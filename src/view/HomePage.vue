<template>
  <div>
    <dev>
      <el-row>
        <el-col :span="8">
          <el-card class="box-card">
            <div class="user">
              <img src="../../assets/HomePage/user0.jpg" alt="" class="user-head">
              <div class="user-info">
                <div class="user-nickname">昵称</div>
                <div class="user-mane">真实姓名</div>
                <div class="user-access">权限</div>
                <div class="user-phone">电话号码</div>
                <div class="user-email">{{ email }}</div>
                <div class="user-school">学校</div>
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
      email: "null",
      password: "null",
    }
  },
  mounted: function () {
    this.$data.email = this.$route.query.email;
    console.log(this.$data.email);
    this.GetUser(this.$data.email);
  },
  GetUser(MyEmail){
    console.log("传参成功");
    let myemail = MyEmail;
    axios.get(`mu/getUsernames/${myemail}`, {
      email: MyEmail,
    }).then(res1 => {
      this.$message({
        message: res1.data,
        type: 'success'
      })
    }, res2 => {
      this.$message({
        message: res2.data,
        type: 'error'
      })
    })
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
    .user-mane{
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
