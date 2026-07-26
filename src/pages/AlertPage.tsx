import React, { useState, useEffect } from "react";
import "./AlertPage.css";
import { SubPageHeader } from "../components/common/SubHeader";

import { AppNotification, MOCK_NOTIFICATIONS } from "@/types/notification";

const AlertPage: React.FC = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    setNotifications(MOCK_NOTIFICATIONS);
  }, []);

  // 디테일한 시간 텍스트 변환 및 섹션 타이틀 결정 함수
  const getTimeInfo = (isoString: string) => {
    const now = new Date();
    const past = new Date(isoString);
    const diffMs = now.getTime() - past.getTime();

    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return { section: "오늘", timeText: "방금 전" };
    if (diffMins < 60) return { section: "오늘", timeText: `${diffMins}분 전` };
    if (diffHours < 24 && now.getDate() === past.getDate()) {
      return { section: "오늘", timeText: `${diffHours}시간 전` };
    }

    if (
      diffDays === 1 ||
      (diffHours < 48 && now.getDate() !== past.getDate())
    ) {
      return { section: "어제", timeText: "어제" };
    }

    if (diffDays < 7)
      return { section: `${diffDays}일 전`, timeText: `${diffDays}일 전` };

    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks < 4)
      return { section: `${diffWeeks}주 전`, timeText: `${diffWeeks}주 전` };

    const diffMonths =
      (now.getFullYear() - past.getFullYear()) * 12 +
      (now.getMonth() - past.getMonth());
    if (diffMonths < 12) {
      return {
        section: `${diffMonths || 1}개월 전`,
        timeText: `${diffMonths || 1}개월 전`,
      };
    }

    const diffYears = now.getFullYear() - past.getFullYear();
    return { section: `${diffYears}년 전`, timeText: `${diffYears}년 전` };
  };

  // 시간대 섹션별로 데이터 그룹화 처리
  const getGroupedNotifications = () => {
    const groups: { [key: string]: AppNotification[] } = {};

    const sorted = [...notifications].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    sorted.forEach((item) => {
      const { section } = getTimeInfo(item.createdAt);
      if (!groups[section]) {
        groups[section] = [];
      }
      groups[section].push(item);
    });

    return groups;
  };

  const groupedData = getGroupedNotifications();

  const renderCard = (item: AppNotification) => {
    const { timeText } = getTimeInfo(item.createdAt);
    const isReaction = item.notificationType === "REACTION";

    return (
      <div
        key={item.id}
        className={`noti-card ${item.isRead ? "read" : "unread"}`}
      >
        <div className="noti-avatar-container">
          <div className={"noti-profile-img-container"}>
            <img
              src="/src/assets/home/profile.svg"
              alt={item.actor.nickname}
              className="noti-avatar-img"
              onError={(e) => {
                e.currentTarget.src = "/src/assets/home/profile.svg";
              }}
            />
          </div>
          <span className="noti-badge">
            <img
              src={
                isReaction
                  ? "/src/assets/alert/heart_colorIcon.svg"
                  : "/src/assets/alert/chat_colorIcon.svg"
              }
              alt={isReaction ? "하트" : "댓글"}
              className="noti-badge-img"
            />
          </span>
        </div>

        <div className="noti-content-area">
          <div className="noti-text-main">
            <span className="noti-sender">{item.actor.nickname}</span>
            {isReaction ? (
              <span className="noti-action-phrase">
                님이 내 오늘 미디어 기록에 하트를 보냈습니다
              </span>
            ) : (
              <span className="noti-action-phrase">님이 댓글을 남겼습니다</span>
            )}
          </div>

          {/* 댓글 알림일 경우에만 본문 문구 노출 */}
          {!isReaction && <p className="noti-comment-body">'{item.body}'</p>}

          <span className="noti-time">
            {timeText} - {item.group.name}
          </span>
        </div>

        {item.video && (
          <button className="noti-video-btn">
            <img
              src="/src/assets/alert/video_icon.svg"
              alt="비디오 보기"
              className="noti-video-icon-img"
            />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="noti-page-wrapper">
      <SubPageHeader title="알림" leftType="back" />

      <main className="noti-main-content">
        {Object.keys(groupedData).map((sectionTitle) => (
          <section key={sectionTitle} className="noti-section">
            <h2 className="noti-section-title">{sectionTitle}</h2>
            <div className="noti-card-group">
              {groupedData[sectionTitle].map(renderCard)}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
};

export default AlertPage;
