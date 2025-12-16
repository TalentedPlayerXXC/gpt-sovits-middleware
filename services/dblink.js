/**
 * mongodb 连接服务
 */
import { MongoClient, ServerApiVersion } from 'mongodb';
import { getMogoDBConfig } from '../untils/util.js'
// mogoDB配置
const mogoConfig = await getMogoDBConfig();
const uri = `mongodb+srv://${mogoConfig.mogoUser}:${mogoConfig.mongoPwd}@sovtsaudiodata.8osq6sw.mongodb.net/?appName=${mogoConfig.appName}`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const DB_NAME = "sovts";  // 数据库名称
const COLLECTION_NAME = "audioDatas"; //数据库集合

async function dbLink() {
  try {
    // 1. 连接客户端到服务器
    await client.connect();

    // 2. 访问数据库和集合
    const database = client.db(DB_NAME);
    const collection = database.collection(COLLECTION_NAME);
    console.log("数据库连接成功");

    // 3. 定义要插入的文档 (数据)
    const docToInsert = {
      user_id: "fangxiu1",
      text_input: "你好，这是一个测试。",
      ref_audio_url: "http://remote.audio/path/123.wav",
      timestamp: new Date(),
      audiotype: "wav",
      status: "success"
    };

    // 4. 执行插入操作
    const result = await collection.insertOne(docToInsert);

    // 5. 打印结果
    console.log(`成功插入文档，ID 为: ${result.insertedId}`);
    return result

  } catch (error) {
    console.error("操作失败:", error);
  } finally {
    // 7. 确保客户端连接关闭
    await client.close();
  }
}

// 数据查询


export { dbLink };