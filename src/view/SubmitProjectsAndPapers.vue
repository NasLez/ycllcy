<template>
  <div>
    <a style="color:dodgerblue">提交项目/论文</a>
    <el-tabs  v-model="activeName" style="width: 500px" stretch @tab-click="handleClick" ref="tabs">
      <el-tab-pane label="论文" name="thesis">
        <el-table :data="thesisData" stripe style="width: 100%" @row-click="clickThesis" >
          <el-table-column label="论文分类" prop="name" ></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="项目" name="project">
        <el-table :data="projectData" stripe style="width: 100%" @row-click="clickProject" >
          <el-table-column label="项目分类" prop="name" ></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import axios from "axios";
import store from "@/vuex/store";
export default {
  name: "SubmitProjectsAndPapers",
  store,
  data() {
    return {
      activeName:'',
      projectData: [],
      projectData1:[],
      thesisData1: [],
      thesisData:[],
      tabPosition: 'left'
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
      axios.get(`mu/listChannel`).then(res => {
        this.tableData = res.data;
        for (let i = 0,j=0,k=0; i < this.tableData.length; i++) {
          if (res.data[i].type === "Thesis") {
            this.$data.thesisData1[j]=res.data[i]
            j++
          }else{
            this.$data.projectData1[k]=res.data[i]
            k++
          }
        }
        this.thesisData=this.thesisData1;
        this.projectData=this.projectData1
        console.log(this.tableData);
      })
    },
    clickProject(row, event, column) {
      console.log(row,  event,  column)
      let newData = Date.parse(new Date());
      if(newData<=row.due){
        this.$store.state.channel.id=row.id
        this.$store.state.project.id='0'
        this.$store.state.project.channelId=row.id
        this.$router.push({path:'/ProjectEdit'})
      }else{
        this.$message.error("超过截止时间！禁止提交！")
      }
    },
    clickThesis(row, event, column) {
      console.log(row,  event,  column)
      let newData = Date.parse(new Date());
      if(newData<=row.due){
        this.$store.state.channel.id=row.id
        this.$store.state.thesis.id='0'
        this.$store.state.thesis.channelId=row.id
        this.$router.push({path:'/PaperEdit'})
      }else{
        this.$message.error("超过截止时间！禁止提交！")
      }
    },
    listChannel() {

    }
  }
}
</script>

<style scoped>

</style>
