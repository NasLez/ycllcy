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
        <div style="padding-left: 10%">
          <div style="display: flex;flex-direction: row;justify-content: center;padding: 10% 0">
            <div style="width: 40%;margin-right:7%;justify-content: center">
              <el-form ref="refName" :label-position="labelPosition" label-width="80px" :model="ActivationCode"
                       style="border-right:1px solid #b9b9b9">
                <el-form-item label="激活码" prop="code" style="width: 80%">
                  <el-input v-model="ActivationCode.code"></el-input>
                </el-form-item>
                <el-form-item label="真实姓名" prop="name" style="width: 80%">
                  <el-input v-model="ActivationCode.name"></el-input>
                </el-form-item>
                <el-form-item label="权限" prop="isAdmin">
                  <el-select v-model="ActivationCode.isAdmin" placeholder="请选择权限">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="success" @click="AddActivationCode('refName')" icon="el-icon-plus">添加激活码
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
            <div style="width: 70%">
              <div style="width: 80%">
                <el-table :data="code_data"
                          stripe="true"
                          border="true"
                          style="width: 100%" @row-click="clickData">
                  <el-table-column label="注册码" prop="code" align="center"></el-table-column>
                  <el-table-column label="姓名" prop="name" align="center">
                  </el-table-column>
                  <el-table-column label="权限" prop="isAdmin" align="center">
                    <template slot-scope="scope">
                      <el-tag v-if="scope.row.isAdmin==='1'">管理员</el-tag>
                      <el-tag v-if="scope.row.isAdmin==='0'" type="success">用户</el-tag>
                    </template>
                  </el-table-column>
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
                      :page-sizes="[3]"
                      :page-size="pagesizeCode"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="total">
                  </el-pagination>
                </div>
              </div>
            </div>
          </div>
          <el-devider></el-devider>
          <div style="padding-left:2%;margin-bottom: 5% ">
            <div style="text-align: right;padding-right: 15%;margin-bottom: 2%">
              <el-input
                  style="width: 30%"
                  v-model="usersearch"
                  placeholder="输入姓名搜索"/>
            </div>
            <div>
              <el-table :data="user_data"
                        stripe="true"
                        border="true"
                        style="width: 900px"
                        :default-sort="{prop: 'id', order: 'ascending'}">
                <el-table-column prop="date" label="用户头像" align="center">
                  <template slot-scope="scope">
                    <el-image style="width: 50px;height: 50px" :src="require('/src/avatar/qll.jpg')"
                              v-if="scope.row.isAdmin==='1'"></el-image>
                    <el-image style="width: 50px;height: 50px" :src="require('/src/avatar/ymr.jpg')"
                              v-if="scope.row.isAdmin==='0'"></el-image>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="真实姓名" align="center">
                </el-table-column>
                <el-table-column prop="isAdmin" label="权限"
                                 :filters="[{text: '管理员', value: '1'}, {text: '用户', value: '0'}]"
                                 :filter-method="filterHandler"
                                 align="center">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.isAdmin==='1'">管理员</el-tag>
                    <el-tag v-if="scope.row.isAdmin==='0'" type="success">用户</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="email" label="邮箱" align="center" width="250">
                </el-table-column>
                <el-table-column prop="code" label="注册码" align="center">
                </el-table-column>
                <el-table-column prop="id" label="注册顺序" sortable align="center">
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center">

                  <template slot-scope="scope">
                    <el-popconfirm
                        title="确定删除此账号吗？"
                        confirm-button-text='是'
                        cancel-button-text='否'
                        icon="el-icon-info"
                        icon-color="red"
                        @confirm="deleteRow(scope.$index, scope.row)">
                      <el-button slot="reference" type="text" size="small" icon="el-icon-delete-solid"
                                 v-if="scope.row.isAdmin==='0'"
                                 style="color: #B70031;">删除
                      </el-button>
                    </el-popconfirm>
                    <el-button slot="reference" type="text" size="small" icon="el-icon-view"
                               v-if="scope.row.isAdmin==='0'" @click="clickUser(scope.row)">查看
                    </el-button>
                    <a v-if="scope.row.isAdmin==='1'">——</a>
                  </template>
                </el-table-column>
              </el-table>
              <div class="pagination">
                <el-pagination
                    @size-change="handleSizeChangeUser"
                    @current-change="handleCurrentChangeUSer"
                    :current-page.sync="currentPageUser"
                    :page-sizes="[5]"
                    :page-size="pagesizeUser"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="UserTotal">
                </el-pagination>
              </div>
            </div>

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
  //搜索数据
  store,
  components: {
    CommonHeader,
    CommonAside
  },
  data() {
    return {
      labelPosition: 'right',
      ActivationCode: {
        code: '',
        name: '',
        isAdmin: ''
      },
      options: [{
        value: '1',
        label: '管理员'
      }, {
        value: '0',
        label: '用户'
      }],
      value: '',
      codeData: [],
      userData: [],
      codesearch: '',
      usersearch: '',
      currentPageCode: 1,
      pagesizeCode: 3,
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
        let fenYe = list.slice((this.currentPageCode - 1) * this.pagesizeCode, this.currentPageCode * this.pagesizeCode);
        return list, fenYe
      } else {
        let fenYe = this.codeData.slice((this.currentPageCode - 1) * this.pagesizeCode, this.currentPageCode * this.pagesizeCode)
        return fenYe
      }
    },
    user_data() {
      let search = this.usersearch;
      // 搜索功能
      if (search) {
        let list = (this.userData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()) || data.name.toLowerCase().includes(search.toLowerCase()))).slice((this.currentPageUser - 1) * this.pagesizeUser, this.currentPageUser * this.pagesizeUser);
        // let fenYe = list.slice((this.currentPageUser - 1) * this.pagesizeUser, this.currentPageUser * this.pagesizeUser);
        return list
      } else {
        let fenYe = this.userData.slice((this.currentPageUser - 1) * this.pagesizeUser, this.currentPageUser * this.pagesizeUser)
        return fenYe
      }
    }
  },
  created: function () {
    axios.get(`mu/showActivationCode`).then(res => {
      this.codeData = res.data
      this.total = this.codeData.length
    })
    axios.get(`mu/showAllUser`).then(res => {
      this.userData = res.data
      this.UserTotal = this.userData.length
    })
  },
  name: "UserManagement",

  methods: {
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    handleSizeChangeCode(val) {
      this.pagesizeCode = val;
      axios.get(`mu/showActivationCode`).then(res => {
        this.codeData = res.data
      })
    },
    handleSizeChangeUser(val) {
      this.pagesizeUser = val;
      axios.get(`mu/showAllUser`).then(res => {
        this.userData = res.data
        this.UserTotal = this.userData.length
      })
    },
    handleCurrentChangeUSer(val) {
      this.currentPageUser = val;
      axios.get(`mu/showAllUser`).then(res => {
        this.userData = res.data
        this.UserTotal = this.userData.length
      })
    },
    handleCurrentChangeCode(val) {
      this.currentPageCode = val;
      axios.get(`mu/showActivationCode`).then(res => {
        this.codeData = res.data
      })
    },
    deleteRow(index, rows) {
      axios.delete(`mu/deleteUser?email=${rows.email}`).then(res => {
        this.$message({
          message: "删除用户成功！",
          type: 'success'
        })
        axios.get(`mu/showAllUser`).then(res => {
            this.userData = res.data
            this.UserTotal = this.userData.length
        })
      })
    },
    clickData() {
    },
    clickUser(row) {
      console.log(row)
      this.$store.state.userEmail = row.email
      this.$router.push({path: '/userHome'})
    },
    AddActivationCode(refName) {
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
          this.$message({
            message: '添加注册码成功！',
            type: 'success'
          })
          this.$refs[refName].resetFields()
          axios.get(`mu/showActivationCode`).then(res => {
              this.codeData = res.data
              this.total = this.codeData.length
          })
        })
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
