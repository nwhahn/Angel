import {
  createStore,
  Store as VuexStore,
  CommitOptions,
  DispatchOptions,
  useStore as baseUseStore,
} from "vuex";
import { State, initialState } from "./state";
import { Mutations, mutations } from "./mutations";
import { Actions, actions } from "./actions";
import { Getters, getters } from "./getters";
import { InjectionKey } from "vue";
import plugins from "./plugins";

export const store = createStore({
  state: initialState,
  getters,
  mutations,
  actions,
  plugins,
});
export type Store = Omit<
  VuexStore<State>,
  "getters" | "commit" | "dispatch"
> & {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload?: P,
    options?: CommitOptions
  ): ReturnType<Mutations[K]>;
} & {
  dispatch<K extends keyof Actions>(
    key: K,
    payload?: Parameters<Actions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<Actions[K]>;
} & {
  getters: {
    [K in keyof Getters]: ReturnType<Getters[K]>;
  };
};

export const key: InjectionKey<VuexStore<State>> = Symbol();

export function useStore(): Store {
  return baseUseStore(key) as Store;
}
