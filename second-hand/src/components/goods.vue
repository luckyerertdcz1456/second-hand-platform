<template>
    <div class="table-container">

        <el-input placeholder="输入搜索内容" v-model="queryInfo.name" style="width: 200px; "></el-input>
        <el-select v-model="queryInfo.status" placeholder="选择订单状态" style="width: 200px; margin-left: 20px;">
            <el-option label="全部订单" value=''></el-option>
            <el-option label="正在上架" value="0"></el-option>
            <el-option label="正在交易" value="1"></el-option>
            <el-option label="仲裁中" value="2"></el-option>
            <el-option label="交易完成" value="3"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" circle @click="search" style="margin-left: 20px;"></el-button>

        <el-card style="margin-top: -20px;">
            <el-table :data="mygoodslist" stripe style="width: 100%">
                <el-table-column label="索引号" type="index" width="100px" align="center"></el-table-column>
                <el-table-column prop="imgUrl" label="商品图片" align="center" width="80px">
                    <template slot-scope="scope">
                        <img :src="getImg(scope.row.imgUrl)" width="60" height="60" style="border-radius: 5px;">
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="商品名称" align="center" width="200px"></el-table-column>
                <el-table-column prop="price" label="价格" align="center" width="70px">
                    <template slot-scope="scope">{{ scope.row.price }} 元</template>
                </el-table-column>
                <el-table-column prop="time" label="发布时间" align="center" width="180px"></el-table-column>
                <el-table-column prop="status" label="状态" align="center" width="140px">
                    <template slot-scope="scope">
                        <el-tag :type="getStatusType(scope.row.status)" size="small">{{ getStatusText(scope.row.status)
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status === 0" type="primary" size="mini" @click="initGoods(scope.row.id)"
                            round>修改商品信息</el-button>

                        <el-dialog title="修改商品信息" :visible.sync="changeGoodsInfo">
                            <el-form :model="goodsInfo" ref='goodsForm' label-width="120px" class="form-container"
                                :rules="rules">
                                <el-form-item label="商品名称" prop="name">
                                    <el-input v-model="goodsInfo.name" clearable></el-input>
                                </el-form-item>
                                <el-form-item label="商品价格" prop="price">
                                    <el-input v-model="goodsInfo.price"></el-input>
                                </el-form-item>
                                <el-form-item label="商品描述" prop="description">
                                    <el-input type="textarea" v-model="goodsInfo.description"></el-input>
                                </el-form-item>
                                <el-form-item label="联系方式" prop="contact">
                                    <el-input v-model="goodsInfo.contact"></el-input>
                                </el-form-item>

                                <div>
                                    <el-form-item label="商品图片" prop="file">
                                        <el-upload ref="upload" class="upload-demo" action="api/file/upload"
                                            :on-success="handleUploadSuccess" :before-upload="beforeUpload"
                                            list-type="picture-card" limit="1" :file-list="fileList"
                                            :before-remove="beforeRemove">
                                            <img v-if="initImg" :src="initImg" class="preview-image"
                                                style="width: 100%; height: 100%;">

                                            <div slot="tip" class="upload-tip">只能上传jpg/png文件,且不超过2MB</div>
                                        </el-upload>

                                    </el-form-item>
                                </div>
                                <el-form-item label="选择区域" prop="area">
                                    <el-select v-model="goodsInfo.area" placeholder="请选择区域">
                                        <el-option label="南区" value='1'></el-option>
                                        <el-option label="北区" value='2'></el-option>
                                        <el-option label="东区" value='3'></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="选择楼栋" prop="building">
                                    <el-select v-model="goodsInfo.building" placeholder="请选择楼栋">
                                        <el-option v-for="n in 20" :key="n" :label="n + '栋'" :value="n"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="选择楼层" prop="floor">
                                    <el-select v-model="goodsInfo.floor" placeholder="请选择楼层">
                                        <el-option v-for="n in 6" :key="n" :label="n + '层'" :value="n"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="选择房间" prop="room">
                                    <el-select v-model="goodsInfo.room" placeholder="请选择房间">
                                        <el-option v-for="n in 20" :key="n" :label="n + '号房间'" :value="n"></el-option>
                                    </el-select>
                                </el-form-item>

                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="changeGoodsInfo = false">取 消</el-button>
                                <el-button type="primary" @click="changeGoods(checkId)">确 定</el-button>
                            </div>
                        </el-dialog>

                        <el-button type="info" size="mini" @click="checkGoods(scope.row.id)" round>查看详情</el-button>
                        <el-button type="danger" icon="el-icon-delete" @click="checkDelete(scope.row.status,scope.row.id)"
                            circle></el-button>

                        <el-dialog title="删除商品" :visible.sync="deleteGoodsInfo" width="30%">
                            <span>确认删除当前商品吗？</span>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="deleteGoodsInfo = false">取 消</el-button>
                                <el-button type="primary" @click="deleteGoods(checkId)">确 定</el-button>
                            </span>
                        </el-dialog>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页功能部分 -->
            <div class="block">
                <el-pagination ref="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page=this.queryInfo.pageNum :page-sizes="[5, 8, 10, 12]" :page-size=this.queryInfo.pageSize
                    layout="total, sizes, prev, pager, next, jumper" :total=this.total>
                </el-pagination>
            </div>
        </el-card>

    </div>
</template>

<script>
export default {
    mounted () {
        if (window.sessionStorage.getItem('mygoodsNum')) {
            this.queryInfo.pageNum = window.sessionStorage.getItem('mygoodsNum')
        }
        if (window.sessionStorage.getItem('mygoodsSize')) {
            this.queryInfo.pageSize = window.sessionStorage.getItem('mygoodsSize')
        }
        this.getMyGoodsList()
    },
    data () {
const fileRule = (rules, value, callback) => {
    if (this.goodsInfo.imgUrl) {
        callback()
    } else {
        callback(new Error('请上传图片'))
    }
}
return {
    mygoodslist: [],
    fileList: [],
    queryInfo: {
        pageNum: 1,
        pageSize: 10,
        name: '',
        status: ''
    },
    goodsInfo: {
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
    total: '',
    initImg: '',
    changeGoodsInfo: false,
    checkId: '',
    deleteGoodsInfo: false,
    rules: {
        name: [
            { required: true, message: '请输入商品名称', trigger: 'blur' },
            { max: 10, min: 1, message: '名称长度在10个字符以内', trigger: 'blur' }
        ],
        description: [
            { required: true, message: '请输入商品描述', trigger: 'blur' },
            { max: 50, min: 1, message: '描述长度在50个字符以内', trigger: 'blur' }
        ],
        contact: [
            { required: true, message: '请输入联系方式', trigger: 'blur' },
            { max: 20, min: 1, message: '联系方式长度在20个字符以内', trigger: 'blur' }
        ],
        // 验证是否上传图片
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
            trigger: 'blur'
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
    }

}
},
methods: {
        checkDelete (status, id) {
            if (status === 1) {
                this.$message.error('当前商品处于交易状态无法删除')
            } else if (status === 2) {
                this.$message.error('当前商品处于仲裁状态无法删除')
            } else {
                this.deleteGoodsInfo = true
                this.checkId = id
            }
        },
        deleteGoods (id) {
            console.log(id)
            this.deleteGoodsInfo = false
            this.$http.delete(`goods/${id}`).then((res) => {
                if (res.data.code === 1) {
                    this.$message.success(res.data.data)
                    this.getMyGoodsList()
                } else if (res.data.code === 2) {
                    this.$message.error(res.data.msg)
                    window.sessionStorage.clear()
                    this.$router.push('/login')
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        checkGoods (id1) {
            this.$router.push({
                path: '/goodsdetail',
                query: { id: id1, from: 'mygoods' }
            })
        },

        getStatusType (status) {
            if (status === 0) {
                return 'info'
            } else if (status === 1) {
                return 'warning'
            } else if (status === 2) {
                return 'danger'
            } else if (status === 3) {
                return 'success'
            }
        },
        getStatusText (status) {
            if (status === 0) {
                return '正在上架'
            } else if (status === 1) {
                return '正在交易'
            } else if (status === 2) {
                return '仲裁中'
            } else if (status === 3) {
                return '交易完成'
            }
        },
        getMyGoodsList () {
            this.$http.get('goods/mygoods', { params: { pageNum: this.queryInfo.pageNum, pageSize: this.queryInfo.pageSize, name: this.queryInfo.name, status: this.queryInfo.status } }).then((res) => {
                if (res.data.code === 1) {
                    this.mygoodslist = res.data.data.records
                    this.total = res.data.data.total
                } else if (res.data.code === 2) {
                    this.$message.error(res.data.msg)
                    window.sessionStorage.clear()
                    this.$router.push('/login')
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        handleSizeChange (newsize) {
            this.queryInfo.pageSize = newsize
            window.sessionStorage.setItem('mygoodsSize', newsize)
            this.getMyGoodsList()
        },
        // 分页改变事件
        handleCurrentChange (newpage) {
            this.queryInfo.pageNum = newpage
            window.sessionStorage.setItem('mygoodsNum', newpage)
            this.getMyGoodsList()
        },
        getImg (img) {
            return `http://47.97.183.209:7070/api/file/download?name=${img}`
        },
        search () {
            this.queryInfo.pageNum = 1
            this.getMyGoodsList()
        },

        handleUploadSuccess (response, file, fileList) {
            this.goodsInfo.imgUrl = response.data
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
                this.initImg = ''
                return file
            }
        },
        beforeRemove (file) {
            this.fileList = []
            this.goodsInfo.imgUrl = ''
        },

        initGoods (id) {
            this.fileList = []
            this.$http.get(`goods/${id}`).then((res) => {
                if (res.data.code === 1) {
                    this.goodsInfo = { ...res.data.data }
                    this.goodsInfo.area = res.data.data.area + ''
                    this.initImg = `http://47.97.183.209:7070/api/file/download?name=${this.goodsInfo.imgUrl}`
                    this.changeGoodsInfo = true
                    this.checkId = id
                } else if (res.data.code === 2) {
                    this.$message.error(res.data.msg)
                    window.sessionStorage.clear()
                    this.$router.push('/login')
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        changeGoods (id) {
            this.$refs.goodsForm.validate(valid => {
                if (valid) {
                    this.$http.put(`goods/changegoods/${id}`, this.goodsInfo).then((res) => {
                        if (res.data.code === 1) {
                            this.changeGoodsInfo = false
                            this.$message.success('修改成功')
                            this.getMyGoodsList()
                        } else if (res.data.code === 2) {
                            this.$message.error(res.data.msg)
                            window.sessionStorage.clear()
                            this.$router.push('/login')
                        } else {
                            this.$message.error(res.data.msg)
                        }
                    })
                }
            })
        }

    }
}
</script>

<style>
.pagination-container {
    text-align: center;
    margin-top: 20px;
}

.el-pagination {
    display: inline-block;
}

.top {
    margin-top: 10px;
}
</style>
