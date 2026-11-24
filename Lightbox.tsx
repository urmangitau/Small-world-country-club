import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { GalleryMediaItem } from '../config/siteConfig';

interface LightboxProps {
  items: GalleryMediaItem[];
  activeIndex: number | null;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  items,
  activeIndex,
  onClose,
  onSelectIndex,
}) => {
  const isOpen = activeIndex !== null && activeIndex >= 0 && activeIndex < items.length;

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowRight') {
        onSelectIndex((activeIndex! + 1) % items.length);
      } else if (event.key === 'ArrowLeft') {
        onSelectIndex((activeIndex! - 1 + items.length) % items.length);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, activeIndex, items.length, onClose, onSelectIndex]);

  if (!isOpen || activeIndex === null) return null;

  const current = items[activeIndex];

  const handlePrev = () => {
    onSelectIndex((activeIndex - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    onSelectIndex((activeIndex + 1) % items.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#183D32]/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`Image gallery viewer: ${current.title}`}
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex items-center justify-between text-[#F8F6F0] mb-4">
          <div className="text-xs tracking-widest uppercase text-[#E6DCCB]">
            <span>{current.category}</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span className="tabular-nums">
              {activeIndex + 1} / {items.length}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close image viewer"
            className="w-11 h-11 flex items-center justify-center rounded-sm border border-[#F8F6F0]/25 text-[#F8F6F0] hover:bg-[#F8F6F0]/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative w-full flex items-center justify-center">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous photograph"
            className="absolute left-2 md:-left-14 z-10 w-11 h-11 flex items-center justify-center rounded-sm bg-[#252925]/70 text-[#F8F6F0] border border-[#F8F6F0]/20 hover:bg-[#183D32] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="w-full max-h-[72vh] flex items-center justify-center overflow-hidden rounded-sm bg-[#252925]">
            <img
              src={current.src}
              alt={current.alt}
              referrerPolicy="no-referrer"
              className="max-h-[72vh] w-auto max-w-full object-contain"
            />
          </div>

          <button
            type="button"
            onClick={handleNext}
            aria-label="Next photograph"
            className="absolute right-2 md:-right-14 z-10 w-11 h-11 flex items-center justify-center rounded-sm bg-[#252925]/70 text-[#F8F6F0] border border-[#F8F6F0]/20 hover:bg-[#183D32] transition-colors cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="mt-4 text-center max-w-2xl">
          <h3 className="font-display text-xl text-[#F8F6F0]">{current.title}</h3>
        </div>
      </div>
    </div>
  );
};
