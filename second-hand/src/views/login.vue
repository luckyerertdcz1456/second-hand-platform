<template>
  <div>
    <!-- <el-row class="content">
      <el-col :span="12" class="img_box"><img src="../assets/img/login_dec.png" alt="" class="login_deco"></el-col>
      <el-col :span="12" class="right-box">
        <el-tabs v-model="activeName">
                        <el-tab-pane label="邮箱登录" name="email">
                            <div class="formdata">
                                <el-form ref="form" :model="form" :rules="rules">
                                    <el-form-item prop="email">
                                        <el-input v-model="form.email" clearable placeholder="请输入邮箱"></el-input>
                                    </el-form-item>
                                    <el-form-item prop="code">
                                        <el-input v-model="form.code" clearable placeholder="请输入验证码"></el-input>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <div class="butt">
                                <el-button type="primary" @click="login">登录</el-button>
                                <el-button id='sendCode' class="shou" @click="sendCode" :disabled="isUse">{{ buttMsg
                                }}</el-button>
                            </div>
                        </el-tab-pane>

                        <el-tab-pane label="密码登录" name="password">

                            <div class="formdata">
                                <el-form ref="passwordform" :model="passwordform" :rules="rules2">
                                    <el-form-item prop="email">
                                        <el-input v-model="passwordform.email" clearable placeholder="请输入邮箱"></el-input>
                                    </el-form-item>
                                    <el-form-item prop="password">
                                        <el-input type="password" v-model="passwordform.password" clearable
                                            placeholder="请输入密码"></el-input>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <div class="butt">
                                <el-button type="primary" @click="passwordlogin" style="width: 100%;">登录</el-button>
                            </div>
                        </el-tab-pane>

                        <el-tab-pane label="账号注册" name="register">
                            <div class="register">
                                <el-form ref="registerForm" :rules="rules3" :model="registerForm">
                                    <el-form-item label="用户名" prop="userName">
                                        <el-input style="width: 250px; position: relative; margin-left: 10px;"
                                            v-model="registerForm.userName"></el-input>
                                    </el-form-item>
                                    <el-form-item label="密码" prop="password">
                                        <el-input style="width: 250px; position: relative; margin-left: 22px;"
                                            type="password" v-model="registerForm.password"></el-input>
                                    </el-form-item>
                                    <el-form-item label="邮箱" prop="email">
                                        <el-input style="width: 250px; position: relative; margin-left: 22px;"
                                            v-model="registerForm.email"></el-input>
                                    </el-form-item>
                                    <el-form-item label="验证码" prop="code">
                                        <el-input style="width: 100px; position: relative; margin-left: 10px"
                                            v-model="registerForm.code"></el-input>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <div class="butt">
                                <el-button type="primary" @click="register">注册</el-button>
                                <el-button @click="resetRegisterForm">重置</el-button>
                                <el-button id='sendCode2' class="shou" @click="sendCode2" :disabled="isUse2">{{ buttMsg2
                                }}</el-button>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
    </el-col>

    </el-row> -->
    <div class="loginbody">
        <div class="logindata">
            <div class="logintext">
                <h2>Welcome</h2>
            </div>
            <el-card class="card">
                <div>
                    <el-tabs v-model="activeName">
                        <el-tab-pane label="邮箱登录" name="email">
                            <div class="formdata">
                                <el-form ref="form" :model="form" :rules="rules">
                                    <el-form-item prop="email">
                                        <el-input v-model="form.email" clearable placeholder="请输入邮箱"></el-input>
                                    </el-form-item>
                                    <el-form-item prop="code">
                                        <el-input v-model="form.code" clearable placeholder="请输入验证码"></el-input>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <div class="butt">
                                <el-button type="primary" @click="login">登录</el-button>
                                <el-button id='sendCode' class="shou" @click="sendCode" :disabled="isUse">{{ buttMsg
                                }}</el-button>
                            </div>
                        </el-tab-pane>

                        <el-tab-pane label="密码登录" name="password">

                            <div class="formdata">
                                <el-form ref="passwordform" :model="passwordform" :rules="rules2">
                                    <el-form-item prop="email">
                                        <el-input v-model="passwordform.email" clearable placeholder="请输入邮箱"></el-input>
                                    </el-form-item>
                                    <el-form-item prop="password">
                                        <el-input type="password" v-model="passwordform.password" clearable
                                            placeholder="请输入密码"></el-input>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <div class="butt">
                                <el-button type="primary" @click="passwordlogin" style="width: 100%;">登录</el-button>
                            </div>
                        </el-tab-pane>

                        <el-tab-pane label="账号注册" name="register">
                            <div class="register">
                                <el-form ref="registerForm" :rules="rules3" :model="registerForm">
                                    <el-form-item label="用户名" prop="userName">
                                        <el-input style="width: 250px; position: relative; margin-left: 10px;"
                                            v-model="registerForm.userName"></el-input>
                                    </el-form-item>
                                    <el-form-item label="密码" prop="password">
                                        <el-input style="width: 250px; position: relative; margin-left: 22px;"
                                            type="password" v-model="registerForm.password"></el-input>
                                    </el-form-item>
                                    <el-form-item label="邮箱" prop="email">
                                        <el-input style="width: 250px; position: relative; margin-left: 22px;"
                                            v-model="registerForm.email"></el-input>
                                    </el-form-item>
                                    <el-form-item label="验证码" prop="code">
                                        <el-input style="width: 100px; position: relative; margin-left: 10px"
                                            v-model="registerForm.code"></el-input>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <div class="butt">
                                <el-button type="primary" @click="register">注册</el-button>
                                <el-button @click="resetRegisterForm">重置</el-button>
                                <el-button id='sendCode2' class="shou" @click="sendCode2" :disabled="isUse2">{{ buttMsg2
                                }}</el-button>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </el-card>
        </div>
        <!-- <div style="text-align: center;margin-top: 250px;">
            <a href="https://beian.miit.gov.cn/" target="_blank">
                赣ICP备2023003235号-1</a>
        </div> -->
    </div>
  </div>
