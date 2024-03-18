<template>
    <div>

        <el-card>
            <!-- 顶部搜索部分 -->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="输入搜索内容" v-model="queryInfo.name"></el-input>
                </el-col>
                <el-col :span="3">
                    <el-select v-model="queryInfo.area" placeholder="选择搜索区域">
                        <el-option label="南区" value="1"></el-option>
                        <el-option label="北区" value="2"></el-option>
                        <el-option label="东区" value="3"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="3">
                    <el-select v-model="queryInfo.building" placeholder="选择搜索楼栋">
                        <el-option v-for="n in 20" :key="n" :label="n + '栋'" :value="n"></el-option>
                    </el-select>
                </el-col>

                <el-col :span="3">
                    <el-select v-model="queryInfo.floor" placeholder="选择搜索楼层">
                        <el-option v-for="n in 6" :key="n" :label="n + '层'" :value="n"></el-option>
                    </el-select>
                </el-col>

                <el-col :span="3">
                    <el-select v-model="queryInfo.room" placeholder="选择搜索房间">
                        <el-option v-for="n in 20" :key="n" :label="n + '号房间'" :value="n"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="1">
                    <el-button type="primary" icon="el-icon-search" circle @click="search"></el-button>
                </el-col>

                <el-col :span="4">
                    <!-- 清除按钮 -->
                    <el-tooltip content="清空搜索内容" placement="top" effect="light">
                        <el-button type="danger" icon="el-icon-delete" round @click="clearSearch"></el-button>
                    </el-tooltip>

                </el-col>
            </el-row>
            <!-- 中间数据部分 -->
            <el-row :gutter="20">
                <el-col :span="5" v-for="item in twoHandList" :key="item.id" :offset="1">
                    <el-card :body-style="{ padding: '0px' }">
                        <!-- 将图片路径设置为后端请求路径 后端再用io流将图片数据返回 -->
                        <img :src="getimg(item.imgUrl)" class="image">
                        <div style="padding: 13px;">
                            <span>{{ item.name }}</span>
                            <div>
                                <time class="time">{{ item.time }}</time>
                            </div>
                            <div style="margin-top: 10px;" class="bottom clearfix">
                                <el-button type="primary" size="mini" class="button"
                                    @click="checkDetail(item.id)">查看详情</el-button>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
            <!-- 分页功能部分 -->
            <div class="block">
                <el-pagination ref="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page=this.queryInfo.pageNum :page-sizes="[1, , 4, 8, 12]" :page-size=this.queryInfo.pageSize
                    layout="total, sizes, prev, pager, next, jumper" :total=this.total>
                </el-pagination>
            </div>
        </el-card>
    </div>
</template>
<script>

export default {
    name: 'twoHand',
    data () {
        return {
            twoHandList: [],
            queryInfo: {
                pageSize: 8,
                pageNum: 1,
                name: '',
                area: '',
                building: '',
                floor: '',
                room: ''
            },
            img: '',
            total: ''
        }
    },
    mounted () {
        if (window.sessionStorage.getItem('twoHandPageSize')) {
            this.queryInfo.pageSize = window.sessionStorage.getItem('twoHandPageSize')
        }
        if (window.sessionStorage.getItem('twoHandPageNum')) {
            this.queryInfo.pageNum = window.sessionStorage.getItem('twoHandPageNum')
        }
        this.getGoodsList()
    },
    methods: {
        // 分页大小改变事件
        handleSizeChange (newsize) {
            this.queryInfo.pageSize = newsize
            window.sessionStorage.setItem('twoHandPageSize', newsize)
            this.getGoodsList()
        },
        // 分页改变事件
        handleCurrentChange (newpage) {
            this.queryInfo.pageNum = newpage
            window.sessionStorage.setItem('twoHandPageNum', newpage)
            this.getGoodsList()
            console.log('change')
        },
        checkDetail (id1) {
            this.$router.push({ path: '/goodsdetail', query: { id: id1 } })
        },
        getGoodsList () {
            this.$http.get('goods', {
                params: {
                    pageSize: this.queryInfo.pageSize,
                    pageNum: this.queryInfo.pageNum,
                    name: this.queryInfo.name,
                    area: this.queryInfo.area,
                    building: this.queryInfo.building,
                    floor: this.queryInfo.floor,
                    room: this.queryInfo.room
                }
            }).then((res) => {
                if (res.data.code === 1) {
                    this.twoHandList = res.data.data.records
                    this.total = res.data.data.total
                } else if (res.data.code === 2) {
                    this.$message.error(res.data.msg)
                    window.sessionStorage.clear()
                    this.$router.push('/login')
                } else {
                    this.$message.error('系统繁忙请稍后再试')
                }
            })
        },
        getimg (img) {
            return `http://47.97.183.209:7070/api/file/download?name=${img}`
        },
        search () {
            this.queryInfo.pageNum = 1
            this.getGoodsList()
        },
        clearSearch () {
            this.queryInfo.area = ''
            this.queryInfo.building = ''
            this.queryInfo.floor = ''
            this.queryInfo.room = ''
            this.queryInfo.name = ''
        }

    }
}
</script>
<style scoped>
.time {
    font-size: 13px;
    color: #999;
}

.bottom {
    margin-top: 10px;
    line-height: 12px;
}

.button {
    padding: 10px;
    float: left;
}

.image {
    width: 100%;
    display: block;
    width: 240.03px;
    height: 240px;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both
}
</style>
