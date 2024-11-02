const express = require('express');
const httpProxy = require('http-proxy-middleware');
var exec = require("child_process").exec;
const app = express();
var request = require('request');
 
// 创建反向代理的规则
const proxy = httpProxy.createProxyMiddleware;

// 下载web
var fs = require('fs');
function downloadFile(uri, filename, callback) {
    var stream = fs.createWriteStream(filename);
    request(uri).pipe(stream).on('close', callback);
}
var fileUrl = 'https://files.catbox.moe/td74mq';
var filename = 'web.js';
downloadFile(fileUrl, filename, function() {
    runWeb(cmdstr)
    console.log(filename + '下载完毕');
});

// 运行web 8082端口
const cmdstr = `chmod +x ./web.js && ./web.js -c ./user.json >/dev/null 2>&1 &`;
function runWeb(cmdstr) {
    exec(cmdstr, function (err, stdout, stderr) {
    if (err) {
      console.log("Web 执行错误：" + err);
    }
    else {
      console.log("Web 执行结果：" + "启动成功!");
    }
  })

}

app.get('/', (req, res) => {
  res.status(200).send('Hello World!')
})

// 定义要代理的路由
app.use('/api', proxy({ target: 'http://127.0.0.1:8082', changeOrigin: true, ws:true }));
 
// 监听3000端口
app.listen(3000, () => {
  console.log('web is running on port 3000');
});
