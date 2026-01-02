/**
 * mongodb 数据库相关方法封装
 */
import { MongoClient, ServerApiVersion } from 'mongodb';
import { getMogoDBConfig,formatDate } from '../untils/util.js'
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
const DB_NAME = "sovts";  // 数据库名称
const COLLECTION_NAME = "userDatas"; //用户数据集合
const COLLECTION_NAME_AUDIO = "audioUrls"; //音频数据链接集合

// async function dbLink() {
// try {
//   // 1. 连接客户端到服务器
//   await client.connect();

//   // 2. 访问数据库和集合
//   const database = client.db(DB_NAME);
//   const collection = database.collection(COLLECTION_NAME);
//   console.log("数据库连接成功");

//   // 数据插入
//   const docToInsert = {
//     user_id: "fangxiu",
//     text_input: "你好，这是一个测试。",
//     ref_audio_url: "http://remote.audio/path/123.wav",
//     timestamp: new Date(),
//     audiotype: "wav",
//     status: "success"
//   };

//   // 执行插入操作
//   await collection.insertOne(docToInsert);
//   // 批量插入
//   const docsToInsert = [
//     {
//       user_id: "fangxiu1",
//     },
//     {
//       user_id: "fangxiu2",
//     }
//   ];
//   await collection.insertMany(docsToInsert);
//   //更新数据
//   const filter = { user_id: "fangxiu" };
//   const updateDoc = {
//     $set: {
//       status: "deleted"
//     },
//   };
//   //删除数据
//   const deleteFilter = { user_id: "fangxiu1" };
//   await collection.deleteOne(deleteFilter);
//   await collection.updateOne(filter, updateDoc);
//   //查询数据
//   const query = { user_id: "fangxiu" }; // 查询条件
//   const result = await collection.find(query).toArray();
//   return result;

// } catch (error) {
//   console.error("操作失败:", error);
// } finally {
//   // 7. 确保客户端连接关闭
//   await client.close();
// }
// }

// 连接数据库
async function dbLink() {
  try {
    // 1. 连接客户端到服务器
    await client.connect();
    console.log("数据库连接成功");
    return client;
  } catch (error) {
    console.error("数据库连接失败:", error);
    throw error;
  }
}

// 查询单条数据
async function queryOneData(userId) {
  try {
    const client = await dbLink();
    const database = client.db(DB_NAME);
    const collection = database.collection(COLLECTION_NAME);
    const query = { user_id: userId };
    const result = await collection.findOne(query);
    return result;
  } catch (error) {
    console.error("查询单条数据失败:", error);
    throw error;
  }
}

// 阿里云音频数据
const audioData = {
  audioName: 'test.wav',
  audioUrl: 'https://example.com/test.wav',
  audioSize: 2048,
  audioDatatype: 'wav',
  fileURLToPath: '/audio/test.wav',
  createdAt: formatDate(new Date()),
}

// 示例用户数据
const userData = {
  userName: 'fangxiu',
  user_id: 'fangxiu',
  userType: 'admin',
  email: 'fangxiu@example.com',
  createdAt: formatDate(new Date()),
}

// 插入一条音频数据
async function insertAuduioUrls(audioData) {
  try {
    const client = await dbLink();
    const database = client.db(DB_NAME);
    const collection = database.collection(COLLECTION_NAME_AUDIO);
    const result = await collection.insertOne(audioData);
    // console.log("音频数据插入成功，ID:", result.insertedId);
    return result.insertedId;
  } catch (error) {
    console.error("音频数据插入失败:", error);
    throw error;
  }
}
// 修改单条数据
async function updateOneData(userId, updateFields) {
  try {
    const client = await dbLink();
    const database = client.db(DB_NAME);
    const collection = database.collection(COLLECTION_NAME);
    const filter = { user_id: userId };
    const updateDoc = {
      $set: updateFields
    };
    await collection.updateOne(filter, updateDoc);
  } catch (error) {
    console.error("修改单条数据失败:", error);
    throw error;
  }
}

// 批量修改数据
async function updateManyData(filter, updateFields) {
  try {
    const client = await dbLink();
    const database = client.db(DB_NAME);
    const collection = database.collection(COLLECTION_NAME);
    const updateDoc = {
      $set: updateFields
    };
    await collection.updateMany(filter, updateDoc);
  } catch (error) {
    console.error("批量修改数据失败:", error);
    throw error;
  }
}

// 删除单条数据
async function deleteOneData(userId) {
  try {
    const client = await dbLink();
    const database = client.db(DB_NAME);
    const collection = database.collection(COLLECTION_NAME);
    const deleteFilter = { user_id: userId };
    await collection.deleteOne(deleteFilter);
  } catch (error) {
    console.error("数据删除失败:", error);
    throw error;
  }
}
// 删除多条数据
async function deleteManyData(filter) {
  try {
    const client = await dbLink();
    const database = client.db(DB_NAME);
    const collection = database.collection(COLLECTION_NAME);
    await collection.deleteMany(filter);
  } catch (error) {
    console.error("删除多条数据失败:", error);
    throw error;
  }
}

//获取数据库中的音频文件树状结构
async function getAudioFileTree() {
  try {
    const client = await dbLink();
    const database = client.db(DB_NAME);
    const collection = database.collection(COLLECTION_NAME_AUDIO);
    const result = await collection.find({}).toArray();
    return result;
  } catch (error) {
    console.error("获取音频文件树状结构失败:", error);
    throw error;
  }
}
// 关闭数据库连接
async function closeDBConnection() {
  await client.close();
}

export {
  dbLink,
  queryOneData,
  updateOneData,
  updateManyData,
  deleteOneData,
  deleteManyData,
  insertAuduioUrls,
  closeDBConnection,
  getAudioFileTree,
};