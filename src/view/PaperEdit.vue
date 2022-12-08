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
        <el-breadcrumb separator="/" v-if="showType == '0'">
          <el-breadcrumb-item>查看通道</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/SubmitProjectsAndPapers' }">论文通道</el-breadcrumb-item>
          <el-breadcrumb-item>编辑论文</el-breadcrumb-item>
        </el-breadcrumb>
        <el-breadcrumb separator="/" v-else>
          <el-breadcrumb-item :to="{ path: '/UserViewProjectsAndPapers' }">查看提交</el-breadcrumb-item>
          <el-breadcrumb-item>论文提交</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/ProjectDetail' }">论文详情</el-breadcrumb-item>
          <el-breadcrumb-item>编辑论文</el-breadcrumb-item>
        </el-breadcrumb>
        <br>
        <el-form ref="form" :model="thesis" label-width="80px">
          <el-form-item label="论文名称">
            <el-input v-model="thesis.name"></el-input>
          </el-form-item>
          <el-form-item label="论文描述">
            <el-input v-model="thesis.description"></el-input>
          </el-form-item>
          <el-form-item label="负责人">
            <el-input v-model="thesis.maintainer"></el-input>
          </el-form-item>
          <el-form-item label="论文类别">
            {{ showChannel }}
          </el-form-item>
          <el-form-item label="负责单位">
            <el-input v-model="thesis.company"></el-input>
          </el-form-item>
          <el-form-item>
            <el-upload
                action=""
                accept=".jpg"
                :on-change="handleChangejpg"
                :auto-upload="false"
                :headers="headers"
                :file-list="fileListjpg">
              <el-button size="small" type="primary">上传截图</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg文件，且不超过16MB</div>
            </el-upload>
            <el-upload
                action=""
                :auto-upload="false"
                accept=".zip"
                :on-change="handleChangezip"
                :headers="headers"
                :file-list="fileListzip">
              <el-button size="small" type="primary">上传压缩包</el-button>
              <div slot="tip" class="el-upload__tip">只能上传zip文件，且不超过50M</div>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" v-if="this.$store.state.thesis.id==='0'">立即创建</el-button>
            <el-button type="primary" @click="edit" v-if="this.$store.state.thesis.id!=='0'">立即修改</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>

import axios from "axios";
import store from "@/vuex/store";
import CommonAside from "../component/CommonAside"
import CommonHeader from "@/component/CommonHeader";

