<template>
  <div>
    <el-button type="primary" @click="lookChannel" style="position: absolute;right: 100px;top: 10px;">获取通道信息
    </el-button>
    <el-button type="primary" @click="lookTime" style="position: absolute;right: 100px;top: 40px;">获取时间
    </el-button>
    <el-tabs v-model="activeName" @tab-click="handleClick" style="width: 400px;" stretch>
      <el-tab-pane label="通道信息" name="look">
        <div>
          通道id：<a>{{ userinfo.id }}</a><br>
          通道名称：<a>{{ userinfo.name }}</a><br>
          通道类型：<a>{{ userinfo.type }}</a><br>
          通道创建者：<a>{{ userinfo.creator }}</a><br>
          通道创建者邮箱：<a>{{ userinfo.creatorEmail }}</a><br>
          通道分数：<a>{{ userinfo.score }}</a><br>
          通道截止日期：<a value-format="yyyy-MM-dd HH:mm:ss">{{ userinfo.due }}</a><br>
        </div>
      </el-tab-pane>
      <el-tab-pane label="修改通道信息" name="update">
        <el-form :label-position="labelPosition" label-width="120px" :model="updateChannel">
          <el-form-item label="通道名称">
            <el-input type="string" v-model="updateChannel.name" style="width:225px"
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
            <el-input type="string" v-model="updateChannel.creator" style="width:225px"
                      placeholder="请输入新的通道创建者"></el-input>
          </el-form-item>
          <el-form-item label="通道创建者邮箱">
            <el-input type="email" v-model="updateChannel.creatorEmail" style="width:225px"
                      placeholder="请输入新的通道创建者邮箱"></el-input>
          </el-form-item>
          <el-form-item label="通道得分">
            <el-input type="string" v-model="updateChannel.score" style="width:225px"
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
            <el-button type="primary" @click="updatechannel">修改通道信息</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "updateChannel",
  data() {
    return {
      userinfo: {
        "id": "",
        "name": "",
        "type": "",
        "creator": "",
        "creatorEmail": "",
        "score": "",
        "due": "",
      },
      activeName: '',
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
  methods: {
    lookTime(){

    },
    handleClick(tab, event) {
      console.log(tab, event);
      this.look = this.$route.query.row
      axios.get(`mu/getChannelById?id=${this.look.id}`, {
        id: this.look.id
      }).then(res => {
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
    lookChannel() {
      this.look = this.$route.query.row
      this.$message({
        message: this.look,
        type: 'success'
      })
    },
    updatechannel() {
      if (this.$data.updateChannel.name === '') {
        this.$message({
          message: "请输入新的通道名称！",
          type: 'warning'
        })
      } else if (this.$data.updateChannel.type === '') {
        this.$message({
          message: "请输入新的通道类型！",
          type: 'warning'
        })
      } else if (this.$data.updateChannel.creator === '') {
        this.$message({
          message: "请输入新的通道创建者！",
          type: 'warning'
        })
      } else if (this.$data.updateChannel.creatorEmail === '') {
        this.$message({
          message: "请输入新的通道创建者邮箱！",
          type: 'warning'
        })
      } else if (this.$data.updateChannel.score === '') {
        this.$message({
          message: "请输入新的通道分数！",
          type: 'warning'
        })
      } else if (this.$data.updateChannel.due === '') {
        this.$message({
          message: "请输入新的通道截止日期！",
          type: 'warning'
        })
      } else {
        this.look = this.$route.query.row
        this.due = this.$data.updateChannel.due.toString()
        this.$message({
          message: this.look.id,
          type: 'success'
        })
        axios.post(`mu/updateChannel?id=${this.look.id}&name=${this.$data.updateChannel.name}&type=${this.$data.updateChannel.type}&creator=${this.$data.updateChannel.creator}&creatorEmail=${this.$data.updateChannel.creatorEmail}&score=${this.$data.updateChannel.score}&due=${this.$data.updateChannel.due}`).then(res => {
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
            this.$message({
              message: res.data,
              type: 'success'
            })
          }
        })
      }
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
</style>