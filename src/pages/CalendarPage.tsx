import { useEffect, useState } from 'react';
import { HomeHeader } from '@/components/common/HomeHeader';
import { HomeBottomNav } from '@/components/common/HomeBottomNav';
import { ArrowButton } from '@/components/common/ArrowButton';
import { useGroupStore } from '@/stores/useGroupStore';
import videoButton from '@/assets/home/video_button.svg';
import logoWhite from '@/assets/logo_white.svg';
import {
  fetchCalendarRecordDates,
  fetchDailyArchives,
  resolveVideoUrl,
  type DailyArchiveRecord,
} from '@/apis/api';

// 전체화면으로 재생 중인 기록 정보
type PlayingRecord = {
  record: DailyArchiveRecord;
  videoUrl: string;
  year: number;
  month: number; // 0-indexed
  selectedDate: string;
};

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed (JS Date 관례)
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // useGroupStore의 currentGroupId는 string이라 숫자로 변환해서 씀.
  // 값이 없으면(그룹 미선택 상태) undefined로 넘겨서 "내가 속한 모든 그룹 통합 조회"가 됨.
  const currentGroupIdRaw = useGroupStore(s => s.currentGroupId);
  const currentGroupId = currentGroupIdRaw ? Number(currentGroupIdRaw) : undefined;

  // 달력 dot 표시용: 이번 달 중 기록이 있는 '일(day)' 목록
  const [recordDays, setRecordDays] = useState<Set<number>>(new Set());
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);
  const [calendarError, setCalendarError] = useState<string | null>(null);

  // 선택한 날짜의 기록 카드들 (같은 날 여러 그룹이면 여러 개)
  const [selectedRecords, setSelectedRecords] = useState<DailyArchiveRecord[] | null>(null);
  const [isDayLoading, setIsDayLoading] = useState(false);
  const [dayError, setDayError] = useState<string | null>(null);

  // 현재 전체화면으로 재생 중인 기록 (없으면 null)
  const [playingRecord, setPlayingRecord] = useState<PlayingRecord | null>(null);

  // 연/월이 바뀔 때마다 이번 달 기록 날짜(dot) 조회
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsCalendarLoading(true);
      setCalendarError(null);
      try {
        const days = await fetchCalendarRecordDates(year, month + 1, currentGroupId);
        if (!cancelled) setRecordDays(new Set(days));
      } catch (err) {
        if (!cancelled) {
          setCalendarError(err instanceof Error ? err.message : '달력 정보를 불러오지 못했어요.');
        }
      } finally {
        if (!cancelled) setIsCalendarLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [year, month, currentGroupId]);

  // 날짜를 선택하면 그날의 기록 카드들을 조회
  useEffect(() => {
    if (!selectedDate) {
      setSelectedRecords(null);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setIsDayLoading(true);
      setDayError(null);
      try {
        const records = await fetchDailyArchives(selectedDate, currentGroupId);
        if (!cancelled) setSelectedRecords(records);
      } catch (err) {
        if (!cancelled) {
          setDayError(err instanceof Error ? err.message : '기록을 불러오지 못했어요.');
        }
      } finally {
        if (!cancelled) setIsDayLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [selectedDate, currentGroupId]);

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDay = (y: number, m: number) => new Date(y, m, 1).getDay();

  const formatDate = (y: number, m: number, d: number) =>
    `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDay(year, month);
  const days = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#ffffff',
      position: 'relative',
    }}>
      <HomeHeader />

      <div style={{ flex: 1, overflowY: 'auto', scrollbarGutter: 'stable', padding: '20px 16px 80px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: 600, marginBottom: '16px', WebkitTextStroke: '0.3px black' }}>나의 달력</h2>

        {calendarError && (
          <p style={{ fontSize: '13px', color: '#FF3B30', marginBottom: '8px' }}>{calendarError}</p>
        )}

        {/* 달력 */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '16px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          border: '1px solid #f0f0f0',
          opacity: isCalendarLoading ? 0.5 : 1,
          transition: 'opacity 0.15s ease',
        }}>
          {/* 월 이동 */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
          }}>
            <ArrowButton direction="left" onClick={prevMonth} />
            <span style={{ fontWeight: 700, fontSize: '16px' }}>{month + 1}월 {year}</span>
            <ArrowButton direction="right" onClick={nextMonth} />
          </div>

          {/* 요일 헤더 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '8px' }}>
            {days.map((d, i) => (
              <span key={d} style={{
                fontSize: '12px',
                fontWeight: 600,
                color: i === 0 ? '#FF3B30' : i === 6 ? '#007AFF' : '#888',
              }}>{d}</span>
            ))}
          </div>

          {/* 날짜 */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', rowGap: '14px' }}>
            {/* biome-ignore lint/suspicious/noArrayIndexKey: 빈 칸은 순서가 바뀌지 않음 */}
            {Array(firstDay).fill(null).map((_, i) => <div key={`empty-${year}-${month}-${i}`} />)}
            {Array(daysInMonth).fill(null).map((_, i) => {
              const day = i + 1;
              const dateStr = formatDate(year, month, day);
              const hasRecord = recordDays.has(day);
              const isSelected = selectedDate === dateStr;
              const isToday = dateStr === formatDate(today.getFullYear(), today.getMonth(), today.getDate());

              return (
                <button
                  key={dateStr}
                  type='button'
                  onClick={() => setSelectedDate(dateStr)}
                  style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', padding: '4px 0' }}
                >
                  <span style={{
                    fontSize: '14px',
                    fontWeight: isToday ? 900 : 500,
                    WebkitTextStroke: isToday ? '0.7px currentColor' : 'none',
                    color: isSelected ? 'white' : 
                        (firstDay + i) % 7 === 0 ? '#FF3B30' :  // 일요일
                        (firstDay + i) % 7 === 6 ? '#007AFF' :  // 토요일
                        '#55545e',
                    background: isSelected ? '#7C3AED' : 'transparent',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>{day}</span>
                  {hasRecord ? (
                    <div style={{ width: '6px', height: '6px', minWidth: '6px', borderRadius: '50%', background: '#7C3AED' }} />
                  ) : (
                    <div style={{ width: '6px', height: '6px', minWidth: '6px' }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 하단 기록 */}
        {selectedDate && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {isDayLoading && (
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                border: '1px solid #f0f0f0',
                textAlign: 'center',
                fontSize: '13px',
                color: '#999',
              }}>
                불러오는 중...
              </div>
            )}

            {dayError && (
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '16px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                border: '1px solid #f0f0f0',
                color: '#FF3B30',
                fontSize: '13px',
              }}>
                {dayError}
              </div>
            )}

            {!isDayLoading && !dayError && selectedRecords && selectedRecords.length > 0 && (
              selectedRecords.map(record => (
                <RecordCard
                  key={record.archiveId}
                  record={record}
                  year={year}
                  month={month}
                  selectedDate={selectedDate}
                  onPlay={(videoUrl) => setPlayingRecord({ record, videoUrl, year, month, selectedDate })}
                />
              ))
            )}

            {!isDayLoading && !dayError && selectedRecords && selectedRecords.length === 0 && (
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '16px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                border: '1px solid #f0f0f0',
              }}>
                <div style={{ textAlign: 'center', padding: '24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    background: '#EDE9FE',
                    borderRadius: '20px',
                    padding: '20px',
                    marginBottom: '16px',
                    width: '170px',
                    height: '120px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <img src="/no_record.svg" alt="기록없음" style={{ width: '120px' }} />
                  </div>
                  <p style={{ fontSize: '16px', fontWeight: 750, marginBottom: '8px' }}>기록이 없어요</p>
                  <p style={{ fontSize: '13px', fontWeight: 500, color: '#999494' }}>이 날엔 아무도 답변을 남기지 않았어요.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <HomeBottomNav />

      {/* 전체화면 비디오 플레이어 오버레이 */}
      {playingRecord && (
        <VideoPlayerOverlay
          playingRecord={playingRecord}
          onClose={() => setPlayingRecord(null)}
        />
      )}
    </div>
  );
}

function VideoPlayerOverlay({
  playingRecord,
  onClose,
}: {
  playingRecord: PlayingRecord;
  onClose: () => void;
}) {
  const { record, videoUrl, year, month, selectedDate } = playingRecord;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#000000',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* 상단바 */}
      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        flexShrink: 0,
      }}>
        <span style={{
          background: 'rgba(123, 63, 242, 0.267)',
          color: '#A78BFA',
          fontSize: '12px',
          fontWeight: 600,
          padding: '4px 12px',
          borderRadius: '20px',
        }}>
          {record.groupName}
        </span>

        <img
          src={logoWhite}
          alt="V_O 로고"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            height: '17px',
            objectFit: 'contain',
          }}
        />

        <button
          type="button"
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '22px',
            lineHeight: 1,
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          ✕
        </button>
      </div>

      {/* 비디오 */}
      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        <video
          src={videoUrl}
          controls
          autoPlay
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000000' }}
        />

        {/* 하단 질문/날짜 오버레이 */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '24px 16px 16px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0))',
          pointerEvents: 'none',
        }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: 600,
            color: '#A78BFA',
            background: 'rgba(123, 63, 242, 0.267)',
            padding: '4px 12px',
            borderRadius: '20px',
            marginBottom: '6px',
          }}>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#A78BFA' }} />
            {year}년 {month + 1}월 {Number(selectedDate.split('-')[2])}일의 기록
          </span>
          <p style={{ fontSize: '17px', fontWeight: 700, color: 'white', margin: 0 }}>
            "{record.questionContent}"
          </p>
        </div>
      </div>
    </div>
  );
}

function RecordCard({
  record,
  year,
  month,
  selectedDate,
  onPlay,
}: {
  record: DailyArchiveRecord;
  year: number;
  month: number;
  selectedDate: string;
  onPlay: (videoUrl: string) => void;
}) {
  const [isResolving, setIsResolving] = useState(false);
  const [playFailed, setPlayFailed] = useState(false);

  const handlePlay = async () => {
    setIsResolving(true);
    setPlayFailed(false);
    const url = await resolveVideoUrl(record.videoId);
    setIsResolving(false);
    if (url) {
      onPlay(url);
    } else {
      setPlayFailed(true);
    }
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '16px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
      border: '1px solid #f0f0f0',
    }}>
      <p style={{ fontSize: '15px', fontWeight: 700, color: '#666262', marginBottom: '4px' }}>
        {year}년 {month + 1}월 {Number(selectedDate.split('-')[2])}일의 기록
      </p>
      <p style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>
        '{record.questionContent}'
      </p>

      <div style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #7B3FF2 0%, #9B62F5 100%)',
        borderRadius: '16px',
        width: '276px',
        height: '150px',
        overflow: 'hidden',
      }}>
        {/* 장식용 원 두 개 (큰 원 8%, 작은 원 5% - 부드럽게 퍼지도록 radial-gradient 처리) */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-40px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 72%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '30px',
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 72%)',
          pointerEvents: 'none',
        }} />

        <button
          type="button"
          onClick={handlePlay}
          disabled={isResolving}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            cursor: isResolving ? 'default' : 'pointer',
            background: record.thumbnailUrl
              ? `url(${record.thumbnailUrl}) center/cover no-repeat`
              : 'transparent',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1px',
          }}
        >
          <span style={{
            zIndex: 1,
            background: '#EDE9FE',
            borderRadius: '20px',
            padding: '2px 14px',
            fontSize: '13px',
            fontWeight: 800,
            color: '#000000',
          }}>
            {record.groupName}
          </span>

          <img
            src={videoButton}
            alt={isResolving ? '불러오는 중' : '재생'}
            style={{ width: '80px', height: '80px', opacity: isResolving ? 0.6 : 1 }}
          />
          {playFailed && (
            <span style={{ color: 'white', fontSize: '12px', background: 'rgba(0,0,0,0.5)', padding: '2px 8px', borderRadius: '10px' }}>
              영상을 불러오지 못했어요
            </span>
          )}
        </button>
      </div>
    </div>
  );
}