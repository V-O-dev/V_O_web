import React, { useState, useRef } from 'react';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button'; 
import defaultProfileImg from '../assets/profile_default.svg'; 
import cameraIcon from '../assets/camera_icon.svg'; 

interface ProfileStepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function ProfileStep({ onNext, onBack }: ProfileStepProps) {
  const [profileImage, setProfileImage] = useState<string>(defaultProfileImg);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileClick = function() {
    fileInputRef.current?.click();
  };

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
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
      <Header showBackButton={true} onBackClick={onBack} />

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
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          style={{ display: 'none' }} 
        />

        <div style={{ marginTop: '130.7px', textAlign: 'center' }}>
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
            marginTop: '32px',
            width: '150px',
            height: '159px',
            position: 'relative',
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

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
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
            marginTop: '180px', 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'center',
            marginBottom: '52px'
          }}
        >
          <div style={{ width: '312px', height: '48px' }}>
            <Button type="button" onClick={onNext} text="계속">
              <span
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '16px',
                  fontWeight: 500,
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