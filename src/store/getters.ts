import { GetterTree } from "vuex";
import { State, Service } from "./state";

export type Getters = {
  displayServices(state: State): Array<Service>;
};

export const getters: GetterTree<State, State> & Getters = {
  displayServices: ({ services }) => {
    const servicesArray = Object.entries(services).map(([pid, service]) => ({
      pid,
      ...service,
    }));

    return servicesArray;
    // Push items to the bottom of the list
    // TODO implement animations to achieve this behavior otherwise it
    // doesnt look optimal
    // return [
    //   ...servicesArray.filter(({ status }) => status === "ACTIVE"),
    //   ...servicesArray.filter(({ status }) => status !== "ACTIVE"),
    // ];
  },
};
