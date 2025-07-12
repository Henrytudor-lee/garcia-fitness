import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/pages/home",
  },
  {
    path: "/pages",
    redirect: "/pages/home",
    component: () => import("@/views/main/index.vue"),
    children: [
      {
        path: "home",
        name: "home",
        component: () => import("@/views/home/index.vue"),
      },
      {
        path: "action",
        name: "action",
        component: () => import("@/views/action/index.vue"),
      },
      {
        path: "stat",
        name: "stat",
        component: () => import("@/views/statistic/index.vue"),
      },
      {
        path: "mine",
        name: "mine",
        component: () => import("@/views/mine/index.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/index.vue"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/register/index.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
