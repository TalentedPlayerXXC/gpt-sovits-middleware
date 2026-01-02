/**
 * 基于GPT-Sovts接口重构的一套服务 
 * 
 */

// const express = require('express') 
import express from 'express'
import { fileURLToPath } from 'url';
import { dirname, format } from 'path';
// import { uploadFolder } from './services/audioUpladB2.js';
import { listFilesInAliYun,listAndInsertFiles } from './services/audioUploadAliyun.js';
import { dbLink, closeDBConnection, insertAuduioUrls,getAudioFileTree } from './services/dblink.js';
import { getCurrentTimestamp } from './untils/util.js';
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
// 测试数据库连接
app.get('/testdb', async (req, res) => {
    // const result = await listAndInsertFiles();
    const result = await getAudioFileTree();
    // 将数据自动下载为json文件
    res.json({
        data: result,
    });
    // insertOneData().then(() => {
    //     res.send('数据库插入测试数据成功');
    // }).catch((err) => {
    //     res.send('数据库插入测试数据失败:' + err);
    // }).finally(() => {
    //     closeDBConnection();
    // });
});
// 测试阿里云文件api
app.get('/filetest', async (req, res) => {
    // res.send('开始测试阿里云文件列表...');
    // listFilesInAliYun().then(files => {
    //     res.send(files);
    // }).catch(err => {
    //     res.send('获取文件列表失败:', err);
    // });
    // const files = await listFilesInAliYun();
    listFilesInAliYun().then(files => {
        res.send(files?.objects || ['无文件']);
    }).catch(err => {
        res.send('获取文件列表失败:', err);
    });
    // res.send(files?.objects || ['无文件']);
});
const tree = [
    {
        "name": "鸣潮/1号演员/中文/【生气_angry】这是什么意思？翻倍了还怎么节省？.wav",
        "url": "aaa.wav",
        "lastModified": "2025-12-22T04:28:54.000Z",
        "etag": "\"7887A5264A4204018649B67EBFA5A071\"",
        "type": "Normal",
        "size": 280354,
        "storageClass": "Standard",
        "owner": {
            "id": "1282504487101079",
            "displayName": "1282504487101079"
        }
    },
    {
        "name": "鸣潮/1号演员/中文/【难过_sad】这个幻境太酷了！.wav",
        "url": "bbb.wav",
        "lastModified": "2025-12-22T04:28:54.000Z",
        "etag": "\"528B7E616EE78CD34A466ABDFA707CD9\"",
        "type": "Normal",
        "size": 339238,
        "storageClass": "Standard",
        "owner": {
            "id": "1282504487101079",
            "displayName": "1282504487101079"
        }
    },
    {
        "name": "鸣潮/丹瑾/中文/【开心_happy】有时太过投入，下手失了轻重……没吓着你吧？.wav",
        "url": "http://sovitsaudiodata.oss-cn-beijing.aliyuncs.com/%E9%B8%A3%E6%BD%AE/%E4%B8%B9%E7%91%BE/%E4%B8%AD%E6%96%87/%E3%80%90%E5%BC%80%E5%BF%83_happy%E3%80%91%E6%9C%89%E6%97%B6%E5%A4%AA%E8%BF%87%E6%8A%95%E5%85%A5%EF%BC%8C%E4%B8%8B%E6%89%8B%E5%A4%B1%E4%BA%86%E8%BD%BB%E9%87%8D%E2%80%A6%E2%80%A6%E6%B2%A1%E5%90%93%E7%9D%80%E4%BD%A0%E5%90%A7%EF%BC%9F.wav",
        "lastModified": "2025-12-22T04:28:54.000Z",
        "etag": "\"A747EFE045F61A53B0F2D4B7200E961B\"",
        "type": "Normal",
        "size": 393302,
        "storageClass": "Standard",
        "owner": {
            "id": "1282504487101079",
            "displayName": "1282504487101079"
        }
    },
    {
        "name": "鸣潮/今汐/中文/【难过_sad】这个人，或许和你有着千丝万缕的联系。.wav",
        "url": "http://sovitsaudiodata.oss-cn-beijing.aliyuncs.com/%E9%B8%A3%E6%BD%AE/%E4%BB%8A%E6%B1%90/%E4%B8%AD%E6%96%87/%E3%80%90%E9%9A%BE%E8%BF%87_sad%E3%80%91%E8%BF%99%E4%B8%AA%E4%BA%BA%EF%BC%8C%E6%88%96%E8%AE%B8%E5%92%8C%E4%BD%A0%E6%9C%89%E7%9D%80%E5%8D%83%E4%B8%9D%E4%B8%87%E7%BC%95%E7%9A%84%E8%81%94%E7%B3%BB%E3%80%82.wav",
        "lastModified": "2025-12-22T04:28:55.000Z",
        "etag": "\"AEA68E33801E5F9E3A04BA8AEFE061E5\"",
        "type": "Normal",
        "size": 385686,
        "storageClass": "Standard",
        "owner": {
            "id": "1282504487101079",
            "displayName": "1282504487101079"
        }
    },
    {
        "name": "鸣潮/伤痕/中文/【中立_neutral】首先，故事围绕着谁来展开？.wav",
        "url": "http://sovitsaudiodata.oss-cn-beijing.aliyuncs.com/%E9%B8%A3%E6%BD%AE/%E4%BC%A4%E7%97%95/%E4%B8%AD%E6%96%87/%E3%80%90%E4%B8%AD%E7%AB%8B_neutral%E3%80%91%E9%A6%96%E5%85%88%EF%BC%8C%E6%95%85%E4%BA%8B%E5%9B%B4%E7%BB%95%E7%9D%80%E8%B0%81%E6%9D%A5%E5%B1%95%E5%BC%80%EF%BC%9F.wav",
        "lastModified": "2025-12-22T04:28:55.000Z",
        "etag": "\"8A0ABC375A5AFB1F6C7C384AAE947C36\"",
        "type": "Normal",
        "size": 370766,
        "storageClass": "Standard",
        "owner": {
            "id": "1282504487101079",
            "displayName": "1282504487101079"
        }
    },
]
// 测试杂项
app.get('/test', async (req, res) => {
    // res.send(generateFileTree(tree));
    res.json({
        timestamp: getCurrentTimestamp('seconds'), //秒级时间戳
        imageTimestamp: getCurrentTimestamp('milliseconds'), //标准时间戳
    });
});

// dbLink().catch(console.dir);

// aliYunUploadFile('./audio/ceshi/test.wav', 'test/test.wav')
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})