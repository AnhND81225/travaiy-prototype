import React from 'react';
import { IOSStatusBar } from '../common/IOSStatusBar';
import { UserPreferences } from '../../types/travel';

interface OnboardingCompleteProps {
  preferences: UserPreferences;
  userName?: string;
  onFinish: () => void;
}

export const OnboardingComplete: React.FC<OnboardingCompleteProps> = ({
  preferences,
  userName,
  onFinish,
}) => {
  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-[#FCFDFF] select-none text-slate-800">
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
        {/* iOS Status Bar */}
        <IOSStatusBar light={false} />

        {/* Hero Illustration / Celebration Header */}
        <div className="flex flex-col items-center justify-center pt-8 pb-3 px-6 text-center">
          <img src="/images/lumi-wave.png" alt="Lumi chúc mừng bạn hoàn tất hồ sơ" className="w-28 h-28 object-contain"/>
          <h1 className="text-[#0A1680] text-[22px] font-bold tracking-tight mt-4 font-heading">
            {userName ? `Sẵn sàng rồi, ${userName}!` : 'Hồ sơ du lịch đã sẵn sàng!'}
          </h1>
          <p className="text-slate-500 text-[13px] font-normal leading-relaxed mt-1 max-w-[280px]">
            Lumi đã ghi nhớ sở thích của bạn.
          </p>
        </div>

        {/* Travel Profile Summary Card */}
        <section className="px-5 mt-2 pb-2">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-3 pb-2.5 border-b border-slate-100">
              <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-[#0A1680]">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                </svg>
              </div>
              <h2 className="text-[13px] font-semibold text-slate-900 tracking-tight font-heading">
                Sở thích đã chọn
              </h2>
            </div>

            <div className="space-y-3 text-[12px]">
              {/* Sở thích */}
              <div className="flex items-start justify-between gap-2">
                <span className="text-slate-500 font-medium pt-0.5 min-w-[90px]">Sở thích</span>
                <div className="flex flex-wrap gap-1.5 justify-end flex-1">
                  {preferences.interests.map((item) => (
                    <span
                      key={item}
                      className="px-2.5 py-0.5 bg-blue-50 text-[#0A1680] rounded-md font-medium text-[11px] border border-blue-100"
                    >
                      {item.replace(' & cà phê', '').replace(' & check-in', '').replace(' & khám phá', '')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Phong cách */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-500 font-medium min-w-[90px]">Phong cách</span>
                <div className="flex flex-wrap gap-1.5 justify-end">
                  <span className="px-2.5 py-0.5 bg-blue-50 text-[#0A1680] rounded-md font-medium text-[11px] border border-blue-100">
                    {preferences.travelStyle}
                  </span>
                </div>
              </div>

              {/* Ưu tiên */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-500 font-medium min-w-[90px]">Ưu tiên</span>
                <div className="flex flex-wrap gap-1.5 justify-end">
                  {preferences.priorities.map((item) => (
                    <span
                      key={item}
                      className="px-2.5 py-0.5 bg-blue-50 text-[#0A1680] rounded-md font-medium text-[11px] border border-blue-100"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Thời điểm */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-500 font-medium min-w-[90px]">Thời điểm</span>
                <div className="flex flex-wrap gap-1.5 justify-end">
                  {preferences.timeOfDay.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-0.5 bg-blue-50 text-[#0A1680] rounded-md font-medium text-[11px] border border-blue-100"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom CTA */}
      <footer className="w-full px-5 pt-2 pb-6 bg-[#FCFDFF]">
        <button
          onClick={onFinish}
          type="button"
          className="w-full h-12 bg-[#0A1680] hover:bg-[#071060] active:scale-[0.98] transition-all duration-200 text-white rounded-2xl font-semibold text-[15px] flex items-center justify-center gap-2 shadow-lg shadow-[#0A1680]/25 cursor-pointer font-heading"
        >
          <span>Vào trang chủ</span>
          <svg className="w-4 h-4 translate-y-[0.5px]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="w-32 h-1 bg-slate-300 rounded-full mx-auto mt-4 opacity-80" />
      </footer>
    </div>
  );
};
