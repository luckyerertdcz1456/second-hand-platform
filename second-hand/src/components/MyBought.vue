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
                        <el-button v-if="scope.row.status === 0" type="primary" size="mini" style="width: 80px;"
                            @click="confirmGetGoods = true; checkId = scope.row.id" round>确认收货</el-button>
                        <!-- 确认收货 -->
                        <el-dialog title="确认收货" :visible.sync="confirmGetGoods" width="30%">
                            <span>是否确认收货</span>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="confirmGetGoods = false">取 消</el-button>
                                <el-button type="primary" @click="handleConfirm(checkId)">确 定</el-button>
                            </span>
                        </el-dialog>
                        <el-button v-if="scope.row.status === 0" type="danger" size="mini"
                            @click="applyJudgingInfo = true; checkId = scope.row.id" round>申请仲裁</el-button>
                        <el-dialog title="申请仲裁" :visible.sync="applyJudgingInfo" width="30%">
                            <span>确认申请仲裁吗？</span>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="applyJudgingInfo = false">取 消</el-button>
                                <el-button type="primary" @click="judging(checkId)">确 定</el-button>
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
                                <el-form-item label="描述" prop="description">
                                    <el-input type="textarea" v-model="judgingForm.description"
                                        style="width: 80%;"></el-input>
                                </el-form-item>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="judgingInfo = false">取 消</el-button>
                                <el-button type="primary" @click="putJudging(checkId)">确 定</el-button>
                            </div>
                        </el-dialog>


                        <el-button v-if="scope.row.status === 1" type="success" size="mini"
                            @click="cancelJudgingInfo = true; checkId = scope.row.id" round>取消仲裁</el-button>
                        <el-dialog title="取消仲裁" :visible.sync="cancelJudgingInfo" width="30%">
                            <span>是否取消仲裁</span>
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="cancelJudgingInfo = false">取 消</el-button>
                                <el-button type="primary" @click="cancelJudging(checkId)">确 定</el-button>
                            </span>
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
    mounted() {
        if (window.sessionStorage.getItem('goodsOrderNum')) {
            this.queryInfo.pageNum = window.sessionStorage.getItem('goodsOrderNum');

        }
        if (window.sessionStorage.getItem('goodsOrderSize')) {
            this.queryInfo.pageSize = window.sessionStorage.getItem('goodsOrderSize');
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
            confirmGetGoods: false,
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
            cancelJudgingInfo: false,
            deleteOrderInfo: false,
            applyJudgingInfo: false,
            fileList:[]
        }
    },
    methods: {
        cancelJudging(id) {
            this.cancelJudgingInfo = false,
                this.$http.get(`/judging/goodsjudgingcancel/${id}`).then((res) => {
                    if (res.data.code == 1) {
                        //发送收货请求
                        this.handleConfirm(id);
                        this.$message.success(res.data.data);
                    } else if (res.data.code == 2) {
                        this.$message.error(res.data.msg);
                        window.sessionStorage.clear();
                        this.$router.push('/login');
                    } else {
                        this.$message.error(res.data.msg);
                    }
                })
        },
        putJudging(id) {
            this.judgingInfo = false,

                this.$http.put(`/judging/custom/${id}`, this.judgingForm).then((res) => {
                    if (res.data.code == 1) {
                        this.$message.success(res.data.data);
                    } else if (res.data.code == 2) {
                        this.$message.error(res.data.msg);
                        window.sessionStorage.clear();
                        this.$router.push('/login');
                    } else {
                        this.$message.error(res.data.msg);
                    }
                    this.judgingForm.description = '';
                    this.judgingForm.imag = '';
                    this.fileList=[];
                })
        },
        getGoodsOrderList() {
            this.$http.get('goodsorder', { params: { pageNum: this.queryInfo.pageNum, pageSize: this.queryInfo.pageSize, name: this.queryInfo.name, status: this.queryInfo.status } }).then((res) => {
                if (res.data.code == 1) {
                    this.goodsOrderList = res.data.data.records;
                    this.total = res.data.data.total;
                } else if (res.data.code == 2) {
                    this.$message.error(res.data.msg);
                    window.sessionStorage.clear();
                    this.$router.push('/login');
                } else {
                    this.$message.error(res.data.msg);
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
        handleConfirm(id) {
            this.confirmGetGoods = false;
            //确认收货
            this.$http.get(`goodsorder/confirm/${id}`).then((res) => {
                if (res.data.code == 1) {
                    this.getGoodsOrderList();
                    this.$message.success(res.data.data);
                } else if (res.data.code == 2) {
                    this.$message.error(res.data.msg);
                    window.sessionStorage.clear();
                    this.$router.push('/login');
                } else {
                    this.$message.error(res.data.msg);
                }
            })
        },
        checkGoods(id1) {
            this.$router.push({
                path: '/goodsdetail',
                query: { id: id1, from: 'mybought' }
            })
        },
        judging(id) {
            // 处理申请仲裁操作
            this.applyJudgingInfo = false
            this.$http.get(`/goodsorder/judging/${id}`).then((res) => {
                if (res.data.code == 1) {
                    this.getGoodsOrderList();
                    this.$message.success(res.data.data);
                } else if (res.data.code == 2) {
                    this.$message.error(res.data.msg);
                    window.sessionStorage.clear();
                    this.$router.push('/login');
                } else {
                    this.$message.error(res.data.msg);
                }
            })
        },

        //分页大小改变事件
        handleSizeChange(newsize) {
            this.queryInfo.pageSize = newsize;
            window.sessionStorage.setItem('goodsOrderSize', newsize,);
            this.getGoodsOrderList();
        },
        //分页改变事件
        handleCurrentChange(newpage) {
            this.queryInfo.pageNum = newpage;
            window.sessionStorage.setItem('goodsOrderNum', newpage,);
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
            this.$http.delete(`goodsorder/cusdelete/${id}`).then((res) => {
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