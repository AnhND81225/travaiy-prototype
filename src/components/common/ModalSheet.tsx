import React, { useRef } from 'react';
import { useModalA11y } from './useModalA11y';

export interface ModalSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  ariaLabel?: string;
  children: React.ReactNode;
  type?: 'bottom-sheet' | 'dialog' | 'fullscreen';
  className?: string;
  contentClassName?: string;
  showHandleBar?: boolean;
}

export const ModalSheet: React.FC<ModalSheetProps> = ({
  isOpen,
  onClose,
  title,
  ariaLabel,
  children,
  type = 'bottom-sheet',
  className = '',
  contentClassName = '',
  showHandleBar = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useModalA11y({
    isOpen,
    onClose,
    modalRef,
  });

  if (!isOpen) return null;

  if (type === 'fullscreen') {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel || title || 'Toàn màn hình'}
        ref={modalRef}
        tabIndex={-1}
        className={`absolute inset-0 z-50 flex flex-col justify-between bg-black/95 text-white overflow-hidden animate-in fade-in duration-200 ${className}`}
      >
        {children}
      </div>
    );
  }

  if (type === 'dialog') {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel || title || 'Hộp thoại'}
        ref={modalRef}
        tabIndex={-1}
        className={`absolute inset-0 z-50 flex items-center justify-center p-4 overflow-hidden animate-in fade-in duration-200 ${className}`}
      >
        <div
          className="absolute inset-0 bg-[#0A1680]/40 backdrop-blur-[3px] transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
        <div
          className={`relative bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 max-w-sm w-full z-10 animate-in zoom-in-95 duration-200 ${contentClassName}`}
        >
          {children}
        </div>
      </div>
    );
  }

  // Default: bottom-sheet
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel || title || 'Bảng điều khiển'}
      ref={modalRef}
      tabIndex={-1}
      className={`absolute inset-0 z-50 flex flex-col justify-end overflow-hidden animate-in fade-in duration-200 ${className}`}
    >
      <div
        className="absolute inset-0 bg-[#0A1680]/35 backdrop-blur-[3px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`relative bg-white rounded-t-[28px] shadow-2xl z-10 w-full max-h-[88vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300 ${contentClassName}`}
      >
        {showHandleBar && (
          <div className="w-full flex justify-center pt-3 pb-1 shrink-0">
            <div className="w-12 h-1 bg-slate-300 rounded-full" />
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
