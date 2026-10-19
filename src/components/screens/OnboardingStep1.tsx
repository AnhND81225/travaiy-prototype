import React from 'react';
import { IOSStatusBar } from '../common/IOSStatusBar';

interface OnboardingStep1Props {
  selectedInterests: string[];
  onChange: (interests: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

interface InterestOption {
  id: string;
  label: string;
  sub: string;
  bgColor: string;
  iconColor: string;
  icon: React.ReactNode;
}

export const OnboardingStep1: React.FC<OnboardingStep1Props> = ({
  selectedInterests,
  onChange,
  onNext,
  onBack,
}) => {
  const options: InterestOption[] = [
    {
      id: 'Ăn uống & cà phê',
      label: 'Ăn uống',
      sub: '& cà phê',
      bgColor: 'bg-amber-50',
      iconColor: 'text-[#F1B94C]',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
          <line x1="6" x2="6" y1="1" y2="4" />
          <line x1="10" x2="10" y1="1" y2="4" />
          <line x1="14" x2="14" y1="1" y2="4" />
        </svg>
      ),
    },
    {
      id: 'Thiên nhiên & khám phá',
      label: 'Thiên nhiên',
      sub: '& khám phá',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
          <path d="M4.14 15.08 7.5 10l3 5" />
        </svg>
      ),
    },
    {
      id: 'Văn hóa & lịch sử',
      label: 'Văn hóa',
      sub: '& lịch sử',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-[#0A1680]',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M4 10h16" />
          <path d="M2 10l10-7 10 7" />
          <path d="M6 10v9" />
          <path d="M10 10v9" />
          <path d="M14 10v9" />
          <path d="M18 10v9" />
          <path d="M3 19h18v2H3z" />
        </svg>
      ),
    },
    {
      id: 'Vui chơi & mua sắm',
      label: 'Vui chơi',
      sub: '& mua sắm',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <line x1="3" x2="21" y1="6" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      ),
    },
    {
      id: 'Chụp ảnh & check-in',
      label: 'Chụp ảnh',
      sub: '& check-in',
      bgColor: 'bg-sky-50',
      iconColor: 'text-[#2563eb]',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
          <circle cx="12" cy="13" r="3" />
        </svg>
      ),
    },
    {
      id: 'Nghỉ dưỡng & thư giãn',
      label: 'Nghỉ dưỡng',
      sub: '& thư giãn',
      bgColor: 'bg-amber-50',
      iconColor: 'text-[#F1B94C]',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      ),
    },
  ];

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      onChange(selectedInterests.filter((item) => item !== id));
    } else {
      if (selectedInterests.length < 3) {
        onChange([...selectedInterests, id]);
      }
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-[#FCFDFF] select-none text-slate-800">
      {/* Top Section */}
      <div className="flex-1 flex flex-col">
        {/* iOS Status Bar */}
        <IOSStatusBar light={false} />

        {/* Stepper Progress Bar */}
        <section className="px-6 pt-2 pb-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={onBack}
                aria-label="Quay lại"
                className="w-7 h-7 flex items-center justify-center rounded-full text-slate-600 hover:text-[#0A1680] hover:bg-slate-100 transition-colors -ml-1 cursor-pointer"
              >
                <svg className="w-4 h-4 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0A1680] font-heading">
                BƯỚC 1/4
              </span>
            </div>
            <span className="text-xs text-slate-500 font-medium">Chọn tối đa 3 sở thích</span>
          </div>
          {/* 4 segments progress */}
          <div className="grid grid-cols-4 gap-1.5 w-full">
            <div className="h-1 rounded-full bg-[#0A1680]" />
            <div className="h-1 rounded-full bg-slate-200" />
            <div className="h-1 rounded-full bg-slate-200" />
            <div className="h-1 rounded-full bg-slate-200" />
          </div>
        </section>

        {/* Screen Title */}
        <section className="px-6 pt-3 pb-2">
          <h1 className="text-[21px] font-bold text-slate-900 leading-snug tracking-tight font-heading">
            Bạn thích trải nghiệm nào?
          </h1>
        </section>

        {/* Interest Selection Grid */}
        <main className="px-5 py-2 flex-1">
          <div className="grid grid-cols-2 gap-3">
            {options.map((opt) => {
              const isSelected = selectedInterests.includes(opt.id);
              return (
                <div
                  key={opt.id}
                  onClick={() => toggleInterest(opt.id)}
                  className={`relative bg-white rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 active:scale-95 ${
                    isSelected
                      ? 'border-2 border-[#0A1680] shadow-[0_6px_16px_rgba(10,22,128,0.12)]'
                      : 'border border-slate-200 shadow-sm hover:border-slate-300'
                  }`}
                >
                  {/* Selected checkmark pill */}
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-[#0A1680] text-white flex items-center justify-center shadow-xs">
                      <svg className="w-3 h-3 stroke-current stroke-[2.5] fill-none" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}

                  {/* Icon Container */}
                  <div className={`w-12 h-12 rounded-2xl ${opt.bgColor} ${opt.iconColor} flex items-center justify-center mb-2 mt-1`}>
                    {opt.icon}
                  </div>

                  <h3 className="text-xs font-bold text-slate-800 tracking-tight font-heading">
                    {opt.label}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">{opt.sub}</p>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {/* Bottom Navigation CTA */}
      <footer className="w-full pt-3 pb-7 bg-white/95 backdrop-blur-md border-t border-slate-100 flex flex-col items-center z-10 px-5">
        <button
          onClick={onNext}
          disabled={selectedInterests.length === 0}
          type="button"
          className="w-full h-12 px-6 rounded-2xl bg-[#0A1680] hover:bg-[#081268] text-white font-semibold text-base shadow-lg shadow-[#0A1680]/25 active:scale-[0.98] disabled:opacity-50 transition duration-200 flex items-center justify-center cursor-pointer font-heading"
        >
          Tiếp tục
        </button>
        {/* iOS Home Indicator */}
        <div className="w-32 h-1 bg-slate-300 rounded-full mt-4" />
      </footer>
    </div>
  );
};
