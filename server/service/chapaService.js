import axios from "axios";

const CHAPA_BASE_URL = "https://api.chapa.co/v1";

export const initializePayment = async (payload) => {
  const secretKey = process.env.CHAPA_SECRET_KEY;

  const response = await axios.post(
    `${CHAPA_BASE_URL}/transaction/initialize`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
    }
  );

  return {
    checkoutUrl: response.data?.data?.checkout_url,
    raw: response.data,
  };
};

export const verifyPayment = async (txRef) => {
  const secretKey = process.env.CHAPA_SECRET_KEY;

  const response = await axios.get(
    `${CHAPA_BASE_URL}/transaction/verify/${txRef}`,
    {
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    }
  );

  return {
    status: response.data?.data?.status || "failed",
    data: response.data?.data || {},
  };
};