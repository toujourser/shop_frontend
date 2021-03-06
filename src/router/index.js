import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from "../components/Login"
// import Home from "../components/Home"
// import Welcome from "../components/Welcome"
// import Users from "../components/user/Users"
// import Rights from "../components/power/Rights"
// import Roles from '../components/power/Roles'
// import Cate from '../components/goods/Cate'
// import Params from '../components/goods/Params'
// import List from '../components/goods/List'
// import GoodsAdd from '../components/goods/Add'
// import Report from '../components/report/Report'
// import Orders from '../components/order/Orders'

const Login = () => import(/* webpackChunkName: "login-home-welcome" */ '../components/Login');
const Home = () => import(/* webpackChunkName: "login-home-welcome" */ '../components/Home');
const Welcome = () => import(/* webpackChunkName: "login-home-welcome" */ '../components/Welcome');
const Users = () => import(/* webpackChunkName: "Users-Rights-Roles" */ '../components/user/Users');
const Rights = () => import(/* webpackChunkName: "Users-Rights-Roles" */ '../components/power/Rights');
const Roles = () => import(/* webpackChunkName: "Users-Rights-Roles" */ '../components/power/Roles');
const Cate = () => import(/* webpackChunkName: "Cate-Params" */ '../components/goods/Cate');
const Params = () => import(/* webpackChunkName: "Cate-Params" */ '../components/goods/Params');
const List = () => import(/* webpackChunkName: "List-GoodsAdd" */ '../components/goods/List');
const GoodsAdd = () => import(/* webpackChunkName: "List-GoodsAdd" */ '../components/goods/Add');
const Report = () => import(/* webpackChunkName: "Report-Orders" */ '../components/report/Report');
const Orders = () => import(/* webpackChunkName: "Report-Orders" */ '../components/order/Orders');


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
            },
            {
                path: '/categories',
                component: Cate,
            },
            {
                path: '/params',
                component: Params,
            },
            {
                path: '/goods',
                component: List,
            },
            {
                path: '/goods/add',
                component: GoodsAdd,
            },
            {
                path: '/reports',
                component: Report,
            },
            {
                path: '/orders',
                component: Orders,
            }
        ]
    }
];

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
