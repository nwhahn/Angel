export interface Service {
  status: string;
  name: string;
}

export type ServiceList = { [pid: string]: Service };

export type OperationRequest = {
  operation: "start" | "stop";
  target: string;
  text: string;
};

export interface State {
  connected: boolean;
  services: { [pid: string]: Service };
}

export const initialState: State = {
  connected: false,
  services: {},
};
