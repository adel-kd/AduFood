const config = {
    baseUrl: "https://developerportal.ethiotelebirr.et:38443/apiaccess/payment/gateway",
    fabricAppId: process.env.TELEBIRR_FABRIC_APPID,
    appSecret: process.env.TELEBIRR_APP_SECRET,
    merchantAppId: process.env.TELEBIRR_MERCHANT_APPID,
    merchantCode: process.env.TELEBIRR_MERCHANT_CODE,
    privateKey: process.env.TELEBIRR_PRIVATE_KEY, // optional if using in signing
    webBaseUrl: "https://developerportal.ethiotelebirr.et:38443/payment/web/paygate?",
    otherParams: "&version=1.0&trade_type=Checkout",
    notifyUrl: process.env.TELEBIRR_NOTIFY_URL || "https://yourdomain.com/payment/notify",
    redirectUrl: process.env.TELEBIRR_REDIRECT_URL || "https://yourdomain.com/payment/redirect"
  };
  
  export default config;
  