<template>
  <div class="about">
    <h2>Services</h2>
    <ul>
      <li>
        <div class="service-info">
          <div class="name table-heading">Name</div>
          <div class="status table-heading">Status</div>
        </div>
        <div class="table-heading">Action</div>
      </li>
      <li v-for="service in services" :key="service.pid">
        <div class="service-info">
          <div class="name">
            <router-link
              v-bind:to="'/services/' + service.pid"
              class="service-link"
            >
              {{ service.name }}
            </router-link>
          </div>
          <div
            class="status"
            v-bind:class="
              service.status === 'STOPPED'
                ? 'service-stopped'
                : 'service-active'
            "
          >
            {{ service.status }}
          </div>
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
    return {
      services,
    };
  },
});
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.service-info {
  display: flex;
  flex-direction: row;
  color: #bdb3b3;
}
.table-heading {
  color: #bdb3b3;
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
.service-info .service-active {
  color: #42b983;
  font-weight: bold;
}
.service-info .service-stopped {
  color: #ff0000;
  font-weight: bold;
}
.service-link {
  color: #bdb3b3;
  font-weight: bold;
}
h2 {
  color: #bdb3b3;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
  padding-inline-start: 0;
}
li {
  margin: 16px 0;
  display: flex;
  justify-content: space-between;
  padding-bottom: 16px;
  border-bottom: 1px solid gray;
}
</style>
