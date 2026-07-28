// src/components/ScaledViewport.tsx
import { useEffect, useRef, useState, type ReactNode } from "react";
import "./ScaledViewport.css";

const BASE_WIDTH = 360;
const BASE_HEIGHT = 800;

interface ScaledViewportProps {
  children: ReactNode;
}

export default function ScaledViewport({ children }: ScaledViewportProps) {
  const [scale, setScale] = useState(1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function updateScale() {
      // wrapper의 실제 렌더링 크기를 기준으로 계산 (dvh 대응 포함)
      const el = wrapperRef.current;
      const vw = el ? el.clientWidth : window.innerWidth;
      const vh = el ? el.clientHeight : window.innerHeight;

      const scaleX = vw / BASE_WIDTH;
      const scaleY = vh / BASE_HEIGHT;
      setScale(Math.min(scaleX, scaleY));
    }

    updateScale();

    window.addEventListener("resize", updateScale);
    window.addEventListener("orientationchange", updateScale);

    // 모바일 주소창 늘었다줄었다 하는 것도 잡기 위해 visualViewport도 감지
    window.visualViewport?.addEventListener("resize", updateScale);

    return () => {
      window.removeEventListener("resize", updateScale);
      window.removeEventListener("orientationchange", updateScale);
      window.visualViewport?.removeEventListener("resize", updateScale);
    };
  }, []);

  return (
    <div className="scaled-viewport-wrapper" ref={wrapperRef}>
      <div
        className="scaled-viewport-inner"
        style={{
          width: BASE_WIDTH,
          height: BASE_HEIGHT,
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}