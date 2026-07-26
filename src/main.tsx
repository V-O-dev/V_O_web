import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "@fontsource/manrope"; //manrope 글씨체 추가
import "pretendard/dist/web/static/pretendard.css"; //pretendard 글씨체 추가

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
