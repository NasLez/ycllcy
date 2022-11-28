<template>
  <div><a style="color:dodgerblue">项目论文管理平台-----登录</a>
    <br><br>
    <el-tabs v-model="activeName" @tab-click="handleClick" style="width: 500px">
      <el-tab-pane label="登录" name="login">
        <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign" action="Homepage.vue">
          <el-form-item label="账户">
            <el-input type="string" v-model="formLabelAlign.email" style="width:225px"
                      placeholder="请输入邮箱" ref="input1"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input type="password" v-model="formLabelAlign.password" style="width:225px"
                      placeholder="请输入登录密码" ref="input2"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="primary" @click="lostlogin">忘记密码</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="注册" name="regis">配置管理</el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import axios from "axios";

export default {

  data() {
    return {
      labelPosition: 'right',
      formLabelAlign: {
        email: '',
        password: '',
      },
      activeName: 'second'
    };
  },
  methods: {
    login() {
      this.test1 = this.$refs.input1.value;//获取input1的值，减少获取dom节点的消耗
      this.test2 = this.$refs.input2.value;
      if (this.test1 == '') {//验证当用户输入的手机号为空或者不正确时不能进行获取验证码
        this.$message({
          message: '邮箱不能为空！',
          type: 'warning'
        });
      } else if (this.test2 == "") {
        this.$message({
          message: '密码不能为空！',
          type: 'warning'
        });
      } else {
        axios.get(`mu/login/${this.$data.formLabelAlign.email}/${this.$data.formLabelAlign.password}`, {
          email: this.$data.formLabelAlign.email,
          password: this.$data.formLabelAlign.password
        }).then(res2 => {
          this.email = res2.data.email;
          this.$message({
            message: res2.data,
            type: 'success'
          });
          axios.get(`mu/getUsernames/${this.$data.formLabelAlign.email}`, {
            email: this.$data.formLabelAlign.email
          }).then(res1 => {
            this.$message({
              message: res1.data,
              type: 'success'
            })
          })
        })
      }
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    lostlogin() {

    }
  }
};
</script>