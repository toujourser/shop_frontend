import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../components/Login"
import Home from "../components/Home"
import Welcome from "../components/Welcome"
import Users from "../components/user/Users"
import Rights from "../components/power/Rights"
import Roles from '../components/power/Roles'


Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        redirect: "/login"
    },
    {
        path: "/login",
        component: Login
    },
    {
        path: "/home",
        component: Home,
        redirect: '/welcome',
        children: [
            {
                path: "/welcome",
                component: Welcome,
            },
            {
                path: "/users",
                component: Users,
            },
            {
                path: "/roles",
                component: Roles,
            },
            {
                path: '/rights',
                component: Rights,
            }
        ]
    }
]

const router = new VueRouter({
    routes
});


// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
    // to: 将要访问的地址
    // from： 从哪个跳转页面而来
    // next： 是一个函数， 表示放行 next（）， next（"/login"）强制放行
    if (to.path === "/login") {
        return next()
    }
    const token = window.sessionStorage.getItem("token");
    if (!token) {
        return next("/login")
    }
    next();
});

export default router
