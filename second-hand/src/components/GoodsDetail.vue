<template>
    <div class="product-detail">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/twohand' }">二手交易商品</el-breadcrumb-item>
            <el-breadcrumb-item v-if="this.$route.query.from == 'mybought'"
                :to="{ path: '/mybought' }">我的购买</el-breadcrumb-item>
            <el-breadcrumb-item v-if="this.$route.query.from == 'mygoods'"
                :to="{ path: '/mygoods' }">我发布的商品</el-breadcrumb-item>
            <el-breadcrumb-item v-if="this.$route.query.from == 'mysell'"
                :to="{ path: '/mysell' }">我卖出的商品</el-breadcrumb-item>
            <el-breadcrumb-item>商品详情</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="product-info">
            <img :src=this.goods.imgUrl class="image">
            <h2>{{ goods.name }}</h2>
            <p class="description">商品描述:{{ goods.description }}</p>
            <div class="price-contact">
                <p class="price">价格：{{ goods.price }} 元</p>
            </div>
            <p class="contact">联系方式：{{ goods.contact }}</p>
            <p class="location">位置：{{ this.location }}</p>
            <p class="published-time">发布时间：{{ goods.time }}</p>
        </div>
        <el-button v-if="this.goods.isManager == 1" class="buy-btn" type="danger" @click="removeInfo = true">下架</el-button>
        <el-dialog title="下架" :visible.sync="removeInfo" width="30%">
            <span>确定下架该商品吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="removeInfo = false">取 消</el-button>
                <el-button type="primary" @click="remove">确 定</el-button>
            </span>
        </el-dialog>
        <el-button v-if="!this.ismygoods&&this.goods.isManager !== 1" class="buy-btn" type="primary" @click="dialogVisible = true">立即购买</el-button>
        <el-dialog title="购买" :visible.sync="dialogVisible" width="30%">
            <span>确定购买该商品吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="buy">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
  

  
<script>
export default {
    data() {
        return {
            goods: {
                name: '',
                description: '',
                price: '',
                time: '',
                contact: '',
                area: '',
                building: '',
                floor: '',
                room: '',
                imgUrl: '',
                isManager: ''
            },
            location: '',
            ismygoods: false,
            dialogVisible: false,
            ismanager: false,
            removeInfo: false
        };
    },
    created() {
        this.getOne();
    },
    methods: {
        buy() {
            // 购买逻辑
            this.dialogVisible = false

            this.$http.put(`goods/${this.$route.query.id}`).then((res) => {
                if (res.data.code == 1) {
                    this.$message.success(res.data.data);
                    this.$router.push('/twohand');
                } else if (res.data.code == 2) {
                    this.$message.error(res.data.msg);
                    window.sessionStorage.clear();
                    this.$router.push('/login');
                } else {
                    this.$message.error(res.data.msg);
                }
            })
        },
        getOne() {
            this.$http.get(`goods/${this.$route.query.id}`).then((res) => {

                if (res.data.code == 1) {
                    this.goods.name = res.data.data.name;
                    this.goods.description = res.data.data.description;
                    this.goods.price = res.data.data.price;
                    this.goods.time = res.data.data.time;
                    this.goods.contact = res.data.data.contact;
                    this.goods.area = res.data.data.area;
                    this.goods.building = res.data.data.building;
                    this.goods.floor = res.data.data.floor;
                    this.goods.room = res.data.data.room;
                    this.goods.imgUrl = `http://47.97.183.209:7070/api/file/download?name=${res.data.data.imgUrl}`;
                    this.goods.time = res.data.data.time;
                    this.goods.isManager = res.data.data.isManager;
                    console.log(this.area)
                    if (this.goods.area == 1) {
                        this.location = `北区${this.goods.building}栋${this.goods.floor}楼${this.goods.room}号房间`
                    } else if (this.goods.area == 2) {
                        this.location = `南区${this.goods.building}栋${this.goods.floor}楼${this.goods.room}号房间`
                    } else if (this.goods.area == 3) {
                        this.location = `东区${this.goods.building}栋${this.goods.floor}楼${this.goods.room}号房间`
                    }
                    if (res.data.data.businessId == window.sessionStorage.getItem('userid') || res.data.data.customId == window.sessionStorage.getItem('userid')) {
                        this.ismygoods = true;
                    }
                } else if (res.data.code == 2) {
                    this.$message.error(res.data.msg);
                    window.sessionStorage.clear();
                    this.$route.push('/login')
                } else {
                    this.$message.error(res.data.msg);
                }

            })
        },
        remove() {
            this.$http.delete(`goods/${this.$route.query.id}`).then((resp) => {
                if (resp.data.code == 1) {
                    this.$message.success("下架成功");
                    this.$router.push('/twohand');
                } else if (resp.data.code == 2) {
                    this.$message.error(resp.data.msg);
                    this.handleReset();
                    window.sessionStorage.clear();
                    this.$router.push('/login');
                } else {
                    this.$message.error(resp.data.msg);
                }
            });
        },
    },
};
</script>

<style scoped>
.product-detail {
    max-width: 800px;
    margin: 0 auto;
}

.product-info {
    padding: 30px;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .1);
}

.product-info h2 {
    font-size: 32px;
    margin-bottom: 10px;
}

.product-info .description {
    font-size: 18px;
    color: #666;
    margin-bottom: 20px;
}

.price-contact {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.price-contact .price {
    font-size: 24px;
    margin-right: 20px;
}

.location,

.published-time {
    font-size: 16px;
    color: #999;
    margin-bottom: 10px;
}

.buy-btn {
    margin-top: 30px;
}</style>