<template>
  <div>

    <el-descriptions  :column="2" border >
      <el-descriptions-item
          label="用户名"
          label-class-name="my-label"
          content-class-name="my-content">
        {{ userData.name }}
      </el-descriptions-item>
      <el-descriptions-item label="手机号" >
        {{ userData.phone }}
      </el-descriptions-item>
      <el-descriptions-item label="邮箱">
        {{ userData.email }}
      </el-descriptions-item>
      <el-descriptions-item
          content-class-name="my-content"
          label="上传总分数">
        {{ parseInt(this.userData.thesisScore)+parseInt(this.userData.projectScore) }}
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
    <br>
    <br>
    <div style="width: 700px;height: 500px" id="main">
    </div>

  </div>
</template>

<script>
import axios from "axios";
import store from "@/vuex/store";
export default {
  name: "StatisticalSubmissionInformation",
  store,
  mounted() {
    this.echartsInit();
  },
  data() {
    return {
      userData: {
        name: '',
        phone: '',
        email: '',
        thesisNumber: '0',
        thesisScore: '0',
        projectNumber: '0',
        projectScore: '0',
        score: 0
      },
      thesisMonth:[0, 0, 0, 0, 0, 0],
      projectMonth:[0, 0, 0, 0, 0, 0],
      option: {
        title: {
          text: '近半年提交数据统计'
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
            stack: 'Total',
            data: [0, 0, 0, 0, 0, 0]
          },
          {
            name: '项目',
            type: 'line',
            stack: 'Total',
            data: [0, 0, 0, 0, 0, 0]
          },
        ]
      }
    }
  },
  created: function () {
    this.email=this.$store.state.userinfo.email
    // this.$message.success(this.email)
    axios.get(`mu/getUsernames/email=${this.email}`).then(res=>{
      if(res.status===200){
        this.userData.name=res.data.name
        this.userData.phone=res.data.phone
        this.userData.email=res.data.email
      }else if(res.status===403){
        this.$message.error("Unauthorized")
      }else if(res.status===404){
        this.$message.error("Not Found")
      }
    })
    axios.get(`mu/project/getScoreByEmail?email=${this.email}`).then(res=>{
      if(res.status===200){
        this.userData.projectScore=res.data
      }else if(res.status===403){
        this.$message.error("Unauthorized")
      }else if(res.status===400){
        this.$message.error("Serve Error")
      }
    })
    axios.get(`mu/thesis/getScoreByEmail?email=${this.email}`).then(res=>{
      if(res.status===200){
        this.userData.thesisScore=res.data
      }else if(res.status===403){
        this.$message.error("Unauthorized")
      }else if(res.status===400){
        this.$message.error("Serve Error")
      }
    })
    axios.get((`mu/project/queryByUploaderEmail?uploaderEmail=${this.email}`)).then(res => {
      if(res.status===200){
        let arr = Array.from(res.data);
        this.userData.projectNumber=arr.length
      }else if(res.status===403){
        this.$message.error("Unauthorized")
      }else if(res.status===400){
        this.$message.error("Serve Error")
      }else if(res.status===404){
        this.$message.error("Not Found")
      }
    })
    axios.get((`mu/thesis/queryByUploaderEmail?uploaderEmail=${this.email}`)).then(res => {
      if(res.status===200){
        let arr = Array.from(res.data);
        this.userData.thesisNumber=arr.length
      }else if(res.status===403){
        this.$message.error("Unauthorized")
      }else if(res.status===400){
        this.$message.error("Serve Error")
      }else if(res.status===404){
        this.$message.error("Not Found")
      }
    })
  },
  methods:{
    echartsInit: function () {
      this.email=this.$store.state.userinfo.email
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
      axios.get((`mu/project/queryByUploaderEmail?uploaderEmail=${this.email}`)).then(res => {
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
        axios.get((`mu/project/queryByUploaderEmail?uploaderEmail=${this.email}`)).then(res0 => {
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
        })
      })
    }
  }
}
</script>

<style>
.my-label {
  background: #E1F3D8;
}

.my-content {
  background: #FDE2E2;
}
</style>
