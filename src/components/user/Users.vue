<template>
    <div>
        <!--面包屑导航区域-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!--卡片视图-->
        <el-card>

            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
            <!--用户列表区域-->
            <el-table :data="userList" style="width: 100%" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="username" label="姓名" width="180"></el-table-column>
                <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
                <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
                <el-table-column prop="role_name" label="角色"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <!--{{scope.row.mg_status}}-->
                        <el-switch v-model="scope.row.mg_status" @change="userStateChange(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!--修改按钮-->
                        <el-button type="primary" icon="el-icon-edit" size="mini"
                                   @click="showEditDialog(scope.row.id)"></el-button>
                        <!--删除按钮-->
                        <el-button type="danger" icon="el-icon-delete" size="mini"
                                   @click="removeUserById(scope.row.id)"></el-button>
                        <!--分配角色按钮-->
                        <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"
                                       @click="setRole(scope.row)"></el-button>
                        </el-tooltip>

                    </template>
                </el-table-column>
            </el-table>

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

        <!--添加用户的对话框-->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
            <!--内容主体区-->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>

            <!--底部区域-->
            <span slot="footer" class="dialog-footer">
                    <el-button @click="addDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>


        <!--修改用户的对话框-->
        <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
            <!--内容主体区-->
            <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>

            <!--底部区域-->
            <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>

        <!--为用户分配角色的对话框-->
        <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogClose">
            <!--内容主体区-->
            <div>
                <p>当前的用户：{{userInfo.username}}</p>
                <p>当前的角色：{{userInfo.role_name}}</p>
                <p>分配新角色：
                    <el-select v-model="selectRoleId" placeholder="请选择">
                        <el-option
                                v-for="item in roleList"
                                :key="item.id"
                                :label="item.roleName"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </p>
            </div>

            <!--底部区域-->
            <span slot="footer" class="dialog-footer">
                    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
            </span>
        </el-dialog>


    </div>
</template>

