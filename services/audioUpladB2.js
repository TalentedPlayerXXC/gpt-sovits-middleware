import axios from "axios";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import mime from "mime-types";
import async from "async";

// B2 配置
const APPLICATION_KEY_ID = "";
const APPLICATION_KEY = "";
const BUCKET_ID = "";


const FOLDER_PATH = "./audio"; // 你要上传的文件夹路径


// Base64 授权头
const authHeader = "Basic " + Buffer.from(`${APPLICATION_KEY_ID}:${APPLICATION_KEY}`).toString("base64");

async function authorize() {
    const res = await axios.get(
        "https://api.backblazeb2.com/b2api/v2/b2_authorize_account",
        {
            headers: {
                Authorization: authHeader
            }
        }
    );
    return res.data;
}

async function getUploadUrl(apiUrl, token) {
    const res = await axios.post(
        `${apiUrl}/b2api/v2/b2_get_upload_url`,
        { bucketId: BUCKET_ID }, // ⚠️ b2_get_upload_url 不需要 accountId
        {
            headers: {
                Authorization: token
            }
        }
    );
    return res.data;
}

async function uploadFile(uploadUrl, uploadToken, filepath, filename) {
    const content = fs.readFileSync(filepath);
    const sha1 = crypto.createHash("sha1").update(content).digest("hex");

    const res = await axios.post(
        uploadUrl,
        content,
        {
            headers: {
                Authorization: uploadToken,
                "X-Bz-File-Name": encodeURIComponent(filename),
                "Content-Type": "b2/x-auto",
                "X-Bz-Content-Sha1": sha1
            }
        }
    );

    console.log(`上传成功：${filename}`);
    return res.data;
}

function getAllFiles(dir) {
    let files = fs.readdirSync(dir);
    let results = [];

    for (let file of files) {
        let filepath = path.join(dir, file);
        let stat = fs.statSync(filepath);

        if (stat.isDirectory()) {
            results = results.concat(getAllFiles(filepath));
        } else {
            results.push(filepath);
        }
    }
    return results;
}

async function uploadFolder() {
    console.log("正在授权 Backblaze B2...");
    const auth = await authorize();
    console.log("授权成功！");
    // console.log("以下是授权信息：", auth);
    return auth;
}

export { uploadFolder };