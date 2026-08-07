import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import errorIcon from '../assets/error_icon.svg'; 
import { useAuthStore } from '../stores/useAuthStore'; // 🎯 스토어 추가

interface NameStepProps {
  onNext?: (name: string) => void;
  onBack?: () => void;
}

export default function NameStep({ onNext, onBack }: NameStepProps) {
  const navigate = useNavigate();
  const setSignupNickname = useAuthStore((state) => state.setSignupNickname); // 🎯 스토어 함수
  const signupNickname = useAuthStore((state) => state.signupProgress.nickname);

  const [name, setName] = useState(signupNickname || '');
  const [errorMsg, setErrorMsg] = useState('');
  const [isValid, setIsValid] = useState(false);
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

  const handleNextSubmit = () => {
    if (!isValid) return; 

    setSignupNickname(name); // 🎯 Zustand signupProgress에 닉네임 저장

    if (onNext) {
      onNext(name);
    } else {
      navigate('/signup/complete');
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
          opacity: isValid ? 1 : 0.5,
          transition: 'opacity 0.2s ease',
        }}
      >
        <div style={{ width: '312px' }}>
          <Button
            type="button"
            onClick={handleNextSubmit} 
            disabled={!isValid} 
            text="계속"
            style={{ width: '312px', height: '48px' }}
          />
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 0, height: '94px', width: '100%' }} />
    </div>
  );
}