<template>
  <el-container>
    <el-header>
      <CommonHeader/>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <CommonAside/>
      </el-aside>
      <el-main class="box">
        <div class="box-block">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/ChannelManagement' }">查看通道</el-breadcrumb-item>
            <el-breadcrumb-item v-if="activeName == 'thesis'">论文通道</el-breadcrumb-item>
            <el-breadcrumb-item v-else-if="activeName == 'project'">项目通道</el-breadcrumb-item>
            <el-breadcrumb-item v-else-if="activeName == 'addChannel'">添加通道</el-breadcrumb-item>
          </el-breadcrumb>
          <br>
          <div class="box-block-content">
            <el-tabs type="border-card" v-model="activeName" stretch @tab-click="handleClick">
              <el-tab-pane label="论文" name="thesis">
                <el-table
                    max-height="400"
                    :default-sort = "{prop: 'due', order: 'descending'}"
                    :data="thesisData" stripe border style="width: 100%" @row-click="clickData">
                  <el-table-column label="研究方向" prop="name" align="center"></el-table-column>
                  <el-table-column label="提交截止日期" prop="due" align="center" sortable>
                    <template slot-scope="scope">
                      {{ parseTime(scope.row.due) }}
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="项目" name="project">
                <el-table max-height="400"
                          :default-sort = "{prop: 'due', order: 'descending'}"
                          :data="projectData" stripe border style="width: 100%" @row-click="clickData">
                  <el-table-column label="所属类别" prop="name" align="center"></el-table-column>
                  <el-table-column label="提交截止日期" prop="due" align="center" sortable>
                    <template slot-scope="scope">
                      {{ parseTime(scope.row.due) }}
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="添加通道" name="addChannel" >
                <div style="position: relative;left: 270px;">
                  <el-form  ref="addChannelDelete" :label-position="labelPosition" label-width="120px" :model="addChannel">
                    <el-form-item label="通道名称" prop="name">
                      <el-input type="string" v-model="addChannel.name" style="width:225px"
                                placeholder="请输入通道名称"></el-input>
                    </el-form-item>
                    <el-form-item label="通道类型" prop="type">
                      <el-select v-model="addChannel.type" placeholder="请选择通道类型">
                        <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="通道创建者" prop="creator">
                      <el-input type="string" v-model="addChannel.creator" style="width:225px"
                                placeholder="请输入通道创建者"></el-input>
                    </el-form-item>
                    <el-form-item label="通道创建者邮箱" prop="creatorEmail">
                      <el-input type="email" v-model="addChannel.creatorEmail" style="width:225px"
                                placeholder="请输入通道创建者邮箱"></el-input>
                    </el-form-item>
                    <el-form-item label="通道得分" prop="score">
                      <el-input type="string" v-model="addChannel.score" style="width:225px"
                                placeholder="请输入通道得分"></el-input>
                    </el-form-item>
                    <el-form-item label="通道截止时间" prop="due">
                      <el-date-picker
                          v-model="addChannel.due"
                          type="datetime"
                          placeholder="请选择通道截止时间"
                          value-format="yyyy-MM-dd HH:mm:ss">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="success" icon="el-icon-plus" @click="add('addChannelDelete')">添加通道信息</el-button>
                    </el-form-item>
                  </el-form>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>

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
  name: "ChannelManagement",
  store,
  components: {
    CommonAside,
    CommonHeader
  },
  data() {
    return {
      labelPosition: 'right',
      activeName: '',
      projectData: [],
      projectData1: [],
      thesisData1: [],
      thesisData: [],
      tabPosition: 'left',
      addChannel: {
        name: '',
        type: '',
        creator: '',
        creatorEmail: '',
        score: '',
        due: '',
      },
      options: [{
        value: 'Thesis',
        label: '论文'
      }, {
        value: 'Project',
        label: '项目'
      }],
      value: ''
    };
  },
  created:function () {
    axios.get((`mu/listChannel`)).then(res => {
      this.tableData = res.data;
      for (let i = 0, j = 0, k = 0; i < this.tableData.length; i++) {
        if (res.data[i].type === "Thesis") {
          this.$data.thesisData1[j] = res.data[i]
          console.log(this.thesisData1[j].name)
          j++
        } else {
          this.$data.projectData1[k] = res.data[i]
          console.log(this.projectData1[k].name)
          k++
        }
      }
      this.$data.thesisData = this.$data.thesisData1
      this.$data.projectData = this.$data.projectData1
    })
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
    add(addChannelDelete) {
      if (this.$data.addChannel.name === '') {
        this.$message({
          message: "请输入新的通道名称！",
          type: 'warning'
        })
      } else if (this.$data.addChannel.type === '') {
        this.$message({
          message: "请输入新的通道类型！",
          type: 'warning'
        })
      } else if (this.$data.addChannel.creator === '') {
        this.$message({
          message: "请输入新的通道创建者！",
          type: 'warning'
        })
      } else if (this.$data.addChannel.creatorEmail === '') {
        this.$message({
          message: "请输入新的通道创建者邮箱！",
          type: 'warning'
        })
      } else if (this.$data.addChannel.score === '') {
        this.$message({
          message: "请输入新的通道分数！",
          type: 'warning'
        })
      } else if (this.$data.addChannel.due === '') {
        this.$message({
          message: "请输入新的通道截止日期！",
          type: 'warning'
        })
      } else {
        this.look = this.$route.query.row
        this.due = this.$data.addChannel.due.toString()
        axios.put(`mu/addChannel?name=${this.$data.addChannel.name}&type=${this.$data.addChannel.type}&creator=${this.$data.addChannel.creator}&creatorEmail=${this.$data.addChannel.creatorEmail}&score=${this.$data.addChannel.score}&due=${this.$data.addChannel.due}`).then(res => {
          console.log(res)
          this.$refs[addChannelDelete].resetFields()
          axios.get((`mu/listChannel`)).then(res0 => {
            this.tableData = res0.data;
            for (let i = 0, j = 0, k = 0; i < this.tableData.length; i++) {
              if (res0.data[i].type === "Thesis") {
                this.$data.thesisData1[j] = res0.data[i]
                console.log(this.thesisData1[j].name)
                j++
              } else {
                this.$data.projectData1[k] = res0.data[i]
                console.log(this.projectData1[k].name)
                k++
              }
            }
            this.$data.thesisData = this.$data.thesisData1;
            this.$data.projectData = this.$data.projectData1
            console.log(this.thesisData);
            console.log(this.projectData)
          })
          this.$message.success("添加成功！")
        })
      }
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    clickData(row, event, column) {
      console.log(row, event, column)
      this.$store.state.channel.id = row.id
      this.$router.push({path: '/updateChannel'})
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

.box-block {
  height: 100%;
  justify-content: center;
  align-items: center;
}

.el-header {
  padding: 0 0;
}
</style>
