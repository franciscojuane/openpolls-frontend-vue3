import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import("../layouts/MainLayout.vue"),
    children: [
      {
        path: "/login",
        name: "loginView",
        component: () => import("../views/LoginView.vue"),
      },
      {
        path: "/pollList",
        name: "pollList",
        component: () => import("../views/polls/PollsList.vue"),
      },
      {
        path: "/pollEdit/:id",
        name: "pollEdit",
        component: () => import("../views/polls/PollEdit.vue"),
      },
      {
        path: "/pollAdd",
        name: "pollAdd",
        component: () => import("../views/polls/PollAdd.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
