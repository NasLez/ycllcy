<template>
  <div>
    <el-descriptions title="项目信息">
      <el-descriptions-item label="项目名称">{{project.name}}</el-descriptions-item>
      <el-descriptions-item label="负责人">{{ project.maintainer }}</el-descriptions-item>
      <el-descriptions-item label="项目简介">{{ project.description }}</el-descriptions-item>
      <el-descriptions-item label="项目类别">
        <el-tag size="small">{{ showChannel }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="负责单位">{{ project.company }}</el-descriptions-item>
      <el-descriptions-item label="开始年份">{{project.startYear}}</el-descriptions-item>
      <el-descriptions-item label="金额">{{project.money}}</el-descriptions-item>
      <el-descriptions-item label="上传时间">{{project.setTime}}</el-descriptions-item>
      <el-descriptions-item label="项目状态">
        <el-tag size="small">{{ project.status}}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="下载">
        <el-button @click="downloadProfile">点击下载项目文件</el-button>
        <el-button @click="downloadPic">点击下载图片凭证</el-button>
      </el-descriptions-item>
    </el-descriptions>

    <el-button @click="showEditDialog" v-if="userinfo.isAdmin == 0">审核</el-button>

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

<!--  <el-button @click="updateProject" v-else>修改论文</el-button>-->
</template>

<script>
import axios from "axios";

export default {
  name: "ProjectDetail",

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
      project: {
        id:'',
        name: '',
        uploaderEmail: '',
        maintainer: '',
        channelId: '',
        description: '',
        company: '',
        money: '',
        setTime: '',
        status: '',
        startYear: ''
      },
    }
  },
  created() {
    let that = this;
    this.$data.project.id = this.$route.query.id
    // this.$data.project.Id = 5
    console.log(this.$data.project.id)
    this.$data.userinfo.email = this.$route.query.email
    // this.$data.userinfo.email ="1730808730@qq.com"
    console.log(this.$data.userinfo.email)
    getUSerAndProject(this.$data.userinfo.email, this.$data.project.Id);

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
        that.$data.project.uploaderEmail = res.data.email;
      });
      axios.get(`mu/project/queryById?id=${id}`, {
        id: id
      }).then(res => {
        console.log(res.data);
        console.log("项目信息")
        that.$data.project.id = res.data.id;
        that.$data.project.channelId=res.data.channelId;
        that.$data.project.name = res.data.name;
        that.$data.project.maintainer = res.data.maintainer;
        that.$data.project.description = res.data.description;
        that.$data.project.company = res.data.company;
        that.$data.project.money = res.data.money;
        that.$data.project.setTime = res.data.setTime;
        that.$data.project.status = res.data.status;
        that.$data.project.startYear = res.data.startTime;
        axios.get(`mu/getChannelById?id=${that.$data.project.channelId}`, {
          id: that.$data.project.channelId
        }).then(res => {
          console.log(res.data);
          console.log("打印通道信息")
          that.$data.showChannel = res.data.name;
        })
      });
    }
  },
  methods: {
    showEditDialog(){
      this.$data.editDialogVisible = true;
    },
    editDialogClosed(){
      this.$refs.editFormRef.resetFields()
    },
    changeStatus(){
      let that = this;
      axios.post(`mu/project/changeStatus?id=${that.$data.project.id}&status=${that.$data.editStatus}`, {
        id: that.$data.project.Id,
        status: that.$data.editStatus
      }).then(res => {
        console.log("修改状态成功")
        console.log(res.data)
      });
      this.editDialogVisible = false
      this.project.status = this.editStatus
    },
    downloadProfile(){
      let that = this;
      window.open(`mu/project/download/${that.$data.project.id}/zip`,"_blank")
    },
    downloadPic(){
      let that = this;
      window.open(`mu/project/download/${that.$data.project.id}/fig`,"_blank")
    }
  }

}
</script>

<style scoped>

</style>
