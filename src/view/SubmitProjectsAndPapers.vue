<template>
  <el-container>
    <el-header>
      <CommonHeader/>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <CommonAside/>
      </el-aside>
      <el-main>
        <div>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item >查看通道</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/SubmitProjectsAndPapers' }" v-if="bread == 'thesis'">论文通道</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/SubmitProjectsAndPapers' }" v-if="bread == 'project'">项目通道</el-breadcrumb-item>
          </el-breadcrumb>
          <el-tabs v-model="activeName" style="width: 500px" stretch @tab-click="handleClick" ref="tabs">
            <el-tab-pane label="论文" name="thesis">
              <el-table :data="thesisData" stripe style="width: 100%" @row-click="clickThesis">
                <el-table-column label="论文分类" prop="name"></el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="项目" name="project">
              <el-table :data="projectData" stripe style="width: 100%" @row-click="clickProject">
                <el-table-column label="项目分类" prop="name"></el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import axios from "axios";
import store from "@/vuex/store";
import CommonAside from "../component/CommonAside"
import CommonHeader from "@/component/CommonHeader";

export default {
  name: "SubmitProjectsAndPapers",
  store,
  components: {
    CommonHeader,
    CommonAside
  },
  data() {
    return {
      bread: '',
      activeName: '',
      projectData: [],
      projectData1: [],
      thesisData1: [],
      thesisData: [],
      tabPosition: 'left'
    };
  },
  methods: {
    handleClick(tab, event) {
      if(this.activeName == 'project'){
        this.bread = 'project'
      }else if(this.activeName == 'thesis'){
        this.bread = 'thesis'
      }
      console.log(tab, event);
      axios.get(`mu/listChannel`).then(res => {
        this.tableData = res.data;
        for (let i = 0, j = 0, k = 0; i < this.tableData.length; i++) {
          if (res.data[i].type === "Thesis") {
            this.$data.thesisData1[j] = res.data[i]
            j++
          } else {
            this.$data.projectData1[k] = res.data[i]
            k++
          }
        }
        this.thesisData = this.thesisData1;
        this.projectData = this.projectData1
        console.log(this.tableData);
      })
    },
    clickProject(row, event, column) {
      console.log(row, event, column)
      let newData = Date.parse(new Date());
      if (newData <= row.due) {
        this.$store.state.channel.id = row.id
        this.$store.state.project.id = '0'
        this.$store.state.project.channelId = row.id
        this.$router.push({path: '/ProjectEdit'})
      } else {
        this.$message.error("超过截止时间！禁止提交！")
      }
    },
    clickThesis(row, event, column) {
      console.log(row, event, column)
      let newData = Date.parse(new Date());
      if (newData <= row.due) {
        this.$store.state.channel.id = row.id
        this.$store.state.thesis.id = '0'
        this.$store.state.thesis.channelId = row.id
        this.$router.push({path: '/PaperEdit'})
      } else {
        this.$message.error("超过截止时间！禁止提交！")
      }
    },
    listChannel() {
    }
  }
}
</script>

<style scoped>
.el-aside {
  display: block;
  position: absolute;
  left: 0;
  top: 60px;
  bottom: 0;
}
.el-main {
  position: absolute;
  left: 200px;
  right: 0;
  top: 60px;
  bottom: 0;
  overflow-y: scroll;
}
</style>
