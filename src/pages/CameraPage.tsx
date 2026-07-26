import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/common/Button';
import { useNavigate } from 'react-router-dom';

type Phase = 'countdown' | 'recording' | 'result';

export default function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const navigate = useNavigate();

  const [phase, setPhase] = useState<Phase>('countdown');
  const [countdown, setCountdown] = useState(5);
  const [, setRecordingProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

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
    setPhase('recording');
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach(track => track.stop());
  };

  return (
    <div style={{
      width: '100%',
      height: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      background: '#f5f5f5',
      position: 'relative',
    }}>

      {/* 카메라 영역 */}
      <div style={{
        position: 'relative',
        width: '92%',
        height: '80dvh',
        borderRadius: '24px',
        overflow: 'hidden',
        border: phase === 'recording' ? 'none' : '2px solid #7C3AED',
      }}>
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
            {/* 게이지 */}
            {/* <svg style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }} viewBox="0 0 312 556">
              //게이지
              <rect
                x="2" y="2"
                width="308" height="552"
                rx="22" ry="22"
                fill="none"
                stroke="#7C3AED"
                strokeWidth="3"
                strokeDasharray={`${(recordingProgress / 100) * (2 * (308 + 552))} 9999`}
                strokeLinecap="round"
              />
            </svg>
            */}
            <style>{`
              @keyframes gauge {
                from { stroke-dashoffset: 392; }
                to { stroke-dashoffset: 0; }
              }
            `}</style>
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