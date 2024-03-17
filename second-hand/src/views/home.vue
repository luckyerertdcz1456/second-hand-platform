<template>
  <el-container class="container">
    <el-header class="header">
      <div class="header-left">
        <img src="../assets/img/avatar2.jpg" alt="" class="avatar" /><span
          class="userName"
          >用户名</span
        >
      </div>
      <el-button type="primary" plain>退出</el-button>
    </el-header>
    <el-container class="down-container">
      <el-aside width="200px">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#b3d8ff"
          text-color="#fff"
          active-text-color="#53a8ff"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>二手交易</span>
            </template>
            <el-menu-item index="1-1">二手交易商品</el-menu-item>
            <el-menu-item index="1-2">发布二手商品</el-menu-item>
          </el-submenu>
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span slot="title">导航二</span>
          </el-menu-item>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span slot="title">我的</span>
            </template>
            <el-menu-item index="3-1">我发布的商品</el-menu-item>
            <el-menu-item index="3-2">我卖出的商品</el-menu-item>
            <el-menu-item index="3-3"><router-link to="/myInformation">我的信息</router-link></el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="router"> <router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>
<script>
 export default {
    methods: {
      handleOpen (key, keyPath) {
        console.log(key, keyPath)
      },
      handleClose (key, keyPath) {
        console.log(key, keyPath)
      }
    }
  }
</script>
<style scoped>
.container {
  display: flex;
  height: 100vh;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #79bbff;
}
.down-container {
  flex: 1;
}
.userName {
  color: white;
  margin-left: 20px;
}
.header-left {
  display: flex;
  align-items: center;
}
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.el-menu-vertical-demo {
  height: 100%;
}
.router{
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
