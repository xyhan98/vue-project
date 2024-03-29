import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import CategoryView from "@/views/product/CategoryView.vue";
import BrandView from "@/views/product/BrandView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue")
    },
    {
      path: "/product/category",
      name: "product-category",
      component: CategoryView
    },
    {
      path: "/product/brand",
      name: "product-brand",
      component: BrandView
    }
  ]
});

export default router;
