<template>
    <div>
        <!--面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>角色管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-row>
                <!--添加角色按钮区域-->
                <el-col>
                    <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
                </el-col>
            </el-row>
            <el-table :data="roleList" style="width: 100%" border stripe>
                <!--展开列-->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <!--通过for循环渲染一级权限-->
                        <el-row :class="['bdbottom', i1 === 0? 'bdtop':'']" v-for="(item1, i1) in scope.row.childrens"
                                :key="item1.id" type="flex" align="middle">
                            <!--渲染一级权限-->
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!--渲染二级和三级权限-->
                            <el-col :span="19">
                                <!--通过for循环渲染二级权限-->
                                <el-row :class="[i2 === 0 ? '':'bdtop']" v-for="(item2, i2) in item1.childrens"
                                        :key="item2.id" type="flex" align="middle">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">
                                            {{item2.authName}}
                                        </el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="item3 in item2.childrens" :key="item3.id"
                                                closable @close="removeRightById(scope.row, item3.id)">
                                            {{item3.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                        <!--  <pre>-->
                        <!--      {{scope.row}}-->
                        <!--  </pre>-->
                    </template>
                </el-table-column>
                <!--索引列-->
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
                <el-table-column prop="level" label="操作" width="300px">

                    <template slot-scope="scope">
                        <!--修改按钮-->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">
                            编辑
                        </el-button>
                        <!--删除按钮-->
                        <el-button type="danger" icon="el-icon-delete" size="mini"
                                   @click="removeRoleById(scope.row.id)">删除
                        </el-button>
                        <!--分配角色按钮-->
                        <el-button type="warning" icon="el-icon-setting" size="mini"
                                   @click="showSetRightDialog(scope.row)" @close="setRieghtDialogClose">分配权限
                        </el-button>
                    </template>

                </el-table-column>
            </el-table>
        </el-card>

        <!--添加角色的对话框-->
        <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
            <!--内容主体区-->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="名称" prop="roleName">
                    <el-input v-model="addForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="roleDesc">
                    <el-input v-model="addForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>

            <!--底部区域-->
            <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addRole">确 定</el-button>
            </span>
        </el-dialog>


        <!--修改角色的对话框-->
        <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
            <!--内容主体区-->
            <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="70px">
                <el-form-item label="名称" prop="roleName">
                    <el-input v-model="editForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="roleDesc">
                    <el-input v-model="editForm.roleDesc"></el-input>
                </el-form-item>

            </el-form>

            <!--底部区域-->
            <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editRoleInfo">确 定</el-button>
            </span>
        </el-dialog>

        <!--分配权限的对话框-->
        <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%">
            <!--内容主体区-->
            <el-tree :data="rightsList" :props="treeProps" @node-click="" show-checkbox node-key="id" default-expand-all
                     :default-checked-keys="defKeys" ref="treeRef"></el-tree>


            <!--底部区域-->
            <span slot="footer" class="dialog-footer">
                    <el-button @click="setRightDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "Roles",
        created() {
            this.getRolesList()
        },
        data() {
            return {
                roleList: [],
                addDialogVisible: false,
                editDialogVisible: false,
                setRightDialogVisible: false,

                addForm: {
                    roleName: '',
                    roleDesc: '',
                },

                addFormRules: {
                    roleName: [
                        {required: true, message: '请输入角色名', trigger: 'blur'},
                        {min: 2, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
                    ],
                    roleDesc: [
                        {required: true, message: '请输入角色描述', trigger: 'blur'},
                        {min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur'}
                    ],
                },
                editForm: {},
                // 所有权限的数据
                rightsList: [],
                // 树形控件的属性绑定对象
                treeProps: {
                    children: 'children',
                    label: 'authName'
                },
                // 树形控件中默认已选择的节点
                defKeys: [],
                // 当前即将分配权限的角色Id
                roleId: '',

            }
        },
        methods: {
            async showEditDialog(id) {
                this.editDialogVisible = true;
                const {data: res} = await this.$http.get(`/role/${id}`);
                if (res.meta.status !== 200) {
                    this.$message.error('查询角色信息失败！！')
                }
                this.editForm = res.data
            },
            async removeRoleById(id) {
                const confirmResult = await this.$confirm('此操作将永久删除该角色数据, 是否继续?', '提示', {
                    confirmButtonText: '确定', // 如果确认删除则返回字符串 confirm
                    cancelButtonText: '取消', // 如果取消删除则返回字符串 cancel
                    type: 'warning'
                }).catch(err => err);
                if (confirmResult === "confirm") {
                    const {data: res} = await this.$http.delete(`/role/${id}`);
                    if (res.meta.status !== 200) {
                        return this.$message.error("角色删除失败！！！")
                    }
                    this.getRolesList();
                    this.$message.success("角色删除成功！！！")
                }

            },
            async getRolesList() {
                const {data: res} = await this.$http.get("/roles");
                if (res.meta.status !== 200) {
                    return this.$message.error("角色列表查询失败！！！")
                }
                console.log(res.data);
                res.data.forEach(item => {
                    item.childrens = item.children;
                    delete item.children
                    item.childrens.forEach(item2 => {
                        item2.childrens = item2.children;
                        delete item2.children;
                        item2.childrens.forEach(item3 => {
                            item3.childrens = item3.children;
                            delete item3.children;
                        });
                    });

                });

                console.log(res.data);
                this.roleList = res.data
            },
            addDialogClose() {
                this.$refs.addFormRef.resetFields();
            },
            editDialogClose() {
                this.$refs.editFormRef.resetFields();
            },
            editRoleInfo() {
                this.$refs.editFormRef.validate(async valid => {
                    if (!valid) {
                        return
                    }
                    const {data: res} = await this.$http.put(`/roles/${this.editForm.id}`, {
                        roleName: this.editForm.roleName,
                        roleDesc: this.editForm.roleDesc
                    });
                    if (res.meta.status !== 200) {
                        return this.$message.error("角色更新失败");
                    }
                    this.$message.success("角色修改成功");
                    this.editDialogVisible = false;
                    this.getRolesList();
                });
            },
            async addRole() {
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) return;
                    const {data: res} = await this.$http.post("/roles", this.addForm)
                    if (res.meta.status !== 200) {
                        this.$message.error("角色添加失败")
                    }
                    this.$message.success("角色添加成功");
                    this.getRolesList();
                    this.addDialogVisible = false;
                });

            },
            // 根据ID删除对应的权限
            async removeRightById(role, rightId) {
                // 弹窗提示用户是否确认删除
                const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err);

                if (confirmResult === "confirm") {
                    const {data: res} = await this.$http.delete(`/roles/${role.id}/rights/${rightId}`);
                    if (res.meta.status !== 200) {
                        return this.$message.error("权限删除失败！！！")
                    }
                    this.$message.success("权限删除成功！！！");
                    role.children = res.data.children // 局部渲染， 只更新这个role
                    // console.log(role)
                    // console.log(res)
                }

            },
            // 展示分配权限的对话框
            async showSetRightDialog(role) {
                this.roleId = role.id;
                const {data: res} = await this.$http.get('/rights/tree');
                if (res.meta.status !== 200) {
                    return this.$message.error("权限列表获取失败！！！")
                }
                this.rightsList = res.data;

                this.getLeafKeys(role, this.defKeys);
                this.setRightDialogVisible = true;
            },
            // 通过递归的形式获取所有三级权限的id， 并保存到defKeys中去
            getLeafKeys(node, arr) {
                // 如果当前节点没有children 属性， 则为三级节点
                if (!node.children) {
                    return arr.push(node.id)
                }
                node.children.forEach(item => this.getLeafKeys(item, arr))
            },
            // 分配权限窗口关闭后清空defKeys 数组
            setRieghtDialogClose() {
                this.defKeys = []
            },
            // 点击为角色分配权限
            async allotRights() {
                const keys = [
                    ...this.$refs.treeRef.getCheckedKeys(),
                    ...this.$refs.treeRef.getHalfCheckedKeys(),
                ];
                const idsStr = keys.join(',');
                const {data: res} = await this.$http.post(`/roles/${this.roleId}/rights`, {'rids': idsStr});
                if (res.meta.status !== 200) {
                    return this.$message.error('角色权限分配失败！！！')
                }
                this.$message.success('角色权限分配成功！！！');
                this.getRolesList();
                this.setRightDialogVisible = false;

            }

        }
    }
</script>

<style lang="less" scoped>
    .el-tag {
        margin: 7px;
    }

    .bdtop {
        border-top: 1px solid #eee;
    }

    .bdbottom {
        border-bottom: 1px solid #eee;
    }
</style>
