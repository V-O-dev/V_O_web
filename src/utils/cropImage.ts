// utils/cropImage.ts
// react-easy-crop가 넘겨주는 pixel 영역(croppedAreaPixels)을 기준으로
// 실제 이미지를 캔버스에 그려서 잘라낸 뒤 Blob으로 반환하는 유틸

export interface CropPixelArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

// 이미지 로드를 Promise로 감싸는 헬퍼
function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    // blob URL / data URL 모두 안전하게 로드되도록 설정
    image.crossOrigin = 'anonymous';
    image.src = url;
  });
}

/**
 * 원본 이미지 + 크롭 영역(px) -> 정사각형으로 잘라낸 이미지 Blob
 * @param imageSrc  원본 이미지의 objectURL 또는 dataURL
 * @param cropArea  react-easy-crop의 onCropComplete에서 받은 croppedAreaPixels
 * @param outputSize 결과 이미지의 한 변 픽셀 크기 (정사각형, 기본 512)
 */
export async function getCroppedImg(
  imageSrc: string,
  cropArea: CropPixelArea,
  outputSize = 512
): Promise<Blob> {
  const image = await createImage(imageSrc);

  const canvas = document.createElement('canvas');
  canvas.width = outputSize;
  canvas.height = outputSize;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('캔버스 컨텍스트를 생성할 수 없습니다.');
  }

  // 잘라낸 영역을 outputSize x outputSize 정사각형으로 리사이즈해서 그림
  ctx.drawImage(
    image,
    cropArea.x,
    cropArea.y,
    cropArea.width,
    cropArea.height,
    0,
    0,
    outputSize,
    outputSize
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('이미지를 Blob으로 변환하는데 실패했습니다.'));
          return;
        }
        resolve(blob);
      },
      'image/png',
      1
    );
  });
}