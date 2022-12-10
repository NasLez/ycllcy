<template>
  <el-row class="tac" >
    <el-col :span="12">
      <el-menu
        :default-active="`${$store.state.menuIndex}`"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose">

        <el-menu-item index="1" @click="SkipToPage('/homepage',1)">
          <i class="el-icon-menu"></i>
          <span slot="title" >首页</span>
        </el-menu-item>

<!--        <el-submenu index="2" v-if="isAdmin == true" @click="SkipToPage('/UserManagement')">-->
<!--          <template slot="title">-->
<!--            <i class="el-icon-s-custom"></i>-->
<!--            <span>用户管理</span>-->
<!--          </template>-->
<!--          <el-menu-item-group>-->
<!--            <el-menu-item index="1-1">注册与注销</el-menu-item>-->
<!--            <el-menu-item index="1-2">查看用户列表</el-menu-item>-->
<!--          </el-menu-item-group>-->
<!--        </el-submenu>-->
        <el-menu-item index="2" @click="SkipToPage('/UserManagement',2)" v-if="isAdmin == true">
          <i class="el-icon-s-custom"></i>
          <span slot="title" >用户管理</span>
        </el-menu-item>

<!--        <el-submenu index="3" v-if="isAdmin == false" >-->
<!--          <template slot="title">-->
<!--            <i class="el-icon-document"></i>-->
<!--            <span>我要上传</span>-->
<!--          </template>-->
<!--          <el-menu-item-group>-->
<!--            <el-menu-item index="1-1" @click="SkipToPage('/')">项目</el-menu-item>-->
<!--            <el-menu-item index="1-2">论文</el-menu-item>-->
<!--          </el-menu-item-group>-->
<!--          </el-submenu>-->

        <el-menu-item index="4" @click="SkipToPage(isAdmin == '1'?'/ChannelManagement':'/SubmitProjectsAndPapers',4)">
          <i class="el-icon-s-marketing"></i>
          <span slot="title" v-if="isAdmin == true">通道管理</span>
          <span slot="title" v-else>查看通道</span>
        </el-menu-item>

        <el-menu-item index="5" @click="SkipToPage('/UserViewProjectsAndPapers',5)">
          <i class="el-icon-location"></i>
          <span slot="title">查看提交</span>
        </el-menu-item>


      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
import store from "@/vuex/store";
// import {mapGetters,mapState} from "vuex";
export default {

  name: "Com  monAside",
  data(){
    return {
      isAdmin:null,
      menuIndex: 1,
    }
  },
  store,
  created() {
    this.isAdmin = this.$store.state.userinfo.isAdmin;
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    SkipToPage(path,menuIndex){
      this.$store.state.menuIndex= menuIndex;
      console.log(this.$store.state.menuIndex);
      // this.menuIndex = menuIndex
      // location. reload();
      this.$router.push(path);
    }
  },
  computed:{
    //没有子菜单
    noChildren() {
      return this.MenuData.filter(item => !item.children)
    },
    hasChildren(){
      return this.MenuData.filter(item=>item.children)
    }
  }
}
</script>

<style scoped>
.el-aside::-webkit-scrollbar {
  display: none;
}
.el-menu-item{
  width: 200px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 100%;
  border: none;
}
html{

}
</style>
