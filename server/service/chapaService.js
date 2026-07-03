import axios from "axios";

const CHAPA_BASE_URL = "https://api.chapa.co/v1";

const getSecretKey = () => {
  const key = process.env.CHAPA_SECRET_KEY;

  if (!key) {
    throw new Error("CHAPA_SECRET_KEY is missing in environment variables");
  }

  return key;
};

export const initializePayment = async (payload) => {
  try {
    const response = await axios.post(
      `${CHAPA_BASE_URL}/transaction/initialize`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${getSecretKey()}`,
          "Content-Type": "application/json",
        },
      }
    );

    const checkoutUrl =
      response.data?.data?.checkout_url ||
      response.data?.checkout_url;

    if (!checkoutUrl) {
      throw new Error("Checkout URL not returned by Chapa");
    }

    return {
      checkoutUrl,
      raw: response.data,
    };
  } catch (error) {
    console.error(
      "CHAPA INIT ERROR:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const verifyPayment = async (txRef) => {
  try {
    const response = await axios.get(
      `${CHAPA_BASE_URL}/transaction/verify/${txRef}`,
      {
        headers: {
          Authorization: `Bearer ${getSecretKey()}`,
        },
      }
    );

    return {
      status: response.data?.data?.status || "failed",
      data: response.data?.data || {},
    };
  } catch (error) {
    console.error(
      "CHAPA VERIFY ERROR:",
      error.response?.data || error.message
    );
    throw error;
  }
};