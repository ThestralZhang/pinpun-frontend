import emptyImg from '@/assets/emptyImg.svg';
import { Image, type ImageProps, Placeholder } from 'rsuite';
import { type SyntheticEvent, useState } from 'react';
import classnames from 'classnames';

interface ImageDisplayProps extends ImageProps {
  imageClassName?: string;
}

export default function ImageDisplay({ className, imageClassName, ...rest }: ImageDisplayProps) {
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const onLoad = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    setIsSuccess(e.currentTarget.src.startsWith('http'));
  };

  return (
    <div
      className={classnames('image-display', className, 'overflow-hidden bg-gray-100', {
        'relative fallback': !isSuccess,
      })}
    >
      <Image
        src={rest.src}
        alt="image display"
        zoomed={isSuccess}
        position="center"
        fit={isSuccess ? 'cover' : 'contain'}
        className={classnames(imageClassName, {
          'w-full h-full': isSuccess,
          'w-[50%] h-[50%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2':
            !isSuccess,
        })}
        fallbackSrc={emptyImg}
        placeholder={<Placeholder.Graph active />}
        onLoad={onLoad}
        {...rest}
      />
    </div>
  );
}
