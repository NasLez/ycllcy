<template>
  <el-descriptions title="项目信息">
    <el-descriptions-item label="项目名称">{{project.name}}</el-descriptions-item>
    <el-descriptions-item label="负责人">{{ project.maintainer }}</el-descriptions-item>
    <el-descriptions-item label="项目简介">{{ project.description }}</el-descriptions-item>
    <el-descriptions-item label="项目类别">
      <el-tag size="small">{{ project.channelId }}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item label="负责单位">{{ project.company }}</el-descriptions-item>
    <el-descriptions-item label="起止年份">{{project.setTime}}</el-descriptions-item>
    <el-descriptions-item label="金额"></el-descriptions-item>
    <el-descriptions-item label="上传时间"></el-descriptions-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmit">上传项目</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-descriptions>

</template>

<script>
export default {
  name: "ProjectDetail",

  data(){
    return{
      showChannel:"",
      userinfo: {
        "id":"",
        "username": "",
        "phone": "",
        "email": "1730808730@qq.com",
        "school": "",
        "password": "",
        "isAdmin": "",
        "code": "",
        "name": ""
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
  // created() {
  //   getChannelAndUser(this.$data.project.channelId,this.$data.userinfo.email);
  //   function getChannelAndUser(channel,email){
  //
  //   }
  // },
  methods: {
    onSubmit() {
      console.log('submit!');
    }
  }

}
</script>

<style scoped>

</style>
