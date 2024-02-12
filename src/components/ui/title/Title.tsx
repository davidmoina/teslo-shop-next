import { titleFont } from '@/config/fonts';
import { HTMLProps } from 'react';

interface Props {
  title: string;
  subtitle?: string;
  className?: HTMLProps<HTMLElement>['className'];
}

export const Title = ({ title, className, subtitle }: Props) => {
  return (
    <div className={`mt-3 ${className}`}>
      <h1
        className={`${titleFont.className} antialiased text-4xl font-semibold my-7`}
      >
        {title}
      </h1>

      {subtitle && <h3 className="text-xl mb-5">{subtitle}</h3>}
    </div>
  );
};
