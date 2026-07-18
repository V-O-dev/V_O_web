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

  // 페이지 진입 시 자동으로 입력창에 포커스를 주어 모바일 키보드가 즉시 뜨게 함
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // 실시간 유효성 검사 로직
  const validateName = (value: string) => {
    setName(value);

    // 1. 미입력 상태 (빈 값일 때 에러 숨김 및 버튼 비활성화)
    if (value.length === 0) {
      setErrorMsg('');
      setIsValid(false);
      return;
    }

    // 2. 공백 포함 여부 검사
    if (/\s/.test(value)) {
      setErrorMsg('공백은 포함할 수 없습니다.');
      setIsValid(false);
      return;
    }

    // 3. 특수문자 포함 여부 검사
    const specialCharRegex = /[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ]/g;
    if (specialCharRegex.test(value)) {
      setErrorMsg('특수문자를 포함할 수 없습니다.');
      setIsValid(false);
      return;
    }

    // 4. 최소 2글자 이상 검사
    if (value.length < 2) {
      setErrorMsg('공백을 제외한 두 글자 이상의 문자를 입력해주세요.');
      setIsValid(false);
      return;
    }

    // 5. 최대 15자 제한 검사
    if (value.length > 15) {
      setErrorMsg('이름은 최대 15자까지 입력 가능합니다.');
      setIsValid(false);
      return;
    }

    // 모든 조건 통과 시 에러 해제 및 버튼 활성화 조건 충족
    setErrorMsg('');
    setIsValid(true);
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
      {/* 1. 상단 공통 헤더 */}
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
        {/* 타이틀 영역 */}
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

        {/* 입력창 영역 */}
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

        {/* 안내 문구 / 에러 메시지 영역 */}
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

        {/* 계속 버튼 영역 */}
        <div
          style={{
            marginTop: '367.7px',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '52px',
          }}
        >
          {/* 🎯 피그마 명세 반영: 규칙을 어기거나 미입력 상태(!isValid)일 때 opacity: 0.5 적용 */}
          <div 
            style={{ 
              width: '312px', 
              height: '48px',
              opacity: isValid ? 1 : 0.5, // 👈 피그마 불투명도 50% 실측치 적용
              transition: 'opacity 0.2s ease', // 자연스러운 전환 효과
            }}
          >
            <Button
              type="button"
              onClick={() => onNext(name)}
              disabled={!isValid} // 🎯 유효성 검사를 통과하지 못하면 버튼 자체 기능 동작을 막음
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