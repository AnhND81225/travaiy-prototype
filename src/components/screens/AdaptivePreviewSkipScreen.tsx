import React, { useState } from 'react';
import { IOSStatusBar } from '../common/IOSStatusBar';

interface AdaptivePreviewSkipScreenProps {
  onBack: () => void;
  onApplyNewSchedule: () => void;
}

export const AdaptivePreviewSkipScreen: React.FC<AdaptivePreviewSkipScreenProps> = ({
  onBack,
  onApplyNewSchedule,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2400);
  };

  const handleApply = () => {
    showToast('Đã áp dụng lịch trình mới thành công!');
    setTimeout(() => {
      onApplyNewSchedule();
    }, 600);
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#FCFDFF] text-[#191c1e] font-body-md antialiased select-none">
      {/* Header */}
      <header className="shrink-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <IOSStatusBar light={false} />
        <div className="h-14 px-5 flex items-center justify-between">
          <button
            onClick={onBack}
            aria-label="Quay lại"
            className="w-11 h-11 -ml-2 rounded-full flex items-center justify-center text-[#0A1680] hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
          >
            <svg fill="none" height="22" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" width="22">
              <path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <h1 className="text-base font-bold text-[#0A1680] tracking-tight font-heading">
            Xem trước điều chỉnh lịch
          </h1>
          <div className="w-11 h-11 -mr-2 flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F1B94C]/60" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-4 py-4 space-y-4">
        {/* Strategy Summary Card */}
        <section className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/70 p-4 rounded-2xl flex items-start space-x-3.5 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-[#F1B94C]/20 flex-shrink-0 flex items-center justify-center text-amber-700 text-lg mt-0.5">
            ⚠️
          </div>
          <div className="flex-1">
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-[#FBEDB0]/80 px-2 py-0.5 rounded-md mb-1 font-heading">
              Phương án giữ nhịp độ thư giãn
            </span>
            <h2 className="text-sm font-bold text-slate-800 leading-snug font-heading">
              Bỏ điểm trễ để giữ nhịp độ thư giãn
            </h2>
            <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
              Giúp bạn không bị dồn dập, ăn uống và nghỉ ngơi trọn vẹn.
            </p>
          </div>
        </section>

        {/* Main Branch Card */}
        <section className="bg-white border-2 border-[#93B2F8]/40 rounded-3xl p-4 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0A1680]" />
              <h3 className="text-sm font-bold text-[#0A1680] font-heading">
                Nhánh 2: Bỏ Thảo Cầm Viên hôm nay
              </h3>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-heading">
              <span>✓</span>
              <span>Khuyên dùng</span>
            </span>
          </div>

          {/* Timeline Nodes */}
          <div className="py-4 pl-1">
            <ol className="relative border-l-2 border-slate-200 space-y-5 ml-2.5">
              {/* Point 1: Cancelled */}
              <li className="ml-5 relative">
                <span className="absolute -left-[27px] top-1 flex items-center justify-center w-4 h-4 bg-red-100 rounded-full ring-4 ring-white text-rose-600 text-[10px] font-bold">
                  ✕
                </span>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400 line-through">09:30</span>
                    <span className="text-xs font-bold text-slate-400 line-through font-heading">Thảo Cầm Viên</span>
                    <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md font-heading">
                      Bỏ Thảo Cầm Viên hôm nay
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-through mt-0.5">Tham quan, chụp ảnh Linh Ứng</p>
                </div>
              </li>

              {/* Point 2: Lunch Unchanged */}
              <li className="ml-5 relative">
                <span className="absolute -left-[27px] top-1 flex items-center justify-center w-4 h-4 bg-[#0A1680] rounded-full ring-4 ring-white">
                  <span className="w-1.5 h-1.5 bg-white rounded-full" />
                </span>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#0A1680] font-heading">12:00 – 13:30</span>
                    <span className="text-xs font-bold text-slate-900 font-heading">Ăn trưa</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80 font-heading">
                      ⏱ Giữ nguyên giờ gốc 12:00
                    </span>
                  </div>
                </div>
              </li>

              {/* Point 3: My Khe Beach */}
              <li className="ml-5 relative">
                <span className="absolute -left-[27px] top-1 flex items-center justify-center w-4 h-4 bg-slate-300 rounded-full ring-4 ring-white">
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full" />
                </span>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700 font-heading">15:00 – 17:30</span>
                    <span className="text-xs font-bold text-slate-800 font-heading">Công viên Tao Đàn</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Tắm biển, dạo mát · <span className="text-slate-600 font-medium">Giữ nguyên lịch trình</span>
                  </p>
                </div>
              </li>

              {/* Point 4: Dinner */}
              <li className="ml-5 relative">
                <span className="absolute -left-[27px] top-1 flex items-center justify-center w-4 h-4 bg-slate-300 rounded-full ring-4 ring-white">
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full" />
                </span>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-700 font-heading">19:00</span>
                    <span className="text-xs font-bold text-slate-800 font-heading">Ăn tối</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    <span className="text-slate-600 font-medium">Giữ nguyên lịch trình</span>
                  </p>
                </div>
              </li>
            </ol>
          </div>

          {/* AI Commitment */}
          <div className="mt-2 pt-3 border-t border-dashed border-slate-200 bg-[#FCFDFF] -mx-4 -mb-4 px-4 py-3 rounded-b-3xl flex items-start space-x-2.5">
            <span className="text-[#0A1680] text-sm shrink-0">🛡️</span>
            <p className="text-xs text-slate-700 leading-snug">
              <strong className="text-[#0A1680] font-heading">Cam kết:</strong> Không tự ý thêm điểm mới lạ. Giữ nhịp độ thư giãn cho hành trình.
            </p>
          </div>
        </section>

        {/* Cost & Ticket Info */}
        <section className="bg-blue-50/70 border border-blue-100 rounded-2xl p-3.5 flex items-center space-x-3 shadow-2xs">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-2xs flex-shrink-0 text-sm">
            🎟️
          </div>
          <p className="text-xs text-slate-700 leading-snug">
            Điểm <strong>Thảo Cầm Viên chưa xác minh giá vé</strong>. Không phát sinh chi phí hủy vé hay phụ thu phát sinh.
          </p>
        </section>
      </main>

      {/* Fixed Bottom Dock */}
      <footer className="shrink-0 w-full z-30 bg-white/95 backdrop-blur-md border-t border-slate-100 px-5 py-3">
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleApply}
            className="w-full h-11 bg-[#0A1680] hover:bg-[#081269] active:scale-[0.98] text-white rounded-full font-heading font-bold text-xs tracking-wide shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>Áp dụng lịch mới</span>
            <span>→</span>
          </button>
          <button
            type="button"
            onClick={onBack}
            className="w-full h-9 bg-transparent hover:bg-slate-50 active:scale-[0.98] text-slate-600 rounded-full font-heading font-semibold text-xs border border-slate-200 transition-all cursor-pointer"
          >
            Giữ lịch cũ / Quay lại
          </button>
        </div>
      </footer>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-slate-900/90 text-white text-xs font-semibold shadow-xl animate-in fade-in duration-200">
          {toastMessage}
        </div>
      )}
    </div>
  );
};
