import Vue from 'vue'
import VueRouter from 'vue-router'
import LogInAndRegister from "../view/LogInAndRegister.vue"
import HomePage from "@/view/HomePage";
import ChannelManagement from "@/view/ChannelManagement";
import updateChannel from "@/view/updateChannel";
import SubmitProjectsAndPapers from "@/view/SubmitProjectsAndPapers";
import ResetPassword from "@/view/ResetPassword";
import UserManagement from "@/view/UserManagement";
import ProjectDetail from "@/view/ProjectDetail";
import ProjectEdit from "@/view/ProjectEdit";
import UserViewProjectsAndPapers from "@/view/UserViewProjectsAndPapers";
import StatisticalSubmissionInformation from "@/component/StatisticalSubmissionInformation";
import PaperEdit from "@/view/PaperEdit";
import PaperDetail from "@/view/PaperDetail";
import userHome from "@/view/userHome";
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
        path: '/StatisticalSubmissionInformation',
        component: StatisticalSubmissionInformation
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
