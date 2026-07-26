import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore";

export const axiosInstance = axios.create({
  baseURL: "...", //백엔드 서버 주소
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (
      config.url?.includes("/auth/oauth/login") ||
      config.url?.includes("/auth/token/refresh")
    ) {
      return config;
    }

    const token =
      useAuthStore.getState().token || localStorage.getItem("accessToken");

    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        alert("세션이 만료되었습니다. 다시 로그인해 주세요.");

        useAuthStore.getState().logout();
      } else if (status === 500) {
        alert("서버 내부 에러가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      }
    }
    return Promise.reject(error);
  }
);
