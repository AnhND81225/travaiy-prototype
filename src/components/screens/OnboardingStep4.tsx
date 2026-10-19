import React from 'react';
import { IOSStatusBar } from '../common/IOSStatusBar';

interface OnboardingStep4Props {
  selectedTimes: string[];
  onChange: (times: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export const OnboardingStep4: React.FC<OnboardingStep4Props> = ({
  selectedTimes,
  onChange,
  onNext,
  onBack,
}) => {
  const timeOptions = [
    {
      id: 'Sáng sớm',
      title: 'Sáng sớm',
      sub: 'Đón bình minh',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmczzwzLUjscEhwk8f3nNwTMjduiD0hcnbS7yGIHijSQhmJSV9A2sWhKhGZrjIsCcb5IGo2ccbP542yhZirHNneda3H9Kc6GqkCM3pgIVcdPSSXWr82rc03atU_NiXVdJkLcZjVwUyRzUmeERDu7PKdlAgh_0DnJLUiH607GisQ2lw4zlaAPYahcD2Ra3X19ypbgOcL2oTeJgNXp0MfNujxwExGTBi0q8_vSDcWxch4w6afY-ZbA',
    },
    {
      id: 'Buổi sáng',
      title: 'Buổi sáng',
      sub: 'Khám phá, tham quan',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDB7QpcbT3KOqUxr9y1jxP5kc-5jqfgYbn9yB6LF0O8exzuX7IYodLUCQT9LaNLtjoIkn9HGr7rw7j3kETub7ndLUY339Pvfv1gldzl4WfZVESbj_KyjsON97UzekifKwpYCe2OtHp9f62zKVpsi2O_1WsojbYHEkIcqfwxtnnOZ0tf_2c55rQKMRfiEbO_wxbLXbNFUXyF2PbOut9UhiZ1rZc0SuFWqrtVcFlJ6FVvAalBJR7YhQ',
    },
    {
      id: 'Buổi chiều',
      title: 'Buổi chiều',
      sub: 'Dạo chơi, trải nghiệm',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOQspFO93T7lZyJmoR64qwR70DMo3ZXSvhjL60MJJL3QuqXDOd0JWynQZoQiM1Y-SCsRi82aozOd3FLfvfkjf0o96nqJBI9lbsAO5r4KOSlYdxvPPVZgzfEYOUYqVXa0fECYb7clpX_YFrs9KUUzxM0I_SoajclHRXg5h692SEdSC8132nol_41mYdFC5kNaNfpUGVVPuYkdQP2VsxSgpVrI5LtZOAOvmZAjyKUvtAx2PyPto_KQ',
    },
    {
      id: 'Hoàng hôn',
      title: 'Hoàng hôn',
      sub: 'Ngắm cảnh, chụp ảnh',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfF9LHVUWahc8bXPXTIEK9gEj6sYZXl4etduHzhGTbJjCiw-b5W6wpbL8b7dJJA9lMIZKK5La6zlCODJwuKeuBjpS2bXGBk4A20Kj91WbgMqhK10l145StOedQB5RE-G1w3bPHQ2A_R6a8Zi5V1QB1JuvzTLGWpcI0GBmmz9zoVL98JCgRnMc4i9FRJ0faXQSAZenE-Td-5MLPXPz7WYN4KlYjd27w6awoiQg_BsMRUmmmh11gZQ',
    },
    {
      id: 'Buổi tối',
      title: 'Buổi tối',
      sub: 'Ăn uống, vui chơi',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1q24oeDkvpO9C6OoxfNNh6e-8R4tkCXifIvoXCj-BBcsKmwZzarqfr7zUrSteR0Rnlzh2mc57WQvj-IVfGdYVRFTps4sClThZCpKiJ4yPIcJTiAUIq5plla4PSgvrh5jVRYHLCYPe3SCjXAMaVAb3T3JXhIUuvPkjrx44vf_QhL_EVF6AQq_rq1e78JFRS1jS1S_1_sRnBsyAmb2S00rjCjTfYZHvF8R-lH_peXQ5iQu0dKY_HA',
    },
    {
      id: 'Linh hoạt',
      title: 'Linh hoạt',
      sub: 'Không ưu tiên khung giờ',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHDjjdiyHbfNft1Lf1BwhJ53UKvWJVSRL7Ma9Vkm_YF6X1sPKfHsuL8kdYr0lQnXgASOSHptVFfz5KcQEjSVh_Z3Zgi2DEjDuiuNbbGuSPLM8F5nrsf20tK_0PITljIESl2XcjNXGi1cLwGbfJQbLp2wjPwRE-Psas6bxv9NlACgJc6iV01Rt6A0YSb_bm9H4aB23yjHN36RWG7rPBNFs08kNMM0ycLUJDRmGeK4uwReXS1zpgTw',
    },
  ];

  const toggleTime = (id: string) => {
    if (id === 'Linh hoạt') {
      onChange(['Linh hoạt']);
      return;
    }
    const withoutFlexible = selectedTimes.filter((t) => t !== 'Linh hoạt');
    if (withoutFlexible.includes(id)) {
      onChange(withoutFlexible.filter((t) => t !== id));
    } else {
      onChange([...withoutFlexible, id]);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-[#FCFDFF] select-none text-slate-800">
      {/* Top Navigation & Progress */}
      <nav aria-label="Tiến trình đăng ký" className="px-5 pt-2 pb-1">
        <IOSStatusBar light={false} />

        <div className="h-[52px] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={onBack}
              aria-label="Quay lại"
              type="button"
              className="p-1 -ml-1 text-slate-800 hover:text-[#0A1680] transition-colors focus:outline-none cursor-pointer"
            >
              <svg className="w-5 h-5 stroke-[2.4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M15.75 19.5L8.25 12l7.5-7.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span className="text-[12px] font-bold text-[#0A1680] uppercase tracking-wider font-heading">
              BƯỚC 4/4
            </span>
          </div>
        </div>

        {/* 4-Stage Progress Bar: All 4 segments fully filled with brand ocean color */}
        <div className="grid grid-cols-4 gap-1.5 w-full h-1">
          <div className="bg-[#0A1680] h-full rounded-full" />
          <div className="bg-[#0A1680] h-full rounded-full" />
          <div className="bg-[#0A1680] h-full rounded-full" />
          <div className="bg-[#0A1680] h-full rounded-full" />
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 px-5 pt-2 pb-2 overflow-y-auto no-scrollbar flex flex-col justify-between">
        <section className="mb-3">
          <h1 className="text-[20px] font-extrabold text-slate-900 leading-[1.3] font-heading">
            Bạn thích đi chơi vào lúc nào?
          </h1>
        </section>

        {/* 2-column grid displaying the 6 travel times of day */}
        <section className="grid grid-cols-2 gap-3 mb-3">
          {timeOptions.map((opt) => {
            const isSelected = selectedTimes.includes(opt.id);
            return (
              <article
                key={opt.id}
                onClick={() => toggleTime(opt.id)}
                className={`relative bg-white rounded-[20px] p-2.5 shadow-xs flex flex-col transition-all cursor-pointer ${
                  isSelected
                    ? 'border-2 border-[#0A1680] shadow-[0_6px_20px_-2px_rgba(10,22,128,0.16)]'
                    : 'border border-slate-200/80 hover:border-[#93B2F8]'
                }`}
              >
                <div className="w-full h-20 rounded-2xl overflow-hidden mb-2 relative bg-slate-100">
                  <img alt={opt.title} className="w-full h-full object-cover" src={opt.img} />
                </div>
                <div className="flex items-start justify-between gap-1">
                  <div className="flex flex-col">
                    <span
                      className={`text-[13px] font-bold leading-tight font-heading ${
                        isSelected ? 'text-[#0A1680]' : 'text-slate-900'
                      }`}
                    >
                      {opt.title}
                    </span>
                    <span
                      className={`text-[11px] font-medium mt-0.5 ${
                        isSelected ? 'text-slate-500' : 'text-slate-400'
                      }`}
                    >
                      {opt.sub}
                    </span>
                  </div>
                  {isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-[#0A1680] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                      <svg className="w-3 h-3 text-white stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M4.5 12.75l6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-[1.5px] border-slate-300 flex-shrink-0 mt-0.5" />
                  )}
                </div>
              </article>
            );
          })}
        </section>

        {/* Bottom Action Button */}
        <footer className="pt-1 pb-3">
          <button
            onClick={onNext}
            disabled={selectedTimes.length === 0}
            type="button"
            className="w-full h-12 bg-[#0A1680] text-white font-semibold text-[15px] rounded-2xl shadow-lg shadow-[#0A1680]/25 hover:bg-[#071060] active:scale-[0.99] transition duration-150 flex items-center justify-center disabled:opacity-50 cursor-pointer font-heading"
          >
            Lưu sở thích
          </button>
        </footer>
      </main>

      {/* iOS Home Indicator */}
      <div className="w-full pb-2 flex justify-center items-center">
        <div className="w-32 h-1 bg-slate-900/40 rounded-full" />
      </div>
    </div>
  );
};
