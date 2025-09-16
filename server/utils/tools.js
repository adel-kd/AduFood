const crypto = require("crypto");

// 13-digit timestamp in seconds
exports.createTimeStamp = () => Math.floor(Date.now() / 1000).toString();

// Random string (32 chars)
exports.createNonceStr = () => crypto.randomBytes(16).toString("hex");

// Signing function (SHA256WithRSA)
exports.signRequestObject = (obj) => {
  // Order keys alphabetically
  const keys = Object.keys(obj).sort();
  const str = keys.map((k) => `${k}=${obj[k]}`).join("&");

  // Example: RSA private key signing (replace with your key in production)
  const sign = crypto.createSign("RSA-SHA256");
  sign.update(str);
  sign.end();

  // You must put your private key here
  const privateKey = `-----BEGIN PRIVATE KEY-----
YOUR_PRIVATE_KEY_HERE
-----END PRIVATE KEY-----`;

  return sign.sign(privateKey, "base64");
};
