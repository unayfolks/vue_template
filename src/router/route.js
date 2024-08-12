const routes = [{
  path: "/",
  name: "Layout",
  redirect: "/home",
  component: () => import("@/Layout/index.vue"),
  children: [{
      path: "/user",
      name: "user",
      component: () => import("@/views/User/index.vue"),
    },
    {
      path: "/home",
      name: "home",
      component: () => import("@/views/Dashboard/index.vue"),
    },
    {
      path: "/customer",
      name: "customer",
      component: () => import("@/views/Customer/index.vue"),
    },
    {
      path: "/products",
      name: "products",
      redirect: "/product",
      component: () => import("@/views/Product/index.vue"),
      children: [{
          path: "/product",
          name: "product",
          component: () => import("@/views/Product/components/TableProduct.vue"),
        },
        {
          path: "/product-form",
          name: "product-form",
          component: () => import("@/views/Product/components/FormProduct.vue"),
          props: true
        }
      ]
    },
    {
      path: "/category",
      name: "category",
      component: () => import("@/views/Category/index.vue"),
    },
    {
      path: "/sales",
      name: "sales",
      component: () => import("@/views/Sales/index.vue"),
    },
    {
      path: "/transaction",
      name: "transaction",
      component: () => import("@/views/Transaction/index.vue")
    },
    {
      path: "/report",
      name: "report",
      component: () => import("@/views/Report/index.vue")
    }
  ],
}, ];

export default routes;