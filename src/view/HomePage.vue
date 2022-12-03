<template>
  <div>
    <dev>
      <el-row>
        <el-col :span="8">
          <el-card class="box-card" style="position: absolute;left: 400px">
            <div class="user" >
              <div class="user-info">
                <a class="user-nickname">真实姓名：{{ userinfo.username }}</a><br>
                <a class="user-name">用户名：{{ userinfo.name }}</a><br>
                <a class="user-access">身份：{{ userinfo.isAdmin }}</a><br>
                <a class="user-phone">电话号码：{{ userinfo.phone }}</a><br>
                <a class="user-email">邮箱地址：{{ userinfo.email }}</a><br>
                <a class="user-school">学校：{{ userinfo.school }}</a><br>
              </div>
            </div>
            <template>
              <el-button size="small" type="primary" icon="el-icon-edit" round @click="showEditDialog()"></el-button>
            </template>
          </el-card>
          <el-card class="box-card" style="position: absolute;left: 400px" v-if="editDialogVisible">
            <el-dialog
                title="修改用户"
                :visible.sync="editDialogVisible"
                width="50%" @close="editDialogClosed">
              <el-form :model="userinfo" :rules="editFormRules" ref="editFormRef" label-width="70px" >
                <!--     disabled表示禁用状态     -->

                <el-form-item label="真实姓名" prop="name">
                  <el-input v-model="userinfo.name" disabled></el-input>
                </el-form-item>
                <el-form-item label="身份" prop="isAdmin">
                  <el-input v-model="userinfo.isAdmin" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="userinfo.email" disabled></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="username" >
                  <el-input v-model="userinfo.username"></el-input>
                </el-form-item>
                <el-form-item label="电话号码" prop="phone">
                  <el-input v-model="userinfo.phone"></el-input>
                </el-form-item>
                <el-form-item label="学校" prop="school">
                  <el-input v-model="userinfo.school"></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
              </span>
            </el-dialog>
          </el-card>
        </el-col>
      </el-row>
    </dev>
    <br><br>
    <div style="position: absolute;left: 400px;top: 250px">
      <el-button type="primary" @click="lookXmlw" >
        用户-查看项目/论文；
        管理-员提交通道管理
      </el-button>
      <el-button type="primary" @click="usermanagement">管理员-用户管理</el-button>
      <el-button type="primary" @click="logout" >注销登录</el-button>
    </div>

  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "HomePage",
  data() {
    return {
      editDialogVisible: false,
      userinfo: {
        "username": "",
        "phone": "",
        "email": "",
        "school": "",
        "password": "",
        "isAdmin": "",
        "code": "",
        "name": ""
      },
      editFormRules: {
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          },
          {
            trigger: 'blur'
          }
        ],
      },
    }
  },
  created: function () {
    let that = this;
    console.log(this.$route.query.email)
    this.email1 = this.$route.query.email;
    console.log(this.$data.userinfo.email);
    GetUser(this.email1);
    function GetUser(MyEmail) {
      axios.get(`mu/getUsernames/email=${MyEmail}`, {
        email: MyEmail,
      }).then(res => {
        console.log(res.data);
        if(res.data.isAdmin==="1"){
          that.$data.userinfo.isAdmin = "管理员";
        }else{
          that.$data.userinfo.isAdmin = "用户";
        }
        that.$data.userinfo.username = res.data.username;
        that.$data.userinfo.name = res.data.name;
        that.$data.userinfo.phone = res.data.phone;
        that.$data.userinfo.email = res.data.email;
        that.$data.userinfo.school = res.data.school;
        that.$data.userinfo.password = res.data.password;
        that.$data.userinfo.code = res.data.code;
      });
    }
  },
  methods: {
    GetUser(MyEmail) {
      let that = this;
      axios.get(`mu/getUsernames/email=${MyEmail}`, {
        email: MyEmail,
      }).then(res => {
        console.log(res.data);
        if(res.data.isAdmin==="1"){
          that.$data.userinfo.isAdmin = "管理员";
        }else{
          that.$data.userinfo.isAdmin = "用户";
        }
        that.$data.userinfo.username = res.data.username;
        that.$data.userinfo.name = res.data.name;
        that.$data.userinfo.phone = res.data.phone;
        that.$data.userinfo.email = res.data.email;
        that.$data.userinfo.school = res.data.school;
        that.$data.userinfo.password = res.data.password;
        that.$data.userinfo.code = res.data.code;
      });
    },
    showEditDialog(){
      this.editDialogVisible = true;
    },
    editDialogClosed(){
      this.$refs.editFormRef.resetFields()
    },
    editUserInfo(){
      this.$refs.editFormRef.validate( async valid =>{
        if (!valid) return
        // 将修改数据传送到后端，并接收修改后的返回数据
        console.log(this.userinfo)
        const {data:res}=await this.$http.post('updateUser/',this.userinfo)
        // 判断是否修改成功
        if (res.meta.status !== 200) {
          return this.$message.error('更改用户信息失败！')
        }
        //关闭会话框
        this.editDialogVisible = false
        //重新获取列表
        this.GetUser(this.userinfo.email);
        //提示修改成功
        this.$message.success('修改数据成功')
      })
    },
    usermanagement(){
      if(this.$data.userinfo.isAdmin === "管理员"){
        this.$router.push({path:'/UserManagement'})
      }else{
        this.$message({
          message:"没有权限！",
          type:'warning'
        })
      }
    },
    logout() {
      axios.get('mu/logout').then(res => {
        this.$message({
          message: "注销登录成功！",
          type: 'success'
        })
        return res;
      })
      this.$router.push({path: '/'})
    },
    lookXmlw(){
      this.email1 = this.$route.query.email;
      axios.get(`mu/getUsernames/email=${this.email1}`, {
        email: this.email1,
      }).then(res => {
        console.log(res.data);
        this.isAdmin=res.data.isAdmin
        if(this.isAdmin==="1"){
          this.$router.push({path: '/ChannelManagement',query:{isAdmin:this.isAdmin}})
        }else if(this.isAdmin==="0"){
          this.$router.push({path: '/SubmitProjectsAndPapers',query:{isAdmin:this.isAdmin}})
        }

      });
    }
  }
}
</script>

<style lang="less">
.user {
  display: flex;
  flex-direction: column;
  align-items: center;

  .user-head {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    margin-right: 20px;
    margin-bottom: 50px;
  }

  .user-info {
    .user-nickname {
      font-size: 16px;
      font-weight: bold;
    }

    .user-name {
      font-size: 16px;
      font-weight: bold;
    }

    .user-access {
      font-size: 16px;
      font-weight: bold;
    }

    .user-phone {
      font-size: 16px;
      font-weight: bold;
    }

    .user-email {
      font-size: 16px;
      font-weight: bold;
    }

    .user-school {
      font-size: 16px;
      font-weight: bold;
    }
  }
}
</style>
