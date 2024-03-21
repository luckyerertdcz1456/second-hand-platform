<template>
  <div>
    <el-form :model="form" ref="form" label-width="80px" class="user-form">
      <div class="avatar-container">
        <el-avatar :src="this.img"></el-avatar>
        <el-form-item label="修改头像" prop="file">
          <el-upload
            class="upload-demo"
            action="api/file/upload"
            :on-success="handleUploadSuccess"
            :before-upload="beforeUpload"
            list-type="picture-card"
            limit="1"
            :file-list="fileList"
            :before-remove="beforeRemove"
          >
            <i class="el-icon-plus upload-icon"></i>
            <div slot="tip" class="upload-tip">
              只能上传jpg/png文件,且不超过2MB
            </div>
          </el-upload>
        </el-form-item>
      </div>
      <el-form-item label="用户名">
        <el-input v-model="form.userName" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="change">保存修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'modifyInfo',
  data () {
    return {
      form: {
        head: '',
        userName: ''
      },
      img: ''
    }
  },
  mounted () {
    this.$http.get('user').then((resp) => {
      if (resp.data.code === 1) {
        this.img = `http://47.97.183.209:7070/api/file/download?name=${resp.data.data.head}`
      } else if (resp.data.code === 2) {
        this.$message.error(resp.data.msg)
        window.sessionStorage.clear()
        this.$router.push('/login')
      } else {
        this.$message.error('系统繁忙请稍后再试')
      }
    })
  },
methods: {
    handleUploadSuccess (response, file, fileList) {
      this.form.head = response.data
    },
    beforeUpload (file) {
      if (file) {
        const suffix = file.name.split('.')[1]
        const size = file.size / 1024 / 1024 < 1

        if (['png', 'jpeg', 'jpg'].indexOf(suffix) < 0) {
          this.$message.error('上传图片只支持 png、jpeg、jpg 格式！')
          this.$refs.upload.clearFiles()
          return false
        }
        if (!size) {
          this.$message.error('上传文件大小不能超过 1MB!')
          return false
        }
        return file
      }
    },
    beforeRemove (file) {
      this.form.head = ''
    },
    change () {
      if (this.form.head || this.form.userName) {
        this.$http.put('/user/modifyinformation', this.form).then((resp) => {
          if (resp.data.code === 1) {
            this.$message.success('修改成功')
            this.$router.push('/myInformation')
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
  }
}
</script>
<style scoped>
.user-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 30px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.avatar-upload-container {
  display: inline-block;
  position: relative;
  width: 100%;
}

.avatar-upload-container>img {
  border-radius: 50%;
  height: 120px;
  width: 120px;
}

.avatar-upload-container>div {
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  height: 120px;
  justify-content: center;
  position: absolute;
  top: 0;
  transition: all 0.3s ease-in-out;
  width: 120px;
}

.avatar-upload-container:hover>div {
  background-color: rgba(0, 0, 0, 0.4);
}

.avatar-upload-container>div:hover {
  transform: scale(1.1);
}

.upload-icon {
  color: #fff;
  font-size: 36px;
}

.avatar-tip {
  display: block;
  margin-top: 5px;
  color: #999;
  font-size: 12px;
}

.user-form .el-form-item__label {
  font-weight: bold;
}

.user-form .el-form-item__content {
  margin-bottom: 20px;
}

.user-form .el-input__inner {
  border-radius: 5px;
}

.user-form .el-button {
  margin-top: 20px;
}

.el-upload-list--picture-card .el-upload-list__item i {
  font-size: 28px;
  color: #999;
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.7);
  padding: 5px;
  transition: all 0.2s;
}

.el-upload-list--picture-card .el-upload-list__item:hover i {
  color: #666;
}

.upload-tip {
  color: #999;
  font-size: 12px;
  margin-top: 5px;
}
</style>
