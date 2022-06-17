import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import ImageConverter from "../views/ImageConverter.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: ImageConverter,
  },
  {
    path: "/image-converter",
    name: "Image Converter",
    component: ImageConverter,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
