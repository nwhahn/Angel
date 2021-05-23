package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/segmentio/ksuid"
)

type Status string
type Operation string
type MutationType string

const (
	ACTIVE          Status       = "ACTIVE"
	STOPPED         Status       = "STOPPED"
	START           Operation    = "start"
	STOP            Operation    = "stop"
	SERVICE_STARTED MutationType = "SERVICE_STARTED"
	SERVICE_STOPPED MutationType = "SERVICE_STOPPED"
)

type Log struct {
	Pid  ksuid.KSUID
	Text string
}

type Service struct {
	Name   string `json:"name"`
	Status Status `json:"status"`
}

type OperationRequest struct {
	Operation Operation   `json:"operation"`
	Target    ksuid.KSUID `json:"target"` // Target PID
	Text      string      `json:"text"`   // Used for extra logging
}

type OperationOutput struct {
	Request OperationRequest `json:"request"` // The source request
	Message string           `json:"message"`
	Type    MutationType     `json:"type"`
	Pid     ksuid.KSUID      `json:"pid"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}

/*
* TODO: Add actual logic for getting list of services (server-side) and a method to update the list
 */
var services = map[ksuid.KSUID]Service{
	ksuid.New(): {
		Name:   "Service 1",
		Status: ACTIVE,
	},
	ksuid.New(): {
		Name:   "Service 2",
		Status: ACTIVE,
	},
	ksuid.New(): {
		Name:   "Service 3",
		Status: STOPPED,
	},
}

var OperationRequestHistory = []OperationRequest{}

// Configure the upgrader
var upgrader = websocket.Upgrader{CheckOrigin: func(*http.Request) bool { return true }}
var broadcast = make(chan OperationOutput)   // broadcast channel
var clients = make(map[*websocket.Conn]bool) // connected clients

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

func getServices(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)

	data, err := json.Marshal(services)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(data)
}
func getService(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	enableCors(&w)
	serviceId, ok := vars["serviceId"]

	if !ok {
		http.Error(w, "Service id not provided in path parameters", http.StatusBadRequest)
	}
	var id, parseError = ksuid.Parse(serviceId)
	if parseError != nil {
		http.Error(w, fmt.Sprintf("Invalid id format %v", parseError), http.StatusBadRequest)
	}
	if _, ok := services[id]; !ok {
		http.Error(w, "Not Found", http.StatusNotFound)
	}
	data, err := json.Marshal(services[id])

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(data)
}
func verifyMessageAndBroadcast(ws *websocket.Conn, request OperationRequest) {

	var errorResponse ErrorResponse
	var output OperationOutput

	output.Request = request

	// Validate the operation is either start or stop
	if request.Operation != START && request.Operation != STOP {
		errorResponse.Error = fmt.Sprintf("Invalid operation %s", request.Operation)
	}

	// Validate the service exists
	if _, ok := services[request.Target]; !ok {
		errorResponse.Error = fmt.Sprintf("%s is not a valid target pid", request.Target)
	}

	// Validate the service state is not the same status as requested
	if services[request.Target].Status == STOPPED && request.Operation == STOP {
		errorResponse.Error = fmt.Sprintf("Service is already stopped")
	}

	//
	if services[request.Target].Status == ACTIVE && request.Operation == START {
		errorResponse.Error = fmt.Sprintf("Service is already active")
	}

	if errorResponse.Error != "" {
		ws.WriteJSON(errorResponse)
		return
	}
	var service Service = services[request.Target]

	/*
	* TODO: Add actual logic here for stopping and starting the services
	 */
	if request.Operation == START {
		output.Type = SERVICE_STARTED
		output.Message = fmt.Sprintf("Service %s has been started", request.Target)
		services[request.Target] = Service{
			Status: ACTIVE,
			Name:   service.Name,
		}
	} else if request.Operation == STOP {
		output.Type = SERVICE_STOPPED
		output.Message = fmt.Sprintf("Service %s has been stopped", request.Target)
		services[request.Target] = Service{
			Status: STOPPED,
			Name:   service.Name,
		}
	}
	output.Pid = request.Target
	// If the operation is valid, broadcast the msg to be used by handleMessages
	broadcast <- output
}

func handleConnections(w http.ResponseWriter, r *http.Request) {
	// Upgrade initial GET request to a websocket
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
	}
	// Make sure we close the connection when the function returns
	defer ws.Close()

	// Register our new client
	clients[ws] = true

	for {
		var request OperationRequest
		//  Map  it to a OperationRequest object
		err := ws.ReadJSON(&request)

		// Parsing Errors
		// These will only be sent back to the ws client that made the request
		if err != nil {
			log.Printf("error: %v", err)
			// Send a message to the client of what they did wrong
			ws.WriteJSON(ErrorResponse{
				Error: fmt.Sprintf("Internal error: %v", err),
			})
			if err := recover(); err != nil {
				// Break on a panic, in case a connection was bad
				log.Println("panic occurred:", err)
				delete(clients, ws)
				break
			}
		} else {
			verifyMessageAndBroadcast(ws, request)
		}
	}
}

func handleMessages() {
	for {
		// Grab the next messsage from the broadcast channel
		msg := <-broadcast

		// Handle the msg instructions
		// Send out the event to every client that is currently connected
		// var targetPid = msg.Target
		for client := range clients {
			err := client.WriteJSON(msg)
			if err != nil {
				log.Printf("error: %v", err)
				client.Close()
				delete(clients, client)
			}
		}
	}
}

func main() {
	router := mux.NewRouter()
	router.HandleFunc("/services", getServices)
	router.HandleFunc("/services/{serviceId}", getService)

	router.HandleFunc("/ws", handleConnections)

	// Start listening for incoming chat messages
	go handleMessages()

	log.Println("http server started on :8000")
	err := http.ListenAndServe(":8000", router)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
