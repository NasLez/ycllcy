<template>
  <div>
    <el-button type="primary" @click="listChannel">获取通道信息</el-button>
    <br><br>
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
  name: "listChannel",
  data() {
    return {
      tableData: [],
      channelDate: [],
      tabPosition: 'left'
    };
  },
  methods: {
    listChannel() {
      axios.get((`mu/listChannel`)).then(res => {
        console.log(res.data);
        this.tableData = res.data;
        console.log(this.tableData);
      })
    },
  }
}
</script>

<style scoped>

</style>