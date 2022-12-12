<template>
  <el-container>
    <el-header style="padding: 0 0">
      <CommonHeader/>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <CommonAside/>
      </el-aside>
      <el-main style="padding-left: 8%">
        <div>
          <el-col :span="8">
            <div style="display: flex;flex-direction: column;justify-content: center">
              <div>
                <el-image style="width: 300px;height: 300px" :src="require('/src/avatar/qll.jpg')" v-if="this.$store.state.userinfo.isAdmin==='1'"></el-image>
                <el-image style="width: 300px;height: 300px" :src="require('/src/avatar/ymr.jpg')" v-if="this.$store.state.userinfo.isAdmin==='0'"></el-image>
              </div>
              <div>
                <el-card class="box-card" style="width: 300px">
                  <div class="user">
                    <div class="user-info">
                      <div class="user-nickname">{{ userinfo.username }}</div><br>
                      <div class="user-name">{{ userinfo.name }}</div><br>
                      <div class="user-access">{{ showAdmin }}</div><br>
                      <div class="user-phone">电话：{{ userinfo.phone }}</div><br>
                      <div class="user-email">邮箱：{{ userinfo.email }}</div><br>
                      <div class="user-school">学校：{{ userinfo.school }}</div><br>
                    </div>
                  </div>
                  <template style=" display:flex;justify-content: center;align-text:center;">
                    <el-button size="small" type="info" round style="margin-top: 0px;margin-left: 90px"
                               @click="showEditDialog()">修改信息
                    </el-button>
                  </template>
                </el-card>
              </div>
              <div>

              </div>
              <el-card class="box-card" style="position: absolute;left: 400px" v-if="editDialogVisible">
                <el-dialog
                    title="修改用户"
                    :visible.sync="editDialogVisible"
                    width="50%" @close="editDialogClosed">
                  <el-form :model="userinfo" :rules="editFormRules" ref="editFormRef" label-width="70px">
                    <!--     disabled表示禁用状态     -->

                    <el-form-item label="真实姓名" prop="name">
                      <el-input v-model="userinfo.name" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="身份" prop="isAdmin">
                      <el-input v-model="showAdmin" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                      <el-input v-model="userinfo.email" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="用户名" prop="username">
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
            </div>
          </el-col>
          <el-col :span="16" >
            <el-row>
              <el-descriptions :column="1" border class="grid-content2" v-if="this.$store.state.userinfo.isAdmin==='0'">
                <el-descriptions-item
                    content-class-name="my-content"
                    label="上传总分数">
                  {{ parseInt(this.userData.thesisScore) + parseInt(this.userData.projectScore) }}
                </el-descriptions-item>
                <el-descriptions-item label="上传论文总数量">
                  {{ userData.thesisNumber }}
                </el-descriptions-item>
                <el-descriptions-item label="论文总分数">
                  {{ userData.thesisScore }}
                </el-descriptions-item>
                <el-descriptions-item label="上传项目总数量">
                  {{ userData.projectNumber }}
                </el-descriptions-item>
                <el-descriptions-item label="项目总分数">
                  {{ userData.projectScore }}
                </el-descriptions-item>
              </el-descriptions>
            </el-row>
            <el-row>
              <div v-if="this.$store.state.userinfo.isAdmin == 1" style="width: 650px;height: 540px" id="main">
              </div>
              <div v-else style="width: 600px;height: 300px" id='main'>
              </div>
            </el-row>
          </el-col>
        </div>


      </el-main>
      <!--        <el-footer>Footer</el-footer>-->
    </el-container>
  </el-container>
</template>

<script>
import axios from "axios";
import store from "../../vuex/store.js"
import CommonAside from "../../component/CommonAside"
import CommonHeader from "@/component/CommonHeader";
// import StatisticalSubmissionInformation from "@/component/StatisticalSubmissionInformation";

