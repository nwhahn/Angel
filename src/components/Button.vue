<template>
  <button v-on:click="onClick" v-bind:class="'button-' + variant">
    <slot />
  </button>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    children: String,
    onClick: Function,
    variant: {
      type: String,
      validator: (value: string): boolean =>
        ["error", "success", "primary", "secondary"].indexOf(value) !== -1,
      default: "primary",
    },
  },
});
</script>

<style scoped>
button {
  border: none;
  cursor: pointer;
  padding: 4px 16px;
  border-radius: 24px;
  font-weight: bold;
}
.button-success {
  background-color: #42b983;
  box-shadow: 3px 3px 3px darkgreen;
  color: whitesmoke;
}
.button-error {
  background-color: #ff0000;
  box-shadow: 3px 3px 3px darkred;
  color: whitesmoke;
}
</style>
