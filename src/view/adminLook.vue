<template>
  <div>
    <el-tabs  v-model="activeName" style="width: 500px" stretch @tab-click="handleClick" ref="tabs">
      <el-tab-pane label="论文" name="thesis">
        <el-table :data="thesisData" stripe style="width: 100%" @row-click="clickData" >
          <el-table-column label="论文分类" prop="name" ></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="项目" name="project">
        <el-table :data="projectData" stripe style="width: 100%" @row-click="clickData" >
          <el-table-column label="项目分类" prop="name" ></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="添加通道" name="'add" >

      </el-tab-pane>
    </el-tabs>
  </div>

</template>

<script>
import axios from "axios";

export default {
  name: "listChannel",
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
      axios.get((`mu/listChannel`)).then(res => {
        this.tableData = res.data;
        for (let i = 0,j=0,k=0; i < this.tableData.length; i++) {
          if (res.data[i].type === "Thesis") {
            // alert(res.data[i].name)
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
    clickData(row, event, column) {
      console.log(row,  event,  column)
      // this.$message({
      //   message:row,
      //   type:'success'
      // })
      this.isAdmin=this.$route.query.isAdmin
      if(this.isAdmin==="1"){
        this.$message({
          message:"欢迎管理员！",
          type:'success'
        })
        this.$router.push({path: '/updateChannel',query:{row:row}})
      }
    },
    listChannel() {
      axios.get((`mu/listChannel`)).then(res => {
        this.tableData = res.data;
        if (res.data[0].type === "Thesis") {
          this.$message({
            message: res.data[0].name,
            type: 'success'
          })
        }
        for (let i = 0,j=0; i < this.tableData.length; i++) {
          if (res.data[i].type === "Thesis") {
            // alert(res.data[i].name)
            this.$data.thesisData[j]=res.data[i]
            j++
          }
        }
        console.log(this.tableData);
      })
    }
  }
}
</script>

<style scoped>

</style>