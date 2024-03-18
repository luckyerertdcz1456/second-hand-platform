<template>
    <div>
        <div slot="header">修改密码</div>
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item label="新密码" prop="newPassword">
                    <el-input type="password" v-model="form.newPassword"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                    <el-input type="password" v-model="form.confirmPassword"></el-input>
                </el-form-item>
                <!--  <el-form-item>
                    <el-input type="password" ></el-input>
                </el-form-item> -->
                <el-form-item label="验证码" prop="code">
                    <el-input v-model="form.code" clearable></el-input>
                </el-form-item>
                <div>
                    <el-button class="submit-button" type="primary" @click="submit">提交</el-button>
                    <el-button class="captcha-button" @click="sendCode" :disabled="isSending">{{
                        buttonText }}</el-button>
                </div>
            </el-form>
    </div>
</template>
<script>
export default {
    name: 'modifyPassword',
    data () {
        return {
            form: {
                newPassword: '',
                code: '',
                confirmPassword: '',
                email: ''
            },

            rules: {

                newPassword: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    { min: 6, max: 12, message: '密码长度应在6到12位之间', trigger: 'blur' }
                ],
                confirmPassword: [
                    { required: true, message: '请再次输入新密码', trigger: 'blur' },
                    { validator: this.validateConfirmPassword, trigger: 'blur' }
                ],
                code: [
                    { required: true, message: '请输入验证码', trigger: 'blur' },
                    { len: 4, message: '请输入正确的验证码', trigger: 'blur' }
                ]
            },
            isSending: false,
            buttonText: '发送验证码'
        }
    },
    methods: {
        validateConfirmPassword (rule, value, callback) {
            console.log(value)
            if (value !== this.form.newPassword) {
                callback(new Error('两次输入的密码不一致'))
            } else {
                callback()
            }
        },
        sendCode () {
            this.$http.get(`login/${this.$route.query.email}`).then((resp) => {
                if (resp.data.code === 1) {
                    this.$message({
                        message: '发送成功 验证码三分钟有效',
                        type: 'success'
                    })
                } else {
                    this.$message.error('发送失败')
                }
            })
            this.isSending = true
            let second = 59
            const timer = setInterval(() => {
                if (second === 0) {
                    clearInterval(timer)
                    this.isSending = false
                    this.buttonText = '发送验证码'
                } else {
                    this.buttonText = `${second}s 后重发`
                    second--
                }
            }, 1000)
        },
        submit () {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.form.email = this.$route.query.email
                    this.$http.put('user/modifypassword', this.form).then((resp) => {
                        if (resp.data.code === 1) {
                            this.$message.success('修改成功')
                            this.$router.push('/mydetail')
                        } else if (resp.data.code === 2) {
                            this.$message.error(resp.data.msg)
                            window.sessionStorage.clear()
                            this.$router.push('/login')
                        } else if (resp.data.code === 0) {
                            this.$message.error(resp.data.msg)
                        }
                    })
                } else {
                    this.$message.error('表单错误')
                }
            })
        }
    }

}
</script>
<style scoped>
.form-container {
    max-width: 600px;
    margin: 0 auto;
}

.captcha-button {
    margin-left: 100px;
    width: 120px;
    text-align: center;
}

.submit-button {
    margin-left: 100px;
    margin-top: 20px;
    width: 50%
}
</style>
