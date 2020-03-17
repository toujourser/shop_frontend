module.exports = {
    devServer: {
        // proxy: 'http://192.168.253.225:8081',
        proxy: 'http://127.0.0.1:8081'
    }
};
// module.exports = {
//     dev: {
//         port: 8089,
//         proxyTable: {
//             '/api': {
//                 target: 'http://127.0.0.1:8089',
//                 changeOrigin: true,
//                 // pathRewrite: {
//                 //     '^/api': ''
//                 // }
//             }
//         }
//     }
// };
