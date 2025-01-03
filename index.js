const express = require('express');
const httpProxy = require('http-proxy-middleware');
const fs = require('fs').promises;
const { exec } = require('child_process');
const app = express();
const axios = require('axios');
const port = process.env.PORT || 3000;
const path = require('path');
const proxy = httpProxy.createProxyMiddleware;
const apiUrl = 'https://github.com/c21xdx/free/releases/download/241218/xweb2'
const passwd = process.env.PASSWD || '99087618-5cd2-4b50-97ea-196a5abe7851';

// 函数A：检查并删除旧的api.js，然后下载新的api.js
async function functionA() {
  const filePath = path.join(__dirname, 'api.js');

  // 检查并删除现有的api.js文件
  try {
      await fs.access(filePath);
      await fs.unlink(filePath);
      console.log('Deleted existing api.js');
  } catch (err) {
      if (err.code === 'ENOENT') {
          console.log('No existing api.js found');
      } else {
          throw err;
      }
  }

  // 下载新的api.js文件
  try {
      const response = await axios({
          url: apiUrl,
          method: 'GET',
          responseType: 'arraybuffer'
      });

      await fs.writeFile(filePath, response.data, { encoding: 'binary' });
      console.log('Downloaded new api.js');
  } catch (err) {
      console.error('Error downloading api.js:', err);
  }
}

// 函数B：运行当前目录下的api.js
function functionB() {
  const command = `sed -i "s/app_passid/${passwd}/" ./user.json && chmod +x ./api.js && ./api.js -c ./user.json >/dev/null 2>&1 &`;
  exec(command, (error, stdout, stderr) => {
      if (error) {
          console.error('Error executing api.js:', error);
          return;
      }

      console.log('api.js output:\n', stdout);
      if (stderr) {
          console.error('api.js stderr:\n', stderr);
      }
  });
}

// 主程序：先运行函数A，再运行函数B
async function main() {
  try {
      await functionA();
      functionB();
  } catch (err) {
      console.error('Error in main:', err);
  }
}

main();

// app.get('/', (req, res) => {
//   res.status(200).send('Hello World!')
// })

// 定义要代理的路由
app.use('/*', proxy({ target: 'http://127.0.0.1:8082', changeOrigin: true, ws:true }));
// app.use('/vl2ws', proxy({ target: 'http://127.0.0.1:8082', changeOrigin: true, ws:true }));
// app.use('/vm2ws', proxy({ target: 'http://127.0.0.1:8082', changeOrigin: true, ws:true }));
 
// 监听app端口
app.listen(port, () => {
  console.log(`xapp listening on port ${port}`);
});
