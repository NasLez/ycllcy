<template>
  <div>
    <a style="color: dodgerblue">用户管理组件</a>
    <br> <br>
    <div style="width: 300px;">
      <el-form :label-position="labelPosition" label-width="80px" :model="ActivationCode">
        <el-form-item label="激活码">
          <el-input v-model="ActivationCode.code"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input v-model="ActivationCode.name"></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <el-input v-model="ActivationCode.isAdmin"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="AddActivationCode">添加激活码</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="width: 500px">
      <el-table :data="code_data"
                stripe="true"
                border="true"
                height="400"
                style="width: 100%" @row-click="clickData">
        <el-table-column label="注册码" prop="code" align="center"></el-table-column>
        <el-table-column label="姓名" prop="name" align="center">
        </el-table-column>
        <el-table-column label="权限" prop="isAdmin" align="center"></el-table-column>
        <el-table-column>
          <template slot="header" slot-scope="scope">
            <el-input
                v-model="codesearch"
                size="mini"
                placeholder="输入真实姓名搜索邀请码"/>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
            @size-change="handleSizeChangeCode"
            @current-change="handleCurrentChangeCode"
            :current-page.sync="currentPageCode"
            :page-sizes="[5, 10, 20]"
            :page-size="pagesizeCode"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
      </div>
    </div>
    <div style="width: 1000px;">
      <el-table :data="user_data"
                stripe="true"
                border="true"
                height="400"
                style="width: 1000px"
                :default-sort="{prop: 'id', order: 'ascending'}">
        <el-table-column prop="date" label="用户头像" align="center">
        </el-table-column>
        <el-table-column prop="name" label="姓名" align="center">
        </el-table-column>
        <el-table-column prop="isAdmin" label="权限" align="center">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" align="center">
        </el-table-column>
        <el-table-column prop="id" label="注册顺序" sortable align="center">
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center">
          <template slot="header" slot-scope="scope">
            <el-input
                v-model="usersearch"
                size="mini"
                placeholder="输入用户名搜索用户"/>
          </template>
          <template slot-scope="scope">
            <el-popconfirm
                title="确定删除此账号吗？"
                confirm-button-text='好的'
                cancel-button-text='不用了'
                icon="el-icon-info"
                icon-color="red"
                @confirm="deleteRow(scope.$index, scope.row)">
              <el-button slot="reference"  type="text" size="small">删除
              </el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
            @size-change="handleSizeChangeUser"
            @current-change="handleCurrentChangeUSer"
            :current-page.sync="currentPageUser"
            :page-sizes="[5, 10, 20]"
            :page-size="pagesizeUser"
            layout="total, sizes, prev, pager, next, jumper"
            :total="UserTotal">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import store from "@/vuex/store";