</template>
<script>

import request from '../request'
import axios from 'axios'
export default {
    name: 'login',
    data () {
        return {
            form: {
                code: '',
                email: ''
            },
            passwordform: {
                email: '',
                password: ''
            },
            registerForm: {
                userName: '',
                password: '',
                email: '',
                code: ''
            },
            rules: {
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
                    { max: 20, message: '格式错误', trigger: 'blur' },
                    { min: 8, message: '格式错误', trigger: 'blur' }
                ],
                code: [
                    { required: true, message: '请输入验证码', trigger: 'blur' },
                    { max: 4, min: 4, message: '请输入正确的验证码', trigger: 'blur' }
                ]
            },
            rules2: {
                email: [
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { max: 20, message: '格式错误', trigger: 'blur' },
                    { min: 8, message: '格式错误', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { max: 12, min: 6, message: '密码格式错误', trigger: 'blur' }
                ]
            },
            rules3: {
                userName: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { max: 15, message: '用户名不能超过15个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 12, message: '密码长度应该在6到12个字符之间', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
                    { min: 6, max: 20, message: '格式错误', trigger: 'blur' }
                ],
                code: [
                    { required: true, message: '请输入验证码', trigger: 'blur' },
                    { len: 4, message: '请输入正确的验证码', trigger: 'blur' }
                ]
            },
            isUse: false,
            isUse2: false,
            time: 59,
            time2: 59,
            buttMsg2: '发送验证码',
            buttMsg: '发送验证码',
            activeName: 'email'
        }
    },
    methods: {
        resetRegisterForm () {
            // eslint-disable-next-line no-unused-expressions, no-sequences
            this.registerForm.userName = '',
            this.registerForm.password = '',
            this.registerForm.email = '',
                this.registerForm.code = ''
        },
        register () {
            this.$refs.registerForm.validate(valid => {
                if (valid) {
                    // 发送登录请求
                    this.$http.post('login/register', this.registerForm).then((res) => {
                        if (res.data.code === 1) {
                            this.$message.success('注册成功')
                            this.activeName = 'password'
                            this.resetRegisterForm()
                        } else {
                            this.$message.error(res.data.msg)
                        }
                    })
                } else {
                    this.$message.error('请正确填写注册表单')
                }
            })
        },
        login () {
            
            // validate验证表单是否合法
            this.$refs.form.validate(valid => {
                if (valid) {
                    // 发送登录请求
                    this.$http.post('login/emaillogin', this.form).then((res) => {
                        // console.log("到了then")
                        if (res.data.code === 1) {
                            // 存token 和id
                            window.sessionStorage.setItem('token', res.data.data.token)
                            window.sessionStorage.setItem('userid', res.data.data.id)

                            // 页面跳转到主页

                            this.$message.success('登录成功')
                            this.$router.push('/home')
                        } else {
                            this.$message.error('登录失败')
                        }
                    })
                } else {
                    this.$message.error('请输入正确的邮箱或验证码')
                }
            })
        },
        sendCode () {
            // 邮箱验证通过才能发送
            this.$refs.form.validateField('email', (emailError) => {
                if (!emailError) {
                    // 发送验证码
                    this.$http.get(`login/${this.form.email}`).then((resp) => {
                        if (resp.data.code === 1) {
                            this.$message({
                                message: '发送成功 验证码三分钟有效',
                                type: 'success'
                            })
                        } else {
                            this.$message.error('发送失败')
                        }
                    })
                    this.isUse = true

                    // 创建定时器实现60秒发送一次验证码的效果
                    // eslint-disable-next-line no-var
                    var timeTool = setInterval(() => {
                        if (this.time === 0) {
                            clearInterval(timeTool)
                            this.isUse = false
                            this.time = 59
                            this.buttMsg = '发送验证码'
                        } else {
                            this.time--
                            this.buttMsg = `${this.time}秒后重新获取`
                        }
                    }, 1000)
                }
            })
        },
        sendCode2 () {
            // 邮箱验证通过才能发送
            this.$refs.registerForm.validateField('email', (emailError) => {
                if (!emailError) {
                    // 发送验证码
                    this.$http.get(`login/${this.registerForm.email}`).then((resp) => {
                console.log('6')
                        if (resp.data.code === 1) {
                            this.$message({
                                message: '发送成功 验证码三分钟有效',
                                type: 'success'
                            })
                        } else {
                            this.$message.error('发送失败')
                        }
                    }).catch((error) => {
                        console.log(error)
                    })
                    this.isUse2 = true
                    // 创建定时器实现60秒发送一次验证码的效果
                    // eslint-disable-next-line no-var
                    var timeTool2 = setInterval(() => {
                        if (this.time2 === 0) {
                            clearInterval(timeTool2)
                            this.isUse2 = false
                            this.time2 = 59
                            this.buttMsg2 = '发送验证码'
                        } else {
                            this.time2--
                            this.buttMsg2 = `${this.time2}秒后重新获取`
                        }
                    }, 1000)
                }
            })
        },
        passwordlogin () {
            this.$router.push('/home')
            // validate验证表单是否合法
            /* this.$refs.passwordform.validate(valid => {
                if (valid) {
                    // 发送登录请求
                    this.$http.post('login/passwordlogin', this.passwordform).then((res) => {
                        if (res.data.code === 1) {
                            // 存token 和id
                            window.sessionStorage.setItem('token', res.data.data.token)
                            window.sessionStorage.setItem('userid', res.data.data.id)
                            // 页面跳转到主页
                            this.$message.success('登录成功')
                            this.$router.push('/home')
                        } else {
                            this.$message.error(res.data.msg)
                        }
                    })
                } else {
                    this.$message.error('请输入正确的邮箱或验证码')
                }
            }) */
        }
    }

}
</script>
<style scoped>

.loginbody {
    width: 100%;
    height: 100%;
    min-width: 1000px;
    background-image: url("../assets/img/login_dec.png");
    background-size: cover;
    background-repeat: repeat;
    background-size: 100% 100%;
    background-position: center center;
    overflow: auto;
    background-repeat: no-repeat;
    position: fixed;
    line-height: 100%;
    padding-top: 150px;
}

.logintext {
    margin-bottom: 20px;
    line-height: 50px;
    text-align: center;
    font-size: 30px;
    font-weight: bolder;
    color: white;
    text-shadow: 2px 2px 4px #000000;
}

.logindata {
    width: 400px;
    height: 300px;
    transform: translate(-50%);
    margin-left: 50%;
}

.tool {
    display: flex;
    justify-content: space-between;
    color: #606266;
}

.butt {
    margin-top: 10px;
    text-align: center;
}

.shou {
    cursor: pointer;
    color: #606266;
}

.msg {
    text-align: center;
    line-height: 88px;
}

</style>
