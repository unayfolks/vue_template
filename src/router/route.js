const routes = [
  {
    path: "/",
    name: "Layout",
    redirect: "/home",
    component: () => import("@/Layout/index.vue"),
    children: [
      {
        path: "/home",
        name: "home",
        component: () => import("@/views/Dashboard/index.vue"),
      },
      {
        path: "/user",
        name: "user",
        component: () => import("@/views/User/index.vue"),
      },
    ],
  },
];

export default routes;
