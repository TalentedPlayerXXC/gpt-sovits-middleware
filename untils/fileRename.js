import { readdir, rename } from 'node:fs/promises';
import { join, basename } from 'node:path';

const rootDir = 'D:/BaiduNetdiskDownload/zzzTest';
const PREFIX = '【默认】';

async function renameDeepestFiles(dir) {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    
    // 1. 分离当前目录下的文件和文件夹
    const subDirs = entries.filter(e => e.isDirectory());
    const files = entries.filter(e => e.isFile());

    // 2. 如果当前目录下还有子文件夹，则继续向深处递归
    if (subDirs.length > 0) {
      for (const subDir of subDirs) {
        await renameDeepestFiles(join(dir, subDir.name));
      }
    } 
    // 3. 如果当前目录下没有子文件夹了，说明这里就是“最里层”
    else {
      for (const file of files) {
        // 检查是否已经加过前缀，避免重复操作
        if (!file.name.startsWith(PREFIX)) {
          const oldPath = join(dir, file.name);
          const newPath = join(dir, `${PREFIX}${file.name}`);
          
          await rename(oldPath, newPath);
          console.log(`已重命名: ${file.name} -> ${PREFIX}${file.name}`);
        }
      }
    }
  } catch (err) {
    console.error(`处理目录 ${dir} 时出错:`, err.message);
  }
}
console.log('开始为最底层文件添加前缀...');
renameDeepestFiles(rootDir).then(() => {
  console.log('所有最底层文件处理完毕！');
});