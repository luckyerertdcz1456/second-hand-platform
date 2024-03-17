<template>
    <div>
<div class="userInfo"><!-- ../assets/img/avatar2.jpg -->
    <img :src="user.avatar" alt="" class="userAvatar">
    <div class="name-email-box">
        <div class="name">{{ user.userName }}</div>
        <div >邮箱：<span>{{ user.email }}</span></div>
    </div>
</div>
<div>
    <div class="money">余额：{{ user.money }}</div>

</div>
<div>
    <el-button type="primary">修改密码</el-button>
    <el-button type="primary">修改信息</el-button>
</div>
    </div>
</template>
<script>
export default {
    name: 'myInformation',
    data () {
        return {
            user: {
                userName: '用户名',
            avatar: '',
                money: '',
                freezeMoney: '',
                status: '0',
                email: ''
            }
        }
    },
    mounted () {
        const token = window.sessionStorage.getItem('token')
        this.$http.get('user').then((resp) => {
            if (resp.data.code === 1) {
                this.user = { ...resp.data.data }
                this.user.head = `http://47.97.183.209:7070/api/file/download?name=${this.user.head}`
            } else if (resp.data.code === 2) {
                this.$message.error(resp.data.msg)
                window.sessionStorage.clear()
                this.$router.push('/login')
            } else {
                this.$message.error('系统繁忙请稍后再试')
            }
        })
    }
}
</script>
<style scoped>
.userAvatar{
    width: 60px;
    height: 60px;
    border-radius: 50%;
}
.userInfo{
    display: flex;
    color: #b3d8ff;
}
.name-email-box{
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin-left: 20px;
}
.name-email-box > :first-child{
    font-size:  15px;
    font-weight: 600;

}
.money{
    color: #b3d8ff;
    margin-left: 80px;
    margin-top: 30px;
    margin-bottom: 20px;
}
</style>