export default {
  store,
  components: {
    CommonHeader,
    CommonAside
  },
  data() {
    return {
      showType: '',
      showChannel: "",
      fileListjpg: [],
      fileListzip: [],
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
      thesis: {
        name: '',
        uploaderEmail: '',
        maintainer: '',
        channelId: '',
        description: '',
        company: '',
        setTime: '',
      },
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  },
  created:function () {
    //  待添加获得参数的接口
    let that = this;
    this.$data.thesis.channelId = this.$store.state.channel.id
    console.log(this.$data.thesis.channelId)
    this.$data.userinfo.email = this.$store.state.userinfo.email
    console.log(this.$store.state.thesis.id)
    this.showType = this.$store.state.thesis.id
    if(this.$store.state.thesis.id!=='0'){
      axios.get(`mu/thesis/queryById?id=${this.$store.state.thesis.id}`).then(res => {
        console.log(res.data);
        console.log("项目信息")
        that.$data.thesis.id = res.data.id;
        that.$data.thesis.channelId=res.data.channelId;
        that.$data.thesis.name = res.data.name;
        that.$data.thesis.maintainer = res.data.maintainer;
        that.$data.thesis.description = res.data.description;
        that.$data.thesis.company = res.data.company;
        axios.get(`mu/getChannelById?id=${that.$data.project.channelId}`, {
          id: that.$data.project.channelId
        }).then(res => {
          console.log(res.data);
          console.log("打印通道信息")
          that.$data.showChannel = res.data.name;
        })
      })
    }
    getChannelAndUser(this.$data.thesis.channelId, this.$data.userinfo.email);
    function getChannelAndUser(channel, email) {
      axios.get(`mu/getUsernames/email=${email}`).then(res => {
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
      axios.get(`mu/getChannelById?id=${channel}`).then(res => {
        console.log(res.data);
        console.log("打印通道信息")
        that.$data.thesis.channelId = res.data.id;
        that.$data.showChannel = res.data.name;
      })
    }
  },
  methods: {
    edit(){
      let setTime = this.GetDateTime();
      console.log(setTime);
      const param = new FormData();
      this.fileListjpg.forEach(
          val => {
            param.append("fig", val.raw);
          }
      );
      this.fileListzip.forEach(
          val=> {
            param.append("zip", val.raw);
          }
      );
      axios.post(`mu/thesis/update?thesisId=${this.$store.state.thesis.id}&name=${this.thesis.name}&uploaderEmail=${this.$store.state.userinfo.email}&maintainer=${this.thesis.maintainer}&channelId=${this.thesis.channelId}&description=${this.thesis.description}&company=${this.thesis.company}&uploadTime=${setTime}`
          , param
      ).then(res => {
        console.log(res.data);
        if (res.status === 200) {
          this.$message.success("修改成功")
        } else if (res.status === 400) {
          this.$message.warning("serve error")
        } else if (res.status === 403) {
          this.$message.warning("Unauthorized")
        } else {
          this.$message.warning("others")
        }
        this.$router.push({path: '/UserViewProjectsAndPapers'})
      })
    },
    handleChangezip(file, fileList) { //文件数量改变
      this.fileListzip= fileList;
    },
    handleChangejpg(file, fileList) { //文件数量改变
      this.fileListjpg = fileList;
    },
    GetDateTime() {
      const getDate = new Date;
      let dateYear = getDate.getFullYear();             //获取年
      let dateMonth = getDate.getMonth() + 1;               //获取月
      let dateDate = getDate.getDate();                 //获取当日
      let dateHours = getDate.getHours();               //获取小时
      let dateMinutes = getDate.getMinutes();           //获取分钟
      let dateSeconds = getDate.getSeconds();           //获取秒
      dateMonth = dateMonth < 10 ? "0" + dateMonth : dateMonth;
      dateDate = dateDate < 10 ? "0" + dateDate : dateDate;
      dateHours = dateHours < 10 ? "0" + dateHours : dateHours;
      dateMinutes = dateMinutes < 10 ? "0" + dateMinutes : dateMinutes;
      dateSeconds = dateSeconds < 10 ? "0" + dateSeconds : dateSeconds;
      return dateYear + "-" + dateMonth + "-" + dateDate + " " + dateHours + "%3A" + dateMinutes + "%3A" + dateSeconds;
    },
    onSubmit() {
      // let that = this;
      let setTime = this.GetDateTime();
      console.log(setTime);
      const param = new FormData();
      this.fileListjpg.forEach(
          val => {
            param.append("fig", val.raw);
          }
      );
      this.fileListzip.forEach(
          val=> {
            param.append("zip", val.raw);
          }
      );
      axios.put(`mu/thesis/upload?name=${this.$data.thesis.name}&uploaderEmail=${this.$store.state.userinfo.email}&maintainer=${this.$data.thesis.maintainer}&channelId=${this.$data.thesis.channelId}&description=${this.$data.thesis.description}&company=${this.$data.thesis.company}&uploadTime=${setTime}`
          , param
      ).then(res => {
        console.log(res.data);
        if (res.status === 200) {
          this.$message.success("创建成功")
        } else if (res.status === 400) {
          this.$message.warning("serve error")
        } else if (res.status === 403) {
          this.$message.warning("Unauthorized")
        } else {
          this.$message.warning("others")
        }
        this.$router.push({path: '/UserViewProjectsAndPapers'})
      })
    }
  }
}
</script>
<style>
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

