<template>
  <div class="box">
    <p style="padding-left:20px ">项目论文管理系统</p>
    <el-button style="text-align: right; font-size: 12px;margin-right: 20px" type="danger" plain @click="logout">注销登录</el-button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CommonHeader",
  methods: {
    logout() {
      axios.get('mu/logout').then(res => {
        this.$message({
          message: "注销登录成功！",
          type: 'success'
        })
        this.$store.state.menuIndex=1
        return res;
      })
      this.$router.push({path: '/'})
    },
  }
}
</script>

<style scoped>

.box{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  /*width: 800px;*/
  margin-left:0;
  background-color: #B70031;
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  padding: 0 0;
}
</style>
