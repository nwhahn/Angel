<template>
  <div id="nav">
    <router-link to="/">Services</router-link>
    <router-link to="/about">About</router-link>
  </div>
  <router-view />
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "@/store";
import { ActionTypes } from "@/store/actionTypes";

export default defineComponent({
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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  margin-left: 8px;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
