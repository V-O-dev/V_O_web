import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { HomeHeader } from "../components/common/HomeHeader";
import { HomeBottomNav } from "../components/common/HomeBottomNav";
import { useGroupStore } from "@/stores/useGroupStore";

import { PrivateGroupData, VideoFeedItem } from "../types/home";
import { fetchMyGroups, fetchGroupFeed, fetchDailyQuestion } from "../apis/api";

import "./HomePage.css";

import purpleFrame from "@/assets/home/purple_frame.svg";
import videoButton from "@/assets/home/video_button.svg";
import character from "@/assets/home/character.svg";
import lockIcon from "@/assets/home/lock_icon.svg";
import heartIcon from "@/assets/home/heart_icon.svg";
import chatIcon from "@/assets/home/chat_icon.svg";
import playIcon from "@/assets/home/play_icon.svg";
import homeImg from "@/assets/home/home_img.svg";
import profileIcon from "@/assets/home/profile.svg";

function HomeMainContent() {
  const navigate = useNavigate();

  const [selectedTabId, setSelectedTabId] = useState<number>(0);
  const [groups, setGroups] = useState<PrivateGroupData[]>([]);

  const [feeds, setFeeds] = useState<VideoFeedItem[]>([]);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(true);
  const [viewerStatus, setViewerStatus] = useState<string>("UPLOADED");
  const [dailyQuestion, setDailyQuestion] = useState<any>(null);

  const setCurrentGroupId = useGroupStore((state) => state.setCurrentGroupId);

  // 초기 내 그룹 목록 조회
  useEffect(() => {
    const getGroups = async () => {
      try {
        const data = await fetchMyGroups();
        setGroups(data);
      } catch (error) {
        console.error("그룹 목록 불러오기 실패:", error);
      }
    };
    getGroups();
  }, []);

  // 선택된 그룹 탭을 전역 store(currentGroupId)에도 동기화
  // -> QuestionPage 등 다른 화면에서 groupId를 참조할 때 이 값을 사용함
  useEffect(() => {
    if (selectedTabId !== 0) {
      setCurrentGroupId(String(selectedTabId));
    }
  }, [selectedTabId, setCurrentGroupId]);

  // selectedTabId 변경 시 피드 및 오늘의 질문 함께 조회
  useEffect(() => {
    const getData = async () => {
      try {
        if (selectedTabId === 0) {
          // 전체 탭
          if (groups.length > 0) {
            const allFeedResults = await Promise.all(
              groups.map((g) =>
                fetchGroupFeed(g.groupId).catch((err) => ({
                  items: err?.response?.data?.items || [],
                  unlocked: false,
                  viewerAnswerStatus: "NOT_UPLOADED",
                }))
              )
            );

            const combinedItems: VideoFeedItem[] = [];
            allFeedResults.forEach((res: any, idx) => {
              const targetGroup = groups[idx];

              // 해당 그룹의 잠금 여부 및 답변 상태
              const groupUnlocked = res.unlocked ?? false;
              const groupViewerStatus =
                res.viewerAnswerStatus ?? "NOT_UPLOADED";

              (res.items || []).forEach((item: any) => {
                combinedItems.push({
                  ...item,
                  groupId: targetGroup?.groupId,
                  groupName: targetGroup?.name || "그룹",
                  // 각 피드 아이템별로 속한 그룹의 잠금 상태를 가지고 있게 함
                  isLocked: !(
                    groupUnlocked && groupViewerStatus !== "NOT_UPLOADED"
                  ),
                });
              });
            });

            setFeeds(combinedItems);
            // 전체 탭 자체의 글로벌 상단 질문 배너용 상태값 (필요 시 세팅)
            setIsUnlocked(true);
            setViewerStatus("UPLOADED");
            setDailyQuestion(null);
          }
        } else {
          // 특정 그룹 탭
          const [feedData, questionData] = await Promise.all([
            fetchGroupFeed(selectedTabId).catch((err) => ({
              // API 에러 시에도 응답 데이터 안에 items가 있다면 보존
              items: err?.response?.data?.items || [],
              unlocked: false,
              viewerAnswerStatus: "NOT_UPLOADED",
            })),
            fetchDailyQuestion(selectedTabId).catch(() => null),
          ]);

          const currentGName =
            groups.find((g) => g.groupId === selectedTabId)?.name || "그룹";
          const itemsWithGName = (feedData.items || []).map((item: any) => ({
            ...item,
            groupId: item.groupId || selectedTabId,
            groupName: currentGName,
          }));

          setFeeds(itemsWithGName);
          setIsUnlocked(feedData.unlocked ?? false);
          setViewerStatus(feedData.viewerAnswerStatus ?? "NOT_UPLOADED");
          setDailyQuestion(questionData);
        }
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      }
    };

    getData();
  }, [selectedTabId, groups]);

  // 현재 선택된 그룹 데이터 객체 찾기
  const currentGroup = groups.find((g) => g.groupId === selectedTabId);

  // 답변 완료 여부
  const isCurrentGroupAnswered = isUnlocked && viewerStatus !== "NOT_UPLOADED";

  // 보라색 상단 카메라 배너 노출 조건: 특정 그룹 탭 + 내가 아직 답변 안함
  const showQuestionBanner = selectedTabId !== 0 && !isCurrentGroupAnswered;

  // 대기 화면 노출 조건: 특정 그룹 탭이면서 질문도 없고 피드도 아예 단 1개도 없는 진짜 빈 상태일 때만!
  const showWaitingContent =
    selectedTabId !== 0 && dailyQuestion === null && feeds.length === 0;

  const formatTimeAgo = (isoString?: string) => {
    if (!isoString) return "방금 전";
    const now = new Date();
    // 서버가 주는 timestamp에 타임존 정보(Z, +09:00 등)가 없으면
    // JS가 이걸 "로컬 시간대 기준"이라고 잘못 해석해버려서 9시간(KST 오프셋)만큼
    // 어긋나는 문제가 있었음. 타임존 표시가 없으면 UTC라고 명시해줌.
    const hasTimezone = /Z$|[+-]\d{2}:?\d{2}$/.test(isoString);
    const normalizedIsoString = hasTimezone ? isoString : `${isoString}Z`;
    const past = new Date(normalizedIsoString);
    const diffMins = Math.floor((now.getTime() - past.getTime()) / (1000 * 60));
    if (diffMins < 1) return "방금 전";
    if (diffMins < 60) return `${diffMins}분 전`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}시간 전`;
    return `${Math.floor(diffHours / 24)}일 전`;
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
            <div className="home-circle">V_O</div>
          </div>
          <span className="home-category-name">전체</span>
        </div>

        {groups.map((group) => {
          const isCurrent = selectedTabId === group.groupId;

          return (
            <div
              key={group.groupId}
              className="home-category-item"
              onClick={() => setSelectedTabId(group.groupId)}
            >
              <div
                className={`home-circle-icon-frame ${
                  isCurrent ? "tab-active" : ""
                }`}
              >
                <div className="home-circle home-group-circle">
                  <img
                    src={group.imageUrl}
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

      {/* 보라 프레임(답변을 아직 안 올렸을 경우) */}
      {showQuestionBanner && (
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

      {showWaitingContent ? (
        // 질문이 아직 없는 경우
        <div className="home-waiting-content">
          <img src={character} alt="대기 캐릭터" className="home-waiting-img" />
          <h2 className="home-main-title">오늘의 질문을 기다리는 중이에요</h2>
        </div>
      ) : (
        // 질문이 존재해서 답변 피드 목록이 있는 경우
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

          {feeds.map((feed) => {
            const isLocked =
              selectedTabId === 0
                ? feed.isLocked ?? false
                : !isCurrentGroupAnswered;
            const displayName = feed.displayName || feed.alias || feed.nickname;

            // 피드 자체에 질문이 들어있거나 오늘 배정된 질문 텍스트 가져오기
            const questionText =
              feed.questionContent ||
              dailyQuestion?.content ||
              dailyQuestion?.questionContent;

            return (
              <div key={feed.videoId} className="home-feed-card">
                <div
                  className="home-card-profile-row"
                  onClick={() => {
                    const gId =
                      feed.groupId ||
                      (selectedTabId !== 0 ? selectedTabId : undefined);
                    const mId = feed.memberId || feed.userId;

                    if (gId && mId && feed.isMe !== true) {
                      navigate(`/group/${gId}/member/${mId}/edit-nickname`, {
                        state: {
                          member: {
                            ...feed,
                            memberId: mId,
                          },
                        },
                      });
                    }
                  }}
                  style={{ cursor: feed.isMe === true ? "default" : "pointer" }}
                >
                  <img
                    src={feed.profileImageUrl || profileIcon}
                    alt={displayName}
                    className="home-profile-img"
                    onError={(e) => {
                      e.currentTarget.src = profileIcon;
                    }}
                  />

                  <div className="home-profile-text-box">
                    <div className="home-profile-name-row">
                      <span className="home-profile-nickname">
                        {displayName}
                      </span>
                      <span className="home-card-group-tag">
                        {feed.groupName || currentGroup?.name || "그룹"}
                      </span>
                    </div>
                    <span className="home-profile-time">
                      {formatTimeAgo(feed.uploadedAt || feed.capturedAt)}
                    </span>
                  </div>
                </div>

                {!isLocked && questionText && (
                  <div className="home-feed-question-box">
                    <span className="home-question-q">Q</span>
                    <span className="home-question-text">{questionText}</span>
                  </div>
                )}

                <div
                  className={`home-card-video-viewport ${
                    !isLocked ? "unlocked" : ""
                  }`}
                  onClick={() => {
                    if (!isLocked) {
                      navigate("/feed", {
                        state: {
                          videoId: feed.videoId,
                          feedItem: {
                            ...feed,
                            groupName:
                              feed.groupName ||
                              currentGroup?.name ||
                              "우리 그룹",
                          },
                        },
                      });
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
                        src={feed.videoUrl}
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
                    <span>{feed.reactionCount}</span>
                  </div>
                  <div className="home-reaction-item">
                    <img
                      src={chatIcon}
                      alt="댓글"
                      className="home-reaction-icon"
                    />
                    <span>{feed.commentCount}</span>
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
