import axios from "axios";

const apiClient = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:8000/"
      : "https://e-commerce-back-i2e8.onrender.com/",
  headers: {
    "Content-type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    if (localStorage.getItem("userInfo"))
      config.headers.authorization = `Bearer ${
        JSON.parse(localStorage.getItem("userInfo")!).token
      }`;
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default apiClient;
