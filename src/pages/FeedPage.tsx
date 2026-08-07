import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FeedPage.css";

import logoImg from "@/assets/logo.png";
import defaultProfile from "@/assets/home/profile.svg";
import heartEmptyIcon from "@/assets/video/heart_empty.svg";
import heartFilledIcon from "@/assets/video/heart_filled.svg";
import commentIcon from "@/assets/video/comment.svg";
import sendIcon from "@/assets/video/send.svg";
import soundOnIcon from "@/assets/video/sound_on.svg";
import soundOffIcon from "@/assets/video/sound_on.svg";

interface Comment {
  id: number;
  author: string;
  isMe?: boolean;
  timeAgo: string;
  content: string;
  isPinned?: boolean;
  profileImg?: string;
}

interface FeedAuthorInfo {
  name: string;
  groupName: string;
  createdAt: string;
  profileImageUrl: string;
}

export default function FeedPage() {
  const navigate = useNavigate();

  // 소리 토글 상태
  const [isMuted, setIsMuted] = useState(false);

  // 좋아요 상태 및 개수
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(12);

  // 댓글 바텀시트 열림 상태
  const [isCommentOpen, setIsCommentOpen] = useState(false);

  // 수정/삭제 모달 대상 댓글 ID
  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(
    null
  );

  // 댓글 입력값
  const [newComment, setNewComment] = useState("");

  const [authorInfo] = useState<FeedAuthorInfo>({
    name: "나",
    groupName: "가족 그룹",
    createdAt: "방금 전",
    profileImageUrl: defaultProfile,
  });

  const questionTitle = "오늘 하루 가장 기억에 남는 순간은?";

  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: "아빠",
      timeAgo: "2분 전",
      content: "허허허 오늘 하루 정말 좋아 보이는구나 😃",
      isPinned: true,
    },
    {
      id: 2,
      author: "남동생",
      timeAgo: "4분 전",
      content: "ㅋㅋㅋ",
    },
    {
      id: 3,
      author: "나",
      isMe: true,
      timeAgo: "5분 전",
      content: "오늘 정말 좋았어",
    },
    {
      id: 4,
      author: "엄마",
      timeAgo: "6분 전",
      content: "딸 예쁘다~~",
    },
  ]);

  // 좋아요 토글
  const handleToggleLike = () => {
    if (isLiked) {
      setLikeCount((prev) => prev - 1);
      setIsLiked(false);
    } else {
      setLikeCount((prev) => prev + 1);
      setIsLiked(true);
    }
  };

  // 본인 댓글 클릭 시 수정/삭제 모달 열기
  const handleCommentClick = (comment: Comment) => {
    if (comment.isMe) {
      setSelectedCommentId(comment.id);
    }
  };

  // 댓글 삭제 실행
  const handleDeleteComment = () => {
    if (selectedCommentId !== null) {
      setComments((prev) => prev.filter((c) => c.id !== selectedCommentId));
      setSelectedCommentId(null);
    }
  };

  // 새로운 댓글 등록
  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const newEntry: Comment = {
      id: Date.now(),
      author: "나",
      isMe: true,
      timeAgo: "방금 전",
      content: newComment,
    };
    setComments((prev) => [...prev, newEntry]);
    setNewComment("");
  };

  return (
    <div className="feed-container">
      <div className="feed-bg-wrapper">
        <img src="null" alt="피드 배경" className="feed-bg-media" />
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
        <h2 className="feed-question-title">{questionTitle}</h2>

        <div className="feed-author-row">
          <img
            src={authorInfo.profileImageUrl}
            alt={authorInfo.name}
            className="author-avatar"
          />
          <div className="author-text-info">
            <span className="author-name">{authorInfo.name}</span>
            <span className="author-group">
              {authorInfo.groupName} • {authorInfo.createdAt}
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
                  key={comment.id}
                  className={`comment-item ${comment.isMe ? "is-me" : ""}`}
                  onClick={() => handleCommentClick(comment)}
                >
                  <img
                    src={comment.profileImg || defaultProfile}
                    alt={comment.author}
                    className="comment-avatar"
                  />
                  <div className="comment-content-box">
                    <div className="comment-author-row">
                      <span className="comment-author-name">
                        {comment.author}
                      </span>
                      {comment.isMe && (
                        <span className="comment-me-tag">나</span>
                      )}
                      <span className="comment-time">{comment.timeAgo}</span>
                    </div>
                    <p className="comment-text">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="comment-input-wrapper">
              <img
                src={defaultProfile}
                alt="내 프로필"
                className="input-avatar"
              />
              <div className="input-box">
                <input
                  type="text"
                  placeholder="따뜻한 댓글을 남겨보세요..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                />
              </div>
              <button
                type="button"
                className="send-btn"
                onClick={handleAddComment}
              >
                <img src={sendIcon} alt="전송" />
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedCommentId !== null && (
        <div
          className="action-sheet-overlay"
          onClick={() => setSelectedCommentId(null)}
        >
          <div
            className="action-sheet-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="action-sheet-group">
              <button
                type="button"
                className="action-sheet-btn"
                onClick={() => {
                  alert("수정하기 기능 연결");
                  setSelectedCommentId(null);
                }}
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
              onClick={() => setSelectedCommentId(null)}
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
