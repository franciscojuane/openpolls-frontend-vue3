import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: () => import("../layouts/PublicLayout.vue"),
    children: [
      {
        path: "/login",
        name: "loginView",
        component: () => import("../views/LoginView.vue"),
      },
      {
        path: "/pollAnswer/:pollKey",
        name: "pollAnswer",
        component: () => import("../views/polls/PollAnswer.vue"),
      },
    ],
  },
  {
    path: "/",
    component: () => import("../layouts/MainLayout.vue"),
    children: [
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
        path: "/pollResults/:id",
        name: "pollResults",
        component: () => import("../views/polls/PollResults.vue"),
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
