import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    component: () => import("../layouts/PublicLayout.vue"),
    children: [
      {
        path: "/",
        redirect: "/login",
      },
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

const router = createRouter({
  history: createWebHistory(),
  base: process.env.BASE_URL,
  routes,
});

export default router;
