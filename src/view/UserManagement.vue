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
    <div style="position:absolute;left: 320px;width: 300px">
      <el-button type="primary" @click="lookCode">查看未被使用的注册码</el-button>
      <el-table :data="codeData" stripe style="width: 100%" @row-click="clickData">
        <el-table-column label="注册码" prop="code"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="权限" prop="isAdmin"></el-table-column>
      </el-table>
    </div>
    <div style="position:absolute;left: 630px;width: 1000px;">
      <el-button type="primary" @click="lookUsers">查看用户列表</el-button>
      <el-table :data="userData" style="width: 1000px" :default-sort="{prop: 'date', order: 'ascending'}">
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
          <template slot-scope="scope">
            <el-button @click.native.prevent="deleteRow(scope.$index, scope.row)" type="text" size="small">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "UserManagement",
  data() {
    return {
      labelPosition: 'right',
      ActivationCode: {
        code: '',
        name: '',
        isAdmin: ''
      },
      codeData: [],
      userData: []
    };
  },
  methods: {
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
              }
            })
          }
        })
      }
    }
  }
}
</script>

<style scoped>

</style>