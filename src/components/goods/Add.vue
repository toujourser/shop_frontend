<template>
    <div>
        <!--面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{path: '/goods'}">商品列表</el-breadcrumb-item>
            <el-breadcrumb-item>商品添加</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <!--警告区域-->
            <el-alert title="添加商品信息" type="info" center :closable="false" show-icon></el-alert>

            <!--step区域-->
            <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>


            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
                <!--tab栏区域-->
                <el-tabs v-model="activeIndex" tab-position="left" :before-leave="beforeTabLeave"
                         @tab-click="tabClicked">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <!--级联选择框-->
                            <el-cascader v-model="addForm.goods_cat" :options="cateList" :props="cateProps"
                                         @change="handleChange"
                                         :show-all-levels="false" size="mini" :clearable="true"></el-cascader>
                        </el-form-item>
                        <!--                        <el-form-item label="商品介绍" prop="goods_introduce">-->
                        <!--                            <el-input v-model="addForm.goods_introduce"></el-input>-->
                        <!--                        </el-form-item>-->
                        <!--                        <el-form-item label="图片路径" prop="pics">-->
                        <!--                            <el-input v-model="addForm.pics"></el-input>-->
                        <!--                        </el-form-item>-->
                        <!--                        <el-form-item label="商品参数" prop="attes">-->
                        <!--                            <el-input v-model="addForm.attrs"></el-input>-->
                        <!--                        </el-form-item>-->
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item :label="item.attr_name" v-for="item in manyTabData" :key="item.attr_id">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox :label="val" v-for="(val, i) in item.attr_vals" :key="i" border
                                             size="mini"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in onlyTabData" :key="item.attr_id">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <!--action： 表示图片上传的API接口地址-->
                        <el-upload
                                class="upload-demo"
                                :action="uploadURL"
                                :on-preview="handlePreview"
                                :on-remove="handleRemove"
                                list-type="picture" :headers="headerObj" :on-success="handleSuccess">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                        <el-button type="primary" class="btnAdd" @click="addGoodsInfo">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>

        </el-card>

        <!--图片预览-->
        <el-dialog
                title="图片预览"
                :visible.sync="previewVisible"
                width="50%">
            <img :src="previewPath" alt="" class="previewImg">
        </el-dialog>


    </div>
</template>

<script>
    import _ from 'lodash';

    export default {
        name: "Add",
        created() {
            this.getCateList();
        },
        data() {
            return {
                activeIndex: '0',
                addForm: {
                    goods_name: '',
                    goods_price: 0,
                    goods_number: 0,
                    goods_weight: 0,
                    goods_cat: [],
                    goods_introduce: '',
                    pics: [],
                    attrs: [],
                },
                addFormRules: {
                    goods_name: [
                        {required: true, message: '请输入商品名称', trigger: 'blur'},
                    ],
                    goods_price: [
                        {required: true, message: '请输入商品价格', trigger: 'blur'},
                    ],
                    goods_number: [
                        {required: true, message: '请输入商品数量', trigger: 'blur'},
                    ],
                    goods_weight: [
                        {required: true, message: '请输入商品重量', trigger: 'blur'},
                    ],
                    goods_introduce: [
                        {required: false, message: '请输入商品介绍', trigger: 'blur'},
                    ],
                    pics: [
                        {required: false, message: '请输入图片路径', trigger: 'blur'},
                    ],
                    attrs: [
                        {required: false, message: '请输入商品参数', trigger: 'blur'},
                    ]
                },
                cateList: [],
                cateProps: {
                    expandTrigger: 'hover',
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },
                // 动态数据列表
                manyTabData: [],
                // 静态属性列表
                onlyTabData: [],
                uploadURL: 'http://127.0.0.1:8081/api/v1.0/upload',
                // 图片上传的请求头数据
                headerObj: {
                    Authorization: 'Bearer ' + window.sessionStorage.getItem('token')
                },
                previewPath: '',
                previewVisible: false,


            }
        },
        methods: {
            async getCateList() {
                const {data: res} = await this.$http.get('/categories');
                if (res.meta.status !== 200) return this.$message.error('分类列表获取错误！');

                this.cateList = res.data.result;
            },
            // 级联选择框选中项发生的变化会触发这个函数
            handleChange() {
                // console.log(this.addForm.goods_cat)
            },
            beforeTabLeave(activeName, oldActiveName) {
                if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
                    this.$message.error("请先选择商品分类！！！");
                    return false
                }
            },
            async tabClicked() {
                if (this.activeIndex === '1') {
                    const {data: res} = await this.$http.get(`categorie/${this.cateId}/attributes`, {params: {sel: 'many'}});
                    if (res.meta.status !== 200) return this.$message.error("动态参数获取失败");
                    if (res.data !== null) {
                        res.data.forEach(item => {
                            item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : [];
                        });
                    }

                    this.manyTabData = res.data;
                }

                if (this.activeIndex === '2') {
                    const {data: res} = await this.$http.get(`categorie/${this.cateId}/attributes`, {params: {sel: 'only'}});
                    if (res.meta.status !== 200) return this.$message.error("动态参数获取失败");
                    this.onlyTabData = res.data;
                }
            },
            // 图片预览处理函数
            handlePreview(file) {
                this.previewPath = file.response.data.url;
                this.previewVisible = true;

            },
            // 处理移除图片的函数
            handleRemove(file) {
                const filepath = file.response.data.tmp_path;
                const i = this.addForm.pics.findIndex(x => x.pic === filepath);
                this.addForm.pics.splice(i, 1);
            },
            // 图片上传成功处理函数
            handleSuccess(response) {
                const picInfo = {pic: response.data.tmp_path};
                this.addForm.pics.push(picInfo);
            },
            addGoodsInfo() {
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) {
                        return this.$message.error('请填写必要的表单项目')
                    }
                    // 动态参数处理
                    this.manyTabData.forEach(item => {
                        const newInfo = {
                            attr_id: item.attr_id,
                            attr_value: item.attr_vals.join(','),
                        };
                        this.addForm.attrs.push(newInfo)
                    });

                    // 静态属性处理
                    this.onlyTabData.forEach(item => {
                        const newInfo = {
                            attr_id: item.attr_id,
                            attr_value: item.attr_vals,
                        };
                        this.addForm.attrs.push(newInfo)
                    });

                    const form = _.cloneDeep(this.addForm);
                    form.goods_cat = form.goods_cat.join(',');
                    const {data: res} = await this.$http.post('/goods', form);
                    if (res.meta.status !== 200) return this.$message.error("商品数据添加失败！！！");
                    this.$message.success("商品添加成功！！！");
                    this.$router.push('/goods');

                });

            },


        },
        computed: {
            cateId() {
                if (this.addForm.goods_cat.length === 3) {
                    return this.addForm.goods_cat[2]
                }
                return null
            }
        },
    }
</script>

<style lang="less" scoped>
    .el-steps {
        margin: 15px 0;
    }

    .el-checkbox {
        margin: 0 10px 0 0 !important;
    }

    .previewImg {
        width: 100%;
    }

    .btnAdd {
        margin-top: 15px;
    }
</style>
