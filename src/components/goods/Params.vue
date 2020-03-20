<template>
    <div>
        <!--面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片视图-->
        <el-card>
            <!--警告区域-->
            <el-alert title="注意：只允许第三级分类设置相关属性！！！" type="warning" :closable="false" show-icon></el-alert>

            <el-row class="cat_opt">
                <el-col class="block">
                    <span>选择相关商品：</span>
                    <!--级联选择框-->
                    <el-cascader v-model="selectedCateKeys" :options="cateList" :props="cateProps"
                                 @change="handleChange"
                                 :show-all-levels="false" size="mini" :clearable="true"></el-cascader>

                </el-col>
            </el-row>

            <!--tab 页签-->
            <el-tabs v-model="activeTabsName" @tab-click="handleTabClick">
                <!--动态属性标签-->
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">
                        添加参数
                    </el-button>
                    <el-table :data="manyTabData" border stripe>
                        <el-table-column type="expand">

                            <template slot-scope="scope">
                                <!--循环渲染tag标签-->
                                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable
                                        @close="handleTagClose(i,scope.row)">{{item}}
                                </el-tag>
                                <!--输入文本框-->
                                <el-input
                                        class="input-new-tag"
                                        v-if="scope.row.inputVisible"
                                        v-model="scope.row.inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    New Tag
                                </el-button>
                            </template>

                        </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
                                <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                </el-tab-pane>

                <!--静态属性标签-->
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">
                        添加属性
                    </el-button>

                    <el-table :data="onlyTabDate" border stripe>
                        <el-table-column type="expand">

                            <template slot-scope="scope">
                                <!--循环渲染tag标签-->
                                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable
                                        @close="handleTagClose(i,scope.row)">{{item}}
                                </el-tag>
                                <!--输入文本框-->
                                <el-input
                                        class="input-new-tag"
                                        v-if="scope.row.inputVisible"
                                        v-model="scope.row.inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    New Tag
                                </el-button>
                            </template>

                        </el-table-column>
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
                                <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                </el-tab-pane>
            </el-tabs>

        </el-card>

        <el-dialog :title="'添加'+titleText" :visible.sync="addDialogVisible" width="50%" @close="paramsDialogClose">
            <!--内容主体区-->
            <el-form :model="addParamForm" :rules="addParamFormRules" ref="addParamsFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addParamForm.attr_name"></el-input>
                </el-form-item>
            </el-form>

            <!--底部区域-->
            <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "Params",
        created() {
            this.getCateList();
        },
        data() {
            return {
                cateList: [],
                // 级联选择框选中的数据
                selectedCateKeys: [],
                cateProps: {
                    expandTrigger: 'hover',
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },
                // 被激活的页签名称
                activeTabsName: 'many',
                addDialogVisible: false,
                manyTabData: [],
                onlyTabDate: [],
                addParamForm: {
                    attr_name: '',
                },
                addParamFormRules: {
                    attr_name: [
                        {required: true, message: '请输入参数名称', trigger: 'blur'},
                        {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
                    ],
                },

            }
        },
        methods: {
            async getCateList() {
                const {data: res} = await this.$http.get('/categories')
                if (res.meta.status !== 200) return this.$message.error("商品分类获取失败")
                this.cateList = res.data.result;
            },
            // 级联选择框选中项发生的变化会触发这个函数
            handleChange() {
                this.getParamsDate()
            },
            handleTabClick() {
                this.getParamsDate()
            },
            async getParamsDate() {
                if (this.selectedCateKeys.length !== 3) {
                    this.manyTabData = [];
                    this.onlyTabDate = [];
                    return
                }
                const {data: res} = await this.$http.get(`categorie/${this.cateId}/attributes`, {params: {sel: this.activeTabsName}});
                if (res.meta.status !== 200) return this.$message.error("属性信息获取失败");

                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : [];
                    // 控制文本框的现实和隐藏
                    item.inputVisible = false;
                    // 文本框中输入的内容
                    item.inputValue = '';
                });

                if (this.activeTabsName === 'many') {
                    this.manyTabData = res.data
                } else {
                    this.onlyTabDate = res.data
                }
            },
            paramsDialogClose() {
                this.$refs.addParamsFormRef.resetFields()
            },
            addParams() {
                this.$refs.addParamsFormRef.validate(async valid => {
                    if (!valid) {
                        return
                    }
                    const {data: res} = await this.$http.post(`/categorie/${this.cateId}/attributes`, {
                        attr_sel: this.activeTabsName,
                        attr_name: this.addParamForm.attr_name
                    });
                    if (res.meta.status !== 200) return this.$message.error('参数添加失败');
                    this.$message.success('参数添加成功');
                    this.getParamsDate();
                    this.addDialogVisible = false
                })
            },
            // 文本框失去焦点或者按下enter键触发该函数
            async handleInputConfirm(row) {
                if (row.inputValue.trim().length === 0) {
                    row.inputValue = '';
                    row.inputVisible = false;
                    return
                }
                row.attr_vals.push(row.inputValue.trim());
                row.inputValue = '';
                row.inputVisible = false;
                this.saveAttrValues(row);
            },
            async saveAttrValues(row) {
                const {data: res} = await this.$http.put(`categorie/${this.cateId}/attributes/${row.attr_id}`, {
                    attr_sel: row.attr_sel,
                    attr_name: row.attr_name,
                    attr_vals: row.attr_vals.join(',')
                });
                if (res.meta.status !== 200) return this.$message.error('参数修改失败');
                this.$message.success('参数修改成功');
            },
            showInput(item) {
                item.inputVisible = true;
                // 让文本框自动获得焦点
                // $nextTick的作用： 当页面上的元素被重新渲染之后才会指向回掉函数中的代码
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            // 删除对应的参数可选项
            handleTagClose(index, row) {
                row.attr_vals.splice(index, 1);
                this.saveAttrValues(row)
            }

        },
        computed: {
            isBtnDisabled() {
                if (this.selectedCateKeys.length !== 3) {
                    return true
                }
                return false
            },
            cateId() {
                if (this.selectedCateKeys.length === 3) {
                    return this.selectedCateKeys[2]
                }
                return null
            },
            titleText() {
                if (this.activeTabsName === 'many') {
                    return '动态参数'
                }
                return '静态属性'
            },
        },


    }
</script>

<style lang="less" scoped>
    .cat_opt {
        margin: 15px 0;
    }

    .el-tag {
        margin: 5px;
    }

    .input-new-tag {
        width: 120px;
    }

</style>
