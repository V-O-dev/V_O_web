import { useState } from 'react';
import { HomeHeader } from '@/components/common/HomeHeader';
import { HomeBottomNav } from '@/components/common/HomeBottomNav';
import { ArrowButton } from '@/components/common/ArrowButton';

// 더미 데이터
const dummyRecords: Record<string, { question: string; group: string }> = {
  '2026-05-05': { question: '오늘의 OOTD는?', group: '가족그룹' },
  '2026-05-06': { question: '오늘의 질문은?', group: '가족그룹' },
  '2026-05-13': { question: '오늘 기분은?', group: '가족그룹' },
  '2026-05-20': { question: '오늘 뭐 먹었어?', group: '가족그룹' },
  '2026-07-21': { question: '오늘 날씨는?', group: '가족그룹' },
  '2026-07-24': { question: '오늘 하루는?', group: '가족그룹' },
};

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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

  const selectedRecord = selectedDate ? dummyRecords[selectedDate] : null;

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

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px 80px' }}>
        <h2 style={{ fontSize: '26px', fontWeight: 600, marginBottom: '16px', WebkitTextStroke: '0.3px black' }}>나의 달력</h2>

        {/* 달력 */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '16px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          border: '1px solid #f0f0f0',
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
              const hasRecord = !!dummyRecords[dateStr];
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
                    fontWeight: isToday ? 700 : 500,
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
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '16px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            border: '1px solid #f0f0f0',
            }}>
                
            {selectedRecord ? (
              <>
                <p style={{ fontSize: '15px', fontWeight: 800, color: '#666262', marginBottom: '4px' }}>
                  {year}년 {month + 1}월 {Number(selectedDate.split('-')[2])}일의 기록
                </p>
                <p style={{ fontSize: '18px', fontWeight: 900, marginBottom: '16px' }}>
                  '{selectedRecord.question}'
                </p>
                <div style={{
                  background: 'var(--color-5)',
                  borderRadius: '16px',
                  height: '180px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}>
                  <span style={{ background: 'white', borderRadius: '20px', padding: '4px 12px', fontSize: '13px', fontWeight: 600, color: 'var(--color-5)' }}>
                    {selectedRecord.group}
                  </span>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: 'white', fontSize: '16px' }}>▶</span>
                  </div>
                </div>
              </>
            ) : (
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
                    <p style={{ fontSize: '16px', fontWeight: 800, marginBottom: '8px' }}>기록이 없어요</p>
                    <p style={{ fontSize: '13px', fontWeight: 800, color: '#999494' }}>이 날엔 아무도 답변을 남기지 않았어요.</p>
                    </div>
                )}
          </div>
        )}
      </div>

      <HomeBottomNav />
    </div>
  );
}