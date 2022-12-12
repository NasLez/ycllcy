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
          <el-breadcrumb-item :to="{ path: '/SubmitProjectsAndPapers' }">论文通道</el-breadcrumb-item>
          <el-breadcrumb-item>编辑论文</el-breadcrumb-item>
        </el-breadcrumb>
        <el-breadcrumb separator="/" v-else>
          <el-breadcrumb-item :to="{ path: '/UserViewProjectsAndPapers' }">查看提交</el-breadcrumb-item>
          <el-breadcrumb-item>论文提交</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/PaperDetail' }">论文详情</el-breadcrumb-item>
          <el-breadcrumb-item>编辑论文</el-breadcrumb-item>
        </el-breadcrumb>
        <br>
        <div style="justify-content: center;padding-top: 5%">
          <div style="display: flex;justify-content: center">
            <div style="width: 55%">
              <el-form ref="ruleForm" :rules="rules" :model="thesis" label-width="80px" style="width: 400px;">
                <el-form-item label="论文名称" prop="name">
                  <el-input v-model="thesis.name" style="width: 400px;" clearable></el-input>
                </el-form-item>
                <el-form-item label="负责人" prop="maintainer">
                  <el-input v-model="thesis.maintainer" style="width: 400px;" clearable></el-input>
                </el-form-item>
                <el-form-item label="论文类别">
                  <el-tag style="font-size: 15px">{{ showChannel }}</el-tag>
                </el-form-item>
                <el-form-item label="负责单位" prop="company">
                  <el-input v-model="thesis.company" style="width: 400px;" clearable></el-input>
                </el-form-item>
                <el-form-item label="论文描述" prop="description">
                  <el-input type="textarea" v-model="thesis.description" :rows="3" style="width: 600px;"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" plain round icon="el-icon-check" @click="onSubmit" v-if="this.$store.state.thesis.id==='0'">提交</el-button>
                  <el-button type="primary" icon="el-icon-edit" plain round @click="edit" v-if="this.$store.state.thesis.id!=='0'">修改</el-button>
                  <el-button type="info" icon="el-icon-close" plain round @click="back">取消</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div style="width: 30%;text-align: center;margin-left: 0">
              <div style="padding: 30px;margin-top: 10%">
                <el-upload
                    action=""
                    :auto-upload="false"
                    accept=".zip"
                    :on-change="handleChangezip"
                    :headers="headers"
                    :file-list="fileListzip">
                  <el-button size="small" type="primary"  icon="el-icon-upload2">上传论文</el-button>
                  <div slot="tip" class="el-upload__tip" style="color: grey;">只能上传zip文件，且不超过50M</div>
                </el-upload>
              </div>
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

      </el-main>
    </el-container>
  </el-container>
</template>
<script>

import axios from "axios";
import store from "@/vuex/store";
import CommonAside from "../../component/CommonAside"
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
      ruleForm: {
        name: '',
        maintainer: '',
        company: '',
        description: '',
        channel: '',
      },
      rules: {
        name: [
          {required: true, message: '请输入论文名称', trigger: 'blur'},
          {min: 3,max:30, message: '长度请在3-30之间', trigger: 'blur'}
        ],
        maintainer: [
          {required: true, message: '请输入负责人', trigger: 'blur'},
          {max:20, message: '长度请在20以内', trigger: 'blur'}
        ],
        company: [
          {required: true, message: '请输入负责单位', trigger: 'blur'},
          {max:30, message: '长度请在30以内', trigger: 'blur'}
        ],
        description: [
          {required: true, message: '请输入论文描述', trigger: 'blur'},
          {max: 500, message: '长度请在500字以内', trigger: 'blur'}
        ],
      },
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
  created: function () {
    //  待添加获得参数的接口
    let that = this;
    this.$data.thesis.channelId = this.$store.state.channel.id
    console.log(this.$data.thesis.channelId)
    this.$data.userinfo.email = this.$store.state.userinfo.email
    console.log(this.$store.state.thesis.id)
    this.showType = this.$store.state.thesis.id
    if (this.$store.state.thesis.id !== '0') {
      axios.get(`mu/thesis/queryById?id=${this.$store.state.thesis.id}`).then(res => {
        console.log(res.data);
        console.log("项目信息")
        that.$data.thesis.id = res.data.id;
        that.$data.thesis.channelId = res.data.channelId;
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
    back() {
      if (this.$store.state.thesis.id !== '0') {
        this.$router.push({path: '/PaperDetail'})
      } else {
        this.$router.push({path: '/SubmitProjectsAndPapers'})
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
      axios.post(`mu/thesis/update?thesisId=${this.$store.state.thesis.id}&name=${this.thesis.name}&uploaderEmail=${this.$store.state.userinfo.email}&maintainer=${this.thesis.maintainer}&channelId=${this.thesis.channelId}&description=${this.thesis.description}&company=${this.thesis.company}&uploadTime=${setTime}`
          , param
      ).then(res => {
        console.log(res.data);
        this.$message.success("修改成功")
        this.$store.state.menuIndex = '5';
        this.$router.push({path: '/PaperDetail'})
      },error=>{
        console.log(error)
        this.$message.error("修改失败！请检查！")
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
      axios.put(`mu/thesis/upload?name=${this.$data.thesis.name}&uploaderEmail=${this.$store.state.userinfo.email}&maintainer=${this.$data.thesis.maintainer}&channelId=${this.$data.thesis.channelId}&description=${this.$data.thesis.description}&company=${this.$data.thesis.company}&uploadTime=${setTime}`
          , param
      ).then(res => {
        console.log(res.data);
        this.$message.success("创建成功")
        this.$store.state.menuIndex = '5';
        this.$router.push({path: '/UserViewProjectsAndPapers'})
      },error=>{
        console.log(error)
        this.$message.error("上传失败！请检查！")
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

