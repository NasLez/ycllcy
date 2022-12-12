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
        <div>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item >查看通道</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/SubmitProjectsAndPapers' }" v-if="bread == 'thesis'">论文通道</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/SubmitProjectsAndPapers' }" v-if="bread == 'project'">项目通道</el-breadcrumb-item>
          </el-breadcrumb>
          <br>
          <el-tabs type="border-card" v-model="activeName" stretch @tab-click="handleClick" ref="tabs">
            <el-tab-pane label="论文" name="thesis">
              <el-table :data="thesisData"
                        max-height="400"
                        :default-sort = "{prop: 'due', order: 'descending'}"
                        border style="width: 100%" @row-click="clickThesis">
                <el-table-column label="研究方向"  prop="name" align="center"></el-table-column>
                <el-table-column label="提交截止日期"  prop="due" sortable align="center">
                  <template slot-scope="scope">
                    {{parseTime(scope.row.due)}}
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="项目" name="project">
              <el-table :data="projectData"
                        max-height="400"
                        :default-sort = "{prop: 'due', order: 'descending'}"
                        border style="width: 100%" @row-click="clickProject">
                <el-table-column  label="所属类别" prop="name" align="center"></el-table-column>
                <el-table-column label="提交截止日期" prop="due" sortable align="center">
                  <template slot-scope="scope">
                    {{parseTime(scope.row.due)}}
                  </template>
                </el-table-column>
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
import CommonAside from "../../component/CommonAside"
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
    parseTime(time, cFormat) {
      if (arguments.length === 0) {
        return null
      }
      const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
      let date
      if (typeof time === 'object') {
        date = time
      } else {
        if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
          time = parseInt(time)
        }
        if ((typeof time === 'number') && (time.toString().length === 10)) {
          time = time * 1000
        }
        date = new Date(time)
      }
      const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours()-8,
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
      }
      const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
        const value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') {
          return ['日', '一', '二', '三', '四', '五', '六'][value]
        }
        return value.toString().padStart(2, '0')
      })
      return time_str
    },
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
