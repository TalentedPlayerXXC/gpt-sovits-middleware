/**
 * 基于GPT-Sovts接口重构的一套服务 
 * 
 */

// const express = require('express') 
import express from 'express'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// 获取路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


import { saveBase64AsWav, readFileList } from './untils/util.js'
const app = express()
const port = 3001
app.use(express.json({ limit: '5mb' })) // 最大请求体大小为5MB
// app.get('/', (req, res) => {
//     res.send(__dirname)
// }
// )
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


// function saveBase64AsWav(base64String, outputFileName) {
//     // 如果包含前缀（如 "data:audio/wav;base64,"），去掉它
//     const base64Data = base64String.includes(',') ? base64String.split(',')[1] : base64String;

//     // 转换为 Buffer
//     const audioBuffer = Buffer.from(base64Data, 'base64');

//     // 保存为 .wav 文件
//     // 做点兼容
//     // includes方案
//     // if (outputFileName.includes('.wav') || outputFileName.includes('.WAV') || outputFileName.includes('.mp3')) {
//     //     const filePath = path.join(__dirname, outputFileName);
//     //     console.log(outputFileName.replace(/.wav|.WAV|.mp3|.MP3/g, ''));
//     //     fs.writeFileSync(filePath, audioBuffer);
//     //     getFilePath(outputFileName)
//     //     return false
//     // }
//     // 正则方案
//     if (fileNameReg.test(outputFileName)) {
//         const filePath = path.join(__dirname, outputFileName);
//         // console.log(outputFileName.replace(/.wav|.WAV|.mp3|.MP3/g, ''));
//         fs.writeFileSync(filePath, audioBuffer);
//         getFilePath(outputFileName)
//         return false
//     }
// }
// function getFilePath(fileName) {
//     filePath = path.join(__dirname, fileName)
// }
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})