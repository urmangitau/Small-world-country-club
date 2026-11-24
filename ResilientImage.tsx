import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  lazy?: boolean;
  showPlaceholderBadge?: boolean;
  placeholderLabel?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  lazy = true,
  showPlaceholderBadge = false,
  placeholderLabel = 'Illustrative Placeholder · Replace with Property Photo',
}) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-[#E6DCCB]/50 ${containerClassName}`}>
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          loading={lazy ? 'lazy' : 'eager'}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover ${className}`}
        />
      ) : (
        <div className="w-full h-full min-h-[220px] flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#183D32]/15 via-[#E6DCCB]/70 to-[#354A36]/20">
          <ImageOff className="w-7 h-7 text-[#183D32]/70 mb-2" aria-hidden="true" />
          <p className="font-serif-editorial text-lg text-[#183D32] font-medium">
            Small World Country Club
          </p>
          <p className="text-xs text-[#252925]/70 mt-1 max-w-xs">{alt}</p>
        </div>
      )}

      {showPlaceholderBadge && (
        <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex justify-start">
          <span className="bg-[#252925]/75 backdrop-blur-xs text-[#F8F6F0] text-[10px] tracking-wide px-2.5 py-1 rounded-xs">
            {placeholderLabel}
          </span>
        </div>
      )}
    </div>
  );
};
