import {createRouter, createWebHistory} from "vue-router";
import LoginPage from "../pages/LoginPage.vue";
import HomePage from "../pages/HomePage.vue";
import AddPostPage from "../pages/AddPostPage.vue";
import ProfilePage from "../pages/ProfilePage.vue";
import NotFoundPage from "../pages/error/NotFoundPage.vue";

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginPage,
    meta: {title: "login"},
    alias: "/login"
  },
  {
    path: "/home",
    name: "home",
    component: HomePage,
    meta: {title: "home"}
  },
  {
    path: "/add-post",
    name: "add-post",
    component: AddPostPage,
    meta: {title: "add-post"}
  },
  {
    path: "/profile",
    name: "profile",
    component: ProfilePage,
    meta: {title: "profile"}
  },
  {
    path: "/404",
    name: "404",
    component: NotFoundPage,
    meta: {title: "404"}
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

const allowUrlList = ["/login", "/404", "/reset-password"];
// if not login, redirect to the login page
router.beforeEach((to, from, next) => {
  document.title = to.name;
  let token = localStorage.getItem("accessToken");
  // check if the uri exists
  let isExist = to.matched.length === 1;
  if (!isExist) {
    let backPath = token? "/profile": "/login";
    return next("/404?backPath=" + backPath);
  }
  if (allowUrlList.includes(to.path) || token) return next();
  return next("/login");
});

export default router
