import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import errorIcon from '../assets/error_icon.svg'; 
import { useAuthStore } from '../stores/useAuthStore';
import { axiosInstance } from '../apis/axiosInstance'; // axiosInstance 경로 프로젝트 구조 확인

interface NameStepProps {
  onNext?: (name: string) => void;
  onBack?: () => void;
}

export default function NameStep({ onNext, onBack }: NameStepProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const setSignupNickname = useAuthStore((state) => state.setSignupNickname);
  const signupNickname = useAuthStore((state) => state.signupProgress.nickname);

  const [name, setName] = useState(signupNickname || '');
  const [errorMsg, setErrorMsg] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const validateName = (value: string) => {
    setName(value);

    if (value.length === 0) {
      setErrorMsg('');
      setIsValid(false);
      return;
    }

    if (/\s/.test(value)) {
      setErrorMsg('공백은 포함할 수 없습니다.');
      setIsValid(false);
      return;
    }

    const specialCharRegex = /[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ]/g;
    if (specialCharRegex.test(value)) {
      setErrorMsg('특수문자를 포함할 수 없습니다.');
      setIsValid(false);
      return;
    }

    if (value.length < 2) {
      setErrorMsg('공백을 제외한 두 글자 이상의 문자를 입력해주세요.');
      setIsValid(false);
      return;
    }

    if (value.length > 15) {
      setErrorMsg('이름은 최대 15자까지 입력 가능합니다.');
      setIsValid(false);
      return;
    }

    setErrorMsg('');
    setIsValid(true);
  };

  // 🎯 온보딩 프로필 생성 API 호출 핸들러
  const handleNextSubmit = async () => {
    if (!isValid || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setSignupNickname(name);

      const formData = new FormData();
      // 이전 스텝(ProfileStep)에서 전달받은 이미지 파일이 있다면 append
      const profileFile = location.state?.profileFile;
      if (profileFile) {
        formData.append('image', profileFile);
      }

      // 🎯 POST /api/v1/users/me/profile?nickname=홍길동 (timeout 30초 지정)
      await axiosInstance.post('/api/v1/users/me/profile', formData, {
        params: { nickname: name },
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30초 타임아웃 지정
      });

      console.log('온보딩 프로필 생성 성공!');

      if (onNext) {
        onNext(name);
      } else {
        navigate('/signup/complete');
      }
    } catch (error: any) {
      console.error('온보딩 프로필 생성 실패:', error);
      const serverMsg = error.response?.data?.message || '프로필 생성 중 오류가 발생했습니다.';
      setErrorMsg(serverMsg);
      setIsValid(false);
    } finally {
      setIsSubmitting(false);
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
          이름을 입력해주세요
        </h1>
      </div>

      <div
        style={{
          position: 'absolute',
          top: '192px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '312px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => validateName(e.target.value)}
          placeholder=""
          minWidth={40}
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: '20px',
            fontWeight: 500,
            textAlign: 'center',
            backgroundColor: 'transparent',
            caretColor: '#000000',
          }}
        />
      </div>

      <div 
        style={{ 
          position: 'absolute',
          top: '256px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '4px',
          height: '21px',
          width: '312px',
        }}
      >
        {errorMsg ? (
          <>
            <img 
              src={errorIcon} 
              alt="에러" 
              style={{ 
                width: '13px', 
                height: '13px',
                objectFit: 'contain'
              }} 
            />
            <p
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: '14px',
                fontWeight: 400,
                color: '#FF383C',
                margin: 0,
                lineHeight: 1.5,
                whiteSpace: 'nowrap',
              }}
            >
              {errorMsg}
            </p>
          </>
        ) : (
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
            당신을 부를 이름을 적어주세요
          </p>
        )}
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
          opacity: isValid && !isSubmitting ? 1 : 0.5,
          transition: 'opacity 0.2s ease',
        }}
      >
        <div style={{ width: '312px' }}>
          <Button
            type="button"
            onClick={handleNextSubmit} 
            disabled={!isValid || isSubmitting} 
            text="계속"
            style={{ width: '312px', height: '48px' }}
          />
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 0, height: '94px', width: '100%' }} />
    </div>
  );
}