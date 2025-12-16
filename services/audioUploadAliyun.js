import OSS from 'ali-oss';


// aliYun oss 配置
const client = new OSS({
  region: '', 
  accessKeyId: '',
  accessKeySecret: '',
  bucket: ''
});
// 上传文件到阿里云 OSS
async function aliYunUploadFile(localPath, ossPath) {
  try {
    const result = await client.put(ossPath, localPath);
    console.log("上传成功：", result.url);
    return result.url;
  } catch (err) {
    console.error("上传失败", err);
  } 
}
// 下载文件从阿里云 OSS
async function downloadFileFromAliYun(ossPath, localPath) {
    
}

export { aliYunUploadFile };
