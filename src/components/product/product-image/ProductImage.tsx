import Image from 'next/image';
import { MouseEventHandler, StyleHTMLAttributes } from 'react';

interface Props {
  src?: string;
  alt: string;
  className: StyleHTMLAttributes<HTMLImageElement>['className'];
  width: number;
  height: number;
  style?: StyleHTMLAttributes<HTMLImageElement>['style'];
  onMouseEnter?: MouseEventHandler<HTMLImageElement>;
  onMouseLeave?: MouseEventHandler<HTMLImageElement>;
}

export const ProductImage = ({
  className,
  src,
  alt,
  height,
  width,
  onMouseEnter,
  onMouseLeave,
  style,
}: Props) => {
  const localSrc = src
    ? src.startsWith('http')
      ? src
      : `/products/${src}`
    : '/imgs/placeholder.jpg';

  return (
    <Image
      src={localSrc}
      width={width}
      height={height}
      alt={alt}
      className={className}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
};
