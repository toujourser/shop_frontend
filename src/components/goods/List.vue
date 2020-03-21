<template>
    <div>
        <!--面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable class="input-with-select"
                              @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click="searchGoods"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddPage">添加商品</el-button>
                </el-col>
            </el-row>


            <el-table :data="goodslist" style="width: 100%" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="商品名称" prop="goods_name"></el-table-column>
                <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
                <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
                <el-table-column label="创建时间" prop="add_time" width="142px">
                    <template slot-scope="scope">
                        {{scope.row.add_time | dataFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="130px">
                    <template slot-scope="scope">
                        <!--修改按钮-->
                        <el-button type="primary" icon="el-icon-edit" size="mini"
                                   @click="showEditDialog(scope.row.goods_id)"></el-button>
                        <!--删除按钮-->
                        <el-button type="danger" icon="el-icon-delete" size="mini"
                                   @click="removeGoodsById(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!--分页-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[2, 6, 10, 50, 100]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>

        </el-card>
    </div>
</template>

<script>
    export default {
        name: "List",
        created() {
            this.getGoodsList();
        },
        data() {
            return {
                queryInfo: {
                    query: '',
                    pagesize: 10,
                    pagenum: 1,
                },
                goodslist: [],
                total: 0,
            }
        },
        methods: {
            async getGoodsList() {
                const {data: res} = await this.$http.get('/goods', {params: this.queryInfo});
                if (res.meta.status !== 200) return this.$message.error("商品数据获取失败！！！")
                this.goodslist = res.data.goods;
                this.total = res.data.total
            },
            // 监听pagesize 改变的事件
            handleSizeChange(newSize) {
                // console.log(newSize);
                this.queryInfo.pagesize = newSize;
                this.queryInfo.pagenum = 1;
                this.getGoodsList();
            },
            // 监听页码值变化的事件
            handleCurrentChange(newPage) {
                // console.log(newPage);
                this.queryInfo.pagenum = newPage;
                this.getGoodsList();

            },
            searchGoods() {
                this.queryInfo.pagenum = 1;
                this.queryInfo.pagesize = 10;
                this.getGoodsList();
            },

            showEditDialog() {
                //TODO: wait
            },
            async removeGoodsById(id) {
                // 弹框提示是否确认删除数据
                const confirmResult = await this.$confirm('此操作将永久删除该商品数据, 是否继续?', '提示', {
                    confirmButtonText: '确定', // 如果确认删除则返回字符串 confirm
                    cancelButtonText: '取消', // 如果取消删除则返回字符串 cancel
                    type: 'warning'
                }).catch(err => err);

                if (confirmResult === "confirm") {
                    const {data: res} = await this.$http.delete(`/goods/${id}`);
                    if (res.meta.status !== 200) {
                        return this.$message.error("商品删除失败！！！")
                    }
                    this.$message.success("商品删除成功！！！");
                    this.getGoodsList();
                }
            },
            goAddPage() {
                this.$router.push('/goods/add')
            },
        },
        computed: {},

    }
</script>

<style lang="less" scoped>

</style>
