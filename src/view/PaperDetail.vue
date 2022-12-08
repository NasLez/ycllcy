<template>
  <el-container>
    <el-header>
      <CommonHeader/>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <CommonAside/>
      </el-aside>
      <el-main>
        <el-breadcrumb>
          <el-breadcrumb-item :to="{ path: '/UserViewProjectsAndPapers' }">查看提交</el-breadcrumb-item>
          <el-breadcrumb-item>论文提交</el-breadcrumb-item>
          <el-breadcrumb-item>论文详情</el-breadcrumb-item>
        </el-breadcrumb>
        <br>
        <div>
          <el-descriptions title="项目信息">
            <el-descriptions-item label="论文名称">{{thesis.name}}</el-descriptions-item>
            <el-descriptions-item label="负责人">{{ thesis.maintainer }}</el-descriptions-item>
            <el-descriptions-item label="论文简介">{{ thesis.description }}</el-descriptions-item>
            <el-descriptions-item label="论文类别">
              <el-tag size="small">{{ showChannel }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="负责单位">{{ thesis.company }}</el-descriptions-item>、
            <el-descriptions-item label="上传时间">{{parseTime(thesis.setTime)}}</el-descriptions-item>
            <el-descriptions-item label="项目状态">
              <el-tag size="small">{{thesis.status}}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="下载">
              <el-button @click="downloadProfile">点击下载论文文件</el-button>
              <el-button @click="downloadPic">点击下载论文凭证</el-button>
              <el-button @click="deleteProject">删除论文</el-button>
              <el-button @click="edit">编辑论文</el-button>
            </el-descriptions-item>
          </el-descriptions>

          <el-button @click="showEditDialog" v-if="userinfo.isAdmin == 1">审核</el-button>

          <el-card class="box-card" style="position: absolute;left: 400px" v-if="editDialogVisible">
            <el-dialog
                title="请问您的审核结果是？"
                :visible.sync="editDialogVisible"
                width="50%" @close="editDialogClosed">
              <el-radio v-model="editStatus" label="Accept">审核通过</el-radio>
              <el-radio v-model="editStatus" label="Reject">审核驳回</el-radio>
              <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false; editStatus ='Waiting' ">取 消</el-button>
        <el-button type="primary" @click="changeStatus">确 定</el-button>
      </span>
            </el-dialog>
          </el-card>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import axios from "axios";
import store from "@/vuex/store.js";
import CommonAside from "../component/CommonAside"
import CommonHeader from "@/component/CommonHeader";

export default {
  name: "PaperDetail",
  store,
  components: {
    CommonAside,
    CommonHeader
  },
  data(){
    return{
      showChannel:"",
      editDialogVisible:false,
      editStatus:"",
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
        id:'',
        name: '',
        uploaderEmail: '',
        maintainer: '',
        channelId: '',
        description: '',
        company: '',
        setTime: '',
        status: '',
      },
    }
  },
  created() {
    let that = this;
    this.thesis.id=this.$store.state.thesis.id
    console.log(this.thesis.id)
    this.userinfo.email=this.$store.state.userinfo.email
    console.log(this.userinfo.email)
    console.log("到达详情页面")
    getUSerAndProject(this.userinfo.email, this.thesis.id);
    function getUSerAndProject(email, id) {
      axios.get(`mu/getUsernames/email=${email}`, {
        email: email,
      }).then(res => {
        console.log(res.data);
        console.log("打印用户信息");
        that.$data.userinfo.id = res.data.id;
        that.$data.userinfo.username = res.data.username;
        that.$data.userinfo.isAdmin = res.data.isAdmin;
        that.$data.userinfo.name = res.data.name;
        that.$data.userinfo.phone = res.data.phone;
        that.$data.userinfo.email = res.data.email;
        that.$data.userinfo.school = res.data.school;
        that.$data.userinfo.password = res.data.password;
        that.$data.userinfo.code = res.data.code;
        that.$data.thesis.uploaderEmail = res.data.email;
      });
      axios.get(`mu/thesis/queryById?id=${id}`, {
        id: id
      }).then(res => {
        console.log(res.data);
        console.log("项目信息")
        that.$data.thesis.id = res.data.id;
        that.$data.thesis.channelId=res.data.channelId;
        that.$data.thesis.name = res.data.name;
        that.$data.thesis.maintainer = res.data.maintainer;
        that.$data.thesis.description = res.data.description;
        that.$data.thesis.company = res.data.company;
        that.$data.thesis.setTime = res.data.submitTime;
        that.$data.thesis.status = res.data.status;
        axios.get(`mu/getChannelById?id=${that.$data.thesis.channelId}`).then(res => {
          console.log(res.data);
          console.log("打印通道信息")
          that.$data.showChannel = res.data.name;
        })
      });
    }
  },
  methods: {
    parseTime(time, cFormat) {
      if (arguments.length === 0) {
        return null
      }
      const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
      let date
      if (typeof time === 'object') {
        date = time
      } else {
        if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
          time = parseInt(time)
        }
        if ((typeof time === 'number') && (time.toString().length === 10)) {
          time = time * 1000
        }
        date = new Date(time)
      }
      const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
      }
      const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
        const value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') {
          return ['日', '一', '二', '三', '四', '五', '六'][value]
        }
        return value.toString().padStart(2, '0')
      })
      return time_str
    },
    edit(){
      this.$router.push({path:'/PaperEdit'})
    },
    deleteProject(){
      axios.delete(`mu/thesis/delete?id=${this.thesis.id}`).then(res=>{
        if(res.status===200){
          this.$message.success("删除成功")
          this.$router.push({path: '/UserViewProjectsAndPapers'})
        }
      })
    },
    showEditDialog(){
      this.$data.editDialogVisible = true;
    },
    editDialogClosed(){
      this.$refs.editFormRef.resetFields()
    },
    changeStatus(){
      let that = this;
      axios.post(`mu/thesis/changeStatus?id=${that.$data.thesis.id}&status=${that.$data.editStatus}`).then(res => {
        console.log("修改状态成功")
        console.log(res.data)
      });
      this.editDialogVisible = false
      this.thesis.status = this.editStatus
    },
    downloadProfile(){
      let that = this;
      window.open(`mu/thesis/download/${that.$data.thesis.id}/zip`,"_blank")
    },
    downloadPic(){
      let that = this;
      window.open(`mu/thesis/download/${that.$data.thesis.id}/fig`,"_blank")
    }
  }

}
</script>

<style scoped>
.el-aside {
  display: block;
  position: absolute;
  left: 0;
  top: 60px;
  bottom: 0;
}
.el-main {
  position: absolute;
  left: 200px;
  right: 0;
  top: 60px;
  bottom: 0;
  overflow-y: scroll;
}
</style>
