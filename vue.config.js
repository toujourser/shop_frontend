module.exports = {
    chainWebpack: config => {
        // 发布模式
        config.when(process.env.NODE_ENV === 'production', config => {
            config.entry('app').clear().add('./src/main-prod.js');
            config.set('externals', {
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
                lodash: '_',
                echarts: 'echarts',
                Nprogress: 'nprogress',
                'vue-quill-editor': 'VueQuillEditor'
            });
            config.plugin('html').tap(args => {
                args[0].isProd = true;
                return args
            });

        });
        // 开发模式
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js');
            config.plugin('html').tap(args => {
                args[0].isProd = false;
                return args
            })
        })
    },
    devServer: {
        // proxy: 'http://192.168.253.225:8081',
        proxy: 'http://127.0.0.1:8081'
    },
};
