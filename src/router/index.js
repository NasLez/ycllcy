import Vue from 'vue'
import VueRouter from 'vue-router'
import MyLogin from "../view/YclStartPage.vue"

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        component: MyLogin,
    },
]
const router = new VueRouter({
    routes
})
export default router
