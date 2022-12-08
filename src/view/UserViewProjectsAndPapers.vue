<template>
  <div>
    <a style="color:dodgerblue">查看项目/论文</a>
    <el-tabs v-model="activeName" style="width: 1000px" stretch @tab-click="handleClick">
      <el-tab-pane label="论文" name="thesis">
        <el-table
            :data="thesisData"
            stripe
            border
            height="400"
            style="width: 100%"
            @row-click="clickThesis"
            :default-sort="{prop: 'submitTime', order: 'descending'}">
          <el-table-column
              label="提交时间"
              sortable
              align="center"
              prop="submitTime">
            <template slot-scope="scope">
            <span v-if="scope.row.submitTime!= null">
              {{ parseTime(scope.row.submitTime) }}
            </span>
            </template>
          </el-table-column>
          <el-table-column
              align="center"
              label="题目"
              prop="name">
          </el-table-column>
          <el-table-column
              align="center"
              label="负责人"
              prop="maintainer">
          </el-table-column>
          <el-table-column
              align="center"
              label="所属研究方向"
              prop="channelName">
          </el-table-column>
          <el-table-column
              align="center"
              label="审核状态"
              :filters="[{text:'审核中',value:'Waiting'},{text:'审核通过',value:'Accept'},{text:'审核不通过',value:'Reject'},]"
              :filter-method="filterStatus"
              prop="status">
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="项目" name="project">
        <el-table
            :data="projectData"
            stripe
            border
            height="400"
            style="width: 100%"
            @row-click="clickProject"
            :default-sort="{prop: 'setTime', order: 'descending'}">
          <el-table-column
              align="center"
              label="提交时间"
              prop="setTime"
              sortable>
          </el-table-column>
          <el-table-column
              align="center"
              label="名称"
              prop="name">
          </el-table-column>
          <el-table-column
              align="center"
              label="负责人"
              prop="maintainer">
          </el-table-column>
          <el-table-column
              align="center"
              label="项目类别"
              prop="channelName">
          </el-table-column>
          <el-table-column
              align="center"
              label="审核状态"
              prop="status"
              :filters="[{text:'审核中',value:'Waiting'},{text:'审核通过',value:'Accept'},{text:'审核不通过',value:'Reject'},]"
              :filter-method="filterStatus">
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import axios from "axios";
import store from "@/vuex/store";

export default {
  name: "UserViewProjectsAndPapers",
  store,
  data() {
    return {
      activeName: '',
      projectData: [],
      thesisData: [],
      tabPosition: 'left'
    };
  },
  created: function () {
    this.userEmail = this.$store.state.userinfo.email
    this.isAdmin = this.$store.state.userinfo.isAdmin
    // this.$message.success(this.userEmail)
    // this.$message.success(this.isAdmin)
    if (this.isAdmin === "1") {
      axios.get((`mu/project/queryAll`)).then(res => {
        let arr = Array.from(res.data);
        arr.forEach(item => {
          this.channelId = item.channelId
          axios.get(`mu/getChannelById?id=${this.channelId}`).then(qll => {
            if (qll.status === 200) {
              this.channelName = qll.data.name
              this.$set(item, 'channelName', this.channelName)
            } else if (qll.status === 403) {
              this.$message.error("Unauthorized")
            } else if (qll.status === 404) {
              this.$message.error("serve error")
            }
          })
        })
        this.projectData = arr
      })
      axios.get((`mu/thesis/queryAll`)).then(res => {
        let arr = Array.from(res.data);
        arr.forEach(item => {
          this.channelId = item.channelId
          axios.get(`mu/getChannelById?id=${this.channelId}`).then(qll => {
            if (qll.status === 200) {
              this.channelName = qll.data.name
              this.$set(item, 'channelName', this.channelName)
            } else if (qll.status === 403) {
              this.$message.error("Unauthorized")
            } else if (qll.status === 404) {
              this.$message.error("serve error")
            }
          })
        })
        this.thesisData = arr
      })
    } else if (this.isAdmin === "0") {
      axios.get((`mu/project/queryByUploaderEmail?uploaderEmail=${this.userEmail}`)).then(res => {
        let arr = Array.from(res.data);
        arr.forEach(item => {
          this.channelId = item.channelId
          axios.get(`mu/getChannelById?id=${this.channelId}`).then(qll => {
            if (qll.status === 200) {
              this.channelName = qll.data.name
              this.$set(item, 'channelName', this.channelName)
            } else if (qll.status === 403) {
              this.$message.error("Unauthorized")
            } else if (qll.status === 404) {
              this.$message.error("serve error")
            }
          })
        })
        this.projectData = arr
      })
      axios.get((`mu/thesis/queryByUploaderEmail?uploaderEmail=${this.userEmail}`)).then(res => {
        let arr = Array.from(res.data);
        arr.forEach(item => {
          this.channelId = item.channelId
          axios.get(`mu/getChannelById?id=${this.channelId}`).then(qll => {
            if (qll.status === 200) {
              this.channelName = qll.data.name
              this.$set(item, 'channelName', this.channelName)
            } else if (qll.status === 403) {
              this.$message.error("Unauthorized")
            } else if (qll.status === 404) {
              this.$message.error("serve error")
            }
          })
        })
        this.thesisData = arr
      })
    }
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
        h: date.getHours(),
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
    filterStatus(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    handleClick(tab, event) {
      console.log(tab)
      console.log(event)
    },
    clickThesis(row, event, column) {
      console.log(row, event, column)
      this.$store.state.thesis.id = row.id
      this.$message.success(this.$store.state.thesis.id)
      this.$router.push({path: '/PaperDetail'})
    },
    clickProject(row, event, column) {
      console.log(row, event, column)
      // this.$message.success("id=" + row.id + ",uploaderEmail=" + row.uploaderEmail)
      this.$store.state.project.id = row.id
      console.log(this.$store.state.project.id)
      console.log(this.$store.state.userinfo.email)
      this.$router.push({path: '/ProjectDetail'})
    }
  }
}
</script>

<style scoped>
</style>
