// services/requestCreateOrderService.js
import applyFabricToken from "./applyFabricTokenService.js";
import config from "./config.js";
import tools from "../utils/tools.js"; 

export const createOrder = async (req, res) => {
  const { title, amount } = req.body;

  try {
    // 1. Apply Fabric token
    const tokenResult = await applyFabricToken();
    const fabricToken = tokenResult.token;

    // 2. Create order
    const orderResult = await requestCreateOrder(fabricToken, title, amount);
    const prepayId = orderResult.biz_content.prepay_id;

    // 3. Generate checkout URL
    const checkoutUrl = createCheckoutUrl(prepayId);
    res.json({ checkoutUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create TeleBirr order", error });
  }
};

export const requestCreateOrder = (fabricToken, title, amount) => {
  return new Promise((resolve, reject) => {
    const reqObject = createRequestObject(title, amount);

    const options = {
      method: "POST",
      url: `${config.baseUrl}/payment/v1/merchant/preOrder`,
      headers: {
        "Content-Type": "application/json",
        "X-APP-Key": config.fabricAppId,
        Authorization: fabricToken,
      },
      rejectUnauthorized: false,
      body: JSON.stringify(reqObject),
    };

    request(options, (error, response) => {
      if (error) return reject(error);
      try {
        resolve(JSON.parse(response.body));
      } catch (err) {
        reject(err);
      }
    });
  });
};

function createRequestObject(title, amount) {
  const req = {
    timestamp: tools.createTimeStamp(),
    nonce_str: tools.createNonceStr(),
    method: "payment.preorder",
    version: "1.0",
  };

  const biz = {
    notify_url: "http://localhost:5000/api/transactions/notify",
    redirect_url: "http://localhost:5173/payment/success",
    appid: config.merchantAppId,
    merch_code: config.merchantCode,
    merch_order_id: Date.now().toString(),
    trade_type: "Checkout",
    title,
    total_amount: amount,
    trans_currency: "ETB",
    timeout_express: "120m",
    business_type: "BuyGoods",
    payee_identifier: config.merchantCode,
    payee_identifier_type: "04",
    payee_type: "5000",
    callback_info: "From web",
  };

  req.biz_content = biz;
  req.sign = tools.signRequestObject(req); 
  req.sign_type = "SHA256WithRSA";
  return req;
}

export const createCheckoutUrl = (prepayId) => {
  const map = {
    appid: config.merchantAppId,
    merch_code: config.merchantCode,
    nonce_str: tools.createNonceStr(),
    prepay_id: prepayId,
    timestamp: tools.createTimeStamp(),
  };
  const sign = tools.signRequestObject(map);

  const rawRequest = [
    `appid=${map.appid}`,
    `merch_code=${map.merch_code}`,
    `nonce_str=${map.nonce_str}`,
    `prepay_id=${map.prepay_id}`,
    `timestamp=${map.timestamp}`,
    `sign=${sign}`,
    `sign_type=SHA256WithRSA`,
  ].join("&");

  return config.webBaseUrl + rawRequest + config.otherParams;
};
