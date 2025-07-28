import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Login",
    component: () => import("@/pages/LoginPage.vue"),
    meta: {
      title: "Login",
    },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/pages/RegisterPage.vue"),
    meta: {
      title: "Register",
    },
  },
];

const journeyRouter = createRouter({
  history: createWebHistory(),
  routes: routes,
});

journeyRouter.beforeEach((toRoute, fromRoute, next) => {
  next();
});

export default journeyRouter;