export default {
  //搜索数据
  store,
  data() {
    return {
      labelPosition: 'right',
      ActivationCode: {
        code: '',
        name: '',
        isAdmin: ''
      },
      codeData: [],
      userData: [],
      codesearch: '',
      usersearch: '',
      currentPageCode: 1,
      pagesizeCode: 5,
      currentPageUser: 1,
      pagesizeUser: 5,
      total: 0,
      UserTotal: 0
    };
  },
  computed: {
    code_data() {
      let search = this.codesearch;
      // 搜索功能
      if (search) {
        let list = this.codeData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()) || data.name.toLowerCase().includes(search.toLowerCase()));
        // let fenYe = list.slice((this.currentPage-1)*this.pagesize,this.currentPage*this.pagesize);
        return list
      } else {
        let fenYe = this.codeData.slice((this.currentPageCode - 1) * this.pagesizeCode, this.currentPageCode * this.pagesizeCode)
        return fenYe
      }
    },
    user_data() {
      let search = this.usersearch;
      // 搜索功能
      if (search) {
        let list = this.userData.filter(data => !search || data.username.toLowerCase().includes(search.toLowerCase()) || data.username.toLowerCase().includes(search.toLowerCase()));
        // let fenYe = list.slice((this.currentPage-1)*this.pagesize,this.currentPage*this.pagesize);
        return list
      } else {
        let fenYe = this.userData.slice((this.currentPageUser - 1) * this.pagesizeUser, this.currentPageUser * this.pagesizeUser)
        return fenYe
      }
    }
  },
  created: function () {
    axios.get(`mu/showActivationCode`).then(res => {
      if (res.status === 403) {
        this.$message({
          message: 'Unauthorized',
          type: 'warning'
        })
      } else if (res.status === 200) {
        this.codeData = res.data
        this.total = this.codeData.length
      }
    })
    axios.get(`mu/showAllUser`).then(res => {
      if (res.status === 403) {
        this.$message({
          message: 'Unauthorized',
          type: 'warning'
        })
      } else if (res.status === 200) {
        this.userData = res.data
        this.UserTotal = this.userData.length
      }
    })
  },
  name: "UserManagement",

  methods: {
    handleSizeChangeCode(val) {
      this.pagesizeCode = val;
      axios.get(`mu/showActivationCode`).then(res => {
        if (res.status === 403) {
          this.$message({
            message: 'Unauthorized',
            type: 'warning'
          })
        } else if (res.status === 200) {
          this.codeData = res.data
        }
      })
    },
    handleSizeChangeUser(val) {
      this.pagesizeUser = val;
      axios.get(`mu/showAllUser`).then(res => {
        if (res.status === 403) {
          this.$message({
            message: 'Unauthorized',
            type: 'warning'
          })
        } else if (res.status === 200) {
          this.userData = res.data
          this.UserTotal = this.userData.length
        }
      })
    },
    handleCurrentChangeUSer(val) {
      this.currentPageUser = val;
      axios.get(`mu/showAllUser`).then(res => {
        if (res.status === 403) {
          this.$message({
            message: 'Unauthorized',
            type: 'warning'
          })
        } else if (res.status === 200) {
          this.userData = res.data
          this.UserTotal = this.userData.length
        }
      })
    },
    handleCurrentChangeCode(val) {
      this.currentPageCode = val;
      axios.get(`mu/showActivationCode`).then(res => {
        if (res.status === 403) {
          this.$message({
            message: 'Unauthorized',
            type: 'warning'
          })
        } else if (res.status === 200) {
          this.codeData = res.data
        }
      })
    },
    deleteRow(index, rows) {
      axios.delete(`mu/deleteUser?email=${rows.email}`).then(res => {
        if (res.status === 403) {
          this.$message({
            message: 'Unauthorized',
            type: 'warning'
          })
        } else if (res.status === 404) {
          this.$message({
            message: 'Not Found',
            type: 'warning'
          })
        } else if (res.status === 200) {
          this.$message({
            message: "删除用户成功！",
            type: 'success'
          })
          axios.get(`mu/showAllUser`).then(res => {
            if (res.status === 403) {
              this.$message({
                message: 'Unauthorized',
                type: 'warning'
              })
            } else if (res.status === 200) {
              this.userData = res.data
              this.UserTotal = this.userData.length
            }
          })
        }
      })
    },
    clickData() {
    },
    AddActivationCode() {
      if (this.$data.ActivationCode.code === '') {
        this.$message({
          message: '请输入激活码！',
          type: 'warning'
        })
      } else if (this.$data.ActivationCode.name === '') {
        this.$message({
          message: '请输入真实姓名！',
          type: 'warning'
        })
      } else if (this.$data.ActivationCode.isAdmin === '') {
        this.$message({
          message: '请输入权限！',
          type: 'warning'
        })
      } else {
        axios.put(`mu/addActivationCode?code=${this.$data.ActivationCode.code}&name=${this.$data.ActivationCode.name}&isAdmin=${this.$data.ActivationCode.isAdmin}`).then(res => {
          if (res.status === 403) {
            this.$message({
              message: 'Unauthorized',
              type: 'warning'
            })
          } else if (res.status === 200) {
            this.$message({
              message: '添加注册码成功！',
              type: 'success'
            })
            axios.get(`mu/showActivationCode`).then(res => {
              if (res.status === 403) {
                this.$message({
                  message: 'Unauthorized',
                  type: 'warning'
                })
              } else if (res.status === 200) {
                this.codeData = res.data
                this.total = this.codeData.length
              }
            })
          }
        })
      }
    },

  }
}
</script>

<style scoped>

</style>
