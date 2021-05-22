import { MutationTree } from "vuex";
import { MutationTypes } from "./mutationTypes";
import { State, Service, ServiceList } from "./state";

export type Mutations<S = State> = {
  [MutationTypes.ADD_SERVICE](
    state: S,
    payload: Service & { pid: string }
  ): ServiceList;
  [MutationTypes.SERVICE_STARTED](state: S, payload: string): Service;
  [MutationTypes.SERVICE_STOPPED](state: S, payload: string): Service;
  [MutationTypes.DELETE_SERVICE](state: S, payload: string): ServiceList;
  [MutationTypes.SET_SERVICES](state: S, payload: ServiceList): ServiceList;
  [MutationTypes.CONNECT](state: S): true;
  [MutationTypes.DISCONNECT](state: S): false;
};

export const mutations: MutationTree<State> & Mutations = {
  [MutationTypes.ADD_SERVICE](
    state,
    { pid, ...rest }: Service & { pid: string }
  ) {
    Object.assign(state.services, { [pid]: rest });
    return state.services;
  },
  [MutationTypes.SERVICE_STARTED](state, pid: string) {
    state.services[pid].status = "ACTIVE";
    return state.services[pid];
  },
  [MutationTypes.SERVICE_STOPPED](state, pid: string) {
    state.services[pid].status = "STOPPED";
    return state.services[pid];
  },
  [MutationTypes.DELETE_SERVICE](state, pid: string) {
    delete state.services[pid];
    return state.services;
  },
  [MutationTypes.SET_SERVICES](state, services: ServiceList) {
    state.services = services;
    return state.services;
  },
  [MutationTypes.CONNECT](state) {
    state.connected = true;
    return state.connected;
  },
  [MutationTypes.DISCONNECT](state) {
    state.connected = false;
    return state.connected;
  },
};
