import Vue from 'vue'
import VueRouter from 'vue-router'
import MyLogin from "../view/YclStartPage.vue"
import HomePage from "@/view/HomePage";
import ListChannel from "@/view/adminLook";
import updateChannel from "@/view/updateChannel";
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
        path: '/listChannel',
        component: ListChannel
    },
    {
        path: '/updateChannel',
        component: updateChannel
    }
]
const router = new VueRouter({
    routes
})
export default router
