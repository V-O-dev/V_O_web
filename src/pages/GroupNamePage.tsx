import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { axiosInstance } from '../apis/axiosInstance';

// 에셋 임포트
import addPhotoIcon from '../assets/add_photo_icon.svg';
import cameraBadgeIcon from '../assets/camera_badge_icon.svg';
import clearInputIcon from '../assets/clear_input_icon.svg';
import errorInfoIcon from '../assets/error_info_icon.svg';

// 빠른 선택 이모지 에셋
import quickHome from '../assets/quick_home.png'; 
import quickHeart from '../assets/quick_heart.png';
import quickHandshake from '../assets/quick_handshake.png';
import quickSparkles from '../assets/quick_sparkles.png';

export default function GroupNamePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [groupName, setGroupName] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // 🎯 백엔드 유효성 검사 규칙과 동일하게 적용 (완성형 한글, 영문, 숫자, 공백만 허용 / 단독 자음·모음 거부)
  const isInvalidName = /[^a-zA-Z0-9가-힣\s]/.test(groupName);
  const isLengthError = groupName.length > 15;
  const isError = isInvalidName || isLengthError;

  const isButtonEnabled = groupName.trim().length > 0 && !isError && !isSubmitting;

  const handleClear = () => {
    setGroupName('');
    inputRef.current?.focus();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleQuickSelect = (iconUrl: string) => {
    setSelectedImage(iconUrl);
    setImageFile(null);
  };

  // 🎯 [계속] 클릭 시 그룹 생성 API 전송 후 /home으로 직접 이동
  const handleNext = async () => {
    if (!isButtonEnabled) return;

    try {
      setIsSubmitting(true);

      const themeCode = location.state?.themeCode || location.state?.groupThemeCode || location.state?.code || 'FAMILY';
      let startTime = location.state?.notificationStartTime || location.state?.startTime || '20:00';
      let endTime = location.state?.notificationEndTime || location.state?.endTime || '21:00';

      const cleanGroupName = groupName.trim();

      const formData = new FormData();
      formData.append('groupName', cleanGroupName);
      formData.append('themeCode', themeCode);
      formData.append('notificationStartTime', startTime);
      formData.append('notificationEndTime', endTime);

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const token = localStorage.getItem('accessToken');

      const response = await axiosInstance.post('/api/v1/groups', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
      });

      const resData = response.data?.data;
      const createdGroupId = resData?.groupId || resData?.group?.groupId;

      console.log('그룹 생성 성공! groupId:', createdGroupId);

      // 🎯 성공 즉시 /home 경로로 직접 이동
      navigate('/home', {
        state: {
          ...location.state,
          groupId: createdGroupId,
          groupName: cleanGroupName,
          groupImage: selectedImage,
        }
      });

    } catch (error: any) {
      console.error('그룹 생성 실패 백엔드 응답 전체:', error.response?.data);
      const serverData = error.response?.data;
      let alertMsg = '그룹 생성 중 오류가 발생했습니다.';

      if (serverData?.errors && Array.isArray(serverData.errors) && serverData.errors.length > 0) {
        const firstErr = serverData.errors[0];
        alertMsg = `[필드 오류: ${firstErr.field || '알수없음'}]\n원인: ${firstErr.reason || firstErr.message}`;
      } else if (serverData?.message) {
        alertMsg = serverData.message;
      }

      alert(`그룹 생성 실패:\n${alertMsg}`);
    } finally {
      setIsSubmitting(false);
    }
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
        top: '95.3px',
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
          margin: 0,
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

        {/* 3. 그룹 설정 카드 */}
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
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover', 
                      borderRadius: '20px', 
                      transform: 'scale(1.35)', 
                      display: 'block' 
                    }} 
                  />
                ) : (
                  <img src={addPhotoIcon} alt="사진 추가" style={{ width: '24px', height: '24px' }} />
                )}
              </div>

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
            <div style={{ marginLeft: '14px', flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              
              <span style={{
                fontFamily: 'Manrope, sans-serif',
                fontWeight: 600,
                fontSize: '12px',
                lineHeight: '16.5px',
                letterSpacing: '0.4px',
                color: '#7B3FF2',
                display: 'block',
                marginTop: '2px',
                marginBottom: '2px'
              }}>
                그룹 이름
              </span>

              {/* 입력창 + 우측 X버튼/카운터 레이아웃 */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                marginTop: '4px',
                gap: '8px'
              }}>
                <div 
                  onClick={() => inputRef.current?.focus()}
                  style={{ 
                    position: 'relative', 
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'text',
                    borderBottom: '1.5px solid #000000',
                    paddingBottom: '2px',
                    minWidth: 0
                  }}
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={isFocused || groupName ? "" : "이름을 입력해주세요"}
                    style={{
                      fontFamily: 'Manrope, sans-serif',
                      fontSize: '15px',
                      fontWeight: '600',
                      color: '#260C36',
                      textAlign: 'left',
                      border: 'none',
                      outline: 'none',
                      caretColor: '#7B3FF2',
                      width: '100%',
                      padding: 0,
                      backgroundColor: 'transparent',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* X버튼 & 0/15 카운터 */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2px',
                  flexShrink: 0
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
                {isInvalidName ? '특수문자 및 자음/모음은 사용할 수 없어요' : '15자 이하로 입력해주세요'}
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

        <div style={{
          marginTop: '10px',
          display: 'flex',
          gap: '8px'
        }}>
          {[
            { icon: quickHome, key: 'home' },
            { icon: quickHeart, key: 'heart' },
            { icon: quickHandshake, key: 'handshake' },
            { icon: quickSparkles, key: 'sparkles' }
          ].map((item) => {
            const isSelected = selectedImage === item.icon;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleQuickSelect(item.icon)}
                style={{
                  width: '56px',
                  height: '56px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '20px',
                  padding: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxSizing: 'border-box',
                  overflow: 'hidden',
                  flexShrink: 0,
                  outline: isSelected ? '2px solid #7B3FF2' : 'none',
                  outlineOffset: '2px',
                  transition: 'outline 0.15s ease'
                }}
              >
                <img 
                  src={item.icon} 
                  alt="빠른 선택 이모지" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    transform: 'scale(1.35)', 
                    borderRadius: '20px',
                    display: 'block'
                  }} 
                />
              </button>
            );
          })}
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