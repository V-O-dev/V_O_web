import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button'; 
import defaultProfileImg from '../assets/profile_default.svg'; 
import cameraIcon from '../assets/camera_icon.svg'; 
import { useAuthStore } from '../stores/useAuthStore'; // 🎯 스토어 추가

interface ProfileStepProps {
  onNext?: () => void;
  onBack?: () => void;
}

export default function ProfileStep({ onNext, onBack }: ProfileStepProps) {
  const navigate = useNavigate();
  const setSignupProfile = useAuthStore((state) => state.setSignupProfile); // 🎯 스토어 함수 가져오기
  const signupProfileImage = useAuthStore((state) => state.signupProgress.profileImage);

  const [profileImage, setProfileImage] = useState<string>(signupProfileImage || defaultProfileImg);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
      setSignupProfile(imageUrl); // 🎯 Zustand signupProgress에 이미지 URL 임시 저장
    }
  };

  const handleNextStep = () => {
    if (onNext) {
      onNext();
    } else {
      navigate('/signup/name');
    }
  };

  const handleBackSubmit = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        width: '100%',
        maxWidth: '360px',
        height: '800px',
        margin: '0 auto',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Header showBackButton={true} onBackClick={handleBackSubmit} />

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        style={{ display: 'none' }} 
      />

      <div
        style={{
          position: 'absolute',
          top: '130px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          width: '312px',
          boxSizing: 'border-box',
        }}
      >
        <h1
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: '20px',
            fontWeight: 500,
            color: '#0F0F0F',
            margin: 0,
            lineHeight: 1.5,
            whiteSpace: 'nowrap',
          }}
        >
          프로필 사진을 선택해주세요
        </h1>
      </div>

      <div
        onClick={handleProfileClick}
        style={{
          position: 'absolute',
          top: '192px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '150px',
          height: '159px',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            overflow: 'hidden',
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
              objectFit: 'cover',
            }} 
          />
        </div>

        <div
          style={{
            position: 'absolute',
            right: '0.5px',
            bottom: '9.5px',
            width: '39px',
            height: '39px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            zIndex: 1,
          }}
        >
          <img
            src={cameraIcon}
            alt="카메라 설정"
            style={{
              width: '22.94px',
              height: '20.65px',
              cursor: 'pointer',
            }}
          />
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: '383px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          width: '312px',
          boxSizing: 'border-box',
        }}
      >
        <p
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: '14px',
            fontWeight: 400,
            color: '#989898',
            margin: 0,
            lineHeight: 1.5,
            whiteSpace: 'nowrap',
          }}
        >
          당신을 나타내는 사진을 선택해주세요
        </p>
      </div>

      <div
        style={{
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
        }}
      >
        <div style={{ width: '312px' }}>
          <Button 
            text="계속" 
            onClick={handleNextStep} 
            style={{ width: '312px', height: '48px' }} 
          />
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 0, height: '94px', width: '100%' }} />
    </div>
  );
}