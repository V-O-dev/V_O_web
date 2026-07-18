import React, { useState, useRef } from 'react';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button'; 
import defaultProfileImg from '../assets/profile_default.svg'; 
import cameraIcon from '../assets/camera_icon.svg'; 

interface ProfileStepProps {
  onNext: () => void;
  onBack: () => void; // App.tsx로부터 전달받을 뒤로가기 함수
}

export default function ProfileStep({ onNext, onBack }: ProfileStepProps) {
  // 실제 선택된 업로드 이미지 상태 관리 (초기값은 기본 이미지)
  const [profileImage, setProfileImage] = useState<string>(defaultProfileImg);
  
  // 숨겨둔 input[type="file"]을 제어하기 위한 ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 프로필 영역을 클릭했을 때 파일 탐색기 창이 뜨도록 호출하는 함수
  const handleProfileClick = function() {
    fileInputRef.current?.click();
  };

  // 사진을 선택했을 때 실행되는 핸들러 (파서 오류 방지를 위해 표준 함수 형태로 작성)
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      // 이미지를 임시 URL로 변환하여 상태 업데이트
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        boxSizing: 'border-box',
      }}
    >
      {/* 1. 상단 공통 헤더: App.tsx에서 전달받은 온백 함수를 정확히 연동 */}
      <Header showBackButton={true} onBackClick={onBack} />

      {/* 2. 메인 콘텐츠 영역 */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0 24px',
          boxSizing: 'border-box',
        }}
      >
        {/* 보이지 않게 숨겨둔 실제 파일 업로드용 input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          style={{ display: 'none' }} 
        />

        {/* 타이틀 영역: 헤더 하단에서 Margin Top 130.7px */}
        <div style={{ marginTop: '130.7px', textAlign: 'center' }}>
          <h1
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: '20px',
              fontWeight: 500, // 피그마 Medium
              color: '#0F0F0F',
              margin: 0,
              lineHeight: 1.5, // 행간 150%
              whiteSpace: 'nowrap', // 글씨 한 줄 정렬
            }}
          >
            프로필 사진을 선택해주세요
          </h1>
        </div>

        {/* 프로필 이미지 버튼 영역: 타이틀 하단에서 Margin Top 32px */}
        <div
          onClick={handleProfileClick}
          style={{
            marginTop: '32px',
            width: '150px',
            height: '159px', // 카메라 버튼 걸치는 범위까지 고려한 높이
            position: 'relative',
            cursor: 'pointer',
          }}
        >
          {/* 동그라미 프로필 이미지 컨테이너 (정방형 크롭 및 100% 원형 가두기) */}
          <div
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              overflow: 'hidden', // 동그라미 바깥으로 튀어나가는 배경 잘라버리기
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#F1F5F9',
            }}
          >
            <img 
              src={profileImage} 
              alt="프로필 사진" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover', // 사진 비율 깨짐 방지
              }} 
            />
          </div>

          {/* 카메라 아이콘 뒤의 지름 39px짜리 흰색 배경 원 */}
          <div
            style={{
              position: 'absolute',
              right: '0.5px', // 카메라와 정렬 싱크용 미세 조절
              bottom: '9.5px',
              width: '39px',
              height: '39px',
              borderRadius: '50%',
              backgroundColor: '#ffffff', // 뒤의 프로필 사진 선을 가려줄 불투명 하양색 배경
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              zIndex: 1, // 사진 레이어 위로 띄우기
            }}
          >
            {/* 보라색 카메라 아이콘 배치 */}
            <img
              src={cameraIcon}
              alt="카메라 설정"
              style={{
                width: '32px',
                height: '32px',
                cursor: 'pointer',
              }}
            />
          </div>
        </div>

        {/* 서브 타이틀 영역: 이미지 하단에서 Margin Top 32px */}
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <p
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: '14px',
              fontWeight: 400, // 피그마 Regular
              color: '#989898',
              margin: 0,
              lineHeight: 1.5, // 행간 150%
              whiteSpace: 'nowrap', // 글씨 한 줄 정렬
            }}
          >
            당신을 나타내는 사진을 선택해주세요
          </p>
        </div>

        {/* 계속 버튼 영역: 서브 타이틀에서 하단 버튼 그룹까지 Margin Top 180px */}
        <div 
          style={{ 
            marginTop: '180px', 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'center', // 312px 너비 버튼을 화면 가운데로 정렬
            marginBottom: '52px' // 피그마 명세: 버튼 밑 여백 52px 반영
          }}
        >
          {/* 피그마 명세: 버튼 크기 312x48 고정 */}
          <div style={{ width: '312px', height: '48px' }}>
            <Button type="button" onClick={onNext} text="계속">
              <span
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '16px',
                  fontWeight: 500, // 피그마 Medium
                  color: '#FFFFFF',
                  lineHeight: '22.5px',
                }}
              >
                계속
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}