import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        showType:"",
        userinfo: {
            "id":"",
            "username": "",
            "phone": "",
            "email": "",
            "school": "",
            "password": "",
            "isAdmin": "",
            "code": "",
            "name": ""
        },
        thesis: {
            id: '0',
            name: '',
            uploaderEmail: '',
            maintainer: '',
            channelId: '',
            description: '',
            company: '',
            money: '',
            setTime: '',
            startYear: ''
        },
        project: {
            id: "",
            name: '',
            uploaderEmail: '',
            maintainer: '',
            channelId: '',
            description: '',
            company: '',
            money: '',
            setTime: '',
            startYear: ''
        },
        channel:{
            id:'',
            name:'',
            type:'',
            creator:'',
            creatorEmail:'',
            score:'',
            due:'',
        },
        menu:{
            id:null,
        }
    },
    mutations:{
        // setuser(state, email){
        //     state.userinfo.email = email
        // },
        // setproject(state, id){
        //     state.project.id = id
        // },
        // setchannel(state, id){
        //     state.channel.id = id
        // },

    }
})

export default store            //把store暴露给别人
