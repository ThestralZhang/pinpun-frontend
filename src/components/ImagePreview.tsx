import { useState, useRef, useEffect, type CSSProperties } from 'react';
import { Text } from 'rsuite';
import classnames from 'classnames';

interface ImagePreviewProps {
  src?: string | null;
  width: CSSProperties['width'];
  height: CSSProperties['height'];
}

export default function ImagePreview({ src, width, height }: ImagePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [scale, setScale] = useState(1);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;
      setOrigin({ x: offsetX, y: offsetY });
      setScale((prev) => Math.min(3, Math.max(1, prev + (e.deltaY > 0 ? -0.1 : 0.1))));
    };

    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
  }, []);

  // Reset scale smoothly
  const reset = () => {
    if (!imgRef.current) return;
    // let transform transition apply
    setScale(1);
  };

  return (
    <div
      ref={containerRef}
      className={classnames(
        'image-preview',
        'relative overflow-hidden transition-all duration-300 ease-out',
        { 'bg-gray-100': !src },
      )}
      style={{ width, height }}
      onMouseLeave={reset}
    >
      {src ? (
        <img
          ref={imgRef}
          src={src}
          alt="preview"
          className="w-full h-full object-contain transition-transform duration-300 ease-out"
          style={{
            transformOrigin: `${origin.x}px ${origin.y}px`,
            transform: `scale(${scale})`,
          }}
        />
      ) : (
        <Text
          align="center"
          size="lg"
          className="font-bold text-gray-400! absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          Image Preview
        </Text>
      )}
    </div>
  );
}
