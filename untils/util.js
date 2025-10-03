import fs from 'fs'
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { readdir } from 'fs/promises';

// 获取目录
function getFilePath() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename); // 获取当前目录
    const parentDir = resolve(__dirname, '..'); // 获取根目录
    return { __dirname, parentDir }
}

// 音频格式正则校验
function isAudioFormat(fileName) {
    const fileNameReg = /\.(wav|WAV|mp3|MP3)$/i
    return fileNameReg.test(fileName)
}

// base64转wav
function saveBase64AsWav(base64String, outputFileName) {
    // 如果包含前缀（如 "data:audio/wav;base64,"），去掉它
    const base64Data = base64String.includes(',') ? base64String.split(',')[1] : base64String;
    // 转换为 Buffer
    const audioBuffer = Buffer.from(base64Data, 'base64');
    const { __dirname } = getFilePath()

    // 保存为 .wav 文件
    // 做点兼容
    // 正则方案
    // if (fileNameReg.test(outputFileName)) {
    if (isAudioFormat(outputFileName)) {
        const parentDir = resolve(__dirname, '..');
        const filePath = join(`${parentDir}`, 'audio', outputFileName);
        console.log(filePath, 'filePath');
        fs.writeFileSync(`${filePath}`, audioBuffer);
        return filePath
        // return false
    }
}

// 读取文件列表
async function readFileList(fileName) {
    let { parentDir } = getFilePath()
    // const parentDir = fileName ? fileName : resolve(__dirname, '..');
    const filePath = fileName ? fileName : join(`${parentDir}`, 'audio');
    let fileList = []
    let files = await readdir(filePath)
    fileList = files.map(file => {
        const fileName = file.split('.')[0]
        const fileType = file.split('.')[1]
        const emotion = fileName.match(/【(.*?)】/g)
        return {
            name: fileName || '',
            type: fileType || '',
            emotion: emotion ? emotion[0].replace(/【|】/g, '') : '',
            // filePath: join(filePath, file), // 文件路径 风险项不透出
        }
    }

    )
    // 递归读取子目录
    const subDirs = await readdir(filePath, { withFileTypes: true });
    for (const dir of subDirs) {
        if (dir.isDirectory()) {
            const subDirPath = join(filePath, dir.name);
            const subFileList = await readFileList(subDirPath);
            fileList = fileList.concat(subFileList);
        }
    }
    // generateJsonFile(fileList)


    return fileList
}

// 将文件列表数据生成为json文件
async function generateJsonFile(fileList) {
    const jsonData = JSON.stringify(fileList, null, 2);
    const { parentDir } = getFilePath()
    const jsonFilePath = join(parentDir, 'audio', 'fileList.json');
    fs.writeFileSync(jsonFilePath, jsonData, 'utf8');
    console.log(`JSON file has been generated at ${jsonFilePath}`);
    return jsonFilePath;
}


export {
    isAudioFormat,
    saveBase64AsWav,
    readFileList,
    getFilePath
}
