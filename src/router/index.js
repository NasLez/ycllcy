import Vue from "vue";
import YclRegis from "@/YclPage/YclStart/YclRegis";
import Router from "vue-router";
Vue.use(Router)
export default new Router(
    {
        routes:[
            {path:'/regis',name:'YclRegis',component:YclRegis}
        ]
    }
)