import profileIcon from "@/assets/home/profile.svg";

interface UserProfileInfoProps {
  profileImageUrl?: string | null;
  nickname: string;
  subText?: string;
}

export function UserProfileInfo({
  profileImageUrl,
  nickname,
  subText,
}: UserProfileInfoProps) {
  const defaultImage = profileIcon;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <img
          src={profileImageUrl || defaultImage}
          alt={nickname}
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "12px",
            objectFit: "cover",
          }}
          onError={(e) => {
            e.currentTarget.src = defaultImage;
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              fontWeight: 800,
              color: "#111827",
            }}
          >
            {nickname}
          </span>
          {subText && (
            <span
              style={{
                fontSize: "11px",
                color: "#9491a8",
                fontWeight: 500,
              }}
            >
              {subText}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
