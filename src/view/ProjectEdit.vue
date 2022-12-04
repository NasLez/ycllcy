<template>
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
        <div slot="tip" class="el-upload__tip">只能上传zip文件，且不超过4G</div>
      </el-upload>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>
<script>

import axios from "axios";

export default {
  data() {
    return {
      showChannel: "",
      fileListjpg: [],
      fileListzip: [],
      formdata:"",
      userinfo: {
        "id": "",
        "name": "",
        "type": "",
        "creator": "",
        "email": "",
        "score": "",
        "due": "",
      },
      imageUrl: '',
      project: {
        name: '',
        uploaderEmail: '',
        maintainer: '',
        channelId: '1',
        description: '',
        company: '',
        money: '',
        setTime: '',
        setYear:'2022'
      },
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  },
  created() {
    //  待添加获得参数的接口
    let that = this;
    this.$data.project.channelId = this.$route.query.chaanelId
    this.$data.userinfo.email = this.$route.query.email
    getChannelAndUser(this.$data.project.channelId, this.$data.userinfo.email);

    function getChannelAndUser(channel, email) {
      axios.get(`mu/getUsernames/email=${email}`, {
        email: email,
      }).then(res => {
        console.log(res.data);
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
      axios.get(`mu/getChannelById?id=${this.$data.project.channelId}`, {
        id: channel
      }).then(res => {
        console.log(res.data);
        that.$data.project.channelId = res.data.id;
        that.$data.showChannel = res.data.name;
      })
    }
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    beforeAvatarUploadjpg(file) {
      const isLt2M = file.size / 1024 / 1024 < 16;
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 16MB!');
      }
      return  isLt2M;
    },
    beforeAvatarUploadzip(file) {
      const isLt2M = file.size / 1024 / 1024 /1024< 4;
      if (!isLt2M) {
        this.$message.error('上传压缩包大小不能超过 4GB!');
      }
      return  isLt2M;
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
      this.$message.success(setTime)
      // let formdata = new FormData();

      //下面数据是我自己设置的数据,可自行添加数据到formData(使用键值对方式存储)
      // formdata.append("name",this.$data.project.name)
      // formdata.append("uploaderEmail",this.$data.project.uploaderEmail)
      // formdata.append("maintainer",this.$data.project.maintainer)
      // formdata.append("channelId",this.$data.project.channelId)
      // formdata.append("description",this.$data.project.description)
      // formdata.append("company",this.$data.project.company)
      // formdata.append("money",this.$data.project.money)
      // formdata.append("setTime",setTime)
      // formdata.append("setYear","2022")
      // formdata.append("fig", this.fileListjpg[0]);//拿到存在fileList的文件存放到formData中
      // formdata.append("zip", this.fileListzip[0]);//拿到存在fileList的文件存放到formData中
      const param = new FormData();
      this.fileListzip.forEach(
          (val, index) => {
            param.append("fig", val.raw);
          }
      );
      this.fileListjpg.forEach(
          (val, index) => {
            param.append("fig", val.raw);
          }
      );
      axios.put(`mu/project/upload/?name=${this.$data.project.name}&uploaderEmail=${this.$route.query.email}&maintainer=${this.$data.project.maintainer}&channelId=5&description=${this.$data.project.description}&company=${this.$data.project.company}&money=${this.$data.project.money}&setTime=${setTime}&startYear=2022`
          ,param,{
        // name: that.$data.project.name,
        // uploaderEmail: that.$data.project.uploaderEmail,
        // maintainer: that.$data.project.maintainer,
        // channelId: Number(that.$data.project.channelId),
        // description: that.$data.project.description,
        // company: that.$data.project.company,
        // money: Number(that.$data.project.money),
        // setTime: setTime,
        // // setYear:this.$data.project.setYear
        //     "Content-Type": "multipart/form-data;charset=utf-8",
      }
      ).then(res => {
        console.log(res.data);
        if (res.data.code === 200) {
          this.$message({
            message: '创建成功',
            type: 'success'
          });
        } else {
          this.$message({
            message: '创建失败',
            type: 'error'
          });
        }
      })
    }
  }
}
</script>
