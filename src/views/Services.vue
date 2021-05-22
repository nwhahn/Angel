<template>
  <div class="about">
    <h1>Services</h1>
    <h3>You are currently {{ isConnected ? "" : "not" }} connected</h3>
    <ul>
      <li v-for="service in services" :key="service.pid">
        {{ service.name }} : {{ service.status }}
        <button
          v-on:click="
            service.status === 'STOPPED'
              ? start(service.pid)
              : stop(service.pid)
          "
          v-bind:class="{
            start: service.status === 'STOPPED',
            stop: service.status === 'ACTIVE',
          }"
        >
          {{ service.status === "STOPPED" ? "START" : "STOP" }}
        </button>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore, store } from "@/store";
import { ActionTypes } from "@/store/actionTypes";

export default defineComponent({
  methods: {
    stop: (pid: string) => {
      store.dispatch(ActionTypes.STOP_SERVICE, pid);
    },
    start: (pid: string) => {
      store.dispatch(ActionTypes.START_SERVICE, pid);
    },
  },
  setup() {
    const store = useStore();
    store.dispatch(ActionTypes.GET_ALL_SERVICES);
    const services = computed(() => store.getters.displayServices);
    const isConnected = computed(() => store.state.connected);
    return {
      services,
      isConnected,
    };
  },
});
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 16px 10px;
  display: flex;
  justify-content: space-between;
  padding-bottom: 8px;
  border-bottom: 1px solid gray;
}
button {
  border: none;
  cursor: pointer;
  padding: 4px 16px;
  border-radius: 24px;
}
button.start {
  background-color: #42b983;
  box-shadow: 3px 3px 3px darkgreen;
}
button.stop {
  background-color: #ff0000;
  box-shadow: 3px 3px 3px darkred;
}
</style>
