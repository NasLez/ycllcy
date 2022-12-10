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
          <el-breadcrumb>
            <el-breadcrumb-item :to="{ path: '/ChannelManagement' }">查看通道</el-breadcrumb-item>
            <el-breadcrumb-item>通道详情</el-breadcrumb-item>
          </el-breadcrumb>
          <br>
          <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick"  stretch>
            <el-tab-pane label="通道信息" name="look">
              <el-descriptions :column="1" border >
                <el-descriptions-item label="通道id">
                  <el-tag size="small" style="color: crimson">{{ userinfo.id }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="通道名称">
                  {{ userinfo.name }}
                </el-descriptions-item>
                <el-descriptions-item label="通道类型">
                  <el-tag size="small">{{ userinfo.type }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="通道创建者">
                  {{ userinfo.creator }}
                </el-descriptions-item>
                <el-descriptions-item label="通道创建者邮箱">
                  {{ userinfo.creatorEmail }}
                </el-descriptions-item>
                <el-descriptions-item label="通道分数">
                  {{userinfo.score }}
                </el-descriptions-item>
                <el-descriptions-item label="通道截止日期">
                  {{ parseTime(userinfo.due) }}
                </el-descriptions-item>
              </el-descriptions>
            </el-tab-pane>
            <el-tab-pane label="修改通道信息" name="update">
              <el-form :label-position="labelPosition" label-width="120px" :model="updateChannel">
                <el-form-item label="通道名称">
                  <el-input type="string" v-model="userinfo.name" style="width:225px"
                            placeholder="请输入新的通道名称"></el-input>
                </el-form-item>
                <el-form-item label="通道类型">
                  <el-select v-model="updateChannel.type" placeholder="请选择新的通道类型">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="通道创建者">
                  <el-input type="string" v-model="userinfo.creator" style="width:225px"
                            placeholder="请输入新的通道创建者"></el-input>
                </el-form-item>
                <el-form-item label="通道创建者邮箱">
                  <el-input type="email" v-model="userinfo.creatorEmail" style="width:225px"
                            placeholder="请输入新的通道创建者邮箱"></el-input>
                </el-form-item>
                <el-form-item label="通道得分">
                  <el-input type="string" v-model="userinfo.score" style="width:225px"
                            placeholder="请输入新的通道得分"></el-input>
                </el-form-item>
                <el-form-item label="通道截止时间">
                  <el-date-picker
                      v-model="updateChannel.due"
                      type="datetime"
                      placeholder="请选择新的通道截止时间"
                      value-format="yyyy-MM-dd HH:mm:ss">
                  </el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="updateChannelNow">修改通道信息</el-button>
                </el-form-item>
              </el-form>
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
  name: "UpdateChannel",
  store,
  components: {
    CommonAside,
    CommonHeader
  },
  data() {
    return {
      userinfo: {
        id: '',
        name: '',
        type: '',
        creator: '',
        creatorEmail: '',
        score: '',
        due: '',
      },
      activeName: 'look',
      labelPosition: 'right',
      updateChannel: {
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
    }
  },
  created: function () {
    this.channelid = this.$store.state.channel.id
    axios.get(`mu/getChannelById?id=${this.channelid}`).then(res => {
      this.userinfo.id = res.data.id
      this.userinfo.name = res.data.name
      if (res.data.type === "Thesis") {
        this.userinfo.type = "论文"
      } else if (res.data.type === "Project") {
        this.userinfo.type = "项目"
      }
      this.userinfo.creator = res.data.creator
      this.userinfo.creatorEmail = res.data.creatorEmail
      this.userinfo.score = res.data.score
      this.userinfo.due = res.data.due
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
    handleClick(tab, event) {
      console.log(tab, event);
    },
    updateChannelNow() {
      this.look = this.$store.state.channel.id
      this.due = this.$data.updateChannel.due.toString()
      axios.post(`mu/updateChannel?id=${this.look}&name=${this.userinfo.name}&type=${this.updateChannel.type}&creator=${this.userinfo.creator}&creatorEmail=${this.userinfo.creatorEmail}&score=${this.userinfo.score}&due=${this.$data.updateChannel.due}`).then(res => {
        if (res.status === 400) {
          this.$message({
            message: "serve error",
            type: 'warning'
          })
        } else if (res.status === 403) {
          this.$message({
            message: "Unauthorized",
            type: 'warning'
          })
        } else if (res.status === 404) {
          this.$message({
            message: "Name Not Found",
            type: 'warning'
          })
        } else if (res.status === 200) {
          this.channelid = this.$store.state.channel.id
          axios.get(`mu/getChannelById?id=${this.channelid}`).then(res => {
            this.userinfo.id = res.data.id
            this.userinfo.name = res.data.name
            if (res.data.type === "Thesis") {
              this.userinfo.type = "论文"
            } else if (res.data.type === "Project") {
              this.userinfo.type = "项目"
            }
            this.userinfo.creator = res.data.creator
            this.userinfo.creatorEmail = res.data.creatorEmail
            this.userinfo.score = res.data.score
            this.userinfo.due = res.data.due
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.user {
  display: flex;
  flex-direction: column;
  align-items: center;
}

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
