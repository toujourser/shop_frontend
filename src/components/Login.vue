<template>
    <div id="login" class="login_container">

        <div class="login_box">
            <!--  头像区域-->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 表单区域-->
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
                <!--用户名-->
                <el-form-item prop="username">
                    <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
                </el-form-item>
                <!--密码-->
                <el-form-item prop="password">
                    <el-input type="password" prefix-icon="iconfont icon-3702mima"
                              v-model="loginForm.password"></el-input>
                </el-form-item>

                <el-form-item class="lgoin_btns">
                    <!--登陆-->
                    <el-button type="primary" @click="login">登录</el-button>
                    <!--重置-->
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>

            </el-form>
        </div>


    </div>
</template>

<script>
    export default {
        data() {
            return {
                // 登陆表单的登陆对象
                loginForm: {
                    username: 'admin',
                    password: 'goodluck'
                },
                loginFormRules: {
                    username: [
                        {required: true, message: '请输入登陆名称', trigger: 'blur'},
                        {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入登陆密码', trigger: 'blur'},
                        {min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur'}
                    ]
                }
            }

        },
        methods: {
            resetLoginForm() {
                this.$refs.loginFormRef.resetFields();
            },
            login() {
                this.$refs.loginFormRef.validate(async valid => {
                    if (!valid) {
                        return;
                    } else {
                        const {data: res} = await this.$http.post("/user/login", this.loginForm);

                        if (res.meta.status !== 200) {
                            return this.$message.error(res.meta.msg)
                        }
                        this.$message.success("登陆成功");

                        window.sessionStorage.setItem("token", res.data.token);
                        this.$router.push("/home")
                    }
                });
            }
        }
    }
</script>

<style lang="less" scoped>
    .login_container {
        background-color: #2b4b6b;
        height: 100%;
    }

    .login_box {
        width: 450px;
        height: 300px;
        background-color: #ffffff;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

        .avatar_box {
            width: 130px;
            height: 130px;
            border: 1px solid #eee;
            border-radius: 50%;
            padding: 10px;
            box-shadow: 0 0 10px #ddd;
            position: absolute;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #fff;

            img {
                height: 100%;
                width: 100%;
                border-radius: 50%;
                background-color: #eee;
            }
        }

        .login_form {
            position: absolute;
            bottom: 0;
            width: 100%;
            padding: 0 20px;
            box-sizing: border-box;
        }

        .lgoin_btns {
            display: flex;
            justify-content: flex-end;
        }
    }
</style>
