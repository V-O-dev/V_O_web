import { useNavigate } from "react-router-dom";

interface SubPageHeaderProps {
  title: string;
  leftType?: "close" | "back";
  onLeftClick?: () => void;
  onSave?: () => void;
}

export function SubPageHeader({
  title,
  leftType = "back",
  onLeftClick,
  onSave,
}: SubPageHeaderProps) {
  const navigate = useNavigate();

  const handleLeftClick = () => {
    if (onLeftClick) {
      onLeftClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 16px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #f3f4f6",
        position: "sticky",
        top: 0,
        zIndex: 60,
      }}
    >
      <button
        onClick={handleLeftClick}
        style={{
          background: "#FFF",
          border: "1px solid rgba(0, 0, 0, 0.06)",
          width: 36,
          height: 36,
          borderRadius: 12,
          fontSize: 22,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#111827",
          fontWeight: 300,
          boxShadow: "0px 2px 8px 0 rgba(0, 0, 0, 0.06)",
          padding: 0,
          lineHeight: 1,
        }}
      >
        {leftType === "close" ? "✕" : "‹"}
      </button>

      <h1
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: "#111013",
          margin: 0,
        }}
      >
        {title}
      </h1>

      {onSave ? (
        <button
          onClick={onSave}
          style={{
            background: "none",
            border: "none",
            fontSize: 16,
            fontWeight: 600,
            color: "#8f8f8f",
            cursor: "pointer",
          }}
        >
          저장
        </button>
      ) : (
        <div style={{ width: 36 }} />
      )}
    </header>
  );
}
