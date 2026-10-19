import React from 'react';

interface IOSStatusBarProps {
  light?: boolean;
}

export const IOSStatusBar: React.FC<IOSStatusBarProps> = ({ light = false }) => {
  const textColor = light ? 'text-white' : 'text-slate-900';
  const fillColor = light ? 'fill-white' : 'fill-slate-900';
  const borderColor = light ? 'border-white' : 'border-slate-900';
  const barBg = light ? 'bg-white' : 'bg-slate-900';

  return (
    <header className={`w-full pt-3 px-7 flex justify-between items-center z-30 relative select-none ${textColor} drop-shadow-xs`}>
      <span className="text-[14px] font-semibold tracking-tight">9:41</span>
      <div className="flex items-center space-x-1.5">
        {/* Signal */}
        <svg className={`w-4 h-3.5 ${fillColor}`} viewBox="0 0 17 11">
          <rect height="3" rx="0.8" width="3" x="0" y="8" />
          <rect height="5.7" rx="0.8" width="3" x="4.6" y="5.3" />
          <rect height="8.4" rx="0.8" width="3" x="9.3" y="2.6" />
          <rect height="11" rx="0.8" width="3" x="14" y="0" />
        </svg>
        {/* Wifi */}
        <svg className={`w-4 h-3.5 ${fillColor}`} viewBox="0 0 16 12">
          <path d="M8 2.5C10.7 2.5 13.1 3.6 14.8 5.4L16 4.1C13.9 2 11.1 0.7 8 0.7C4.9 0.7 2.1 2 0 4.1L1.2 5.4C2.9 3.6 5.3 2.5 8 2.5ZM8 6.5C9.7 6.5 11.2 7.2 12.3 8.4L13.5 7.1C12.1 5.6 10.1 4.7 8 4.7C5.9 4.7 3.9 5.6 2.5 7.1L3.7 8.4C4.8 7.2 6.3 6.5 8 6.5ZM8 10.5C8.8 10.5 9.5 11.2 9.5 12C9.5 12.8 8.8 13.5 8 13.5C7.2 13.5 6.5 12.8 6.5 12C6.5 11.2 7.2 10.5 8 10.5Z" />
        </svg>
        {/* Battery */}
        <div className={`w-6 h-3 border ${borderColor} rounded-[3px] p-[1px] flex items-center relative`}>
          <div className={`h-full w-4 ${barBg} rounded-[1.5px]`} />
          <div className={`w-[1.5px] h-1.5 ${barBg} absolute -right-[3px] top-[2px] rounded-r-xs`} />
        </div>
      </div>
    </header>
  );
};
