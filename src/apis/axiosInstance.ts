import axios from "axios";
import { useAuthStore } from "../stores/useAuthStore";

export const axiosInstance = axios.create({
  baseURL: "https://54.206.52.35.nip.io", // 백엔드 서버 주소
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. Request Interceptor: 요청 보낼 때 토큰 자동 주입
axiosInstance.interceptors.request.use(
  (config) => {
    // 토큰이 필요 없는 인증/로그인 관련 API 요청은 헤더 주입 제외
    if (
      config.url?.includes("/auth/oauth") ||
      config.url?.includes("/auth/token/refresh") ||
      config.url?.includes("/auth/login")
    ) {
      return config;
    }

    // Zustand 스토어 또는 LocalStorage에서 accessToken 가져오기
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

// 2. Response Interceptor: 에러 응답(401, 500 등) 공통 처리
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const status = error.response.status;

      // 401 Unauthorized (인증 에러 / 토큰 만료)
      if (status === 401) {
        alert("세션이 만료되었습니다. 다시 로그인해 주세요.");

        // 로컬스토리지 정리 및 Zustand 상태 초기화
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        useAuthStore.getState().logout();

        // 로그인 페이지로 이동
        window.location.href = "/login";
      } else if (status === 500) {
        alert("서버 내부 에러가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      }
    }
    return Promise.reject(error);
  }
);