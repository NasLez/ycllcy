<template>
  <el-container>
    <el-header style="padding: 0 0">
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
        <div style="justify-content: center;padding-top: 2%;padding-right: 0">
          <div style="display: flex;justify-content: center">
            <div style="width: 55%">
              <el-form ref="ruleForm" :rules="rules" :model="project" label-width="80px" style="width: 400px">
                <el-form-item label="项目名称" prop="name">
                  <el-input v-model="project.name" style="width: 400px;" clearable></el-input>
                </el-form-item>
                <el-form-item label="负责人" prop="maintainer">
                  <el-input v-model="project.maintainer" style="width: 400px;" clearable></el-input>
                </el-form-item>
                <el-form-item label="负责单位" prop="company">
                  <el-input v-model="project.company" style="width: 400px;" clearable></el-input>
                </el-form-item>
                <el-form-item label="项目类别" prop="showChannel">
                  <el-tag style="font-size: 15px">{{ showChannel }}</el-tag>
                </el-form-item>
                <!--    <el-form-item label="起止年份">-->
                <!--      <el-col>-->
                <!--        <el-date-picker type="date" placeholder="选择开始日期" v-model="project.setTime" style="width: 100%;"></el-date-picker>-->
                <!--      </el-col>-->
                <!--    </el-form-item>-->
                <el-form-item label="开始年份" prop="startYear">
                  <el-input v-model="project.startYear" style="width: 200px;" clearable></el-input>
                </el-form-item>
                <el-form-item label="金额" prop="money">
                  <el-input v-model="project.money" style="width: 200px;" clearable></el-input>
                </el-form-item>
                <el-form-item label="项目简介" prop="description">
                  <el-input  type="textarea" style="width: 600px;" v-model="project.description" :rows="3"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" plain round icon="el-icon-check" @click="onSubmit" v-if="this.$store.state.project.id==='0'">提交</el-button>
                  <el-button type="primary" plain round icon="el-icon-edit" @click="edit" v-if="this.$store.state.project.id!=='0'">修改</el-button>
                  <el-button type="info" icon="el-icon-close" plain round @click="back">取消</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div style="width: 30%;text-align: center;margin-left: 0">
              <div style="padding: 30px;margin-top: 25%">
                <el-upload
                    action=""
                    :auto-upload="false"
                    accept=".zip"
                    :on-change="handleChangezip"
                    :headers="headers"
                    :file-list="fileListzip">
                  <el-button size="small" type="primary"  icon="el-icon-upload2">上传项目</el-button>
                  <div slot="tip" class="el-upload__tip" style="color: grey;">只能上传zip文件，且不超过50M</div>
                </el-upload>
                <div style="padding: 30px">
                  <el-upload
                      action=""
                      accept=".jpg"
                      :on-change="handleChangejpg"
                      :auto-upload="false"
                      :headers="headers"
                      :file-list="fileListjpg">
                    <el-button size="small" type="primary"  icon="el-icon-upload2">上传凭证</el-button>
                    <div slot="tip" class="el-upload__tip" style="color: gray;">只能上传jpg文件，且不超过16MB</div>
                  </el-upload>
                </div>

              </div>
            </div>
          </div>
        </div>
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
      },
      ruleForm: {
        name: '',
        maintainer: '',
        company: '',
        showChannel: '',
        startYear: '',
        money: '',
        description: '',
      },
      rules: {
        name: [
          {required: true, message: '请输入论文名称', trigger: 'blur'},
          {min: 3,max:30, message: '长度请在3-30之间', trigger: 'blur'}
        ],
        maintainer: [
          {required: true, message: '请输入负责人', trigger: 'blur'},
          {max:20, message: '长度请在20之间', trigger: 'blur'}
        ],
        company: [
          {required: true, message: '请输入负责单位', trigger: 'blur'},
          {max:30, message: '长度请在30以内', trigger: 'blur'}
        ],
        startYear: [
          {required: true, message: '请输入起止年份', trigger: 'blur'},
        ],
        money: [
          {required: true, message: '请输入金额', trigger: 'blur'},
        ],
        description: [
          {required: true, message: '请输入项目简介', trigger: 'blur'},
          {max:500, message: '长度请在500字以内', trigger: 'blur'}
        ],
      },
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
    back(){
      if(this.$store.state.project.id!=='0'){
        this.$router.push({path:'/ProjectDetail'})
      }else{
        this.$router.push({path:'/SubmitProjectsAndPapers'})
      }
    },
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
        this.$store.state.menuIndex = '5';
        this.$router.push({path: '/ProjectDetail'})
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
        this.$store.state.menuIndex = '5';
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
  right: 0;
  top: 60px;
  bottom: 0;
  overflow-y: scroll;
}
</style>
