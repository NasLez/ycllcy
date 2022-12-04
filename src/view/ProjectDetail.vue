<template>
  <el-descriptions title="项目信息">
    <el-descriptions-item label="项目名称">{{project.name}}</el-descriptions-item>
    <el-descriptions-item label="负责人">{{ project.maintainer }}</el-descriptions-item>
    <el-descriptions-item label="项目简介">{{ project.description }}</el-descriptions-item>
    <el-descriptions-item label="项目类别">
      <el-tag size="small">{{ project.channelId }}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="负责单位">{{ project.company }}</el-descriptions-item>
    <el-descriptions-item label="开始年份">{{project.setYear}}</el-descriptions-item>
    <el-descriptions-item label="金额">{{project.money}}</el-descriptions-item>
    <el-descriptions-item label="上传时间">{{project.setTime}}</el-descriptions-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmit">上传项目</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-descriptions>

</template>

<script>
import axios from "axios";

export default {
  name: "ProjectDetail",

  data(){
    return{
      showChannel:"",
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
      imageUrl: '',
      project: {
        name: '',
        uploaderEmail: '',
        maintainer: '',
        channelId: '',
        description: '',
        company: '',
        money: '',
        setTime: '',
        setYear: ''
      },
    }
  },
  created() {
    let that = this;
    // this.$data.project.channelId = this.$route.query.channelId
    this.$data.project.channelId =5
    console.log(this.$route.query.channelId)
    // this.$data.userinfo.email = this.$route.query.email
    this.$data.userinfo.email ="10204500101@stu.ecnu.edu.cn"
    console.log(this.$route.query.email)
    getChannelAndUser(this.$data.project.channelId, this.$data.userinfo.email);

    function getChannelAndUser(channel, email) {
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
      axios.get(`mu/getChannelById?id=${channel}`, {
        id: channel
      }).then(res => {
        console.log(res.data);
        console.log("打印通道信息")
        that.$data.project.channelId = res.data.id;
        that.$data.showChannel = res.data.name;
      })
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!');
    }
  }

}
</script>

<style scoped>

</style>
