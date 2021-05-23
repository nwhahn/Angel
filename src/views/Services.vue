<template>
  <div class="about">
    <h1>Services</h1>
    <h3>You are currently {{ isConnected ? "" : "not" }} connected</h3>
    <ul>
      <li>
        <div class="service-info">
          <div class="name">Name</div>
          <div class="status">Status</div>
        </div>
        <div>Action</div>
      </li>
      <li v-for="service in services" :key="service.pid">
        <div class="service-info">
          <div class="name">
            <a class="service-link" v-bind:href="'/services/' + service.pid">
              {{ service.name }}
            </a>
          </div>
          <div class="status">{{ service.status }}</div>
        </div>
        <Button
          v-if="service.status === 'ACTIVE'"
          :onClick="() => stop(service.pid)"
          variant="error"
        >
          STOP
        </Button>
        <Button
          v-else-if="service.status === 'STOPPED'"
          :onClick="() => start(service.pid)"
          variant="success"
        >
          START
        </Button>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore, store } from "@/store";
import { ActionTypes } from "@/store/actionTypes";
import Button from "../components/Button.vue";

export default defineComponent({
  components: {
    Button,
  },
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
.service-info {
  display: flex;
  flex-direction: row;
}
.service-info div {
  text-align: left;
}
.service-info .name {
  width: 200px;
}

.service-info .status {
  width: 100px;
}
.service-link {
  color: black;
}
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
  padding-bottom: 16px;
  border-bottom: 1px solid gray;
}
</style>
