<template>
    <div class="add-product">        
        <h2>添加商品</h2>
        <el-form :model="form" ref='goodsForm' label-width="120px" class="form-container" :rules="rules">
            <el-form-item label="商品名称" prop="name">
                <el-input v-model="form.name" clearable></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="price">
                <el-input v-model="form.price"></el-input>
            </el-form-item>
            <el-form-item label="商品描述" prop="description">
                <el-input type="textarea" v-model="form.description"></el-input>
            </el-form-item>
            <el-form-item label="联系方式" prop="contact">
                <el-input v-model="form.contact"></el-input>
            </el-form-item>

            <el-form-item label="商品图片" prop="file">
                <el-upload ref="upload" class="upload-demo" action="api/file/upload" :on-success="handleUploadSuccess"
                    :before-upload="beforeUpload" list-type="picture-card" limit="1" :file-list="fileList"
                    :before-remove="beforeRemove">
                    <i class="el-icon-plus upload-icon"></i>
                    <div slot="tip" class="upload-tip">只能上传jpg/png文件,且不超过1MB</div>
                </el-upload>

            </el-form-item>
            <el-form-item label="选择区域" prop="area">
                <el-select v-model="form.area" placeholder="请选择区域">
                    <el-option label="南区" value="1"></el-option>
                    <el-option label="北区" value="2"></el-option>
                    <el-option label="东区" value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="选择楼栋" prop="building">
                <el-select v-model="form.building" placeholder="请选择楼栋">
                    <el-option v-for="n in 20" :key="n" :label="n + '栋'" :value="n"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="选择楼层" prop="floor">
                <el-select v-model="form.floor" placeholder="请选择楼层">
                    <el-option v-for="n in 6" :key="n" :label="n + '层'" :value="n"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="选择房间" prop="room">
                <el-select v-model="form.room" placeholder="请选择房间">
                    <el-option v-for="n in 20" :key="n" :label="n + '号房间'" :value="n"></el-option>
                </el-select>
            </el-form-item>
            <div class="btn-container">
                <el-button type="primary" @click="handleSubmit">发布商品</el-button>
                <el-button @click="handleReset">重置</el-button>
            </div>
        </el-form>
    </div>
</template>
  
<script>
export default {
    data() {
        var fileRule = (rules, value, callback) => {

            if (this.form.imgUrl) {
                callback();
            } else {
                callback(new Error('请上传图片'));
            }
        };
        return {
            form: {
                name: '',
                price: null,
                description: '',
                imgUrl: '',
                area: '',
                building: null,
                floor: null,
                room: null,
                contact: ''
            },
            //文件上传区存储的临时图片集合
            fileList: [],
            rules: {
                name: [
                    { required: true, message: "请输入商品名称", trigger: "blur" },
                    { max: 10, min: 1, message: "名称长度在10个字符以内", trigger: "blur" },
                ],
                description: [
                    { required: true, message: "请输入商品描述", trigger: "blur" },
                    { max: 50, min: 1, message: "描述长度在50个字符以内", trigger: "blur" },
                ],
                contact: [
                    { required: true, message: "请输入联系方式", trigger: "blur" },
                    { max: 20, min: 1, message: "联系方式长度在20个字符以内", trigger: "blur" },
                ],
                //验证是否上传图片
                file: [
                    {
                        required: true,
                        validator: fileRule,
                        trigger: 'blur'
                    }
                ],

                price: {
                    required: true,
                    validator: (rules, value, callback) => {
                        if (!value) {
                            callback(new Error('请填写商品价格'))
                        } else {
                            const reg = /^\d+(\.\d{0,2})?$/
                            if (reg.test(value)) {
                                if (value < 10000) {
                                    callback()
                                } else {
                                    callback(new Error('商品价格小于10000'))
                                }
                            } else {
                                callback(new Error('商品价格格式只能为数字,且最多保留两位数字'))
                            }
                        }
                    },
                    trigger: 'blur',
                },


                area: [
                    { required: true, message: '请选择校区', trigger: 'change' }
                ],
                building: [
                    { required: true, message: '请选择楼栋', trigger: 'change' }
                ],
                floor: [
                    { required: true, message: '请选择楼层', trigger: 'change' }
                ],
                room: [
                    { required: true, message: '请选择房间', trigger: 'change' }
                ]
            },
        };
    },
    methods: {
        /*  handleUploadSuccess(res) {
             this.form.imageUrlList.push({
                 name: res.name,
                 url: res.url
             });
         }, */
        handleUploadSuccess(response, file, fileList) {
            this.form.imgUrl = response.data
        },
        beforeUpload(file) {
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
        beforeRemove(file) {
            this.fileList = [];
            this.form.imgUrl = '';
        },
        handleSubmit() {

            this.$refs.goodsForm.validate(valid => {

                if (valid) {

                    // 将表单数据提交到后端
                    this.$http.post('goods/add', this.form).then((resp) => {
                        if (resp.data.code == 1) {
                            this.$message.success("发布成功");
                            this.handleReset();
                        } else if (resp.data.code == 2) {
                            this.$message.error(resp.data.msg);
                            this.handleReset();
                            window.sessionStorage.clear();
                            this.$router.push('/login');
                        } else {
                            this.$message.error('发布失败');
                        }
                    });
                }
            })


        },
        handleReset() {
            this.form.name = '';
            this.form.price = '';
            this.form.description = '';
            this.form.imgUrl = '';
            this.form.area = '';
            this.form.building = '';
            this.form.floor = '';
            this.form.room = '';
            this.form.contact = '';
            this.fileList = []
        },
    }
};
</script>
  
<style scoped>
.add-product {
    margin: 20px;
}

.form-container {
    max-width: 500px;
}

.el-form-item__label {
    font-weight: bold;
    font-size: 16px;
}

.upload-demo .el-upload-list {
    display: flex !important;
    flex-wrap: wrap;
}

.el-upload-list--picture-card .el-upload-list__item {
    width: 120px;
    height: 120px;
    margin-right: 10px;
    margin-bottom: 10px;
    position: relative;
}

.el-upload-list--picture-card .el-upload-list__item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
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

.btn-container {
    text-align: center;
    margin-top: 20px;
}
</style>