import { useNavigate } from "react-router-dom";

export function HomeBottomNav() {
  const navigate = useNavigate();

  return (
    <nav
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        width: "100%",
        maxWidth: "360px",
        height: "66px",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 50,
        margin: "0 auto",
        flexShrink: 0,
        backgroundColor: "#ffffff",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "100px",
          width: "100%",
          backgroundColor: "#ffffff",
        }}
      >
        <button
          type="button"
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "24px",
              height: "24px",
            }}
          >
            <img
              src="src/asset/home/home_button.svg"
              alt="홈"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
          <span
            style={{
              color: "#7b3ff2",
              fontSize: "12px",
              fontWeight: 600,
              lineHeight: "16.5px",
            }}
          >
            홈
          </span>
        </button>

        <button
          type="button"
          // 달력 페이지로 넘어가는 경로 추가
          style={{
            background: "none",
            border: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "4px",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "24px",
              height: "24px",
            }}
          >
            <img
              src="src/asset/home/calender_button.svg"
              alt="나의 달력"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
          <span
            style={{
              color: "#9491a8",
              fontSize: "12px",
              lineHeight: "16.5px",
              fontWeight: 600,
            }}
          >
            나의 달력
          </span>
        </button>
      </div>
    </nav>
  );
}
