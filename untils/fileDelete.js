// D:\BaiduNetdiskDownload\zzzTest
import { readdir, stat, unlink } from 'node:fs/promises';
import { join, extname } from 'node:path';

// 目标根目录
const rootDir = 'D:/BaiduNetdiskDownload/zzzTest';
// 需要清理的后缀名
const targetExts = ['.log', '.pth', '.ckpt'];

async function cleanFiles(dir) {
  try {
    // 读取“绝区零”文件夹下的所有内容
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        // 如果是文件夹（即你的 xxx 文件夹），递归进去查找文件
        await cleanFiles(fullPath);
      } else if (entry.isFile()) {
        // 如果是文件，检查后缀名
        const ext = extname(entry.name).toLowerCase();
        
        if (targetExts.includes(ext)) {
          try {
            await unlink(fullPath);
            console.log(`已删除: ${fullPath}`);
          } catch (err) {
            console.error(`无法删除文件 ${fullPath}: ${err.message}`);
          }
        }
      }
    }
  } catch (err) {
    console.error(`读取目录 ${dir} 出错: ${err.message}`);
  }
}

console.log('开始清理指定类型文件...');
cleanFiles(rootDir).then(() => {
  console.log('清理任务完成。');
});