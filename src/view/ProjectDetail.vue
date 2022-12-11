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
        <el-breadcrumb>
          <el-breadcrumb-item :to="{ path: '/UserViewProjectsAndPapers' }">查看提交</el-breadcrumb-item>
          <el-breadcrumb-item>项目提交</el-breadcrumb-item>
          <el-breadcrumb-item>项目详情</el-breadcrumb-item>
        </el-breadcrumb>
        <br>
        <el-card>
          <a style="font-size: 40px;color: lightskyblue;text-align: center">
            {{ project.name }}
          </a>
          <el-tag size="200px"
                  v-if="project.status==='Waiting'"
          >
            审核中
          </el-tag>
          <el-tag size="large"
                  v-if="project.status==='Accept'"
                  style="color: chartreuse">
            审核通过
          </el-tag>
          <el-tag size="large"
                  v-if="project.status==='Reject'"
                  style="color: crimson">
            审核驳回
          </el-tag>
          <br>
          <a style="font-weight: bold;text-align: left">作者：</a>
          <a >
            {{ project.maintainer }}，
          </a><br>
          <a style="font-weight: bold;text-align: left">所属单位：</a>
          <a >
            {{ project.company }}
          </a><br>
          <a style="font-weight: bold;text-align: left">项目所属类别：</a>
          <a style="text-align: left">
            {{ showChannel }}
          </a><br>
          <a style="font-weight: bold;text-align: left">上传者邮箱：</a>
          <a style="text-align: left">{{ project.uploaderEmail }}</a><br>
          <a style="font-weight: bold;text-align: left">上传时间：</a>
          <a style="text-align: left">{{ project.setTime }}</a><br>
          <a style="font-weight: bold;text-align: left">项目金额：</a>
          <a style="text-align: left">{{ project.money }}，</a>
          <a style="font-weight: bold;text-align: left">项目开始年份：</a>
          <a style="text-align: left">{{ project.startYear }}</a>
          <div style="position: absolute;right: 50px;">
            <el-button @click="edit" type="text" style="color: #99a9bf" v-if="this.$store.state.userinfo.isAdmin==='0'">修改</el-button>
            <el-button @click="deleteProject" type="text" style="color: #99a9bf">删除</el-button>
            <el-button @click="downloadProfile" type="text">下载项目</el-button>
            <el-button @click="downloadPic" type="text">下载项目凭证</el-button>
          </div>
            <br><br>
            <el-divider></el-divider>
            <a style="font-weight: bold;text-align: left">简介：</a>
            <a style="text-align: left">
              {{ project.description }}
            </a>
            <el-divider></el-divider>
          <div v-if="this.$store.state.userinfo.isAdmin==='1'">
            <el-button @click="showEditDialog"
                       style="position: absolute;right: 500px;color: crimson"
                       >审核
            </el-button>
            <el-card class="box-card" style="position: absolute;left: 400px" v-if="editDialogVisible">
              <el-dialog
                  title="请问您的审核结果是？"
                  :visible.sync="editDialogVisible"
                  width="50%" @close="editDialogClosed">
                <el-radio v-model="editStatus" label="Accept">审核通过</el-radio>
                <el-radio v-model="editStatus" label="Reject">审核驳回</el-radio>
                <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false; editStatus ='Waiting' ">取 消</el-button>
        <el-button type="primary" @click="changeStatus">确 定</el-button>
      </span>
              </el-dialog>
            </el-card>
          </div><br><br>
          </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import axios from "axios";
import store from "@/vuex/store.js";
import CommonAside from "../component/CommonAside"
import CommonHeader from "@/component/CommonHeader";

export default {
  name: "ProjectDetail",
  store,
  components: {
    CommonAside,
    CommonHeader
  },
  data() {
    return {
      showChannel: "",
      editDialogVisible: false,
      editStatus: "",
      userinfo: {
        "id": "",
        "username": "",
        "phone": "",
        "email": "",
        "school": "",
        "password": "",
        "isAdmin": "",
        "code": "",
        "name": ""
      },
      project: {
        id: '',
        name: '',
        uploaderEmail: '',
        maintainer: '',
        channelId: '',
        description: '',
        company: '',
        money: '',
        setTime: '',
        status: '',
        startYear: ''
      },
    }
  },
  created() {
    let that = this;
    // this.project.id = this.$route.query.id
    this.project.id = this.$store.state.project.id
    console.log(this.project.id)
    // this.userinfo.email = this.$route.query.email
    this.userinfo.email = this.$store.state.userinfo.email
    console.log(this.userinfo.email)
    console.log("到达详情页面")

    getUSerAndProject(this.userinfo.email, this.project.id);

    function getUSerAndProject(email, id) {
      axios.get(`mu/getUsernames/email=${email}`, {
        email: email,
      }).then(res => {
        console.log(res.data);
        console.log("打印用户信息");
        that.$data.userinfo.id = res.data.id;
        that.$data.userinfo.username = res.data.username;
        that.$data.userinfo.isAdmin = res.data.isAdmin;
        that.$data.userinfo.name = res.data.name;
        that.$data.userinfo.phone = res.data.phone;
        that.$data.userinfo.email = res.data.email;
        that.$data.userinfo.school = res.data.school;
        that.$data.userinfo.password = res.data.password;
        that.$data.userinfo.code = res.data.code;
        that.$data.project.uploaderEmail = res.data.email;
      });
      axios.get(`mu/project/queryById?id=${id}`, {
        id: id
      }).then(res => {
        console.log(res.data);
        console.log("项目信息")
        that.$data.project.id = res.data.id;
        that.$data.project.channelId = res.data.channelId;
        that.$data.project.name = res.data.name;
        that.$data.project.maintainer = res.data.maintainer;
        that.$data.project.description = res.data.description;
        that.$data.project.company = res.data.company;
        that.$data.project.money = res.data.money;
        that.$data.project.setTime = res.data.setTime;
        that.$data.project.status = res.data.status;
        that.$data.project.startYear = res.data.startYear;
        axios.get(`mu/getChannelById?id=${that.$data.project.channelId}`, {
          id: that.$data.project.channelId
        }).then(res => {
          console.log(res.data);
          console.log("打印通道信息")
          that.$data.showChannel = res.data.name;
        })
      });
    }
  },
  methods: {
    edit() {
      this.$router.push({path: '/ProjectEdit'})
    },
    deleteProject() {
      axios.delete(`mu/project/delete?id=${this.project.id}`).then(res => {
        if (res.status === 200) {
          this.$message.success("删除成功")
          this.$router.push({path: '/UserViewProjectsAndPapers'})
        }
      })
    },
    showEditDialog() {
      this.$data.editDialogVisible = true;
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    changeStatus() {
      let that = this;
      axios.post(`mu/project/changeStatus?id=${that.$data.project.id}&status=${that.$data.editStatus}`, {
        id: that.$data.project.id,
        status: that.$data.editStatus
      }).then(res => {
        console.log("修改状态成功")
        console.log(res.data)
      });
      this.editDialogVisible = false
      this.project.status = this.editStatus
    },
    downloadProfile() {
      let that = this;
      window.open(`mu/project/download/${that.$data.project.id}/zip`, "_blank")
    },
    downloadPic() {
      let that = this;
      window.open(`mu/project/download/${that.$data.project.id}/fig`, "_blank")
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
