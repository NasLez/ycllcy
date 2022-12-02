import Vue from 'vue'
import VueRouter from 'vue-router'
import MyLogin from "../view/YclStartPage.vue"
import HomePage from "@/view/HomePage";
import adminLook from "@/view/adminLook";
import updateChannel from "@/view/updateChannel";
import userLook from "@/view/userLook";
Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        component: MyLogin,
    },
    {
        path: '/homepage',
        component: HomePage,
    },
    {
        path: '/adminLook',
        component: adminLook
    },
    {
        path: '/updateChannel',
        component: updateChannel
    },
    {
        path:'/userLook',
        component: userLook
    }
]
const router = new VueRouter({
    routes
})
export default router
