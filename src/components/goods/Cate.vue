<template>
    <div>
        <!--面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-row>
                <!--添加分类按钮区域-->
                <el-col>
                    <el-button type="primary" @click="showAddCateDiglog">添加分类</el-button>
                </el-col>
            </el-row>

            <tree-table class="tree-table" :data="cateList" :columns="columns" :selection-type="false"
                        :expand-type="false"
                        :show-index="true" index-text="#" border :show-row-hover="false">
                <!--是否有效-->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
                    <i class="el-icon-error" v-else style="color: red;"></i>
                </template>

                <!--排序-->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag type="warning" size="mini" v-else>三级</el-tag>
                </template>

                <!--操作-->
                <template slot="opt" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini">修改</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                </template>

            </tree-table>

            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryInfo.pagenum"
                    :page-sizes="[5, 10, 20]"
                    :page-size="queryInfo.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>

        <!--添加分类的对话框-->
        <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
            <!--内容主体区-->
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
                <el-form-item label="分类名称：" prop="cate_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类：">
                    <!--options 指定数据源-->
                    <el-cascader
                            v-model="selectKeys"
                            :options="parentCateList"
                            :props="cascaderProps"
                            @change="parentateChanged" clearable></el-cascader>
                </el-form-item>

            </el-form>

            <!--底部区域-->
            <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addCateInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Cate",
        created() {
            this.getCateList();
        },
        data() {
            return {
                cateList: [],
                addDialogVisible: false,
                queryInfo: {
                    type: 3,
                    pagenum: 1,
                    pagesize: 5,
                },
                total: 0,
                columns: [
                    {
                        label: '分类名称',
                        prop: 'cat_name'
                    },
                    {
                        label: '是否有效',
                        // prop: 'cat_deleted',
                        // 表示将当前列定义为模版列
                        type: 'template',
                        // 表示当前这一列使用的模版名称
                        template: 'isok',

                    },
                    {
                        label: '排序',
                        type: 'template',
                        template: 'order',
                    },
                    {
                        label: '操作',
                        type: 'template',
                        template: 'opt',
                    }
                ],
                addCateForm: {
                    cat_name: '',
                    cat_level: 0,
                    cat_pid: 0,
                },
                addCateFormRules: {
                    cat_name: [
                        {required: true, message: '请输入分类名称', trigger: 'blur'},
                        {min: 2, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur'}
                    ],
                },
                parentCateList: [],
                // 指定级联选择器的配置属性
                cascaderProps: {
                    expandTrigger: 'hover',
                    checkStrictly: true,
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },
                // 选中的父级分类数组id
                selectKeys: [],

            }
        },
        methods: {
            async getCateList() {
                const {data: res} = await this.$http.get('/categories', {params: this.queryInfo})
                if (res.meta.status !== 200) return this.$message.error('分类列表获取错误！');
                // console.log(res);
                this.cateList = res.data.result;
                this.total = res.data.total;
            },

            // 监听pageSize 改变的事件
            handleSizeChange(newSize) {
                this.queryInfo.pagesize = newSize;
                this.queryInfo.pagenum = 1;
                this.getCateList();
            },
            // 监听页码值变化的事件
            handleCurrentChange(newPage) {
                this.queryInfo.pagenum = newPage;
                this.getCateList()

            },
            showAddCateDiglog() {
                this.getParentCateList();
                this.addDialogVisible = true;
            },
            addDialogClose() {
                this.addCateForm = {};
                this.selectKeys = [];
            },
            async addCateInfo() {
                this.$refs.addCateFormRef.validate(async valid => {
                    if (!valid) {
                        return
                    }
                    const {data: res} = await this.$http.post('/categories', this.addCateForm);
                    if (res.meta.status !== 200) return this.$message.error('分类添加失败');
                    this.$message.success('分类添加成功');
                    this.getCateList();
                    this.addDialogVisible = false
                })

            },
            async getParentCateList() {
                const {data: res} = await this.$http.get('/categories', {params: {type: 2}});
                if (res.meta.status !== 200) return this.$message.error('父级分类列表获取错误！');

                this.parentCateList = res.data.result
            },
            // 选择项变化触发这函数
            parentateChanged() {
                if (this.selectKeys.length > 0) {
                    this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1];
                    this.addCateForm.cat_level = this.selectKeys.length
                } else {
                    this.addCateForm.cat_pid = 0;
                    this.addCateForm.cat_level = 0;
                }
            },
        },

    }
</script>

<style lang="less" scoped>
    .tree-table {
        margin-top: 15px;
    }

    .el-cascader {
        width: 100%;
    }


</style>
