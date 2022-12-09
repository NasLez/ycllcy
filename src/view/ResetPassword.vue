<template>
  <el-form :label-position="labelPosition" label-width="80px" :model="YclResetPassword">
    <el-form-item label="账户">
      <el-input type="string" v-model="YclResetPassword.email" style="width:225px"
                placeholder="请输入邮箱"></el-input>
    </el-form-item>
    <el-form-item label="邀请码">
      <el-input type="password" v-model="YclResetPassword.code" style="width:225px"
                placeholder="请输入邀请码"></el-input>
    </el-form-item>
    <el-form-item label="新密码">
      <el-input type="password" v-model="YclResetPassword.NewPassword" style="width:225px"
                placeholder="请输入新密码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="LostLogin">修改密码</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import axios from "axios";

export default {
  name: "ResetPassword",
  data(){
    return{
      labelPosition: 'right',
      YclResetPassword: {
        email: '',
        code: '',
        NewPassword: ''
      },
    }
  },
  methods:{
    LostLogin() {
      if (this.YclResetPassword.email == '') {
        this.$message({
          message: "邮箱不能为空",
          type: 'warning'
        })
      } else if (this.YclResetPassword.code == '') {
        this.$message({
          message: "邀请码不能为空",
          type: 'warning'
        })
      } else if (this.YclResetPassword.NewPassword == '') {
        this.$message({
          message: "新密码不能为空",
          type: 'warning'
        })
      } else {
        axios.post(`mu/resetPassword?email=${this.YclResetPassword.email}&code=${this.YclResetPassword.code}&newPassword=${this.YclResetPassword.NewPassword}`).then(res3 => {
          if (res3.status === 400) {
            this.$message({
              message: "服务器错误！",
              type: 'warning'
            })
          } else if (res3.status === 220) {
            this.$message({
              message: "邀请码不正确或者邀请码和真实姓名不匹配！",
              type: 'warning'
            })
          } else if (res3.status === 210) {
            this.$message({
              message: "邮箱地址不存在",
              type: 'warning'
            })
          } else if (res3.status === 200) {
            this.$message({
              message: "修改密码成功！",
              type: 'success'
            })
            this.$router.push({path:'/'})
          }
        })
      }
    },
  }
}
</script>

<style scoped>

</style>