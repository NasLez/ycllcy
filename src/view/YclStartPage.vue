<template>
  <div><a style="color:dodgerblue">项目论文管理平台-----登录</a>
    <br><br>
    <el-tabs v-model="activeName" @tab-click="handleClick" style="width: 350px" stretch>

      <el-tab-pane label="登录" name="login">
        <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
          <el-form-item label="账户">
            <el-input type="string" v-model="formLabelAlign.email" style="width:225px"
                      placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input type="password" v-model="formLabelAlign.password" style="width:225px"
                      placeholder="请输入登录密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="primary" @click="logout">注销登录</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="注册" name="register">
        <el-form :label-position="labelPosition" label-width="80px" :model="yclRegister">
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
          <el-form-item>
            <el-button type="primary" @click="register">注册</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="忘记密码" name="lostLogin">
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
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name:"MyLogin",
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
      yclRegister: {
        username: '',
        phone: '',
        email: '',
        school: '',
        password: '',
        retPassword:'',
        code: '',
        name: '',
      }
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    logout() {
      axios.get('mu/logout').then(res => {
        this.$message({
          message:"注销登录成功！",
          type:'success'
        })
        return res;
      })
    },
    login() {
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
            },
            this.$router.push({path: '/HomePage',query:{ email: this.$data.formLabelAlign.email}})
            )
            axios.get(`mu/getUsernames/${this.$data.formLabelAlign.email}`, {
              email: this.$data.formLabelAlign.email
            }).then(res1 => {
              this.$message({
                message: res1.data,
                type: 'success'
              })
            })
          }
        })
      }
    },
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
              message: "修改密码成功！请返回登录",
              type: 'success'
            })
          }
        })
      }
    },
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
      }
      else if (this.yclRegister.code == '') {
        this.$message({
          message: "邀请码不能为空",
          type: 'warning'
        })
      } else if (this.yclRegister.name == '') {
        this.$message({
          message: "真实姓名不能为空",
          type: 'warning'
        })
      } else if (this.yclRegister.password !=this.yclRegister.retPassword) {
        this.$message({
          message: "确认密码和密码不匹配",
          type: 'warning'
        })
      }else {
        axios.post(`mu/register?username=${this.yclRegister.username}&phone=${this.yclRegister.phone}&email=${this.yclRegister.email}&school=${this.yclRegister.school}&password=${this.yclRegister.password}&code=${this.yclRegister.code}&name=${this.yclRegister.name}`).then(res4 => {
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
              message: "注册成功！请返回登录！",
              type: 'warning'
            })
          }
        })
      }
    }
  }
};
</script>
