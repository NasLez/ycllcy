<template>
  <div>
    <a style="color: dodgerblue">用户管理组件</a>
    <br> <br>
    <div style="position:absolute;left: 10px;width: 300px;">
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
    <div style="position:absolute;left: 320px;width: 500px">
      <el-button type="primary" @click="lookCode">查看未被使用的注册码</el-button>

      <el-table :data="code_data" stripe
                style="width: 100%" @row-click="clickData">
        <el-table-column label="注册码" prop="code"></el-table-column>
        <el-table-column label="姓名" prop="name">
        </el-table-column>
        <el-table-column label="权限" prop="isAdmin"></el-table-column>
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
    <div style="position:absolute;left: 830px;width: 1000px;">
      <el-button type="primary" @click="lookUsers">查看用户列表</el-button>
      <el-table :data="user_data" style="width: 1000px" :default-sort="{prop: 'date', order: 'ascending'}">
        <el-table-column prop="date" label="用户头像">
        </el-table-column>
        <el-table-column prop="name" label="姓名">
        </el-table-column>
        <el-table-column prop="isAdmin" label="权限">
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
        </el-table-column>
        <el-table-column prop="id" label="注册顺序" sortable>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot="header" slot-scope="scope">
            <el-input
                v-model="usersearch"
                size="mini"
                placeholder="输入用户名搜索用户"/>
          </template>
          <template slot-scope="scope">
            <el-button @click.native.prevent="deleteRow(scope.$index, scope.row)" type="text" size="small">删除
            </el-button>
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

export default {
  //搜索数据
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
    lookUsers() {
      axios.get(`mu/showAllUser`).then(res => {
        if (res.status === 403) {
          this.$message({
            message: 'Unauthorized',
            type: 'warning'
          })
        } else if (res.status === 200) {
          this.userData = res.data
        }
      })
    },
    lookCode() {
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