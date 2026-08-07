import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { HomeHeader } from "../components/common/HomeHeader";
import { HomeBottomNav } from "../components/common/HomeBottomNav";
import { UserProfileInfo } from "../components/common/Profile";

import {
  PrivateGroupData,
  VideoFeedItem,
  MOCK_GROUPS,
  MOCK_VIDEOS,
} from "../types/home";

import "./HomePage.css";

import purpleFrame from "@/assets/home/purple_frame.svg";
import videoButton from "@/assets/home/video_button.svg";
import character from "@/assets/home/character.svg";
import lockIcon from "@/assets/home/lock_icon.svg";
import heartIcon from "@/assets/home/heart_icon.svg";
import chatIcon from "@/assets/home/chat_icon.svg";
import playIcon from "@/assets/home/play_icon.svg";
import homeImg from "@/assets/home/home_img.svg";

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

  return (
    <div className="home-container">
      <div className="home-category-scroll">
        <div className="home-category-item" onClick={() => setSelectedTabId(0)}>
          <div
            className={`home-circle-icon-frame ${
              selectedTabId === 0 ? "tab-active" : ""
            }`}
          >
            <div className="home-circle">V_O</div>
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
                    src={group.groupImageUrl}
                    alt={group.name}
                    className="home-group-img"
                    onError={(e) => {
                      e.currentTarget.src = homeImg;
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
            <button
              className="home-add-circle"
              onClick={() => navigate("/group/create")}
            >
              +
            </button>
          </div>
          <span className="home-category-name">추가</span>
        </div>
      </div>

      {selectedTabId !== 0 && !isCurrentGroupAnswered && (
        <div className="home-group-question-banner">
          <img
            src={purpleFrame}
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
              className="home-banner-camera-btn"
              onClick={() => navigate("/splash")}
            >
              <img
                src={videoButton}
                alt="카메라 버튼"
                className="home-camera-icon"
              />
            </button>
            <span className="home-banner-sub-badge">10초간 답변하기</span>
          </div>
        </div>
      )}

      {/* 피드 빈 상태 / 피드 목록 분기 처리 */}
      {isFeedEmpty ? (
        <div className="home-waiting-content">
          <img src={character} alt="대기 캐릭터" className="home-waiting-img" />
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
                  className={`home-card-video-viewport ${
                    !isLocked ? "unlocked" : ""
                  }`}
                  onClick={() => {
                    if (!isLocked) {
                      navigate("/feed");
                    }
                  }}
                >
                  {isLocked ? (
                    <div className="home-video-container">
                      <video
                        src={feed.videoUrl || undefined}
                        poster={feed.thumbnailUrl || undefined}
                        className="home-video-blur-element"
                      />

                      <div className="home-video-lock-overlay">
                        <div className="home-lock-box">
                          <div className="home-lock-icon-wrapper">
                            <img
                              src={lockIcon}
                              alt="잠금"
                              className="home-lock-icon"
                            />
                          </div>

                          <p className="home-lock-text">영상이 잠겨 있어요</p>

                          <button
                            className="home-lock-action-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("/splash");
                            }}
                          >
                            지금 답변하기 →
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="home-video-container">
                      <video
                        src={feed.videoUrl!}
                        poster={feed.thumbnailUrl || undefined}
                        className="home-video-element"
                      />

                      <div className="home-play-overlay">
                        <img
                          src={playIcon}
                          alt="재생"
                          className="home-play-icon"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="home-card-reaction-bar">
                  <div className="home-reaction-item">
                    <img
                      src={heartIcon}
                      alt="좋아요"
                      className="home-reaction-icon"
                    />
                    <span>{feed.likesCount}</span>
                  </div>
                  <div className="home-reaction-item">
                    <img
                      src={chatIcon}
                      alt="댓글"
                      className="home-reaction-icon"
                    />
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
