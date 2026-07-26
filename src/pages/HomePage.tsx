import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

import { HomeHeader } from "../components/common/HomeHeader";
import { HomeBottomNav } from "../components/common/HomeBottomNav";
import { UserProfileInfo } from "../components/common/Profile";

import {
  PrivateGroupData,
  VideoFeedItem,
  MOCK_GROUPS,
  MOCK_VIDEOS,
} from "../types/home";

function HomeMainContent() {
  const navigate = useNavigate();

  const [selectedTabId, setSelectedTabId] = useState<number>(0);
  const [feeds, setFeeds] = useState<VideoFeedItem[]>([]);
  const [groups, setGroups] = useState<PrivateGroupData[]>([]);

  useEffect(() => {
    setGroups(MOCK_GROUPS);
    setFeeds(MOCK_VIDEOS);
  }, []);

  // 선택 탭 기반 피드 필터링
  const filteredFeeds =
    selectedTabId === 0
      ? feeds
      : feeds.filter((feed) => feed.group.id === selectedTabId);

  // 현재 선택된 그룹 객체 및 답변 작성 여부 감지
  const currentGroup = groups.find((g) => g.id === selectedTabId);
  const isCurrentGroupAnswered = currentGroup?.isAnsweredToday ?? true;

  const isFeedEmpty = filteredFeeds.length === 0;

  const getGroupIconSrc = (group: PrivateGroupData) => {
    if (group.groupImageUrl) return group.groupImageUrl;
    if (group.name === "가족") return "/src/assets/home/home_img.svg";
    return "/src/assets/home/heart_img.svg";
  };

  return (
    <div className="home-container">
      <div className="home-category-scroll">
        <div className="home-category-item" onClick={() => setSelectedTabId(0)}>
          <div
            className={`home-circle-icon-frame ${
              selectedTabId === 0 ? "tab-active" : ""
            }`}
          >
            <div className="home-circle home-active-circle">V_O</div>
          </div>
          <span className="home-category-name">전체</span>
        </div>

        {groups.map((group) => {
          const isCurrent = selectedTabId === group.id;

          return (
            <div
              key={group.id}
              className="home-category-item"
              onClick={() => setSelectedTabId(group.id)}
            >
              <div
                className={`home-circle-icon-frame ${
                  isCurrent ? "tab-active" : ""
                }`}
              >
                <div className="home-circle home-group-circle">
                  <img
                    src={getGroupIconSrc(group)}
                    alt={group.name}
                    style={{ width: "24px", height: "24px" }}
                    onError={(e) => {
                      e.currentTarget.src = "/src/assets/home/home_img.svg";
                    }}
                  />
                </div>
              </div>
              <span className="home-category-name">{group.name}</span>
            </div>
          );
        })}

        <div className="home-category-item">
          <div className="home-circle-icon-frame">
            <button className="home-add-circle">+</button>
          </div>
          <span className="home-add-name">추가</span>
        </div>
      </div>

      {/* 그룹 질문 유도 배너 (특정 그룹 선택 & 미답변 상태 시 노출) */}
      {selectedTabId !== 0 && !isCurrentGroupAnswered && (
        <div className="home-group-question-banner">
          <img
            src="/src/assets/home/purple_frame.svg"
            alt="배경 배너"
            className="home-banner-svg-bg"
          />

          <div className="home-banner-overlay-content">
            <p className="home-banner-main-text">
              아래 버튼을 눌러
              <br />
              {currentGroup?.name} 그룹 질문을 확인해주세요
            </p>
            <button
              className="home-banner-camera-btn" /*영상촬영 페이지 이동 추가하기*/
            >
              <img
                src="/src/assets/home/video_button.svg"
                alt="카메라 버튼"
                className="home-camera-icon"
              />
            </button>
            <span className="home-banner-sub-badge">10초간 답변하기</span>
          </div>
        </div>
      )}

      {isFeedEmpty ? (
        <div className="home-waiting-content">
          <img
            src="/src/assets/home/character.svg"
            alt="대기 캐릭터"
            className="home-waiting-img"
          />
          <h2 className="home-main-title">오늘의 질문을 기다리는 중이에요</h2>
        </div>
      ) : (
        <div className="home-feed-stream">
          <div className="home-feed-header-line">
            <div className="home-feed-header-left">
              <span className="home-feed-section-title">
                {selectedTabId === 0
                  ? "전체 그룹 답변 피드"
                  : `${currentGroup?.name} 그룹 답변 피드`}
              </span>

              {selectedTabId === 0 && (
                <span className="home-feed-count-badge">
                  {filteredFeeds.length}개
                </span>
              )}
            </div>

            {selectedTabId !== 0 && (
              <button
                className="home-group-setting-btn"
                onClick={() => navigate(`/group/${selectedTabId}`)}
              >
                그룹 설정
              </button>
            )}
          </div>

          {filteredFeeds.map((feed) => {
            // 내가 안 올렸거나 videoUrl이 없으면 영상 블러/잠금 처리
            const isLocked = !isCurrentGroupAnswered;

            const displayName = feed.user.customName || feed.user.nickname;
            return (
              <div key={feed.id} className="home-feed-card">
                <div className="home-card-profile-row">
                  <div
                    onClick={() => navigate(`/edit-nickname/${feed.user.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <UserProfileInfo
                      profileImageUrl={feed.user.profileImageUrl}
                      nickname={displayName}
                      subText={feed.createdAt}
                    />
                  </div>
                  <span className="home-card-group-tag">{feed.group.name}</span>
                </div>

                <div
                  className="home-card-video-viewport"
                  onClick={() => {
                    // 잠기지 않은 영상일 때만 클릭 시 상세 페이지로 이동
                    if (!isLocked) {
                      navigate(`/video/${feed.id}`);
                    }
                  }}
                  style={{ cursor: isLocked ? "default" : "pointer" }}
                >
                  {isLocked ? (
                    <div className="home-video-placeholder-bg">
                      <video
                        src={feed.videoUrl || undefined}
                        poster={feed.thumbnailUrl || undefined}
                        className="home-video-blur-element"
                      />

                      <div className="home-video-lock-overlay">
                        <div className="home-lock-box">
                          <div className="home-lock-icon-wrapper">
                            <img
                              src="/src/assets/home/lock_icon.svg"
                              alt="잠금"
                              className="home-lock-icon"
                            />
                          </div>

                          <p className="home-lock-text">영상이 잠겨 있어요</p>

                          <button
                            className="home-lock-action-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              // 답변 작성 로직
                            }}
                          >
                            지금 답변하기 →
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="home-video-active-player">
                      <video
                        src={feed.videoUrl!}
                        poster={feed.thumbnailUrl || undefined}
                        controls
                        className="home-video-element"
                      />
                    </div>
                  )}
                </div>

                <div className="home-card-reaction-bar">
                  <div className="home-reaction-item">
                    <img src="/src/assets/home/heart_icon.svg" alt="좋아요" />
                    <span>{feed.likesCount}</span>
                  </div>
                  <div className="home-reaction-item">
                    <img src="/src/assets/home/chat_icon.svg" alt="댓글" />
                    <span>{feed.commentsCount}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="home-app-wrapper">
      <div className="home-phone-screen">
        <HomeHeader />

        <main className="home-main-scroll-area">
          <HomeMainContent />
        </main>

        <HomeBottomNav />
      </div>
    </div>
  );
}
