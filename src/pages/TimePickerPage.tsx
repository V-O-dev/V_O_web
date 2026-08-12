import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';

// Swiper CSS 로드
import 'swiper/css';

const HOURS = Array.from({ length: 24 }, (_, i) => {
  return `${String(i).padStart(2, '0')}:00`;
});

export default function TimePickerPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🎯 기본값을 00:00 ~ 00:00 으로 변경
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('00:00');

  // 🎯 시간 설정 후 백엔드 요청 없이 다음 단계인 GroupNamePage로 이동
  const handleNext = () => {
    let finalEndTime = endTime;

    // 🎯 시작 시간과 종료 시간이 같다면 (24시간 선택), 종료 시간에서 1분을 빼서 백엔드 오류 방지
    // 예: 00:00 ~ 00:00 -> 00:00 ~ 23:59 / 01:00 ~ 01:00 -> 01:00 ~ 00:59
    if (startTime === endTime) {
      const startHour = parseInt(startTime.split(':')[0], 10);
      const adjustedHour = startHour === 0 ? 23 : startHour - 1;
      finalEndTime = `${String(adjustedHour).padStart(2, '0')}:59`;
    }

    console.log('설정된 시간대:', startTime, '~', finalEndTime);

    navigate('/group/name', { 
      state: { 
        ...location.state, 
        notificationStartTime: startTime, 
        notificationEndTime: finalEndTime,
        startTime,
        endTime: finalEndTime
      } 
    }); 
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      width: '100%',
      maxWidth: '360px', 
      height: '800px',   
      margin: '0 auto',  
      boxSizing: 'border-box',
      position: 'relative', 
      overflow: 'hidden'
    }}>
      
      {/* 1. 공통 헤더 */}
      <Header />

      {/* 2. 타이틀 영역 */}
      <div style={{ 
        position: 'absolute',
        top: '95.3px', 
        left: '32px', 
        textAlign: 'left', 
        width: '296px', 
        boxSizing: 'border-box'
      }}>
        <h1 style={{ 
          fontFamily: 'Manrope, sans-serif',
          fontSize: '20px', 
          fontWeight: 500, 
          color: '#000000', 
          margin: '0 0 2px 0', 
          lineHeight: '150%', 
          letterSpacing: '0em' 
        }}>
          질문 받을 시간대를 설정해주세요
        </h1>
        <p style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: '14px',
          fontWeight: 400,
          color: '#989898', 
          margin: 0,
          lineHeight: '150%'
        }}>
          설정한 시간에 질문이 도착해요
        </p>
      </div>

      {/* 3. 시간 선택 휠 영역 */}
      <div style={{
        position: 'absolute',
        top: '248.3px', 
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px', 
        width: '312px',
        height: '250px', 
        boxSizing: 'border-box',
      }}>
        
        {/* 시작 시간 '부터' 휠 */}
        <div style={{ width: '112px', height: '100%', position: 'relative' }}>
          <Swiper
            direction="vertical"
            slidesPerView={5}
            centeredSlides={true}
            loop={true}
            initialSlide={0} // 🎯 00:00 위치로 설정
            onSlideChange={(swiper) => {
              const realIndex = swiper.realIndex;
              setStartTime(HOURS[realIndex]);
            }}
            style={{ width: '100%', height: '100%' }}
          >
            {HOURS.map((hour, idx) => (
              <SwiperSlide key={`start-${idx}`}>
                {({ isActive, isPrev, isNext }) => {
                  const isHighlighted = isActive;
                  const isSemiHighlighted = isPrev || isNext;
                  return (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '50px',
                      fontSize: isHighlighted ? '24px' : '20px',
                      fontFamily: 'Manrope, sans-serif',
                      fontWeight: isHighlighted ? 600 : 400,
                      color: isHighlighted ? '#7E49E9' : isSemiHighlighted ? '#989898' : '#EAEAEA',
                      backgroundColor: isHighlighted ? '#F3EFFF' : 'transparent',
                      borderRadius: isHighlighted ? '12px' : '0px',
                      lineHeight: isHighlighted ? '36px' : 'normal',
                      transition: 'all 0.2s ease',
                      userSelect: 'none'
                    }}>
                      {hour}
                    </div>
                  );
                }}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* '부터' 텍스트 */}
        <span style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: '12px',
          fontWeight: 600,
          color: '#000000',
          userSelect: 'none',
          whiteSpace: 'nowrap'
        }}>
          부터
        </span>

        {/* 종료 시간 '까지' 휠 */}
        <div style={{ width: '112px', height: '100%', position: 'relative' }}>
          <Swiper
            direction="vertical"
            slidesPerView={5}
            centeredSlides={true}
            loop={true}
            initialSlide={0} // 🎯 00:00 위치로 설정
            onSlideChange={(swiper) => {
              const realIndex = swiper.realIndex;
              setEndTime(HOURS[realIndex]);
            }}
            style={{ width: '100%', height: '100%' }}
          >
            {HOURS.map((hour, idx) => (
              <SwiperSlide key={`end-${idx}`}>
                {({ isActive, isPrev, isNext }) => {
                  const isHighlighted = isActive;
                  const isSemiHighlighted = isPrev || isNext;
                  return (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '50px',
                      fontSize: isHighlighted ? '24px' : '20px',
                      fontFamily: 'Manrope, sans-serif',
                      fontWeight: isHighlighted ? 600 : 400,
                      color: isHighlighted ? '#7E49E9' : isSemiHighlighted ? '#989898' : '#EAEAEA',
                      backgroundColor: isHighlighted ? '#F3EFFF' : 'transparent',
                      borderRadius: isHighlighted ? '12px' : '0px',
                      lineHeight: isHighlighted ? '36px' : 'normal',
                      transition: 'all 0.2s ease',
                      userSelect: 'none'
                    }}>
                      {hour}
                    </div>
                  );
                }}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* '까지' 텍스트 */}
        <span style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: '12px',
          fontWeight: 600,
          color: '#000000',
          userSelect: 'none',
          whiteSpace: 'nowrap'
        }}>
          까지
        </span>

      </div>

      {/* 4. 하단 버튼 영역 */}
      <div style={{
        position: 'absolute',
        bottom: '94px', 
        left: '50%',
        transform: 'translateX(-50%)',
        width: '312px',
        height: '48px', 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxSizing: 'border-box',
      }}>
        <div style={{ width: '312px' }}>
          <Button 
            text="계속" 
            onClick={handleNext} 
            style={{ width: '312px', height: '48px' }} 
          />
        </div>
      </div>

      {/* 5. 바닥 여백 영역 */}
      <div style={{ position: 'absolute', bottom: 0, height: '94px', width: '100%' }} />

    </div>
  );
}