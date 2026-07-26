import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';

// 에셋 임포트
import addPhotoIcon from '../assets/add_photo_icon.svg';
import cameraBadgeIcon from '../assets/camera_badge_icon.svg';
import clearInputIcon from '../assets/clear_input_icon.svg';
import errorInfoIcon from '../assets/error_info_icon.svg';

// 빠른 선택 이모지 에셋 (PNG 파일)
import quickHome from '../assets/quick_home.png'; 
import quickHeart from '../assets/quick_heart.png';
import quickHandshake from '../assets/quick_handshake.png';
import quickSparkles from '../assets/quick_sparkles.png';

export default function GroupNamePage() {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // 특수문자 검증 (한글, 영문, 숫자, 공백만 허용)
  const hasSpecialChar = /[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\s]/.test(groupName);
  const isLengthError = groupName.length > 15;
  const isError = hasSpecialChar || isLengthError;

  const isButtonEnabled = groupName.trim().length > 0 && !isError;

  // 텍스트 지우기
  const handleClear = () => {
    setGroupName('');
  };

  // 프로필 이미지 업로드
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  // 다음 단계 이동
  const handleNext = () => {
    if (!isButtonEnabled) return;
    navigate('/group/theme', { state: { groupName, groupImage: selectedImage } });
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

      {/* 2. 메인 컨텐츠 영역 */}
      <div style={{
        position: 'absolute',
        top: '83.3px',
        left: '25px',
        width: '310px',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box'
      }}>

        {/* 메인 타이틀 */}
        <h1 style={{
          fontFamily: 'Manrope, sans-serif',
          fontWeight: 600,
          fontSize: '20px',
          lineHeight: '30px',
          color: '#0F0F0F',
          margin: '32px 0 0 0',
          letterSpacing: '0px',
          textAlign: 'left',
          whiteSpace: 'nowrap'
        }}>
          그룹 이름과 사진을 설정해주세요
        </h1>

        {/* 서브 타이틀 */}
        <p style={{
          fontFamily: 'Manrope, sans-serif',
          fontWeight: 500,
          fontSize: '13px',
          lineHeight: '19.5px',
          color: '#9491A8',
          margin: '4px 0 0 0',
          letterSpacing: '0px',
          textAlign: 'left'
        }}>
          언제든지 바꿀 수 있어요
        </p>

        {/* 3. 그룹 설정 카드 (310px x 140px) */}
        <div style={{
          marginTop: '28px',
          width: '310px',
          height: '140px',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '16px',
          boxSizing: 'border-box',
          border: '1.5px solid #A870FF',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
          
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            
            {/* 프로필 사진 영역 */}
            <label style={{
              position: 'relative',
              width: '67.6px',
              height: '67.6px',
              cursor: 'pointer',
              flexShrink: 0
            }}>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                style={{ display: 'none' }} 
              />
              <div style={{
                width: '67.6px',
                height: '67.6px',
                borderRadius: '20px',
                border: selectedImage ? 'none' : '1.5px dashed #A870FF',
                backgroundColor: '#F8F6FE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                boxSizing: 'border-box'
              }}>
                {selectedImage ? (
                  <img 
                    src={selectedImage} 
                    alt="그룹 프로필" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                  <img src={addPhotoIcon} alt="사진 추가" style={{ width: '24px', height: '24px' }} />
                )}
              </div>

              {/* 카메라 배지 아이콘 (배경색 제거, SVG 단독 노출) */}
              <img 
                src={cameraBadgeIcon} 
                alt="카메라" 
                style={{ 
                  position: 'absolute',
                  bottom: '-10px',
                  right: '-10px',
                  width: '40px', 
                  height: '40px', 
                  zIndex: 2,
                  display: 'block'
                }} 
              />
            </label>

            {/* 입력 폼 영역 */}
            <div style={{ marginLeft: '14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              
              <span style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 600,
                fontSize: '12px',
                lineHeight: '16.5px',
                letterSpacing: '0.4px',
                color: '#7B3FF2',
                display: 'block',
                marginBottom: '2px'
              }}>
                그룹 이름
              </span>

              {/* 입력 영역 및 우측 삭제/카운터 레이아웃 */}
              <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                width: '100%'
              }}>
                {/* 160px 너비 밑줄 입력창 */}
                <div style={{
                  position: 'relative',
                  width: '160px',
                  borderBottom: '1.5px solid #000000',
                  paddingBottom: '2px'
                }}>
                  <textarea 
                    rows={2}
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="이름을 입력해주세요"
                    style={{
                      width: '100%',
                      height: '42px',
                      border: 'none',
                      outline: 'none',
                      resize: 'none',
                      padding: 0,
                      margin: 0,
                      fontFamily: 'Manrope, sans-serif',
                      fontWeight: 600,
                      fontSize: '16px',
                      lineHeight: '21px',
                      color: '#260C36',
                      backgroundColor: 'transparent',
                      boxSizing: 'border-box',
                      overflow: 'hidden'
                    }}
                  />
                </div>

                {/* X버튼(상시 노출) & 0/15 카운터 */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '2px',
                  marginBottom: '2px',
                  marginRight: '4px'
                }}>
                  <button 
                    onClick={handleClear}
                    type="button"
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <img src={clearInputIcon} alt="삭제" style={{ width: '22px', height: '22px' }} />
                  </button>

                  <span style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontWeight: 700,
                    fontSize: '11px',
                    lineHeight: '14px',
                    color: isError ? '#FF3B30' : '#C4C1D4'
                  }}>
                    {groupName.length}/15
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* 에러 경고 문구 */}
          {isError && (
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '16px',
              right: '16px',
              height: '28px',
              backgroundColor: '#FFF1F0',
              borderRadius: '10px',
              padding: '0 10px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxSizing: 'border-box'
            }}>
              <img src={errorInfoIcon} alt="경고" style={{ width: '14px', height: '14px' }} />
              <span style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 500,
                fontSize: '12px',
                color: '#FF3B30'
              }}>
                {hasSpecialChar ? '특수문자는 사용할 수 없어요' : '15자 이하로 입력해주세요'}
              </span>
            </div>
          )}

        </div>

        {/* 4. 빠른 선택 영역 */}
        <span style={{
          fontFamily: 'Manrope, sans-serif',
          fontWeight: 600,
          fontSize: '12px',
          lineHeight: '16.5px',
          letterSpacing: '0.5px',
          color: '#9491A8',
          marginTop: '20px',
          textAlign: 'left'
        }}>
          빠른 선택
        </span>

        {/* 빠른 선택 이모지 버튼 그룹 */}
        <div style={{
          marginTop: '10px',
          display: 'flex',
          gap: '0px'
        }}>
          {[
            { icon: quickHome, key: 'home' },
            { icon: quickHeart, key: 'heart' },
            { icon: quickHandshake, key: 'handshake' },
            { icon: quickSparkles, key: 'sparkles' }
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setSelectedImage(item.icon)}
              style={{
                width: '56px',
                height: '56px',
                border: selectedImage === item.icon ? '2px dashed #7B3FF2' : 'none',
                borderRadius: '18px',
                backgroundColor: 'transparent',
                padding: 0,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
                overflow: 'hidden',
                flexShrink: 0
              }}
            >
              <img 
                src={item.icon} 
                alt="빠른 선택 이모지" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  display: 'block'
                }} 
              />
            </button>
          ))}
        </div>

      </div>

      {/* 5. 하단 계속 버튼 */}
      <div style={{
        position: 'absolute',
        bottom: '94px', 
        left: '50%',
        transform: 'translateX(-50%)',
        width: '310px',
        height: '48px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxSizing: 'border-box'
      }}>
        <button
          type="button"
          onClick={handleNext}
          disabled={!isButtonEnabled}
          style={{
            border: 'none',
            background: isButtonEnabled ? '#7B3FF2' : '#C3ACFF', 
            fontFamily: 'Manrope, sans-serif',
            fontSize: '16px',
            fontWeight: 600, 
            lineHeight: '22px', 
            color: '#ffffff', 
            width: '310px',
            height: '48px',
            borderRadius: '16px', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: isButtonEnabled ? 'pointer' : 'not-allowed',
            transition: 'all 0.15s ease'
          }}
        >
          계속
        </button>
      </div>

      {/* 6. 바닥 여백 영역 */}
      <div style={{ position: 'absolute', bottom: 0, height: '94px', width: '100%' }} />

    </div> 
  );
}