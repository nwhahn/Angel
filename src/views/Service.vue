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
        <div>Action</div>
      </div>
    </div>
  </div>
  <div v-else>Error: Not Found</div>
</template>
<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "@/store";
import { ActionTypes } from "@/store/actionTypes";

export default defineComponent({
  props: {
    serviceId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    store.dispatch(ActionTypes.GET_SERVICE, props.serviceId);
    const service = computed(() => store.getters.getService(props.serviceId));
    return {
      service,
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
