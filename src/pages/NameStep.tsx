import { useState, useEffect, useRef } from 'react';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import errorIcon from '../assets/error_icon.svg'; 

interface NameStepProps {
  onNext: (name: string) => void;
  onBack: () => void;
}

export default function NameStep({ onNext, onBack }: NameStepProps) {
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

  const handleNextSubmit = () => {
    if (!isValid) return; 
    onNext(name);
  };

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
        <div style={{ marginTop: '52px', textAlign: 'center' }}>
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
            marginTop: '32px',
            width: '100%',
            maxWidth: '312px',
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
            style={{
              width: '100%',
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
            marginTop: '32px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '4px',
            height: '21px'
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
            marginTop: '367.7px',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '52px',
          }}
        >
          <div 
            style={{ 
              width: '312px', 
              height: '48px',
              opacity: isValid ? 1 : 0.5, 
              transition: 'opacity 0.2s ease', 
            }}
          >
            <Button
              type="button"
              onClick={handleNextSubmit} 
              disabled={!isValid} 
              text="계속"
            >
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