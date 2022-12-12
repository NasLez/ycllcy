<template>
  <el-container>
    <el-header style="padding: 0 0">
      <CommonHeader/>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <CommonAside/>
      </el-aside>
      <el-main>
        <el-page-header @back="goBack" content="详情页面">
        </el-page-header>
        <div>
          <el-col :span="8">
            <div class="grid-content1">
              <el-image style="width: 300px;height: 300px" :src="require('./ymr.jpg')" ></el-image>
              <el-card class="box-card" style="position: absolute;left: 20px;width: 300px;margin-top: 0">
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
              </el-card>
            </div>
          </el-col>
          <el-col :span="16" >
            <el-row>
              <el-descriptions :column="1" border class="grid-content2" >
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
              <div style="width: 600px;height: 300px" id='main'>
              </div>
            </el-row>
          </el-col>
        </div>


      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import axios from "axios";
import store from "../vuex/store.js"
import CommonAside from "../component/CommonAside"
import CommonHeader from "@/component/CommonHeader";

export default {
  name: "userHome",
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
      thesisMonth: [0, 0, 0, 0, 0, 0],
      projectMonth: [0, 0, 0, 0, 0, 0],
      option: {
        title: {
          text: '该用户近半年提交数据统计！'
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
            stack: 'thesis',
            data: [0, 0, 0, 0, 0, 0]
          },
          {
            name: '项目',
            type: 'line',
            stack: 'project',
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
    this.email1 = this.$store.state.userEmail;
    GetUser(this.email1);

    function GetUser(MyEmail) {
      axios.get(`mu/getUsernames/email=${MyEmail}`, {
        email: MyEmail,
      }).then(res => {
        console.log(res.data);
        that.$data.showAdmin = "用户";
        that.$data.userinfo.id = res.data.id;
        that.$data.userinfo.username = res.data.username;
        that.$data.userinfo.isAdmin = res.data.isAdmin;
        that.$data.userinfo.name = res.data.name;
        that.$data.userinfo.phone = res.data.phone;
        that.$data.userinfo.email = res.data.email;
        that.$data.userinfo.school = res.data.school;
        that.$data.userinfo.password = res.data.password;
        that.$data.userinfo.code = res.data.code;
      });
    }

    this.email = this.$store.state.userEmail
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
    goBack() {
      this.$router.push({path: '/UserManagement'})
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
        that.$data.showAdmin = "用户";
        that.$data.userinfo.id = res.data.id;
        that.$data.userinfo.username = res.data.username;
        that.$data.userinfo.isAdmin = res.data.isAdmin;
        that.$data.userinfo.name = res.data.name;
        that.$data.userinfo.phone = res.data.phone;
        that.$data.userinfo.email = res.data.email;
        that.$data.userinfo.school = res.data.school;
        that.$data.userinfo.password = res.data.password;
        that.$data.userinfo.code = res.data.code;
      });
    },
    echartsInit: function () {
        this.email = this.$store.state.userEmail
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

.grid-content1 {
  border-radius: 4px;
  min-height: 36px;
  padding: 0;
}
.grid-content2 {
  border-radius: 4px;
  width: 600px;
  min-height: 36px;
}

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
