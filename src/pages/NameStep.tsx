import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import errorIcon from '../assets/error_icon.svg'; 

interface NameStepProps {
  onNext?: (name: string) => void;
  onBack?: () => void;
}

export default function NameStep({ onNext, onBack }: NameStepProps) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
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

  // 계속 버튼 핸들러
  const handleNextSubmit = () => {
    if (!isValid) return; 

    if (onNext) {
      onNext(name);
    } else {
      navigate('/signup/complete');
    }
  };

  // 뒤로가기 버튼 핸들러
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
      {/* 1. 헤더 영역 */}
      <Header showBackButton={true} onBackClick={handleBackSubmit} />

      {/* 2. 타이틀 영역 */}
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

      {/* 3. 인풋 입력 영역 */}
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
          minWidth={40} // 🎯 빈 값일 때 최소 밑줄 너비 (필요시 조절)
          style={{
            // 🎯 width: '100%' 제거! (동적 width 계산 반영을 위함)
            fontFamily: 'Manrope, sans-serif',
            fontSize: '20px', // 인풋 폰트 크기를 20px로 쓰고 싶다면 Input.tsx도 함께 보완
            fontWeight: 500,
            textAlign: 'center',
            backgroundColor: 'transparent',
            caretColor: '#000000',
          }}
        />
      </div>

      {/* 4. 안내 및 에러 메시지 영역 */}
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

      {/* 5. 하단 고정 버튼 영역 */}
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

      {/* 6. 바닥 여백 영역 */}
      <div style={{ position: 'absolute', bottom: 0, height: '94px', width: '100%' }} />
    </div>
  );
}