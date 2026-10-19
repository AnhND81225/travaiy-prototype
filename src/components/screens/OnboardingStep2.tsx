import React from 'react';
import { IOSStatusBar } from '../common/IOSStatusBar';

interface OnboardingStep2Props {
  selectedStyle: string;
  onChange: (style: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const OnboardingStep2: React.FC<OnboardingStep2Props> = ({
  selectedStyle,
  onChange,
  onNext,
  onBack,
}) => {
  const styles = [
    {
      id: 'Thư thả, tận hưởng',
      title: 'Thư thả',
      desc: 'Ít điểm đến, nhiều thời gian nghỉ',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBWA3q6NhKZB32PiCHLh_SamKl1RJ7ZbDVedyZY2CDHD4fa1Hud6SeTdjQr1KQH2vDxS4jxI4OQ25PzTv87Gt3ZUd51w3y8PdskKHbQ5OL04pC28yZAdrb6LwyOfrPmjh2-JC5CVRhCVRY7KYxzoxUl-oK9OCwyHUCeFmnS_le0fhKqcq4sNa-1PtyVHSIKRa8KbTkN8pA6giXagNCTiYCMN1SUylLQ9Yib4oB_oqcnpzVRH1juYw',
    },
    {
      id: 'Cân bằng',
      title: 'Cân bằng',
      desc: 'Kết hợp tham quan và nghỉ ngơi',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCr3H8z_ukqTF331YNvOCg-8-2EW3ywWZLwaQ4i10ISIC34UejyZsMEmFqi4Vv2rRjs23PsqejDyJHa5wiC9iQkP7B91OHFuyrBh8ywTUK1t--reupHDySHfu2_BV5a7dtOYm8Tkn_0fVxy7RjLIy34nhQgMvFQpsfi7xCuM6RwcYwodm5ISBW7HN0NiQVEQRorTDQmoXCSh11JC3Whhrv9XWBxC9-sNj-7H1POFwYWKq66mXHLZw',
    },
    {
      id: 'Khám phá thật nhiều',
      title: 'Nhiều hoạt động',
      desc: 'Dành nhiều thời gian tham quan',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHGulZmaPZ5Mr8Wg8dKUikaI151Iduigy7A7C6NTstrHR0sy6EzQMuh1hoYgYQq7V8NODCanMsZjlodUzWjQrseLM0vL--kAuHag1EvzL6mgJlDsIpMdf64SQIj42t0j_DpesJZZ24zFEwCgpIn4k6aX-ms7O8Ua96XNyX4DluP2BaduUzQKEmk2_sKNo9lnjjoz2QhQ2xJgjUiBn_pgamG8HrTTshBcm1yQLg7Op1GDwsFKB1SQ',
    },
  ];

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-hidden bg-[#FCFDFF] select-none text-slate-800">
      {/* Top Header & Progress */}
      <header className="pt-2 px-5 flex-shrink-0">
        <IOSStatusBar light={false} />

        <div className="flex items-center gap-3 pt-1 pb-2">
          <button
            onClick={onBack}
            aria-label="Quay lại"
            type="button"
            className="p-1 -ml-1 text-slate-800 hover:text-[#0A1680] transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="flex-1 flex flex-col justify-center">
            <span className="text-[11px] font-bold text-slate-400 tracking-wider mb-1 uppercase font-heading">
              BƯỚC 2/4
            </span>
            <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
              <div className="bg-[#0A1680] rounded-full h-full" />
              <div className="bg-[#0A1680] rounded-full h-full" />
              <div className="bg-slate-200 rounded-full h-full" />
              <div className="bg-slate-200 rounded-full h-full" />
            </div>
          </div>
          <div className="w-5" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 pt-3 overflow-y-auto no-scrollbar flex flex-col">
        <div className="mb-5">
          <h1 className="text-[22px] leading-tight font-extrabold text-slate-900 tracking-tight font-heading">
            Bạn muốn đi với nhịp độ nào?
          </h1>
        </div>

        <div className="space-y-3.5 flex-1 pb-4">
          {styles.map((s) => {
            const isSelected = selectedStyle === s.id;
            return (
              <div
                key={s.id}
                onClick={() => onChange(s.id)}
                className={`w-full bg-white rounded-2xl p-3 flex items-center gap-3.5 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-2 border-[#0A1680] shadow-[0_6px_20px_-2px_rgba(10,22,128,0.14)]'
                    : 'border border-slate-200/90 shadow-[0_4px_20px_-2px_rgba(10,22,128,0.06)] hover:border-slate-300'
                }`}
              >
                {/* Photo Thumbnail */}
                <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100 relative">
                  <img alt={s.title} className="w-full h-full object-cover" src={s.img} />
                </div>

                {/* Details */}
                <div className="flex-1 pr-2">
                  <h3
                    className={`text-[15px] font-bold leading-snug font-heading ${
                      isSelected ? 'text-[#0A1680]' : 'text-slate-900'
                    }`}
                  >
                    {s.title}
                  </h3>
                  <p className="text-[12px] text-slate-500 mt-0.5 leading-normal font-normal">
                    {s.desc}
                  </p>
                </div>

                {/* Radio Indicator */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mr-1 ${
                    isSelected ? 'border-[#0A1680]' : 'border-slate-300'
                  }`}
                >
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#0A1680]" />}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer Bottom Action */}
      <footer className="p-5 pt-2 bg-gradient-to-t from-[#FCFDFF] via-[#FCFDFF] to-transparent flex-shrink-0">
        <button
          onClick={onNext}
          type="button"
          className="w-full h-12 px-6 bg-[#0A1680] text-white font-semibold text-[15px] rounded-full shadow-lg shadow-[#0A1680]/20 hover:bg-opacity-95 active:scale-[0.99] transition-all flex items-center justify-center cursor-pointer font-heading"
        >
          Tiếp tục
        </button>
        <div className="w-32 h-1 bg-slate-300 rounded-full mx-auto mt-4 mb-0.5" />
      </footer>
    </div>
  );
};
