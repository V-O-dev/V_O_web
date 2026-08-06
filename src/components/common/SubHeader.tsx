import { useNavigate } from "react-router-dom";

interface SubPageHeaderProps {
  title: string;
  leftType?: "close" | "back";
  onLeftClick?: () => void;
  onSave?: () => void;
  rightText?: string;
  onRightClick?: () => void;
}

export function SubPageHeader({
  title,
  leftType = "back",
  onLeftClick,
  onSave,
  rightText,
  onRightClick,
}: SubPageHeaderProps) {
  const navigate = useNavigate();

  const handleLeftClick = () => {
    if (onLeftClick) {
      onLeftClick();
    } else {
      navigate(-1);
    }
  };

  // 우측 버튼 클릭 동작 (onRightClick이 없으면 기존 onSave 사용)
  const handleRightClick = onRightClick || onSave;

  // 우측 버튼 표기 텍스트 (rightText가 없으면 onSave가 있을 때 "저장" 표시)
  const displayText = rightText || (onSave ? "저장" : "");

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
        position: "relative",
        zIndex: 200,
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

      {displayText ? (
        <button
          type="button"
          onClick={handleRightClick}
          style={{
            background: "none",
            border: "none",
            fontSize: 14,
            fontWeight: 600,
            color: "#6b7280",
            cursor: "pointer",
            padding: 0,
            whiteSpace: "nowrap",
          }}
        >
          {displayText}
        </button>
      ) : (
        <div style={{ width: 36 }} />
      )}
    </header>
  );
}
