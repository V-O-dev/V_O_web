import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./FeedPage.css";

import logoImg from "@/assets/logo.png";
import defaultProfile from "@/assets/home/profile.svg";
import heartEmptyIcon from "@/assets/video/heart_empty.svg";
import heartFilledIcon from "@/assets/video/heart_filled.svg";
import commentIcon from "@/assets/video/comment.svg";
import sendIcon from "@/assets/video/send.svg";
import soundOnIcon from "@/assets/video/sound_on.svg";
import soundOffIcon from "@/assets/video/sound_off.svg";

import { VideoDetailData, CommentItem } from "@/types/feed";

import {
  fetchVideoDetailData,
  addVideoReaction,
  removeVideoReaction,
  fetchVideoComments,
  createVideoComment,
  updateVideoComment,
  deleteVideoComment,
  fetchMyProfile,
} from "@/apis/api";

export default function FeedPage() {
  const navigate = useNavigate();
  const { videoId: paramVideoId } = useParams<{ videoId: string }>();
  const location = useLocation();
  const [myProfileImg, setMyProfileImg] = useState<string | null>(null);

  // 이전 페이지(홈 피드 등)에서 넘어온 feedItem 객체가 있다면 활용
  const passedFeed = (
    location.state as { feedItem?: VideoDetailData; videoId?: number }
  )?.feedItem;
  const videoId =
    Number(paramVideoId) ||
    passedFeed?.videoId ||
    (location.state as { videoId?: number })?.videoId ||
    1;

  // 비디오 및 댓글 상태
  const [videoData, setVideoData] = useState<VideoDetailData | null>(
    passedFeed || null
  );
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(!passedFeed);

  // 음소거 상태
  const [isMuted, setIsMuted] = useState(false);

  // 좋아요 상태
  const [isLiked, setIsLiked] = useState<boolean>(
    passedFeed?.reactedByMe ?? passedFeed?.isLiked ?? false
  );
  const [likeCount, setLikeCount] = useState<number>(
    passedFeed?.reactionCount ?? passedFeed?.likeCount ?? 0
  );

  // 댓글 바텀시트 열림 상태
  const [isCommentOpen, setIsCommentOpen] = useState(false);

  // 수정/삭제 모달 대상 댓글
  const [selectedComment, setSelectedComment] = useState<CommentItem | null>(
    null
  );

  // 댓글 입력 및 수정 상태
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);

  // 경과 시간 변환
  const formatTimeAgo = (isoString?: string) => {
    if (!isoString) return "방금 전";
    const now = new Date();
    const past = new Date(isoString);
    const diffMins = Math.floor((now.getTime() - past.getTime()) / (1000 * 60));
    if (diffMins < 1) return "방금 전";
    if (diffMins < 60) return `${diffMins}분 전`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}시간 전`;
    return `${Math.floor(diffHours / 24)}일 전`;
  };

  // 영상 상세 및 댓글 목록 로드
  const loadFeedContent = async () => {
    if (!videoId) return;

    try {
      setLoading(true);

      const [detail, commentRes] = await Promise.all([
        fetchVideoDetailData(videoId).catch(() => null),
        fetchVideoComments(videoId).catch(() => ({
          comments: [],
          hasNext: false,
        })),
      ]);

      if (detail) {
        setVideoData((prev: any) => ({
          ...prev,
          ...detail,
          questionContent: prev?.questionContent || detail?.questionContent,
          nickname: prev?.nickname || detail?.nickname,
          groupName: prev?.groupName || detail?.groupName,
          profileImageUrl: prev?.profileImageUrl || detail?.profileImageUrl,
        }));

        if (detail.reactedByMe !== undefined) setIsLiked(detail.reactedByMe);
        if (detail.reactionCount !== undefined)
          setLikeCount(detail.reactionCount);
      }
      setComments(commentRes.comments || []);
    } catch (error) {
      console.error("피드 데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedContent();
  }, [videoId]);

  useEffect(() => {
    const getMyInfo = async () => {
      try {
        const myData = await fetchMyProfile();
        if (myData?.profileImageUrl) {
          setMyProfileImg(myData.profileImageUrl);
        }
      } catch (error) {
        console.error("내 프로필 정보 불러오기 실패:", error);
      }
    };

    getMyInfo();
  }, []);

  const handleToggleLike = async () => {
    if (!videoId) return;
    try {
      if (isLiked) {
        const res = await removeVideoReaction(videoId);
        setIsLiked(false);
        setLikeCount(res.likeCount);
      } else {
        const res = await addVideoReaction(videoId);
        setIsLiked(true);
        setLikeCount(res.likeCount);
      }
    } catch (error) {
      console.error("좋아요 처리 실패:", error);
    }
  };

  // 내 댓글 클릭 시 모달 열기
  const handleCommentClick = (comment: CommentItem) => {
    if (comment.isMine) {
      setSelectedComment(comment);
    }
  };

  // 댓글 등록/수정
  const handleAddOrUpdateComment = async () => {
    if (!newComment.trim() || !videoId) return;

    try {
      if (editingCommentId) {
        // 댓글 수정 진행
        const updated = await updateVideoComment(editingCommentId, newComment);
        setComments((prev) =>
          prev.map((c) =>
            c.commentId === editingCommentId
              ? { ...c, ...(updated || {}), content: newComment }
              : c
          )
        );
        setEditingCommentId(null);
      } else {
        // 신규 댓글 등록
        const added = await createVideoComment(videoId, newComment);
        if (added) {
          setComments((prev) => [...prev, added]);
        } else {
          // 등록 성공 후 전체 댓글 목록 다시 로드
          loadFeedContent();
        }
      }
      setNewComment("");
    } catch (error) {
      console.error("댓글 작성/수정 실패:", error);
      alert("댓글 처리 중 오류가 발생했습니다.");
    }
  };

  // 수정하기 선택 시 인풋 박스에 텍스트 채우기
  const handleStartEdit = () => {
    if (!selectedComment) return;
    setEditingCommentId(selectedComment.commentId);
    setNewComment(selectedComment.content);
    setSelectedComment(null);
  };

  // 삭제하기
  const handleDeleteComment = async () => {
    if (!selectedComment) return;
    try {
      await deleteVideoComment(selectedComment.commentId);
      setComments((prev) =>
        prev.filter((c) => c.commentId !== selectedComment.commentId)
      );
      console.log("댓글이 삭제되었습니다.");
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
    } finally {
      setSelectedComment(null);
    }
  };

  if (loading && !videoData) {
    return (
      <div
        className="feed-container"
        style={{
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        영상을 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="feed-container">
      <div className="feed-bg-wrapper">
        {videoData?.videoUrl ? (
          <video
            src={videoData.videoUrl}
            poster={videoData.thumbnailUrl || undefined}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="feed-bg-media"
          />
        ) : (
          <div className="feed-bg-media" style={{ background: "#111" }} />
        )}
      </div>

      <header className="feed-header">
        <button
          type="button"
          className="feed-header-btn"
          onClick={() => navigate(-1)}
        >
          ‹
        </button>

        <div className="feed-header-logo-wrapper">
          <img src={logoImg} alt="V_O Logo" className="feed-logo-img" />
        </div>

        <button
          type="button"
          className="feed-header-btn"
          onClick={() => setIsMuted(!isMuted)}
        >
          <img
            src={isMuted ? soundOffIcon : soundOnIcon}
            alt="소리 토글"
            className="header-icon-img"
          />
        </button>
      </header>

      <div className="feed-side-actions">
        <button type="button" className="action-btn" onClick={handleToggleLike}>
          <div className="action-icon-circle">
            <img
              src={isLiked ? heartFilledIcon : heartEmptyIcon}
              alt="좋아요"
            />
          </div>
          <span className="action-count">{likeCount}</span>
        </button>

        <button
          type="button"
          className="action-btn"
          onClick={() => setIsCommentOpen(true)}
        >
          <div className="action-icon-circle">
            <img src={commentIcon} alt="댓글" />
          </div>
          <span className="action-count">{comments.length}</span>
        </button>
      </div>

      <div className="feed-bottom-info">
        <div className="badge-today-question">• 오늘의 질문</div>
        <h2 className="feed-question-title">
          {videoData?.questionContent || "오늘 하루 가장 기억에 남는 순간은?"}
        </h2>

        <div className="feed-author-row">
          <img
            src={videoData?.profileImageUrl || defaultProfile}
            alt={videoData?.nickname || "작성자"}
            className="author-avatar"
            onError={(e) => {
              e.currentTarget.src = defaultProfile;
            }}
          />
          <div className="author-text-info">
            <span className="author-name">
              {videoData?.nickname || "그룹 멤버"}
            </span>
            <span className="author-group">
              {videoData?.groupName || "우리 그룹"} •{" "}
              {formatTimeAgo(videoData?.uploadedAt)}
            </span>
          </div>
        </div>
      </div>

      {isCommentOpen && (
        <div
          className="comment-backdrop"
          onClick={() => setIsCommentOpen(false)}
        >
          <div className="comment-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="comment-header">
              <h3>
                댓글{" "}
                <span className="comment-count-badge">{comments.length}</span>
              </h3>
            </div>

            <div className="comment-list">
              {comments.map((comment) => (
                <div
                  key={comment?.commentId}
                  className={`comment-item ${comment?.isMine ? "is-me" : ""}`}
                  onClick={() => comment && handleCommentClick(comment)}
                >
                  <img
                    src={comment?.writer?.profileImageUrl || defaultProfile}
                    alt={comment?.writer?.nickname || "사용자"}
                    className="comment-avatar"
                    onError={(e) => {
                      e.currentTarget.src = defaultProfile;
                    }}
                  />
                  <div className="comment-content-box">
                    <div className="comment-author-row">
                      <span className="comment-author-name">
                        {comment?.writer?.nickname || "익명"}
                      </span>
                      {comment?.isMine && (
                        <span className="comment-me-tag">나</span>
                      )}
                      <span className="comment-time">
                        {formatTimeAgo(comment?.createdAt)}
                      </span>
                    </div>
                    <p className="comment-text">{comment?.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="comment-input-wrapper">
              <img
                src={myProfileImg || defaultProfile}
                alt="내 프로필"
                className="input-avatar"
                onError={(e) => {
                  e.currentTarget.src = defaultProfile;
                }}
              />
              <div className="input-box">
                <input
                  type="text"
                  placeholder="따뜻한 댓글을 남겨보세요..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleAddOrUpdateComment()
                  }
                />
              </div>
              <button
                type="button"
                className="send-btn"
                onClick={handleAddOrUpdateComment}
              >
                <img src={sendIcon} alt="전송" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 내 댓글 수정/삭제 옵션 */}
      {selectedComment !== null && (
        <div
          className="action-sheet-overlay"
          onClick={() => setSelectedComment(null)}
        >
          <div
            className="action-sheet-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="action-sheet-group">
              <button
                type="button"
                className="action-sheet-btn"
                onClick={handleStartEdit}
              >
                수정하기
              </button>

              <button
                type="button"
                className="action-sheet-btn text-danger"
                onClick={handleDeleteComment}
              >
                삭제하기
              </button>
            </div>

            <button
              type="button"
              className="action-sheet-btn btn-cancel"
              onClick={() => setSelectedComment(null)}
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
