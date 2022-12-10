<template>
  <div id="body">
    <div class="block1">
      <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick" style="width: 400px;justify-content: center" stretch>
        <el-tab-pane label="登录" name="login" style="margin-top: 20px">
          <el-form :label-position="labelPosition" label-width="95px" :model="formLabelAlign">
            <el-form-item label="账户">
              <el-input type="string" v-model="formLabelAlign.email" style="width:225px"
                        placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input type="password" v-model="formLabelAlign.password" style="width:225px"
                        placeholder="请输入登录密码"></el-input>
            </el-form-item>
            <el-form-item style="margin-top: 20px;margin-bottom: 10px;margin-left: 15px">
              <el-button type="primary" @click="login">登录</el-button>
              <el-button type="primary" @click="ResetPassword">注册</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="忘记密码" name="resetPassword" style="margin-top: 20px">
          <el-form :label-position="labelPosition" label-width="95px" :model="YclResetPassword">
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
            <el-form-item style="margin-top: 30px;margin-bottom: 10px;margin-left: 40px">
              <el-button type="primary" @click="LostLogin">修改密码</el-button>
            </el-form-item>
          </el-form>

        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import store from "../vuex/store.js";
export default {
  name: "LogInAndRegister",
  data() {
    return {
      activeName: 'login',
      labelPosition: 'right',
      formLabelAlign: {
        email: '',
        password: '',
      },
      YclResetPassword: {
        email: '',
        code: '',
        NewPassword: ''
      },
    }
  },
  store,
  methods: {
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
            // this.$router.push({path:'/'})
            this.activeName = 'login'
          }
        })
      }
    },
    ResetPassword(){
      this.$router.push({path:'/ResetPassword'})
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    login() {
      let that = this;
      if (this.formLabelAlign.email == '') {//验证当用户输入的手机号为空或者不正确时不能进行获取验证码
        this.$message({
          message: '邮箱不能为空！',
          type: 'warning'
        });
      } else if (this.formLabelAlign.password == "") {
        this.$message({
          message: '密码不能为空！',
          type: 'warning'
        });
      } else {
        axios.get(`mu/login/${this.$data.formLabelAlign.email}/${this.$data.formLabelAlign.password}`, {
          email: this.$data.formLabelAlign.email,
          password: this.$data.formLabelAlign.password
        }).then(res2 => {
          if (res2.status === 400) {
            this.$message({
              message: "服务器错误！",
              type: 'warning'
            })
          } else if (res2.status === 220) {
            this.$message({
              message: "登录密码错误！",
              type: 'warning'
            })
          } else if (res2.status === 210) {
            this.$message({
              message: "邮箱地址不存在！",
              type: 'warning'
            })
          } else if (res2.status === 200) {
            this.$message({
              message: "登录成功！",
              type: 'success'
            })
            console.log("正在修改权限")
            // this.$router.push({path: '/HomePage', query: {email: this.$data.formLabelAlign.email}})
            that.$store.state.userinfo.email= that.$data.formLabelAlign.email
            axios.get(`mu/getUsernames/email=${that.$data.formLabelAlign.email}`, {
              email: that.$data.formLabelAlign.email,
            }).then(res => {
              console.log(res.data);
              that.$store.state.userinfo.isAdmin = res.data.isAdmin;
              console.log("权限修改成功")
              that.$router.push({path: '/HomePage'})
            });
            // console.log(that.$store.state.userinfo.isAdmin)
          }
        })
      }
    },
  }
};
</script>
<style>
@import '../component/reset.css';
#body{
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  display: -webkit-flex;
}
.block1{
  margin-top: 180px;
}
page { background: #ebecee; }
html, body {
  background-color: #EAF2F5;
}

</style>
