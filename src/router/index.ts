import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/services",
    name: "Services",
    alias: "/",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "services" */ "../views/Services.vue"),
  },
  {
    path: "/services/:serviceId",
    component: () =>
      import(/* webpackChunkName: "service" */ "../views/Service.vue"),
    props: (route) => ({ serviceId: route.params.serviceId }),
  },
  {
    path: "/about",
    name: "About",
    component: Home,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
