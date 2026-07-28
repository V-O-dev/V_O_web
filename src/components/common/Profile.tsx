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
        gap: 12,
      }}
    >
      <img
        src={profileImageUrl || defaultImage}
        alt={nickname}
        style={{
          width: 36,
          height: 36,
          borderRadius: 12,
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
          gap: 2,
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 800,
            color: "#11013",
          }}
        >
          {nickname}
        </span>
        {subText && (
          <span
            style={{
              fontSize: 8,
              color: "#9491a8",
              fontWeight: 500,
            }}
          >
            {subText}
          </span>
        )}
      </div>
    </div>
  );
}
