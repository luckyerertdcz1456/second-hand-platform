<template>
    <div class="table-container">
        <el-input placeholder="输入搜索内容" v-model="queryInfo.name" style="width: 200px; "></el-input>
        <el-select v-model="queryInfo.status" placeholder="选择订单状态" style="width: 200px; margin-left: 20px;">
            <el-option label="全部订单" value=''></el-option>
            <el-option label="交易中" value="0"></el-option>
            <el-option label="仲裁中" value="1"></el-option>
            <el-option label="交易完成" value="2"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-search" circle @click="search" style="margin-left: 20px;"></el-button>

        <el-card style="margin-top: -20px;">
            <el-table :data="goodsOrderList" stripe style="width: 100%">
                <el-table-column label="索引号" type="index" width="100px" align="center"></el-table-column>
                <el-table-column prop="image" label="商品图片" align="center" width="80px">
                    <template slot-scope="scope">
                        <img :src="getImg(scope.row.imag)" width="60" height="60" style="border-radius: 5px;">
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="商品名称" align="center" width="200px"></el-table-column>
                <el-table-column prop="price" label="价格" align="center" width="70px">
                    <template slot-scope="scope">{{ scope.row.price }} 元</template>
                </el-table-column>
                <el-table-column prop="creteTime" label="购买时间" align="center" width="180px"></el-table-column>
                <el-table-column prop="status" label="状态" align="center" width="140px">
                    <template slot-scope="scope">
                        <el-tag :type="getStatusType(scope.row.status)" size="small">{{ getStatusText(scope.row.status)
                        }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status === 1" type="primary" size="mini" style="width: 80px;"
                            @click="returnInfo = true; checkId = scope.row.id" round>同意退款</el-button>
                        <!-- 确认收货 -->
                        <el-dialog title="同意退款" :visible.sync="returnInfo" width="30%">
                            <span>是否同意退款</span>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="returnInfo = false">取 消</el-button>
                                <el-button type="primary" @click="returnMoney(checkId)">确 定</el-button>
                            </span>
                        </el-dialog>

                        <el-button v-if="scope.row.status === 1" type="primary" size="mini"
                            @click="judgingInfo = true; checkId = scope.row.id" round>提供仲裁资料</el-button>
                        <!-- 提供仲裁资料 -->
                        <el-dialog title="提供仲裁资料" :visible.sync="judgingInfo">
                            <el-form :model="judgingForm" :rules="rules">
                                <el-form-item label="仲裁图片" prop="file">
                                    <el-upload ref="upload" class="upload-demo" action="api/file/upload"
                                        :on-success="handleUploadSuccess" :before-upload="beforeUpload"
                                        list-type="picture-card" limit="1" :file-list="fileList"
                                        :before-remove="beforeRemove">
                                        <i class="el-icon-plus upload-icon"></i>
                                        <div slot="tip">只能上传jpg/png文件,且不超过1MB</div>
                                    </el-upload>

                                </el-form-item>
                                <el-form-item label="商品描述" prop="description">
                                    <el-input type="textarea" v-model="judgingForm.description"
                                        style="width: 80%;"></el-input>
                                </el-form-item>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="judgingInfo = false">取 消</el-button>
                                <el-button type="primary" @click="putJudging(checkId)">确 定</el-button>
                            </div>
                        </el-dialog>



                        <el-button type="info" size="mini" @click="checkGoods(scope.row.goodsId)" round>查看详情</el-button>
                        <el-button type="danger" icon="el-icon-delete" @click="checkDelete(scope.row.status, scope.row.id)"
                            circle></el-button>

                        <el-dialog title="删除订单" :visible.sync="deleteOrderInfo" width="30%">
                            <span>确认删除订单吗？</span>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="deleteOrderInfo = false">取 消</el-button>
                                <el-button type="primary" @click="deleteOrder(checkId)">确 定</el-button>
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
    name:'mySell',
    mounted() {
        if (window.sessionStorage.getItem('MySellNum')) {
            this.queryInfo.pageNum = window.sessionStorage.getItem('MySellNum');

        }
        if (window.sessionStorage.getItem('MySellSize')) {
            this.queryInfo.pageSize = window.sessionStorage.getItem('MySellSize');
        }
        this.getGoodsOrderList();
    },
    data() {
        var fileRule = (rules, value, callback) => {

            if (this.judgingForm.imag) {
                callback();
            } else {
                callback(new Error('请上传图片'));
            }
        };
        return {

            goodsOrderList: [],
            queryInfo: {
                pageNum: 1,
                pageSize: 10,
                name: '',
                status: ''
            },
            total: '',

            judgingInfo: false,
            judgingForm: {
                imag: '',
                description: ''
            },
            checkId: '',
            rules: {

                description: [
                    { required: true, message: "请输入仲裁描述", trigger: "blur" },
                    { max: 50, min: 1, message: "描述长度在50个字符以内", trigger: "blur" },
                ],

                //验证是否上传图片
                file: [
                    {
                        validator: fileRule,
                        trigger: 'blur'
                    }
                ],
            },
            returnInfo: false,
            deleteOrderInfo: false,
            fileList:[]
        }
    },
    methods: {
        returnMoney(id) {
            this.returnInfo = false;
            this.$http.put(`goodsorder/return/${id}`).then((res) => {
                if (res.data.code == 1) {
                    this.$message.success(res.data.data);
                    this.getGoodsOrderList();

                } else if (res.data.code == 2) {
                    this.$message.error(res.data.msg);
                    window.sessionStorage.clear();
                    this.$router.push('/login');
                } else {
                    this.$message.error('系统繁忙请稍后再试');
                }
            })
        },

        putJudging(id) {
            this.judgingInfo = false,

                this.$http.put(`/judging/bis/${id}`, this.judgingForm).then((res) => {
                    if (res.data.code == 1) {
                        this.$message.success(res.data.data);
                    } else if (res.data.code == 2) {
                        this.$message.error(res.data.msg);
                        window.sessionStorage.clear();
                        this.$router.push('/login');
                    } else {
                        this.$message.error('系统繁忙请稍后再试');
                    }
                    this.judgingForm.description = '';
                    this.judgingForm.imag = '';
                    this.fileList=[];
                })
        },
        getGoodsOrderList() {
            this.$http.get('goodsorder/bis', { params: { pageNum: this.queryInfo.pageNum, pageSize: this.queryInfo.pageSize, name: this.queryInfo.name, status: this.queryInfo.status } }).then((res) => {
                if (res.data.code == 1) {
                    this.goodsOrderList = res.data.data.records;
                    this.total = res.data.data.total;
                } else if (res.data.code == 2) {
                    this.$message.error(res.data.msg);
                    window.sessionStorage.clear();
                    this.$router.push('/login');
                } else {
                    this.$message.error('系统繁忙请稍后再试');
                }
            })
        },

        getStatusType(status) {
            if (status === 0) {
                return 'warning';
            } else if (status === 1) {
                return 'danger';
            } else if (status === 2) {
                return 'success';
            }
        },
        getStatusText(status) {
            if (status === 0) {
                return '交易中';
            } else if (status === 1) {
                return '仲裁中';
            } else if (status === 2) {
                return '交易完成';
            }
        },

        checkGoods(id1) {
            this.$router.push({
                path: '/GoodsDetail',
                query: { id: id1, from: 'mysell' }
            })
        },


        //分页大小改变事件
        handleSizeChange(newsize) {
            this.queryInfo.pageSize = newsize;
            window.sessionStorage.setItem('MySellSize', newsize,);
            this.getGoodsOrderList();
        },
        //分页改变事件
        handleCurrentChange(newpage) {
            this.queryInfo.pageNum = newpage;
            window.sessionStorage.setItem('MySellNum', newpage,);
            this.getGoodsOrderList();
        },
        getImg(img) {
            return `http://47.97.183.209:7070/api/file/download?name=${img}`
        },
        search() {
            this.queryInfo.pageNum = 1;
            this.getGoodsOrderList();
        },

        handleUploadSuccess(response, file, fileList) {
            this.judgingForm.imag = response.data
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
            this.fileList=[];
            this.judgingForm.imag = '';
        },
        deleteOrder(id) {
            this.deleteOrderInfo = false;
            this.$http.delete(`goodsorder/bisdelete/${id}`).then((res) => {
                if (res.data.code == 1) {
                    this.getGoodsOrderList();
                    this.$message.success(res.data.data);
                } else if (res.data.code == 2) {
                    this.$message.error(res.data.msg);
                    window.sessionStorage.clear();
                    this.$router.push('/login');
                } else {
                    this.$message.error('系统繁忙请稍后再试');
                }
            })
        },
        checkDelete(status, id) {
            if (status !== 2) {
                this.$message.error("当前订单未完成无法删除");
            } else {
                this.checkId = id
                this.deleteOrderInfo = true;

            }
        }
    },

};
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