export default {
  name: "HomePage",
  store,
  data() {
    return {
      userData: {
        thesisNumber: '0',
        thesisScore: '0',
        projectNumber: '0',
        projectScore: '0',
        score: 0
      },
      editDialogVisible: false,
      showAdmin: "",
      userinfo: {
        "id": "",
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
      thesisMonth: [0, 0, 0, 0, 0, 0],
      projectMonth: [0, 0, 0, 0, 0, 0],
      option: {
        title: {
          text: '你的近半年提交数据统计！'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['论文', '项目']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '论文',
            type: 'line',
            stack: 'thesisData',
            data: [0, 0, 0, 0, 0, 0]
          },
          {
            name: '项目',
            type: 'line',
            stack: 'projectData',
            data: [0, 0, 0, 0, 0, 0]
          },
        ]
      }
    }
  },
  components: {
    CommonAside,
    CommonHeader,
    // StatisticalSubmissionInformation
  },
  mounted() {
    this.echartsInit();
  },
  created: function () {
    let that = this;
    // console.log(this.$route.query.email)
    // this.email1 = this.$route.query.email;
    console.log(this.$store.state.userinfo.email)
    this.email1 = this.$store.state.userinfo.email;
    GetUser(this.email1);

    function GetUser(MyEmail) {
      axios.get(`mu/getUsernames/email=${MyEmail}`, {
        email: MyEmail,
      }).then(res => {
        console.log(res.data);
        if (res.data.isAdmin === "1") {
          that.$data.showAdmin = "管理员";
        } else {
          that.$data.showAdmin = "用户";
        }
        that.$data.userinfo.id = res.data.id;
        that.$data.userinfo.username = res.data.username;
        that.$data.userinfo.isAdmin = res.data.isAdmin;
        // that.$store.state.userinfo.isAdmin = res.data.isAdmin;
        that.$data.userinfo.name = res.data.name;
        that.$data.userinfo.phone = res.data.phone;
        that.$data.userinfo.email = res.data.email;
        that.$data.userinfo.school = res.data.school;
        that.$data.userinfo.password = res.data.password;
        that.$data.userinfo.code = res.data.code;
      });
    }

    this.email = this.$store.state.userinfo.email
    // this.$message.success(this.email)
    axios.get(`mu/project/getScoreByEmail?email=${this.email}`).then(res => {
      if (res.status === 200) {
        console.log('项目总分数',res.data)
        this.userData.projectScore = res.data
      } else if (res.status === 403) {
        this.$message.error("Unauthorized")
      } else if (res.status === 400) {
        this.$message.error("Serve Error")
      }
    })
    axios.get(`mu/thesis/getScoreByEmail?email=${this.email}`).then(res => {
      if (res.status === 200) {
        console.log('论文总分数',res.data)
        this.userData.thesisScore = res.data
      } else if (res.status === 403) {
        this.$message.error("Unauthorized")
      } else if (res.status === 400) {
        this.$message.error("Serve Error")
      }
    })
    axios.get((`mu/project/queryByUploaderEmail?uploaderEmail=${this.email}`)).then(res => {
      if (res.status === 200) {
        let arr = Array.from(res.data);
        this.userData.projectNumber = arr.length
      } else if (res.status === 403) {
        this.$message.error("Unauthorized")
      } else if (res.status === 400) {
        this.$message.error("Serve Error")
      } else if (res.status === 404) {
        this.$message.error("Not Found")
      }
    })
    axios.get((`mu/thesis/queryByUploaderEmail?uploaderEmail=${this.email}`)).then(res => {
      if (res.status === 200) {
        let arr = Array.from(res.data);
        this.userData.thesisNumber = arr.length
      } else if (res.status === 403) {
        this.$message.error("Unauthorized")
      } else if (res.status === 400) {
        this.$message.error("Serve Error")
      } else if (res.status === 404) {
        this.$message.error("Not Found")
      }
    })
  },
  methods: {
    StatisticalSubmissionInformation() {
      this.$router.push({path: '/StatisticalSubmissionInformation'})
    },
    ViewProjectsAndPapers() {
      this.$store.state.userinfo.isAdmin = this.userinfo.isAdmin
      this.$router.push({path: '/UserViewProjectsAndPapers'})
    },
    GetUser(MyEmail) {
      let that = this;
      axios.get(`mu/getUsernames/email=${MyEmail}`, {
        email: MyEmail,
      }).then(res => {
        console.log(res.data);
        if (res.data.isAdmin === "1") {
          that.$data.showAdmin = "管理员";
        } else {
          that.$data.showAdmin = "用户";
        }
        that.$data.userinfo.id = res.data.id;
        that.$data.userinfo.username = res.data.username;
        that.$data.userinfo.isAdmin = res.data.isAdmin;
        this.$store.state.userinfo.isAdmin = res.data.isAdmin;
        that.$data.userinfo.name = res.data.name;
        that.$data.userinfo.phone = res.data.phone;
        that.$data.userinfo.email = res.data.email;
        that.$data.userinfo.school = res.data.school;
        that.$data.userinfo.password = res.data.password;
        that.$data.userinfo.code = res.data.code;
      });
    },
    showEditDialog() {
      this.editDialogVisible = true;
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    editUserInfo() {
      // 将修改数据传送到后端，并接收修改后的返回数据
      console.log("正在修改用户信息")

      let fulluser = this.$data.userinfo;
      console.log(fulluser);
      axios({
        method: 'post',
        url: `mu/updateUser`,
        headers: {
          'Content-Type': 'application/json'
        },
        data: fulluser,
      }).then(res => {
        console.log(res);
        console.log("修改成功");
      })
      //关闭会话框
      this.editDialogVisible = false
      //重新获取列表
      this.methods.GetUser(this.userinfo.email);
      //提示修改成功
      // })
    },
    usermanagement() {
      if (this.$data.userinfo.isAdmin === "1") {
        this.$router.push({path: '/UserManagement'})
      } else {
        this.$message({
          message: "没有权限！",
          type: 'warning'
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
    echartsInit: function () {
      if(this.$store.state.userinfo.isAdmin==='0') {
        this.email = this.$store.state.userinfo.email
        let myChart = this.$echarts.init(document.getElementById('main'), 'white');
        let nowDate = new Date();
        let date = {
          year: nowDate.getFullYear(),
          month: nowDate.getMonth() + 1,
          date: nowDate.getDate(),
        }
        this.option.xAxis.data[5] = date.month + '月'
        this.option.xAxis.data[4] = date.month - 1 + '月'
        this.option.xAxis.data[3] = date.month - 2 + '月'
        this.option.xAxis.data[2] = date.month - 3 + '月'
        this.option.xAxis.data[1] = date.month - 4 + '月'
        this.option.xAxis.data[0] = date.month - 5 + '月'
        axios.get((`mu/project/queryByUploaderEmail?uploaderEmail=${this.email}`)).then(res => {
          if (res.status === 200) {
            console.log("project 200")
            for (let i = 0; i < res.data.length; i++) {
              let projectDate = new Date(res.data[i].setTime)
              this.month = projectDate.getMonth() + 1
              if (date.month == this.month) {
                this.projectMonth[5]++
              } else if (date.month - 1 == this.month) {
                this.projectMonth[4]++
              } else if (date.month - 2 == this.month) {
                this.projectMonth[3]++
              } else if (date.month - 3 == this.month) {
                this.projectMonth[2]++
              } else if (date.month - 4 == this.month) {
                this.projectMonth[1]++
              } else if (date.month - 5 == this.month) {
                this.projectMonth[0]++
              }
            }
            this.option.series[1].data = this.projectMonth
            axios.get((`mu/thesis/queryByUploaderEmail?uploaderEmail=${this.email}`)).then(res0 => {
              if (res0.status === 200) {
                console.log("thesis 200")
                for (let i = 0; i < res0.data.length; i++) {
                  let thesisDate = new Date(res0.data[i].submitTime)
                  this.month = thesisDate.getMonth() + 1
                  if (date.month == this.month) {
                    this.thesisMonth[5]++
                  } else if (date.month - 1 == this.month) {
                    this.thesisMonth[4]++
                  } else if (date.month - 2 == this.month) {
                    this.thesisMonth[3]++
                  } else if (date.month - 3 == this.month) {
                    this.thesisMonth[2]++
                  } else if (date.month - 4 == this.month) {
                    this.thesisMonth[1]++
                  } else if (date.month - 5 == this.month) {
                    this.thesisMonth[0]++
                  }
                }
                this.option.series[0].data = this.thesisMonth
                myChart.setOption(this.option);
              }
            },error=>{
              console.log("thesis 420")
              if (error && error.response) {
                switch (error.response.status) {
                  case 400: this.$message.error("400")
                    break;
                  case 403: this.$message.error("没有权限！");
                    break;
                  case 420: {
                    // this.$message.error("没有找到用户论文！")
                    this.option.series[0].data = this.thesisMonth
                    myChart.setOption(this.option);
                  }
                    break;
                  default: this.$message.error("连接错误！")
                }
              }else{
                this.$message.error("连接服务器失败！")
              }
            })
          }
        },error=>{
          console.log("project 420")
          if (error && error.response) {
            switch (error.response.status) {
              case 400: this.$message.error("400")
                break;
              case 403: this.$message.error("没有权限！");
                break;
              case 420: {
                // this.$message.error("没有找到用户项目！")
                this.option.series[1].data = this.projectMonth
                axios.get((`mu/thesis/queryByUploaderEmail?uploaderEmail=${this.email}`)).then(res0 => {
                  if (res0.status === 200) {
                    console.log("thesis 200")
                    for (let i = 0; i < res0.data.length; i++) {
                      let thesisDate = new Date(res0.data[i].submitTime)
                      this.month = thesisDate.getMonth() + 1
                      if (date.month == this.month) {
                        this.thesisMonth[5]++
                      } else if (date.month - 1 == this.month) {
                        this.thesisMonth[4]++
                      } else if (date.month - 2 == this.month) {
                        this.thesisMonth[3]++
                      } else if (date.month - 3 == this.month) {
                        this.thesisMonth[2]++
                      } else if (date.month - 4 == this.month) {
                        this.thesisMonth[1]++
                      } else if (date.month - 5 == this.month) {
                        this.thesisMonth[0]++
                      }
                    }
                    this.option.series[0].data = this.thesisMonth
                    myChart.setOption(this.option);
                  }
                },error0=>{
                  console.log("thesis 420")
                  if (error0 && error0.response) {
                    switch (error0.response.status) {
                      case 400: this.$message.error("400")
                        break;
                      case 403: this.$message.error("没有权限！");
                        break;
                      case 420: {
                        // this.$message.error("没有找到用户论文！")
                        this.option.series[0].data = this.thesisMonth
                        myChart.setOption(this.option);
                      }
                        break;
                      default: this.$message.error("连接错误！")
                    }
                  }else{
                    this.$message.error("连接服务器失败！")
                  }
                })
              }
                break;
              default: this.$message.error("连接错误！")
            }
          }else{
            this.$message.error("连接服务器失败！")
          }
        })
      }else if(this.$store.state.userinfo.isAdmin==='1') {
        this.option.title.text='近半年所有用户提交数据统计！'
        this.email = this.$store.state.userinfo.email
        let myChart = this.$echarts.init(document.getElementById('main'), 'dark');
        let nowDate = new Date();
        let date = {
          year: nowDate.getFullYear(),
          month: nowDate.getMonth() + 1,
          date: nowDate.getDate(),
        }
        this.option.xAxis.data[5] = date.month + '月'
        this.option.xAxis.data[4] = date.month - 1 + '月'
        this.option.xAxis.data[3] = date.month - 2 + '月'
        this.option.xAxis.data[2] = date.month - 3 + '月'
        this.option.xAxis.data[1] = date.month - 4 + '月'
        this.option.xAxis.data[0] = date.month - 5 + '月'

        axios.get((`mu/project/queryAll`)).then(res => {
          if (res.status === 200) {
            console.log("project 200")
            for (let i = 0; i < res.data.length; i++) {
              let projectDate = new Date(res.data[i].setTime)
              this.month = projectDate.getMonth() + 1
              if (date.month == this.month) {
                this.projectMonth[5]++
              } else if (date.month - 1 == this.month) {
                this.projectMonth[4]++
              } else if (date.month - 2 == this.month) {
                this.projectMonth[3]++
              } else if (date.month - 3 == this.month) {
                this.projectMonth[2]++
              } else if (date.month - 4 == this.month) {
                this.projectMonth[1]++
              } else if (date.month - 5 == this.month) {
                this.projectMonth[0]++
              }
            }
            this.option.series[1].data = this.projectMonth
            axios.get((`mu/thesis/queryAll`)).then(res0 => {
              if (res0.status === 200) {
                console.log("thesis 200")
                for (let i = 0; i < res0.data.length; i++) {
                  let thesisDate = new Date(res0.data[i].submitTime)
                  this.month = thesisDate.getMonth() + 1
                  if (date.month == this.month) {
                    this.thesisMonth[5]++
                  } else if (date.month - 1 == this.month) {
                    this.thesisMonth[4]++
                  } else if (date.month - 2 == this.month) {
                    this.thesisMonth[3]++
                  } else if (date.month - 3 == this.month) {
                    this.thesisMonth[2]++
                  } else if (date.month - 4 == this.month) {
                    this.thesisMonth[1]++
                  } else if (date.month - 5 == this.month) {
                    this.thesisMonth[0]++
                  }
                }
                this.option.series[0].data = this.thesisMonth
                myChart.setOption(this.option);
              }
            },error=>{
              console.log(error)
              if (error && error.response) {
                switch (error.response.status) {
                  case 400: this.$message.error("400")
                    break;
                  case 403: this.$message.error("没有权限！");
                    break;
                  case 420: {
                    this.$message.error("没有找到用户论文！")
                    this.option.series[0].data = this.thesisMonth
                    myChart.setOption(this.option);
                  }
                    break;
                  default: this.$message.error("连接错误！")
                }
              }else{
                this.$message.error("连接服务器失败！")
              }
            })
          }
        },error=>{
          console.log(error)
          if (error && error.response) {
            switch (error.response.status) {
              case 400: this.$message.error("400")
                break;
              case 403: this.$message.error("没有权限！");
                break;
              case 420: {
                this.$message.error("没有找到用户项目！")
                this.option.series[1].data = this.projectMonth
                axios.get((`mu/thesis/queryAll`)).then(res0 => {
                  if (res0.status === 200) {
                    console.log("thesis 200")
                    for (let i = 0; i < res0.data.length; i++) {
                      let thesisDate = new Date(res0.data[i].submitTime)
                      this.month = thesisDate.getMonth() + 1
                      if (date.month == this.month) {
                        this.thesisMonth[5]++
                      } else if (date.month - 1 == this.month) {
                        this.thesisMonth[4]++
                      } else if (date.month - 2 == this.month) {
                        this.thesisMonth[3]++
                      } else if (date.month - 3 == this.month) {
                        this.thesisMonth[2]++
                      } else if (date.month - 4 == this.month) {
                        this.thesisMonth[1]++
                      } else if (date.month - 5 == this.month) {
                        this.thesisMonth[0]++
                      }
                    }
                    this.option.series[0].data = this.thesisMonth
                    myChart.setOption(this.option);
                  }
                },error0=>{
                  console.log(error0)
                  if (error0 && error0.response) {
                    switch (error0.response.status) {
                      case 400: this.$message.error("400")
                        break;
                      case 403: this.$message.error("没有权限！");
                        break;
                      case 420: {
                        this.$message.error("没有找到用户论文！")
                        this.option.series[0].data = this.thesisMonth
                        myChart.setOption(this.option);
                      }
                        break;
                      default: this.$message.error("连接错误！")
                    }
                  }else{
                    this.$message.error("连接服务器失败！")
                  }
                })
              }
                break;
              default: this.$message.error("连接错误！")
            }
          }else{
            this.$message.error("连接服务器失败！")
          }
        })
      }
    }
  }
}
</script>

<style lang="less">
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}

//.bg-purple-dark {
//  background: #99a9bf;
//}
//
//.bg-purple {
//  background: #d3dce6;
//}
////
////.bg-purple-light {
////  background: #e5e9f2;
////}

.el-main{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.el-aside::-webkit-scrollbar {
  display: none;
}
.user {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 0;
  //.user-head {
  //  width: 200px;
  //  height: 200px;
  //  border-radius: 50%;
  //  margin-right: 20px;
  //  margin-bottom: 50px;
  //}

  .user-info {
    .user-nickname {

      text-align: center;
      font-size: 20px;
      font-weight: bold;
    }

    .user-name {
      text-align: center;
      font-size: 16px;
      font-weight: bold;
    }

    .user-access {

      text-align: center;
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
.el-header{
  padding: 0 0;
}
</style>
