import Vue from 'vue'
import VueRouter from 'vue-router'
import LogInAndRegister from "../view/LogInAndRegister.vue"
import HomePage from "@/view/HomePage";
import ChannelManagement from "@/view/ChannelManagement";
import updateChannel from "@/view/UpdateChannel";
import SubmitProjectsAndPapers from "@/view/SubmitProjectsAndPapers";
import ResetPassword from "@/view/ResetPassword";
import UserManagement from "@/view/UserManagement";
Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        component: LogInAndRegister,
    },
    {
        path: '/homepage',
        component: HomePage,
    },
    {
        path: '/ChannelManagement',
        component: ChannelManagement
    },
    {
        path: '/updateChannel',
        component: updateChannel
    },
    {
        path:'/SubmitProjectsAndPapers',
        component: SubmitProjectsAndPapers
    },
    {
        path: '/ResetPassword',
        component: ResetPassword
    },
    {
        path: '/UserManagement',
        component: UserManagement
    }
]
const router = new VueRouter({
    routes
})
export default router
