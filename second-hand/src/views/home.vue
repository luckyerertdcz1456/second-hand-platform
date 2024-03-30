<template>
  <el-container class="container">
    <el-header class="header">
      <div class="header-left">
        <img :src="user.head" alt="" class="avatar" /><span
          class="userName"
          >用户名</span
        >
      </div>
      <el-button type="primary" plain>退出</el-button>
    </el-header>
    <el-container class="down-container">
      <el-aside width="200px">
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#b3d8ff"
          text-color="#fff"
          active-text-color="#53a8ff"
        >
          
          <el-menu-item index="1">
            <i class="el-icon-location"></i>
              <span><router-link to="/twoHand" class="router-link">二手交易商品</router-link></span>
          </el-menu-item>
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span slot="title"><router-link to="/postChange" class="router-link">发布二手商品</router-link></span>
          </el-menu-item>
          
          <el-menu-item index="3">
            <i class="el-icon-menu"></i>
            <span slot="title"><router-link to="/MyBought" class="router-link">我卖出的二手商品</router-link></span>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-menu"></i>
            <span slot="title"><router-link to="/MyBought" class="router-link">我买的二手商品</router-link></span>
          </el-menu-item>
          <el-menu-item index="5">
            <i class="el-icon-menu"></i>
            <span slot="title"><router-link to="/myInformation" class="router-link">我的信息</router-link></span>
          </el-menu-item>
          <!-- <el-submenu index="7">
            <template slot="title">
              <i class="el-icon-setting"></i>
              <span slot="title">我的</span>
            </template>
            <el-menu-item index="3-1">我发布的商品</el-menu-item>
            <el-menu-item index="3-2">我卖出的商品</el-menu-item>
            <el-menu-item index="3-3"><router-link to="/myInformation" class="router-link">我的信息</router-link></el-menu-item>
          </el-submenu> -->
        </el-menu>
      </el-aside>
      <el-main class="router"> <router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>
<script>
 export default {
    name:'home',
    data(){
      return{
        user: {
                userName: '',
                head: '',
                
            }
      }
    },
    methods: {
      handleOpen (key, keyPath) {
        console.log(key, keyPath)
      },
      handleClose (key, keyPath) {
        console.log(key, keyPath)
      },
      logout() {
            //登出功能实现 清楚会话token和缓存的用户数据并跳转 
            this.$http.delete('login').then((res) => {
                if (res.data.code == 1) {
                    this.$message.success('退出成功');
                    window.sessionStorage.clear();
                    this.$router.push('/login');
                } else {
                    this.$message.error('系统繁忙请稍后再试')
                }
            })

        },
        getUser() {
            const token = window.sessionStorage.getItem('token');
            this.$http.get('user').then((res) => {
                if (res.data.code == 1) {
                    this.user = { ...res.data.data };
                    this.user.head = `http://82.157.184.71:4545/file/download?name=${this.user.head}`
                } else if (res.data.code == 2) {
                    this.$message.error(res.data.msg);
                    window.sessionStorage.clear();
                    this.$router.push('/login');
                } else {
                    this.$message.error('系统繁忙请稍后再试')
                }

            })
        },
    }
  }
</script>
<style scoped>
.router-link{
  text-decoration: none;
  color: white;
  
}
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
    justify-content: center;
}
</style>
