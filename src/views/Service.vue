<template>
  <div v-if="service">
    <div class="service-header">
      <div class="service-name">{{ service.name }}</div>
      <div class="service-status">
        Status:
        <span
          v-bind:class="
            service.status === 'STOPPED' ? 'service-stopped' : 'service-active'
          "
          >{{ service.status }}</span
        >
      </div>
      <div class="service-actions">
        <Button
          v-if="service.status === 'ACTIVE'"
          :onClick="() => stop(pid)"
          variant="error"
        >
          STOP
        </Button>
        <Button
          v-else-if="service.status === 'STOPPED'"
          :onClick="() => start(pid)"
          variant="success"
        >
          START
        </Button>
      </div>
    </div>
  </div>
  <div v-else>Error: Not Found</div>
</template>
<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore, store } from "@/store";
import { ActionTypes } from "@/store/actionTypes";
import Button from "@/components/Button.vue";

export default defineComponent({
  components: {
    Button,
  },
  props: {
    serviceId: {
      type: String,
      required: true,
    },
  },
  methods: {
    stop: (pid: string) => {
      store.dispatch(ActionTypes.STOP_SERVICE, pid);
    },
    start: (pid: string) => {
      store.dispatch(ActionTypes.START_SERVICE, pid);
    },
  },
  setup(props) {
    const store = useStore();
    store.dispatch(ActionTypes.GET_SERVICE, props.serviceId);
    const service = computed(() => store.getters.getService(props.serviceId));

    return {
      service,
      pid: props.serviceId,
    };
  },
});
</script>
<style scoped>
.service-header {
  display: flex;
  flex-direction: row;
  padding-bottom: 16px;
  border-bottom: 1px solid gray;
  margin-top: 32px;
  color: #bdb3b3;
}
.service-header .service-name {
  display: flex;
  font-weight: bold;
  flex: 1;
  align-content: flex-start;
}
.service-header .service-status {
  flex: 1;
  align-content: flex-start;
  font-weight: bold;
}
.service-active {
  color: #42b983;
}
.service-stopped {
  color: #ff0000;
}
.service-header .service-actions {
  flex: 3;
  align-items: flex-end;
  text-align: right;
}
</style>
