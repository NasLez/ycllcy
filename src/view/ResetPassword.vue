<template>
<!--  <el-tab-pane label="注册" name="register">-->
  <div class="mybody">
    <el-form :label-position="labelPosition" label-width="80px" :model="yclRegister" class="myForm" border>
      <el-form-item label="用户名">
        <el-input type="string" v-model="yclRegister.username" style="width:225px"
                  placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="电话号码">
        <el-input type="string" v-model="yclRegister.phone" style="width:225px"
                  placeholder="请输入电话号码"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input type="string" v-model="yclRegister.email" style="width:225px"
                  placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <el-form-item label="学校">
        <el-input type="string" v-model="yclRegister.school" style="width:225px"
                  placeholder="请输入学校"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="yclRegister.password" style="width:225px"
                  placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input type="password" v-model="yclRegister.retPassword" style="width:225px"
                  placeholder="请重新输入密码"></el-input>
      </el-form-item>
      <el-form-item label="邀请码">
        <el-input type="password" v-model="yclRegister.code" style="width:225px"
                  placeholder="请输入邀请码"></el-input>
      </el-form-item>
      <el-form-item label="真实姓名">
        <el-input type="string" v-model="yclRegister.name" style="width:225px"
                  placeholder="请输入真实姓名"></el-input>
      </el-form-item>
      <el-form-item style="margin-left: 40px;margin-bottom: 10px">
        <el-button type="primary" @click="register">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
<!--  </el-tab-pane>-->
</template>

<script>
import axios from "axios";

export default {
  name: "ResetPassword",
  data(){
    return{
      labelPosition: 'right',
      yclRegister: {
        username: '',
        phone: '',
        email: '',
        school: '',
        password: '',
        retPassword: '',
        code: '',
        name: '',
      }
    }
  },
  methods:{
    register() {
      if (this.yclRegister.username == '') {
        this.$message({
          message: "用户名不能为空",
          type: 'warning'
        })
      } else if (this.yclRegister.phone == '') {
        this.$message({
          message: "电话号码不能为空",
          type: 'warning'
        })
      } else if (this.yclRegister.email == '') {
        this.$message({
          message: "邮箱不能为空",
          type: 'warning'
        })
      } else if (this.yclRegister.school == '') {
        this.$message({
          message: "学校不能为空",
          type: 'warning'
        })
      } else if (this.yclRegister.password == '') {
        this.$message({
          message: "密码不能为空",
          type: 'warning'
        })
      } else if (this.yclRegister.retPassword == '') {
        this.$message({
          message: "确认密码不能为空",
          type: 'warning'
        })
      } else if (this.yclRegister.code == '') {
        this.$message({
          message: "邀请码不能为空",
          type: 'warning'
        })
      } else if (this.yclRegister.name == '') {
        this.$message({
          message: "真实姓名不能为空",
          type: 'warning'
        })
      } else if (this.yclRegister.password != this.yclRegister.retPassword) {
        this.$message({
          message: "确认密码和密码不匹配",
          type: 'warning'
        })
      } else {
        axios.put(`mu/register?username=${this.yclRegister.username}&phone=${this.yclRegister.phone}&email=${this.yclRegister.email}&school=${this.yclRegister.school}&password=${this.yclRegister.password}&code=${this.yclRegister.code}&name=${this.yclRegister.name}`).then(res4 => {
          if (res4.status === 400) {
            this.$message({
              message: "服务器错误！",
              type: 'warning'
            })
          } else if (res4.status === 220) {
            this.$message({
              message: "邀请码不正确或者邀请码和真实姓名不匹配！",
              type: 'warning'
            })
          } else if (res4.status === 210) {
            this.$message({
              message: "邮箱地址已经存在！请输入新的邮箱地址",
              type: 'warning'
            })
          } else if (res4.status === 200) {
            this.$message({
              message: "注册成功！",
              type: 'success'
            })
            this.$router.push(({path:'/'}))
          }
        })
      }
    }
  }
}
</script>

<style scoped>

.myForm {
  background: rgba(255, 255, 255, 0.3);
  height: 100%;
  padding: 20px;
  width: 320px;
  margin: auto;
  margin-top: 40px;
  border: 1px solid #c5c5c5;
}
</style>
