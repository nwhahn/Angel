/* eslint-disable @typescript-eslint/no-empty-function */
import { ActionTree, ActionContext } from "vuex";
import { State, Service, ServiceList } from "./state";
import { Mutations } from "./mutations";
import { ActionTypes } from "./actionTypes";
import { MutationTypes } from "./mutationTypes";

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, State>, "commit">;

export interface OperationRequest {
  operation: "stop" | "start";
  target: string;
  text: string; // Logging
}

export interface Actions {
  [ActionTypes.GET_ALL_SERVICES]({
    commit,
  }: AugmentedActionContext): Promise<ServiceList>;
  [ActionTypes.ADD_SERVICE](
    { commit }: AugmentedActionContext,
    payload: Service
  ): void;
  [ActionTypes.DELETE_SERVICE](
    { commit }: AugmentedActionContext,
    payload: string
  ): void;
  [ActionTypes.START_SERVICE](): void;
  [ActionTypes.STOP_SERVICE](): void;
  [ActionTypes.DISCONNECT](): void;
  [ActionTypes.CONNECT](): void;
}

export const actions: ActionTree<State, State> & Actions = {
  async [ActionTypes.GET_ALL_SERVICES]({ commit }) {
    try {
      const response = await fetch("http://localhost:8000/services", {
        headers: new Headers(),
        redirect: "follow",
      });
      const services = (await response.json()) as ServiceList;
      commit(MutationTypes.SET_SERVICES, services);
      return services;
    } catch (e) {
      console.log({ info: "get services failed", message: e.message });
    }
    return {};
  },
  [ActionTypes.ADD_SERVICE]({ commit }, service: Service) {
    commit(MutationTypes.ADD_SERVICE, { ...service, pid: "Mockpid" });
  },
  [ActionTypes.DELETE_SERVICE]({ commit }, pid: string) {
    commit(MutationTypes.DELETE_SERVICE, pid);
  },
  // These are handled via the websocket plugin but need to exist to run
  [ActionTypes.START_SERVICE]() {},
  [ActionTypes.STOP_SERVICE]() {},
  [ActionTypes.DISCONNECT]() {},
  [ActionTypes.CONNECT]() {},
};
