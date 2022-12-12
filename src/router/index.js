import Vue from 'vue'
import VueRouter from 'vue-router'
import LogInAndRegister from "../view/userpages/LogInAndRegister.vue"
import HomePage from "@/view/userpages/HomePage";
import ChannelManagement from "@/view/channels/ChannelManagement";
import updateChannel from "@/view/channels/updateChannel";
import SubmitProjectsAndPapers from "@/view/channels/SubmitProjectsAndPapers";
import ResetPassword from "@/view/userpages/ResetPassword";
import UserManagement from "@/view/superpages/UserManagement";
import ProjectDetail from "@/view/workpages/ProjectDetail";
import ProjectEdit from "@/view/workpages/ProjectEdit";
import UserViewProjectsAndPapers from "@/view/workpages/UserViewProjectsAndPapers";
import PaperEdit from "@/view/workpages/PaperEdit";
import PaperDetail from "@/view/workpages/PaperDetail";
import userHome from "@/view/superpages/userHome";
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
    },
    {
        path: '/ProjectDetail',
        component: ProjectDetail
    },
    {
        path: '/ProjectEdit',
        component: ProjectEdit
    },
    {
        path: '/UserViewProjectsAndPapers',
        component: UserViewProjectsAndPapers
    },
    {
        path: '/PaperEdit',
        component: PaperEdit
    },
    {
        path: '/PaperDetail',
        component: PaperDetail
    },
    {
        path: '/userHome',
        component: userHome
    }
]
const router = new VueRouter({
    routes
})
export default router
