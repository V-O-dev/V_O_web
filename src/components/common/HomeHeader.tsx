import { useNavigate } from "react-router-dom";

export function HomeHeader() {
  const navigate = useNavigate();
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "52px",
        padding: "0 20px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #eaeaea",
        flexShrink: 0,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <h1 style={{ margin: 0, display: "flex", alignItems: "center" }}>
        <img
          src="/logo.png"
          alt="V_O 로고"
          style={{
            height: "17px",
            objectFit: "contain",
          }}
        />
      </h1>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          type="button"
          onClick={() => navigate("/alert")}
          style={{
            background: "#ffffff",
            border: "0.833px solid rgba(0, 0, 0, 0.06)",
            cursor: "pointer",
            padding: 0,
            width: "28px",
            height: "28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "12px",
            boxShadow: "0 2px 8px 0 rgba(0, 0, 0, 0.06)",
          }}
        >
          <img
            src="/notification.svg"
            alt="알림"
            style={{ width: "12px", height: "12px", objectFit: "contain" }}
          />
        </button>
        <button
          type="button"
          onClick={() => navigate("/profile")}
          style={{
            width: "26px",
            height: "26px",
            borderRadius: "50%",
            overflow: "hidden",
            border: "none",
            cursor: "pointer",
            padding: 0,
            backgroundColor: "#f3f4f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="/profile.svg"
            alt="프로필"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </button>
      </div>
    </header>
  );
}
