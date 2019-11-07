const proxy = require('http-proxy-middleware');
const proxyAPI = {
    "target": "https://000int-prd-payara2.private.entiros.io:8181",
    "pathRewrite": {
        "^/starlify/resources/": "/starlify/resources/"
    },
    "auth": "web:Entiros123",
    "changeOrigin": true,
    "secure": false
};
module.exports = function(app) {
    app.use(proxy('/starlify', proxyAPI));
}