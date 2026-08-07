// src/apis/api.ts
//
// 기준 문서: "나의 달력(아카이브) API" + "영상 API" 스웨거
//   - GET  /api/v1/archives/daily     : 일자별 기록 조회 (그룹별 카드 배열)
//   - GET  /api/v1/archives/calendar  : 월별 기록 있는 날짜(dot) 조회
//   - POST /api/v1/videos             : 영상 업로드
//   - GET  /api/v1/videos/{videoId}   : 영상 상세(재생 URL 포함) 조회
//
// 인증/에러 처리(401 로그아웃, baseURL 등)는 이미 axiosInstance에서 처리하고 있어서
// 여기서는 axiosInstance만 가져다 씁니다.
//
// TODO: 프로젝트의 실제 axiosInstance 위치에 맞게 이 import 경로를 수정하세요.
import { axiosInstance } from '@/apis/axiosInstance';

// 공통 응답 포맷 (스웨거 예시 기준)
interface ApiEnvelope<T> {
  success: boolean;
  code: string;
  message: string;
  data: T | null;
  errors: { field: string; value: string; reason: string }[] | null;
  timestamp: string;
}

// axios는 2xx가 아니면 자동으로 reject하고, axiosInstance 인터셉터가 401/500을 처리합니다.
// 여기서는 success:false (200인데 실패)인 경우만 별도로 걸러서 에러로 던져줍니다.
function unwrap<T>(envelope: ApiEnvelope<T>): T {
  if (!envelope.success) {
    throw new Error(envelope.message || '요청이 실패했어요.');
  }
  return envelope.data as T;
}

// ── /api/v1/archives/daily ──────────────────────────────────────

export interface DailyArchiveRecord {
  archiveId: number;
  recordDate: string;      // 'YYYY-MM-DD'
  questionContent: string;
  groupName: string;
  groupTheme: string;      // 예: 'FAMILY'
  videoId: number;
  thumbnailUrl: string;
}

interface DailyArchivesResponse {
  records: DailyArchiveRecord[];
}

/**
 * 특정 날짜의 기록 카드들을 가져옵니다. (같은 날 여러 그룹 기록이 있으면 배열로 옴)
 * groupId를 생략하면 내가 속한 모든 그룹을 통합 조회합니다.
 */
export async function fetchDailyArchives(
  date: string,          // 'YYYY-MM-DD'
  groupId?: number,
): Promise<DailyArchiveRecord[]> {
  const res = await axiosInstance.get<ApiEnvelope<DailyArchivesResponse>>(
    '/api/v1/archives/daily',
    { params: { date, groupId } },
  );
  return unwrap(res.data).records;
}

// ── /api/v1/archives/calendar ───────────────────────────────────

interface CalendarResponse {
  year: number;
  month: number;
  recordDates: number[]; // 기록이 있는 '일(day)' 숫자 목록. 예: [1, 3, 7]
}

/**
 * 해당 연/월에 기록이 있는 날짜 목록(dot 표시용)을 가져옵니다.
 * groupId를 생략하면 내가 속한 모든 그룹을 통합 조회합니다.
 */
export async function fetchCalendarRecordDates(
  year: number,
  month: number,          // 1~12
  groupId?: number,
): Promise<number[]> {
  const res = await axiosInstance.get<ApiEnvelope<CalendarResponse>>(
    '/api/v1/archives/calendar',
    { params: { year, month, groupId } },
  );
  return unwrap(res.data).recordDates;
}

// ── /api/v1/videos (업로드 + 상세 조회) ──────────────────────────

export type CameraFacing = 'FRONT' | 'BACK';

export interface VideoUploadMetadata {
  groupId: number;
  questionId: number;
  durationMs: number;
  width: number;
  height: number;
  cameraFacing: CameraFacing;
  capturedAt: string; // ISO 8601
}

export interface VideoDetail {
  videoId: number;
  groupId: number;
  questionId: number;
  videoUrl: string;
  thumbnailUrl: string;
  durationMs: number;
  uploadedAt: string;
}

/**
 * 오늘의 질문에 대한 답변 영상을 업로드합니다.
 */
export async function uploadVideo(
  videoBlob: Blob,
  metadata: VideoUploadMetadata,
): Promise<VideoDetail> {
  const formData = new FormData();
  formData.append('video', videoBlob, `video-${Date.now()}.mp4`);
  formData.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], { type: 'application/json' }),
  );

  const res = await axiosInstance.post<ApiEnvelope<VideoDetail>>(
    '/api/v1/videos',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );

  return unwrap(res.data);
}

/**
 * 답변 영상 상세 정보(재생 URL 포함)를 조회합니다.
 */
export async function fetchVideoDetail(videoId: number): Promise<VideoDetail> {
  const res = await axiosInstance.get<ApiEnvelope<VideoDetail>>(
    `/api/v1/videos/${videoId}`,
  );
  return unwrap(res.data);
}

/**
 * CalendarPage에서 재생 버튼을 눌렀을 때 사용하는 헬퍼.
 * 실패하면 null을 반환해서 화면에서 썸네일만 노출하도록 함.
 */
export async function resolveVideoUrl(videoId: number): Promise<string | null> {
  try {
    const detail = await fetchVideoDetail(videoId);
    return detail.videoUrl;
  } catch {
    return null;
  }
}
