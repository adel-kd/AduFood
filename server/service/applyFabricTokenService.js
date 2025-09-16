import request from "request";
import config from "./config.js";

export default function applyFabricToken() {
  return new Promise((resolve, reject) => {
    const options = {
      method: "POST",
      url: `${config.baseUrl}/payment/v1/token`,
      headers: {
        "Content-Type": "application/json",
        "X-APP-Key": config.fabricAppId,
      },
      rejectUnauthorized: false,
      body: JSON.stringify({ appSecret: config.appSecret }),
    };

    request(options, (error, response) => {
      if (error) return reject(error);
      try {
        const result = JSON.parse(response.body);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  });
}
