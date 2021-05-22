import { Plugin } from "vuex";
import { State } from "../state";
import { Store } from "../";
import { ActionTypes } from "../actionTypes";
import { MutationTypes } from "../mutationTypes";

type OperationRequest = {
  operation: "start" | "stop";
};

type OperationOutput = {
  error?: string;
  request: OperationRequest;
  pid: string;
  type: MutationTypes.SERVICE_STARTED | MutationTypes.SERVICE_STOPPED;
};

export default function createWebSocketPlugin(): Plugin<State> {
  return (store: Store) => {
    let client: WebSocket;

    store.subscribeAction(({ type, payload }, state) => {
      if (type === ActionTypes.CONNECT && !state.connected) {
        // Setup
        client = new WebSocket("ws://localhost:8000/ws");
        client.onclose = () => {
          store.commit(MutationTypes.DISCONNECT);
        };
        client.onopen = ({ target }) => {
          console.log({ connection: target });
          store.commit(MutationTypes.CONNECT);
        };

        client.onmessage = ({ data }) => {
          const { error, type, pid } = JSON.parse(data) as OperationOutput;

          if (error) {
            console.error(error);
          }
          switch (type) {
            case MutationTypes.SERVICE_STARTED:
              store.commit(MutationTypes.SERVICE_STARTED, pid);
              break;
            case MutationTypes.SERVICE_STOPPED:
              store.commit(MutationTypes.SERVICE_STOPPED, pid);
          }
        };
        return;
      }
      if (type === ActionTypes.DISCONNECT && state.connected) {
        client.close();
        return;
      }
      if (state.connected) {
        const pid = payload as string;
        switch (type) {
          case ActionTypes.START_SERVICE:
            client.send(JSON.stringify({ target: pid, operation: "start" }));
            break;
          case ActionTypes.STOP_SERVICE:
            client.send(JSON.stringify({ target: pid, operation: "stop" }));
            break;
        }
      }
    });
  };
}
