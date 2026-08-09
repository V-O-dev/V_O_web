import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuthStore();

  useEffect(() => {
    // 1. URL 쿼리 스트링에서 토큰 및 신규 유저 여부 추출
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const isNewUser = searchParams.get("isNewUser");

    if (accessToken) {
      // 2. 로컬 스토리지 및 Zustand 스토어 저장
      localStorage.setItem("accessToken", accessToken);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      login({ nickname: "", phoneNumber: "" }, accessToken, refreshToken || undefined);

      // 3. 신규 유저 여부에 따른 이동 경로 분기
      if (isNewUser === "true") {
        navigate("/signup/profile", { replace: true });
      } else {
        navigate("/group/create", { replace: true });
      }
    } else {
      alert("로그인 처리 중 오류가 발생했습니다.");
      navigate("/login", { replace: true });
    }
  }, [searchParams, navigate, login]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <p>로그인 처리 중입니다...</p>
    </div>
  );
}