<script>
    export default {
        name: "Users",
        created() {
            this.getUserList()
        },

        data() {
            // 校验邮箱的规则
            var checkEmail = (rules, value, cb) => {
                const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
                if (regEmail.test(value)) {
                    return cb()
                }
                cb(new Error("请输入合法的邮箱"))
            };

            // 校验手机号的规则
            var checkMobile = (rules, value, cb) => {
                const regMobile = /^(0|86|17951)?(13[0-5]|15[0-9]|17[678]|18[0-9]|14[5-7])[0-9]{8}$/
                if (regMobile.test(value)) {
                    return cb()
                }
                cb(new Error("请输入合法的手机号！"))

            };
            return {
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 2
                },
                total: 0,
                userList: [],
                addDialogVisible: false,
                // 控制修改用户对话框的展示和隐藏
                editDialogVisible: false,
                setRoleDialogVisible: false,
                addForm: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: ''
                },
                addFormRules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 2, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {validator: checkEmail, trigger: 'blur'}
                    ],
                    mobile: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                        // {min: 11, max: 11, message: '长度为 11 个字符', trigger: 'blur'}
                        {validator: checkMobile, trigger: 'blur'}
                    ]
                },
                editForm: {},
                // 需要被分配权限的用户角色
                userInfo: {},
                roleList: [],
                // 以选中的角色ID值
                selectRoleId: '',
            }
        },

        methods: {
            async getUserList() {
                const {data: res} = await this.$http.get("/user/list", {params: this.queryInfo});
                if (res.meta.status !== 200) {
                    return this.$message.error("获取用户列表失败！")
                }
                this.userList = res.data.users;
                this.total = res.data.total;
            },
            searchUser() {
                this.queryInfo.pagenum = 1;
                this.queryInfo.pagesize = 10;
                this.getUserList();
            },
            // 监听pagesize 改变的事件
            handleSizeChange(newSize) {
                // console.log(newSize);
                this.queryInfo.pagesize = newSize;
                this.queryInfo.pagenum = 1;
                this.getUserList();
            },
            // 监听页码值变化的事件
            handleCurrentChange(newPage) {
                // console.log(newPage);
                this.queryInfo.pagenum = newPage;
                this.getUserList();

            },
            // 监听switch开关的变化
            async userStateChange(userinfo) {
                // const {data: res} = await this.$http.put(`/user/${userinfo.id}/state/${userinfo.mg_status}`);
                const {data: res} = await this.$http.put("/user/" + userinfo.id + "/state/" + userinfo.mg_status);
                if (res.meta.status !== 200) {
                    userinfo.mg_status = !userinfo.mg_status;
                    this.$message.error("用户状态更新失败！！！")
                }
                this.$message.success("用户状态更新成功！！！")
            },
            // 添加用户弹窗关闭后清空已经输入的内容
            addDialogClose() {
                this.$refs.addFormRef.resetFields();
            },
            addUser() {
                this.$refs.addFormRef.validate(async valid => {
                    if (!valid) return;
                    const {data: res} = await this.$http.post("/user", this.addForm);
                    if (res.meta.status !== 201) {
                        return this.$message.error(res.meta.msg)
                    }
                    this.$message.success(res.meta.msg);
                    this.addDialogVisible = false;
                    this.getUserList();
                });
            },
            // 展示修改用户对话框
            async showEditDialog(id) {
                this.editDialogVisible = true;
                const {data: res} = await this.$http.get(`/user/${id}`);
                if (res.meta.status !== 200) {
                    this.$message.error('查询用户信息失败！！')
                }
                this.editForm = res.data
            },
            editDialogClose() {
                this.$refs.editFormRef.resetFields();
            },
            editUserInfo() {
                this.$refs.editFormRef.validate(async valid => {
                    if (!valid) {
                        return
                    }
                    const {data: res} = await this.$http.put(`/user/${this.editForm.id}`, {
                        email: this.editForm.email,
                        mobile: this.editForm.mobile
                    });
                    if (res.meta.status === 200) {
                        this.$message.success("用户修改成功");
                        this.editDialogVisible = false;
                        this.getUserList();
                    } else {
                        return this.$message.error("用户更新失败");
                    }
                });
            },
            // 删除指定用户数据
            async removeUserById(id) {
                // 弹框提示是否确认删除数据
                const confirmResult = await this.$confirm('此操作将永久删除该用户数据, 是否继续?', '提示', {
                    confirmButtonText: '确定', // 如果确认删除则返回字符串 confirm
                    cancelButtonText: '取消', // 如果取消删除则返回字符串 cancel
                    type: 'warning'
                }).catch(err => err);

                if (confirmResult === "confirm") {
                    const {data: res} = await this.$http.delete(`/user/${id}`);
                    if (res.meta.status !== 200) {
                        return this.$message.error("用户删除失败！！！")
                    }
                    this.$message.success("用户删除成功！！！");
                    this.getUserList()
                }
            },
            // 展示分配角色对话框
            async setRole(userInfo) {
                this.userInfo = userInfo;
                // 在展示对话框之前获取所有的角色列表
                const {data: res} = await this.$http.get("/roles");
                if (res.meta.status !== 200) {
                    return this.$message.error("角色列表查询失败！！！")
                }
                this.roleList = res.data;
                this.setRoleDialogVisible = true;
            },
            async saveRoleInfo() {
                if (!this.selectRoleId) {
                    return this.$message.error("请选择要分配的角色！！！")
                }
                const {data: res} = await this.$http.put(`/user/${this.userInfo.id}/role`, {'rid': this.selectRoleId});
                if (res.meta.status !== 200) {
                    return this.$message.error("用户分配角色失败！！！")
                }
                this.$message.success("用户分配角色成功！！！");
                this.setRoleDialogVisible = false;
                this.getUserList();
            },
            setRoleDialogClose() {
                this.selectRoleId = '';
                this.userInfo = {};
            }
        },
    }
</script>

<style lang="less" scoped>

</style>
