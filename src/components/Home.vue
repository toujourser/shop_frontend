<template>


    <el-container class="home_container">
        <!--头部-->
        <el-header>
            <div>
                <img src="../assets/绿婆娘.jpeg" alt="">
                <span>后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>

        <!--主题区域-->
        <el-container>
            <!--左侧导航栏-->
            <el-aside :width="isCollapse ? '64px': '200px'">
                <div class="toggle-button" @click="toggleCollapse">lll</div>
                <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff" :unique-opened="true"
                         :collapse="isCollapse" :collapse-transition="false" :router="true"
                         :default-active="$route.path">
                    <!-- :default-active="$route.path 将当前活动的路径设置为高亮 -->
                    <!--一级菜单-->
                    <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">

                        <!--一级菜单模板区域-->
                        <template slot="title">
                            <!--图标-->
                            <i :class="iconObj[item.id]"></i>
                            <!--文本-->
                            <span>{{item.authName}}</span>
                        </template>

                        <!--二级菜单-->
                        <el-menu-item :index="'/'+subItem.path.String" v-for="subItem in item.children"
                                      :key="subItem.id" @click="saveNavtate('/'+subItem.path.String)">
                            <!--图标-->
                            <i class="el-icon-menu"></i>
                            <!--文本-->
                            <span>{{subItem.authName}}</span>
                        </el-menu-item>
                    </el-submenu>

                </el-menu>
            </el-aside>

            <!--右侧内容区域-->
            <el-main>
                <router-view></router-view>
            </el-main>

        </el-container>

    </el-container>

</template>

<script>
    export default {
        created() {
            this.getMenuList();
            // this.activePath = window.sessionStorage.getItem("activePath");
        },
        name: "Home",
        data() {
            return {
                menuList: [],
                iconObj: {
                    '101': "iconfont icon-shangpin",
                    '102': "iconfont icon-danju",
                    '103': "iconfont icon-tijikongjian",
                    '125': "iconfont icon-users",
                    '145': "iconfont icon-baobiao",
                },
                // 菜单是否折叠
                isCollapse: false,
                // 被激活的链接
                activePath: '',
            }
        },
        methods: {
            logout() {
                window.sessionStorage.clear();
                this.$router.push('/login');
            },
            async getMenuList() {
                const {data: res} = await this.$http.get("/menus");

                if (res.meta.status !== 200) {
                    return this.$message.error(res.meta.msg)
                }
                this.menuList = res.data
            },
            // 点击按钮实现菜单的折叠和展开
            toggleCollapse() {
                this.isCollapse = !this.isCollapse
            },
            saveNavtate(activePath) {
                // window.sessionStorage.setItem("activePath", activePath);
                // this.activePath = activePath
            }
        }
    }
</script>

<style lang="less" scoped>
    .el-header {
        background-color: #373d41;
        display: flex;
        justify-content: space-between;
        padding-left: 5px;
        align-items: center;
        color: #fff;

        > div {
            display: flex;
            align-items: center;

            > span {
                padding-left: 15px;
            }
        }

        img {
            width: 50px;
            height: 50px;
            border-radius: 20%;
        }
    }

    .el-aside {
        background-color: #333744;

        .el-menu {
            border-right: 0;
        }
    }

    .el-main {
        background-color: #eaedf1;
    }

    .home_container {
        width: 100%;
        height: 100%;
    }

    .iconfont {
        margin-right: 10px;
    }

    .toggle-button {
        background-color: #4a5064;
        font-size: 10px;
        line-height: 24px;
        color: #fff;
        text-align: center;
        letter-spacing: 0.2em;
        cursor: pointer;
    }
</style>
