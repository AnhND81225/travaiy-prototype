import React from 'react';
import { IOSStatusBar } from '../common/IOSStatusBar';

interface OnboardingStep3Props {
  selectedPriorities: string[];
  onChange: (priorities: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

interface PriorityItem {
  id: string;
  label: string;
  bgColor: string;
  textColor: string;
  icon: React.ReactNode;
}

export const OnboardingStep3: React.FC<OnboardingStep3Props> = ({
  selectedPriorities,
  onChange,
  onNext,
  onBack,
}) => {
  const priorities: PriorityItem[] = [
    {
      id: 'Tiết kiệm chi phí',
      label: 'Tiết kiệm chi phí',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-500',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      id: 'Tối ưu thời gian & di chuyển',
      label: 'Tiết kiệm thời gian di chuyển',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-500',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      id: 'Trải nghiệm mới',
      label: 'Trải nghiệm mới',
      bgColor: 'bg-blue-100',
      textColor: 'text-[#0A1680]',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L14.4 7.6L20 10L14.4 12.4L12 18L9.6 12.4L4 10L9.6 7.6L12 2Z" />
        </svg>
      ),
    },
    {
      id: 'Lưu giữ kỷ niệm đẹp',
      label: 'Lưu giữ kỷ niệm',
      bgColor: 'bg-sky-50',
      textColor: 'text-sky-500',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="13" r="3" />
        </svg>
      ),
    },
    {
      id: 'Thời gian bên người đồng hành',
      label: 'Thời gian bên nhau',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-500',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
  ];

  const togglePriority = (id: string) => {
    if (selectedPriorities.includes(id)) {
      onChange(selectedPriorities.filter((item) => item !== id));
    } else {
      if (selectedPriorities.length < 2) {
        onChange([...selectedPriorities, id]);
      }
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-[#FCFDFF] select-none text-[#1E293B]">
      {/* Top Bar & Header */}
      <header className="pt-2 px-5 flex-shrink-0">
        <IOSStatusBar light={false} />

        <div className="flex items-center gap-3 pt-1 pb-2">
          <button
            onClick={onBack}
            aria-label="Quay lại"
            type="button"
            className="p-1 -ml-1 text-slate-700 hover:text-black transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[11px] font-bold tracking-wider text-[#0A1680] uppercase font-heading">
                BƯỚC 3/4
              </span>
            </div>
            {/* 4 Segmented Progress Bars (3 filled, 1 light) */}
            <div className="grid grid-cols-4 gap-1.5 w-full">
              <div className="h-1 rounded-full bg-[#0A1680]" />
              <div className="h-1 rounded-full bg-[#0A1680]" />
              <div className="h-1 rounded-full bg-[#0A1680]" />
              <div className="h-1 rounded-full bg-slate-200" />
            </div>
          </div>
        </div>

        <div className="mt-3">
          <h1 className="text-[20px] leading-tight font-extrabold text-[#0A1680] font-heading">
            Bạn ưu tiên điều gì?
          </h1>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">Chọn tối đa 2 ưu tiên</p>
        </div>
      </header>

      {/* Main Options List */}
      <main className="flex-1 px-5 py-2 overflow-y-auto no-scrollbar flex flex-col justify-between">
        <div className="space-y-2.5 mt-2">
          {priorities.map((item) => {
            const isSelected = selectedPriorities.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => togglePriority(item.id)}
                className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-[1.5px] border-[#0A1680] bg-white shadow-[0_4px_14px_-2px_rgba(10,22,128,0.12)]'
                    : 'bg-white border border-slate-200 shadow-2xs hover:border-slate-300'
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-xl ${item.bgColor} ${item.textColor} flex items-center justify-center flex-shrink-0 mr-3`}
                  >
                    {item.icon}
                  </div>
                  <span
                    className={`text-[14px] ${
                      isSelected ? 'font-bold text-[#0A1680]' : 'font-semibold text-slate-800'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>

                {/* Selected Indicator Pill */}
                {isSelected ? (
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#0A1680] text-white mr-1 shadow-xs">
                    <svg className="w-3 h-3 stroke-current stroke-[3] fill-none" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-200 mr-1" />
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Bottom CTA Button */}
      <footer className="p-5 pt-1 bg-[#FCFDFF] flex-shrink-0">
        <button
          onClick={onNext}
          disabled={selectedPriorities.length === 0}
          type="button"
          className="w-full bg-[#0A1680] hover:bg-[#071060] active:scale-[0.99] disabled:opacity-50 text-white font-semibold text-[15px] rounded-full shadow-md shadow-blue-950/20 transition duration-150 flex items-center justify-center tracking-wide h-[48px] cursor-pointer font-heading"
        >
          Tiếp tục
        </button>
        <div className="w-32 h-1 bg-slate-300 rounded-full mx-auto mt-4" />
      </footer>
    </div>
  );
};
