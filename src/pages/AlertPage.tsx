import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AlertPage.css";
import { SubPageHeader } from "../components/common/SubHeader";

import { AppNotification } from "@/types/notification";
import { fetchNotifications, markNotificationAsRead } from "@/apis/api";

import profileIcon from "@/assets/home/profile.svg";
import heartColorIcon from "@/assets/alert/heart_colorIcon.svg";
import chatColorIcon from "@/assets/alert/chat_colorIcon.svg";
import videoIcon from "@/assets/alert/video_icon.svg";

const AlertPage: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // 실제 백엔드 알림 목록 조회
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await fetchNotifications();
        setNotifications(data.notifications || []);
      } catch (error) {
        console.error("알림 목록을 불러오는 데 실패했습니다:", error);
        setNotifications([]); // 실패 시 빈 배열로 안전 처리
      }
    };

    loadNotifications();
  }, []);

  // 알림 클릭 시 읽음 처리 API 호출 + 관련 비디오 피드로 이동
  const handleNotificationClick = async (item: AppNotification) => {
    if (!item.isRead) {
      try {
        await markNotificationAsRead(item.notificationId);
        setNotifications((prev) =>
          prev.map((n) =>
            n.notificationId === item.notificationId
              ? { ...n, isRead: true }
              : n
          )
        );
      } catch (error) {
        console.error("알림 읽음 처리 실패:", error);
      }
    }

    if (item.relatedVideoId) {
      navigate("/feed");
    }
  };

  // 날짜 문자열 시간으로 변환 함수
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

  // 시간대 섹션별 알림 데이터 그룹화
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
    const isReaction = item.type === "REACTION";

    return (
      <div
        key={item.notificationId}
        className={`noti-card ${item.isRead ? "read" : "unread"}`}
        onClick={() => handleNotificationClick(item)}
        style={{ cursor: "pointer" }}
      >
        <div className="noti-avatar-container">
          <div className="noti-profile-img-container">
            <img
              src={profileIcon}
              alt="프로필"
              className="noti-avatar-img"
              onError={(e) => {
                e.currentTarget.src = profileIcon;
              }}
            />
          </div>
          <span className="noti-badge">
            <img
              src={isReaction ? heartColorIcon : chatColorIcon}
              alt={isReaction ? "하트" : "댓글"}
              className="noti-badge-img"
            />
          </span>
        </div>

        <div className="noti-content-area">
          <div className="noti-text-main">
            <span className="noti-action-phrase">{item.content}</span>
          </div>

          <span className="noti-time">
            {timeText} - {item.groupName}
          </span>
        </div>

        {item.relatedVideoId && (
          <button className="noti-video-btn">
            <img
              src={videoIcon}
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
        {Object.keys(groupedData).length === 0
          ? null
          : Object.keys(groupedData).map((sectionTitle) => (
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
