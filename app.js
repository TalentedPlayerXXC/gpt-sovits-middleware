/**
 * 基于GPT-Sovts接口重构的一套服务 
 * 
 */

// const express = require('express') 
import express from 'express'
import { fileURLToPath } from 'url';
import { dirname, format } from 'path';
// import { uploadFolder } from './services/audioUpladB2.js';
// import { aliYunUploadFile } from './services/audioUploadAliyun.js';
import { dbLink } from './services/dblink.js';
const app = express()
const port = 3000
// 获取路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { saveBase64AsWav, readFileList } from './untils/util.js'
app.use(express.json({ limit: '5mb' })) // 最大请求体大小为5MB
app.get('/', (req, res) => {
    res.send('Hello World! This is GPT-Sovts-Middleware.');
}
)
// 获取模型列表
app.get('/getModels', async (req, res) => {
    let list = await readFileList(`${__dirname}/audio`)
    res.json({
        modelList: list || [],
    })
})
// 获取配音列表
app.get('/getEmotionList', async (req, res) => {
    let list = await readFileList('')
    res.json({
        list: list || [],
    })
})
// 获取文件本地链接
app.post('/getFileLink', async (req, res) => {
    let filePath = saveBase64AsWav(req.body.file, req.body.fileName)
    // getFilePath
    // let list = await readFileList()
    res.json({
        fileName: req.body.fileName,
        isBase64: req.body.isBase64,
        file: req.body.file,
        filePath: filePath || '异步',
        // list: list || [],
    })
})
app.get('/testdb', async (req, res) => {
    const data = await dbLink();
    res.send(data);
});
// dbLink().catch(console.dir);

// aliYunUploadFile('./audio/ceshi/test.wav', 'test/test.wav')
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})