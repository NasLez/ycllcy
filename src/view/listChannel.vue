<template>
  <div>
    <el-tabs  v-model="activeName" style="" stretch @tab-click="handleClick">
      <el-tab-pane label="论文" name="thesis">
        <el-table :data="tableData" stripe style="width: 100%" @row-click="clickData" >
          <el-table-column prop="name" ></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="项目" name="project">论文</el-tab-pane>
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
      tableData: [],
      thesisName: [],
      tabPosition: 'left'
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
      axios.get((`mu/listChannel`)).then(res => {
        this.tableData = res.data;
        for (let i = 0; i < this.tableData.length; i++) {
          if (res.data[i].type === "Thesis") {
            // alert(res.data[i].name)
          }
        }
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
          message:"11",
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
        for (let i = 0; i < this.tableData.length; i++) {
          if (res.data[i].type === "Thesis") {
            // alert(res.data[i].name)
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