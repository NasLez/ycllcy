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
            <el-breadcrumb-item :to="{ path: '/ChannelManagement' }">查看通道</el-breadcrumb-item>
            <el-breadcrumb-item v-if="activeName == 'thesis'">论文通道</el-breadcrumb-item>
            <el-breadcrumb-item v-else-if="activeName == 'project'">项目通道</el-breadcrumb-item>
            <el-breadcrumb-item v-else-if="activeName == 'addChannel'">添加通道</el-breadcrumb-item>
          </el-breadcrumb>
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
            <el-tab-pane label="添加通道" name="addChannel">

              <el-form :label-position="labelPosition" label-width="120px" :model="addChannel">
                <el-form-item label="通道名称">
                  <el-input type="string" v-model="addChannel.name" style="width:225px"
                            placeholder="请输入通道名称"></el-input>
                </el-form-item>
                <el-form-item label="通道类型">
                  <el-select v-model="addChannel.type" placeholder="请选择通道类型">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="通道创建者">
                  <el-input type="string" v-model="addChannel.creator" style="width:225px"
                            placeholder="请输入通道创建者"></el-input>
                </el-form-item>
                <el-form-item label="通道创建者邮箱">
                  <el-input type="email" v-model="addChannel.creatorEmail" style="width:225px"
                            placeholder="请输入通道创建者邮箱"></el-input>
                </el-form-item>
                <el-form-item label="通道得分">
                  <el-input type="string" v-model="addChannel.score" style="width:225px"
                            placeholder="请输入通道得分"></el-input>
                </el-form-item>
                <el-form-item label="通道截止时间">
                  <el-date-picker
                      v-model="addChannel.due"
                      type="datetime"
                      placeholder="请选择通道截止时间"
                      value-format="yyyy-MM-dd HH:mm:ss">
                  </el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="add">添加通道信息</el-button>
                  <el-button type="primary" @click="pack">打包数据</el-button>
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
  name: "ChannelManagement",
  store,
  components: {
    CommonAside,
    CommonHeader
  },
  data() {
    return {
      labelPosition:'right',
      activeName:'',
      projectData: [],
      projectData1:[],
      thesisData1: [],
      thesisData:[],
      tabPosition: 'left',
      addChannel:{
        name:'',
        type:'',
        creator:'',
        creatorEmail:'',
        score:'',
        due:'',
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
  methods: {
    pack(){
      this.package=JSON.stringify(this.addChannel)
      this.$message({
        message:this.package,
        type:'success'
      })
    },
    add(){
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
          }else if (res.status === 200) {
            this.$message({
              message: "OK",
              type: 'success'
            })
          }
        })
      }
    },
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
      this.$store.state.channel.id=row.id
      this.$router.push({path: '/updateChannel'})
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
