import OSS from 'ali-oss';
import { getAliyunOSSConfig, generateFileTree, formatDate } from '../untils/util.js';
import { insertAuduioUrls } from './dblink.js';

const aliyunOSSConfig = await getAliyunOSSConfig();

// aliYun oss 配置
const client = new OSS({
  region: aliyunOSSConfig.region || 'oss-cn-beijing',
  accessKeyId: aliyunOSSConfig.accessKeyId,
  accessKeySecret: aliyunOSSConfig.accessKeySecret,
  authorizationV4: true,
  bucket: aliyunOSSConfig.bucket
});
// 列举文件
async function listFilesInAliYun() {
  const result = await client.list(
    { 'max-keys': 1000 }
  );
  // console.log("文件列表：", result);
  return result;
}

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
// 下载文件从阿里云 OSS 到本地 目前暂未发现有啥用
async function downloadFileFromAliYun(ossPath, localPath) {
  try {
    const result = await client.get(ossPath, localPath);
    console.log("下载成功：", result);
    return result;
  } catch (err) {
    console.error("下载失败", err);
  }
}

// 列举文件并插入数据库
async function listAndInsertFiles() {
  try {
    const result = await listFilesInAliYun();
    const files = result.objects || [];
    // 打成树状结构然后插入数据库
    if (files.length === 0) {
      return '无文件可插入';
    }
    const fileTree = generateFileTree(files);
    // 插入数据库
    const res = await insertAuduioUrls({ fileTree: fileTree, insertedAt: formatDate(new Date()) });
    return res;

  } catch (err) {
    console.error("操作失败", err);
    throw err;
  }
}

export { aliYunUploadFile, listFilesInAliYun, downloadFileFromAliYun, listAndInsertFiles };
