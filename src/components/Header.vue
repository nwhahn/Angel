<template>
  <div id="nav">
    <div class="nav-left-content">
      <h1 class="logo">Angel UI</h1>
      <router-link to="/">Services</router-link>
      <router-link to="/about">About</router-link>
    </div>
    <div class="nav-right-content">
      <div
        class="connection-status tooltip"
        v-bind:class="isConnected ? 'connected' : 'disconnected'"
      >
        <span class="tooltiptext">{{
          isConnected ? "You are connected!" : "You are not connected :("
        }}</span>
      </div>
      <router-link to="/settings" aria-label="settings menu">
        <img src="../assets/settings.png" class="nav-logo" />
      </router-link>
    </div>
  </div>
  <ul>
    <li v-for="crumb in crumbs" :key="crumb.path">
      {{ crumb.path }}
    </li>
  </ul>
</template>
<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "@/store";
export default defineComponent({
  computed: {
    crumbs() {
      const currentPath: string = this.$route.path;
      let pathArray = currentPath.split("/").filter((el) => el !== "");
      const breadcumbs = pathArray.reduce(
        (
          breadcumbArray: Array<{
            path: string;
            to: string;
            text: unknown;
          }> = [],
          path: string,
          idx
        ) => {
          const matchedRoute = this.$route.matched[idx];
          breadcumbArray.push({
            path,
            to: breadcumbArray[idx - 1]
              ? "/" + breadcumbArray[idx - 1].path + "/" + path
              : "/" + path,
            text: matchedRoute && matchedRoute.name ? matchedRoute.name : path,
          });
          return breadcumbArray;
        },
        []
      );
      return breadcumbs;
    },
  },
  setup() {
    const store = useStore();
    const isConnected = computed(() => store.state.connected);
    return {
      isConnected,
    };
  },
});
</script>
<style scoped>
#nav {
  padding: 30px;
  background-color: #51051c;
  display: flex;
  justify-content: space-between;
}

#nav h1 {
  display: inline-block;
  background: -webkit-linear-gradient(135deg, #ba2211, #bd27a6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-right: 24px;
}

#nav div {
  display: flex;
  align-items: center;
}

#nav a {
  color: #cba3fa;
  margin-left: 8px;
  text-decoration: none;
  cursor: pointer;
}

#nav a.router-link-exact-active {
  font-weight: bold;
}
#nav a:hover {
  font-weight: bold;
}

#nav .nav-logo {
  width: 36px;
  transition: transform 0.7s ease-in-out;
}

#nav .nav-logo:hover {
  transform: rotate(360deg);
}

#nav .connection-status {
  margin-right: 16px;
  height: 24px;
  width: 24px;
  border-radius: 24px;
}

#nav .connection-status.disconnected {
  background-color: #e93010;
  box-shadow: 2px 2px 3px #7e1301;
}

#nav .connection-status.connected {
  background-color: #67b359;

  box-shadow: 2px 2px 3px #4d8241;
  transform: scale(1);
  animation-duration: 2000ms;
}

.tooltip .tooltiptext {
  visibility: hidden;
  min-width: 120px;
  display: flex;
  color: #fff;
  background-color: slategrey;
  border-radius: 6px;
  position: absolute;
  z-index: 1;
  right: 40px;
}
.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>
