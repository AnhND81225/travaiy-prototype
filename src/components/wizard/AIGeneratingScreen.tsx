import React, { useEffect, useRef, useState } from 'react';
import { IOSStatusBar } from '../common/IOSStatusBar';

interface AIGeneratingScreenProps {
  onComplete: () => void;
  onCancel: () => void;
}

export const AIGeneratingScreen: React.FC<AIGeneratingScreenProps> = ({
  onComplete,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState(3);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const completeRef=useRef(onComplete);completeRef.current=onComplete;
  const finished=useRef(false);
  const complete=()=>{if(!finished.current){finished.current=true;completeRef.current();}};

  useEffect(() => {
    if(showCancelDialog)return;
    const timer1 = setTimeout(() => {
      setCurrentStep(4);
    }, 1500);

    const timer2 = setTimeout(() => {
      setCurrentStep(5);
    }, 2800);

    const timer3 = setTimeout(() => {
      complete();
    }, 3800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [showCancelDialog]);

  return (
    <div className="relative w-full h-full min-h-0 bg-[#FCFDFF] flex flex-col overflow-hidden select-none text-slate-800">
      {/* Header */}
      <header className="shrink-0 w-full z-40 bg-white/90 backdrop-blur-md border-b border-[#0A1680]/10">
        <IOSStatusBar light={false} />
        <div className="h-14 px-5 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => setShowCancelDialog(true)}
              aria-label="Quay lại"
              type="button"
              className="w-10 h-10 -ml-1 flex items-center justify-center rounded-full text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5 text-slate-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="font-bold text-[17px] text-[#0A1680] truncate font-heading">
              AI đang tạo lịch trình
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#0A1680] flex items-center justify-center text-white text-xs font-bold font-heading">
              👤
            </div>
          </div>
        </div>
      </header>

      {/* Main Spinner & Step Progress Cards */}
      <main className="px-5 pt-4 pb-6 flex-1 min-h-0 overflow-y-auto flex flex-col gap-4 max-w-md mx-auto w-full text-center">
        {/* Spinner Header */}
        <div className="flex flex-col items-center justify-center pt-2 text-center">
          <div className="relative w-20 h-20 mb-3 flex items-center justify-center">
            <div className="absolute w-16 h-16 rounded-full border-2 border-[#0A1680]/10" />
            <div className="absolute w-16 h-16 rounded-full border-2 border-[#0A1680] border-t-transparent animate-spin" />
            <div className="relative w-12 h-12 rounded-full bg-[#FBEDB0]/80 flex items-center justify-center shadow-xs border border-[#F1B94C]/40">
              <span className="text-[#0A1680] text-xl animate-pulse">✦</span>
            </div>
          </div>

          <h2 className="text-[20px] font-bold text-[#0A1680] tracking-tight font-heading">
            {currentStep === 5
              ? 'Lịch trình đã sẵn sàng!'
              : 'Đang tạo lịch trình tối ưu cho bạn...'}
          </h2>
          <p className="text-[13px] text-slate-500 mt-1 font-medium">
            Đang sắp xếp địa điểm theo chuyến đi của bạn
          </p>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBEDB0]/70 text-[#0A1680] mt-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F1B94C] animate-pulse" />
            <span className="text-[11px] font-semibold font-heading">
              Bước {currentStep} / 5
            </span>
          </div>
        </div>

        {/* Steps Card with Vertical Progress Line */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col text-left">
          <div className="relative flex flex-col gap-1.5">
            {/* Timeline Vertical Line */}
            <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-slate-200 -z-0">
              <div
                className="w-full bg-[#0A1680] transition-all duration-500"
                style={{
                  height: currentStep === 3 ? '50%' : currentStep === 4 ? '75%' : '100%',
                }}
              />
            </div>

            {/* Step 1 */}
            <div className="relative z-10 flex items-center gap-3 py-2">
              <div className="w-8 h-8 rounded-full bg-[#0A1680] flex items-center justify-center text-white shrink-0 shadow-xs">
                ✓
              </div>
              <div className="flex items-center justify-between flex-1">
                <span className="text-[14px] font-semibold text-[#0A1680] font-heading">
                  Tìm địa điểm phù hợp
                </span>
                <span className="text-[11px] text-[#0A1680]/60 font-medium">Hoàn tất</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex items-center gap-3 py-2">
              <div className="w-8 h-8 rounded-full bg-[#0A1680] flex items-center justify-center text-white shrink-0 shadow-xs">
                ✓
              </div>
              <div className="flex items-center justify-between flex-1">
                <span className="text-[14px] font-semibold text-[#0A1680] font-heading">
                  Kiểm tra thông tin chi tiết
                </span>
                <span className="text-[11px] text-[#0A1680]/60 font-medium">Hoàn tất</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex items-center gap-3 py-2">
              {currentStep > 3 ? (
                <div className="w-8 h-8 rounded-full bg-[#0A1680] flex items-center justify-center text-white shrink-0 shadow-xs">
                  ✓
                </div>
              ) : (
                <div className="relative w-8 h-8 rounded-full bg-[#FBEDB0] border-2 border-[#F1B94C] flex items-center justify-center text-[#0A1680] font-bold shrink-0 shadow-xs font-heading">
                  <span>3</span>
                  <span className="absolute -inset-1 rounded-full bg-[#F1B94C]/30 animate-ping pointer-events-none" />
                </div>
              )}
              <div className="flex items-center justify-between flex-1">
                <span
                  className={`text-[14px] font-heading ${
                    currentStep >= 3 ? 'font-bold text-[#0A1680]' : 'text-slate-400'
                  }`}
                >
                  Sắp xếp thứ tự hợp lý
                </span>
                <span className="text-[11px] text-[#0A1680] font-semibold flex items-center gap-1">
                  {currentStep === 3 ? (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F1B94C] animate-pulse" />
                      Đang xử lý
                    </>
                  ) : (
                    'Hoàn tất'
                  )}
                </span>
              </div>
            </div>

            {/* Step 4 */}
            <div
              className={`relative z-10 flex items-center gap-3 py-2 transition-opacity ${
                currentStep >= 4 ? 'opacity-100' : 'opacity-40'
              }`}
            >
              {currentStep > 4 ? (
                <div className="w-8 h-8 rounded-full bg-[#0A1680] flex items-center justify-center text-white shrink-0 shadow-xs">
                  ✓
                </div>
              ) : currentStep === 4 ? (
                <div className="relative w-8 h-8 rounded-full bg-[#FBEDB0] border-2 border-[#F1B94C] flex items-center justify-center text-[#0A1680] font-bold shrink-0 shadow-xs font-heading">
                  <span>4</span>
                  <span className="absolute -inset-1 rounded-full bg-[#F1B94C]/30 animate-ping pointer-events-none" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 font-heading">
                  4
                </div>
              )}
              <div className="flex items-center justify-between flex-1">
                <span
                  className={`text-[14px] font-heading ${
                    currentStep >= 4 ? 'font-bold text-[#0A1680]' : 'text-slate-600'
                  }`}
                >
                  Ước tính thời gian &amp; chi phí
                </span>
                {currentStep === 4 && (
                  <span className="text-[11px] text-[#0A1680] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F1B94C] animate-pulse" />
                    Đang xử lý
                  </span>
                )}
                {currentStep > 4 && (
                  <span className="text-[11px] text-[#0A1680]/60 font-medium">Hoàn tất</span>
                )}
              </div>
            </div>

            {/* Step 5 */}
            <div
              className={`relative z-10 flex items-center gap-3 py-2 transition-opacity ${
                currentStep >= 5 ? 'opacity-100' : 'opacity-40'
              }`}
            >
              {currentStep === 5 ? (
                <div className="w-8 h-8 rounded-full bg-[#0A1680] flex items-center justify-center text-white shrink-0 shadow-xs">
                  ✓
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 font-heading">
                  5
                </div>
              )}
              <div className="flex items-center justify-between flex-1">
                <span
                  className={`text-[14px] font-heading ${
                    currentStep === 5 ? 'font-bold text-[#0A1680]' : 'text-slate-600'
                  }`}
                >
                  Hoàn tất lịch trình
                </span>
                {currentStep === 5 && (
                  <span className="text-[11px] text-[#0A1680] font-bold">Xong!</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button: Xem & Duyệt ngay */}
        <div className="flex flex-col gap-2 pt-2">
          <button
            onClick={complete}
            type="button"
            className="w-full py-3.5 px-4 rounded-xl bg-[#0A1680] text-white font-bold text-[15px] flex items-center justify-center gap-2 hover:opacity-95 active:scale-95 transition-all shadow-md cursor-pointer font-heading"
          >
            <span>Xem &amp; Duyệt lịch trình ngay →</span>
          </button>
          <p className="text-center text-[12px] text-slate-400">
            Bản xem trước dùng dữ liệu mẫu · tự động chuyển khi hoàn tất
          </p>
        </div>
      </main>

      {/* CANCEL MODAL */}
      {showCancelDialog && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setShowCancelDialog(false)}
          />
          <div className="w-[340px] max-w-[90vw] bg-white rounded-[28px] p-6 flex flex-col items-center text-center shadow-2xl border border-slate-100 z-10 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-[#FBEDB0] text-[#0A1680] flex items-center justify-center mb-3 text-xl font-bold">
              ?
            </div>
            <h3 className="text-[18px] font-bold text-[#0A1680] tracking-tight mb-1 font-heading">
              Hủy tạo lịch trình?
            </h3>
            <p className="text-[13px] text-slate-600 leading-relaxed mb-5">
              Quá trình phân tích và tối ưu tuyến đường sẽ dừng lại. Bạn có thể tạo lại bất cứ lúc nào.
            </p>
            <div className="flex flex-col w-full gap-2">
              <button
                type="button"
                onClick={() => setShowCancelDialog(false)}
                className="w-full h-11 rounded-[16px] bg-[#0A1680] text-white font-bold text-[14px] shadow-sm font-heading cursor-pointer"
              >
                Tiếp tục đợi
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="w-full h-11 rounded-[16px] bg-slate-100 text-rose-600 font-semibold text-[14px] cursor-pointer"
              >
                Hủy tạo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
