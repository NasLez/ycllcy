<template>
  <div>
    <dev>
      <el-button type="primary" @click="logout" style="position: absolute;left: 1180px;top: 0px">注销登录</el-button>
      <el-row>
        <el-col :span="8">
          <el-card class="box-card">
            <div class="user">
              <div class="user-info">
                <a class="user-nickname">真实姓名：{{ userinfo.username }}</a><br>
                <a class="user-name">用户名：{{ userinfo.name }}</a><br>
                <a class="user-access">管理员权限：{{ userinfo.isAdmin }}</a><br>
                <a class="user-phone">电话号码：{{ userinfo.phone }}</a><br>
                <a class="user-email">邮箱地址：{{ userinfo.email }}</a><br>
                <a class="user-school">学校：{{ userinfo.school }}</a><br>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </dev>
    <el-button type="primary" @click="listChannel">获取通道信息</el-button>
    <el-button type="primary" @click="lookXmlw">查看项目论文</el-button>
    <el-tabs style="height: 200px;" stretch>
      <el-tab-pane label="项目">
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column label="id" prop="id"></el-table-column>
          <el-table-column label="name" prop="name"></el-table-column>
          <el-table-column label="type" prop="type"></el-table-column>
          <el-table-column label="creator" prop="creator"></el-table-column>
          <el-table-column label="creatorEmail" prop="creatorEmail"></el-table-column>
          <el-table-column label="score" prop="score"></el-table-column>
          <el-table-column label="due" prop="due"></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="论文">论文</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "HomePage",
  data() {
    return {
      tableData: [],
      userinfo: {
        "username": "",
        "phone": "",
        "email": "",
        "school": "",
        "password": "",
        "isAdmin": "",
        "code": "",
        "name": ""
      }
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
  methods: {
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
    listChannel() {
      axios.get((`mu/listChannel`)).then(res => {
        console.log(res.data);
        this.tableData = res.data;
        console.log(this.tableData);
      })
    },
    lookXmlw(){
      this.$router.push({path: '/listChannel'})
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