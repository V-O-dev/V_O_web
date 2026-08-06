import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/common/Button';
import { useNavigate } from 'react-router-dom';

type Phase = 'countdown' | 'recording' | 'result';

export default function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const cameraBoxRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [phase, setPhase] = useState<Phase>('countdown');
  const [countdown, setCountdown] = useState(5);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [boxSize, setBoxSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const startCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    };
    startCamera();
    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, []);

  // 카메라 박스의 실제 렌더링 크기를 측정 (뷰박스를 픽셀 크기와 동일하게 맞추기 위함)
  useEffect(() => {
    const el = cameraBoxRef.current;
    if (!el) return;

    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      setBoxSize({ width: rect.width, height: rect.height });
    };

    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(el);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (phase !== 'countdown') return;
    if (countdown === 0) {
      startRecording();
      return;
    }
    const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, countdown]);

  useEffect(() => {
    if (phase !== 'recording') return;
    const interval = setInterval(() => {
      setRecordingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          stopRecording();
          return 100;
        }
        return prev + 1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [phase]);

  const startRecording = () => {
    if (!streamRef.current) return;
    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(streamRef.current);
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      setVideoUrl(URL.createObjectURL(blob));
      setPhase('result');
    };
    mediaRecorder.start();
    setRecordingProgress(0);
    setPhase('recording');
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach(track => track.stop());
  };

  // 게이지 계산: 실제 박스 크기(boxSize) 기준으로 rect를 그리므로
  // 카메라 화면 비율이 어떻든 테두리와 정확히 일치함
  const strokeWidth = 8; // 게이지 선 두께
  const strokeInset = strokeWidth / 2; // 선이 박스 밖으로 잘리지 않도록 두께의 절반만큼 안쪽으로 이동
  const cornerRadius = 24 - strokeInset; // 기존 borderRadius 24px에 strokeInset 반영
  const gaugeWidth = Math.max(boxSize.width - strokeInset * 2, 0);
  const gaugeHeight = Math.max(boxSize.height - strokeInset * 2, 0);
  const perimeter =
    2 * (gaugeWidth + gaugeHeight) - 8 * cornerRadius + 2 * Math.PI * cornerRadius;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      background: '#f5f5f5',
      position: 'relative',
    }}>

      {/* 카메라 영역 */}
      <div
        ref={cameraBoxRef}
        style={{
          position: 'relative',
          width: '92%',
          height: '80dvh',
          borderRadius: '24px',
          overflow: 'hidden',
          border: phase === 'recording' ? 'none' : '2px solid #7C3AED',
        }}
      >
        {/* 카메라 미리보기 */}
        {phase !== 'result' && (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}

        {/* 결과 영상 */}
        {phase === 'result' && videoUrl && (
          <video
            src={videoUrl}
            autoPlay
            loop
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}

        {/* 카운트다운 */}
        {phase === 'countdown' && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.3)',
          }}>
            <span style={{
              fontSize: '120px',
              fontWeight: 700,
              color: 'white',
            }}>
              {countdown}
            </span>
          </div>
        )}

        {/* 촬영 중 텍스트 */}
        {phase === 'recording' && (
          <>
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}>
              <span style={{
                fontSize: '40px',
                fontWeight: 700,
                color: 'black',
                textShadow: 'none',
              }}>촬영 중</span>
            </div>
            {/* 게이지 - 카메라 박스의 실제 픽셀 크기를 viewBox로 그대로 사용해서
                비율/모서리 왜곡 없이 테두리를 따라 정확히 채워지도록 함 */}
            {boxSize.width > 0 && boxSize.height > 0 && (
              <svg
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                }}
                viewBox={`0 0 ${boxSize.width} ${boxSize.height}`}
              >
                <rect
                  x={strokeInset}
                  y={strokeInset}
                  width={gaugeWidth}
                  height={gaugeHeight}
                  rx={cornerRadius}
                  ry={cornerRadius}
                  fill="none"
                  stroke="#7C3AED"
                  strokeWidth={strokeWidth}
                  strokeDasharray={`${(recordingProgress / 100) * perimeter} 9999`}
                  strokeLinecap="round"
                />
              </svg>
            )}
          </>
        )}

        {/* 촬영 영상 텍스트 */}
        {phase === 'result' && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <span style={{
              fontSize: '40px',
              fontWeight: 700,
              color: 'black',
              textShadow: 'none',
            }}>촬영 영상</span>
          </div>
        )}
      </div>

      {/* 업로드 버튼 */}
      {phase === 'result' && (
        <Button text="업로드 하기" onClick={() => navigate("/home")} />
      )}
    </div>
  );
}
