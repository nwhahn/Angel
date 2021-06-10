<template>
  <Header />
  <div class="content-wrapper">
    <router-view />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "@/store";
import { ActionTypes } from "@/store/actionTypes";
import Header from "@/components/Header.vue";

export default defineComponent({
  components: {
    Header,
  },
  beforeMount() {
    const store = useStore();
    store.dispatch(ActionTypes.CONNECT);
  },
  beforeUnmount() {
    const store = useStore();
    // Disconnect from the websocket
    store.dispatch(ActionTypes.DISCONNECT);
  },
});
</script>

<style>
body {
  background-color: #b63336;
  padding: 0;
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.content-wrapper {
  max-width: 1272px;
  padding: 32px 16px;
  margin: 0 auto;
}
</style>
