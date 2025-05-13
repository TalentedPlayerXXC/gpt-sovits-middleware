const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')
const port = 3001
app.use(express.json({ limit: '5mb' })) // 最大请求体大小为5MB
let filePath = ''
// app.get('/getFileLink', ({ fileName = '1', isBase64 = 0, file = 'demo.audio' }, res) => {
app.post('/getFileLink', (req, res) => {
    saveBase64AsWav(req.body.file, req.body.fileName)
    getFilePath
    res.json({
        // fileName: req.body.fileName,
        // isBase64: req.body.isBase64,
        // file: req.body.file,
        filePath: filePath || '异步',
    })
})


function saveBase64AsWav(base64String, outputFileName) {
    // 如果包含前缀（如 "data:audio/wav;base64,"），去掉它
    const base64Data = base64String.includes(',') ? base64String.split(',')[1] : base64String;

    // 转换为 Buffer
    const audioBuffer = Buffer.from(base64Data, 'base64');

    // 保存为 .wav 文件
    // 做点兼容
    // replace正则为最佳方案
    if (outputFileName.includes('.wav') ||outputFileName.includes('.WAV')|| outputFileName.includes('.mp3')) {
        const filePath = path.join(__dirname, outputFileName);
        fs.writeFileSync(filePath, audioBuffer);
        getFilePath(outputFileName)
        return false
    }
    path.join(__dirname, `${outputFileName}.wav`);
    getFilePath({ fileName: outputFileName })

    // console.log(`WAV 文件已保存: ${filePath}`);
}
function getFilePath(fileName) {
    filePath = path.join(__dirname, fileName)
    // console.log(filePath);
    // return filePath
}
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})