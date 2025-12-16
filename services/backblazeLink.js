/**
 * Backblaze B2 link
 */
// import axios from "axios";
// import base64 from "base-64";

// const keyId = "005b0535a7b3ae70000000002";
// const applicationKey = "K005d/kKKwC+uYIpchKKMYPcIQE5hNk";

// async function authorize() {
//   const authString = base64.encode(`${keyId}:${applicationKey}`);

//   const res = await axios.get(
//     "https://api.backblazeb2.com/b2api/v2/b2_authorize_account",
//     {
//       headers: {
//         Authorization: `Basic ${authString}`,
//       },
//     }
//   );

//   return res.data;
// }

// authorize().then(console.log);


import axios from "axios";

// 配置你的 B2 凭证
const KEY_ID = "005b0535a7b3ae70000000002";
const APPLICATION_KEY = "K005d/kKKwC+uYIpchKKMYPcIQE5hNk";

// 缓存授权信息（减少频繁调用 b2_authorize_account）
let authCache = null;

// 获取授权
async function authorize() {
    const auth = Buffer.from(`${KEY_ID}:${APPLICATION_KEY}`).toString("base64");

    const res = await axios({
        method: "GET",
        url: "https://api.backblazeb2.com/b2api/v2/b2_authorize_account",
        headers: {
            Authorization: `Basic ${auth}`
        }
    });

    authCache = {
        apiUrl: res.data.apiUrl,
        downloadUrl: res.data.downloadUrl,
        authToken: res.data.authorizationToken
    };

    return authCache;
}