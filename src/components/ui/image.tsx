import { forwardRef, type ImgHTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';
import './image.css';

function resolveSrc(rawUrl: string): string {
  if (rawUrl.startsWith('https://static.wixstatic.com/media/')) {
    const afterMedia = rawUrl.replace('https://static.wixstatic.com/media/', '').split('?')[0];
    return `/images/${afterMedia}`;
  }
  return rawUrl;
}

export type ImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fittingType?: string;
  originWidth?: number;
  originHeight?: number;
  focalPointX?: number;
  focalPointY?: number;
};

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ src, className, style, alt = '', ...props }, ref) => {
    const resolved = src ? resolveSrc(src) : '';
    const [errored, setErrored] = useState(false);

    if (!src) {
      return <div data-empty-image ref={ref as React.RefObject<HTMLDivElement>} className={cn(className)} />;
    }

    return (
      <img
        ref={ref}
        src={errored ? '/images/JD-Home-Construction.png' : resolved}
        alt={alt}
        className={cn('max-w-full h-auto', className)}
        style={style}
        onError={() => {
          if (!errored) setErrored(true);
        }}
        {...props}
      />
    );
  }
);
Image.displayName = 'Image';
