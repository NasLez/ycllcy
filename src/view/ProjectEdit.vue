
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
      showChannel:"",
      userinfo: {
        "id": "",
        "name": "",
        "type": "",
        "creator": "",
        "creatorEmail": "1730808730@qq.com",
        "score": "",
        "due": "",
      },
      project:{
        name:'',
        uploaderEmail:'',
        maintainer:'',
        channelId:'1',
        description:'',
        company:'',
        money:'',
        setTime:'',
      },
    }
  },
  created() {
  //  待添加获得参数的接口
    let that = this;
    getChannelAndUser(this.$data.project.channelId,this.$data.userinfo.creatorEmail);
    function getChannelAndUser(channel,email) {
      axios.get(`mu/getUsernames/email=${email}`, {
        email: email,
      }).then(res => {
        console.log(res.data);
        that.$data.userinfo.id=res.data.id;
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
        that.$data.project.channelId = res.data.id;
        that.$data.showChannel = res.data.name;
      })
    }
  },
  methods: {
    GetDateTime() {
      var getDate = new Date;
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
      return dateYear + "-" + dateMonth + "-" + dateDate + " " + dateHours + ":" + dateMinutes + ":" + dateSeconds;
},
    onSubmit() {
      let that = this;
      let setTime=this.GetDateTime();
      console.log(setTime);
      axios.put(`mu/project/upload`,{
        name:that.$data.project.name,
        uploaderEmail:that.$data.project.uploaderEmail,
        maintainer:that.$data.project.maintainer,
        channelId:Number(that.$data.project.channelId),
        description:that.$data.project.description,
        company:that.$data.project.company,
        money:Number(that.$data.project.money),
        setTime:setTime,
      }).then(res => {
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
