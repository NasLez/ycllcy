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
          <el-breadcrumb-item :to="{ path: '/SubmitProjectsAndPapers' }">项目通道</el-breadcrumb-item>
          <el-breadcrumb-item>编辑项目</el-breadcrumb-item>
        </el-breadcrumb>
        <el-breadcrumb separator="/" v-else>
          <el-breadcrumb-item :to="{ path: '/UserViewProjectsAndPapers' }">查看提交</el-breadcrumb-item>
          <el-breadcrumb-item>项目提交</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/ProjectDetail' }">项目详情</el-breadcrumb-item>
          <el-breadcrumb-item>编辑项目</el-breadcrumb-item>
        </el-breadcrumb>
        <br>
        <el-form ref="form" :model="project" label-width="80px">
          <el-form-item label="项目名称">
            <el-input v-model="project.name"></el-input>
          </el-form-item>

          <el-form-item label="项目简介">
            <el-input v-model="project.description"></el-input>
          </el-form-item>
          <el-form-item label="负责人">
            <el-input v-model="project.maintainer"></el-input>
          </el-form-item>
          <el-form-item label="项目类别">
            {{ showChannel }}
          </el-form-item>
          <el-form-item label="负责单位">
            <el-input v-model="project.company"></el-input>
          </el-form-item>
          <!--    <el-form-item label="起止年份">-->
          <!--      <el-col>-->
          <!--        <el-date-picker type="date" placeholder="选择开始日期" v-model="project.setTime" style="width: 100%;"></el-date-picker>-->
          <!--      </el-col>-->
          <!--    </el-form-item>-->
          <el-form-item label="金额">
            <el-input v-model="project.money"></el-input>
          </el-form-item>
          <el-form-item label="开始年份">
            <el-input v-model="project.startYear"></el-input>
          </el-form-item>
          <el-form-item>
            <el-upload
                action=""
                accept=".jpg"
                :on-change="handleChangejpg"
                :auto-upload="false"
                :headers="headers"
                :file-list="fileListjpg">
              <el-button size="small" type="primary">上传项目凭证</el-button>
              <div slot="tip" class="el-upload__tip" style="color: crimson">只能上传jpg文件，且不超过16MB</div>
            </el-upload>
            <el-upload
                action=""
                :auto-upload="false"
                accept=".zip"
                :on-change="handleChangezip"
                :headers="headers"
                :file-list="fileListzip">
              <el-button size="small" type="primary">上传项目文件</el-button>
              <div slot="tip" class="el-upload__tip" style="color: crimson">只能上传zip文件，且不超过50M</div>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" v-if="this.$store.state.project.id==='0'">立即创建</el-button>
            <el-button type="primary" @click="edit" v-if="this.$store.state.project.id!=='0'">立即修改</el-button>
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
    CommonAside,
    CommonHeader
  },
  data() {
    return {
      showType: '',
      showChannel: "",
      fileListjpg: [],
      fileListzip: [],
      userinfo: {
        "id": "",
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
        startYear: ''
      },
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  },
  created: function () {
    //  待添加获得参数的接口
    let that = this;
    this.$data.project.channelId = this.$store.state.channel.id
    console.log(this.$data.project.channelId)
    this.$data.userinfo.email = this.$store.state.userinfo.email
    console.log(this.$store.state.project.id)
    this.showType = this.$store.state.project.id
    if (this.$store.state.project.id !== '0') {
      axios.get(`mu/project/queryById?id=${this.$store.state.project.id}`).then(res => {
        console.log(res.data);
        console.log("项目信息")
        that.$data.project.id = res.data.id;
        that.$data.project.channelId = res.data.channelId;
        that.$data.project.name = res.data.name;
        that.$data.project.maintainer = res.data.maintainer;
        that.$data.project.description = res.data.description;
        that.$data.project.company = res.data.company;
        that.$data.project.money = res.data.money;
        that.$data.project.setTime = res.data.setTime;
        that.$data.project.status = res.data.status;
        that.$data.project.startYear = res.data.startYear;
        axios.get(`mu/getChannelById?id=${that.$data.project.channelId}`, {
          id: that.$data.project.channelId
        }).then(res => {
          console.log(res.data);
          console.log("打印通道信息")
          that.$data.showChannel = res.data.name;
        })
      })
    }
    getChannelAndUser(this.$data.project.channelId, this.$data.userinfo.email);

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
        that.$data.project.channelId = res.data.id;
        that.$data.showChannel = res.data.name;
      })
    }
  },
  methods: {
    edit() {
      let setTime = this.GetDateTime();
      console.log(setTime);
      const param = new FormData();
      this.fileListjpg.forEach(
          val => {
            param.append("fig", val.raw);
          }
      );
      this.fileListzip.forEach(
          val => {
            param.append("zip", val.raw);
          }
      );
      axios.post(`mu/project/update?id=${this.$store.state.project.id}&name=${this.$data.project.name}&uploaderEmail=${this.$store.state.userinfo.email}&maintainer=${this.$data.project.maintainer}&description=${this.$data.project.description}&channelId=${this.$data.project.channelId}&company=${this.$data.project.company}&money=${this.$data.project.money}&setTime=${setTime}&startYear=${this.$data.project.startYear}`
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
      this.fileListzip = fileList;
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
          val => {
            param.append("zip", val.raw);
          }
      );
      axios.put(`mu/project/upload/?name=${this.$data.project.name}&uploaderEmail=${this.$store.state.userinfo.email}&maintainer=${this.$data.project.maintainer}&channelId=${this.$data.project.channelId}&description=${this.$data.project.description}&company=${this.$data.project.company}&money=${this.$data.project.money}&setTime=${setTime}&startYear=${this.$data.project.startYear}`
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
