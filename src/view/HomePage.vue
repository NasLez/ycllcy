<template>
  <div>
    <dev>
      <el-row>
        <el-col :span="8">
          <el-card class="box-card">
            <div class="user">
              <img src="../../assets/HomePage/user0.jpg" alt="" class="user-head">
              <div class="user-info">
                <div class="user-nickname">{{ userinfo.username }}</div>
                <div class="user-name">{{ userinfo.name }}</div>
                <div class="user-access">{{ userinfo.isAdmin }}</div>
                <div class="user-phone">{{ userinfo.phone }}</div>
                <div class="user-email">{{ userinfo.email }}</div>
                <div class="user-school">{{ userinfo.school }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="16"><div class="grid-content bg-purple-light">统计信息</div></el-col>
      </el-row>
    </dev>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "HomePage",
  data() {
    return {
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
    }
  },
  created: function () {
    let that = this;
    console.log(this.$route.query.email)
    this.$data.userinfo.email = this.$route.query.email;
    console.log(this.$data.userinfo.email);
    GetUser(this.$data.userinfo.email);
    function GetUser(MyEmail){
      axios.get(`mu/getUsernames/${MyEmail}`, {
        email: MyEmail,
      }).then(res => {
        console.log(res.data);
        // that.$data.userinfo.isAdmin = res.data.isAdmin;
        that.$data.userinfo.isAdmin = res.data.isAdmin;
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

}
</script>

<style lang="less">
.user{
  display: flex;
  flex-direction: column;
  align-items: center;
  .user-head{
    width: 200px;
    height: 200px;
    border-radius: 50%;
    margin-right: 20px;
    margin-bottom: 50px;
  }
  .user-info{
    .user-nickname{
      font-size: 20px;
      font-weight: bold;
    }
    .user-name{
      font-size: 16px;
      font-weight: bold;
    }
    .user-access{
      font-size: 16px;
      font-weight: bold;
    }
    .user-phone{
      font-size: 16px;
      font-weight: bold;
    }
    .user-email{
      font-size: 16px;
      font-weight: bold;
    }
    .user-school{
      font-size: 16px;
      font-weight: bold;
    }
  }
}
</style>
