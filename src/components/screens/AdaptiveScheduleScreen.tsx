import React, { useState } from 'react';
import { IOSStatusBar } from '../common/IOSStatusBar';

interface AdaptiveScheduleScreenProps {
  onBack: () => void;
  onApplyPlan?: () => void;
  onOpenPreviewSkip?: () => void;
}

export const AdaptiveScheduleScreen: React.FC<AdaptiveScheduleScreenProps> = ({
  onBack,
  onApplyPlan,
  onOpenPreviewSkip,
}) => {
  const [activeTab, setActiveTab] = useState<'weather' | 'delay'>('weather');
  const [selectedWeatherOption, setSelectedWeatherOption] = useState<number>(1);
  const [selectedDelayBranch, setSelectedDelayBranch] = useState<'go' | 'skip'>('go');

  // Modals state
  const [showConfirmApplyModal, setShowConfirmApplyModal] = useState(false);
  const [showWeatherWarningSheet, setShowWeatherWarningSheet] = useState(false);
  const [showAIOptionsSheet, setShowAIOptionsSheet] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showUndo, setShowUndo] = useState(false);

  // AI Criteria state
  const [aiCriteria, setAiCriteria] = useState<'indoor' | 'budget' | 'commute'>('indoor');
  const [autoWeatherEnabled, setAutoWeatherEnabled] = useState(true);

  const showToast = (msg: string, withUndo = false) => {
    setToastMessage(msg);
    setShowUndo(withUndo);
    setTimeout(() => {
      setToastMessage(null);
      setShowUndo(false);
    }, 3000);
  };

  const handleApplyWeatherPlan = () => {
    setShowConfirmApplyModal(false);
    showToast(
      selectedWeatherOption === 1
        ? 'Đã áp dụng lịch trình: Đi Hội An chiều nay! ✨'
        : 'Đã áp dụng lịch trình: Đi Mỹ Khê chiều nay, Bà Nà dời ngày mai! ☀️',
      true
    );
    if (onApplyPlan) onApplyPlan();
  };

  const handleApplyDelayBranch = (branch: 'go' | 'skip') => {
    if (branch === 'go') {
      showToast('Đã áp dụng lịch mới: Dời giờ Sơn Trà sang 11:00 🚗', true);
    } else {
      showToast('Đã áp dụng lịch mới: Bỏ qua Sơn Trà để giữ nhịp nghỉ ngơi 🌴', true);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#f8f9fb] text-[#191c1e] antialiased select-none">
      {/* Header */}
      <header className="shrink-0 z-30 bg-[#f8f9fb]/90 backdrop-blur-xl border-b border-[#edeef0]">
        <IOSStatusBar light={false} />
        <div className="h-14 px-5 flex items-center justify-between">
          <button
            onClick={onBack}
            aria-label="Quay lại"
            className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full text-[#191c1e] hover:bg-[#edeef0] transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h1 className="font-bold text-[18px] text-[#191c1e] font-heading">
            Điều chỉnh lịch trình
          </h1>
          <button
            onClick={() => setShowAIOptionsSheet(true)}
            aria-label="Tùy chọn bổ sung"
            className="w-10 h-10 -mr-2 flex items-center justify-center rounded-full text-[#454652] hover:bg-[#edeef0] transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-5 pt-3 pb-24 flex flex-col gap-4">
        {/* Scenario Tabs (Thời tiết vs Adaptive Trễ giờ) */}
        <div className="flex items-center p-1 bg-[#edeef0] rounded-full gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('weather')}
            className={`flex-1 py-1.5 px-3 rounded-full text-center font-heading text-[12px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'weather'
                ? 'bg-[#0A1680] text-white shadow-xs'
                : 'text-[#454652] hover:text-[#191c1e]'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
              <path d="m13 15-2 4h3l-1 4" />
            </svg>
            <span>Thời tiết (Mưa lớn)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('delay')}
            className={`flex-1 py-1.5 px-3 rounded-full text-center font-heading text-[12px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'delay'
                ? 'bg-[#0A1680] text-white shadow-xs'
                : 'text-[#454652] hover:text-[#191c1e]'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>Adaptive Trễ giờ</span>
          </button>
        </div>

        {/* TAB 1: THỜI TIẾT SCENARIO */}
        {activeTab === 'weather' && (
          <div className="flex flex-col gap-3.5">
            {/* Warning Card */}
            <div
              onClick={() => setShowWeatherWarningSheet(true)}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-2 cursor-pointer hover:border-blue-300 transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100/70 text-rose-600 font-heading font-bold text-[12px]">
                  <svg className="w-4 h-4 text-rose-600 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
                    <path d="m13 15-2 4h3l-1 4" />
                  </svg>
                  <span>Thời tiết thay đổi</span>
                </div>
              </div>
              <p className="text-[13px] text-slate-700 leading-relaxed">
                Dự báo chiều nay mưa lớn tại <strong className="text-[#0A1680]">Bà Nà Hills</strong>, TravAIy đề xuất điều chỉnh lịch trình phù hợp.
              </p>
            </div>

            {/* Section Heading */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[#0A1680] text-sm">✦</span>
              <h2 className="font-heading font-bold text-[16px] text-slate-900">
                Phương án đề xuất
              </h2>
            </div>

            {/* Proposed Options */}
            <div className="flex flex-col gap-3.5">
              {/* Option 1: Selected & Recommended */}
              <div
                onClick={() => setSelectedWeatherOption(1)}
                className={`bg-white rounded-2xl p-4 shadow-sm transition-all duration-200 cursor-pointer ${
                  selectedWeatherOption === 1
                    ? 'ring-2 ring-[#0A1680] bg-blue-50/20'
                    : 'border border-slate-200/80 hover:border-[#0A1680]/30'
                }`}
              >
                <div className="flex items-center justify-between pb-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0A1680] text-white font-heading font-bold text-[11px] shadow-xs">
                    <span>★ Phương án 1 (Đề xuất)</span>
                  </div>
                  {selectedWeatherOption === 1 ? (
                    <div className="w-6 h-6 rounded-full bg-[#0A1680] text-white flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-slate-300" />
                  )}
                </div>

                <div className="grid grid-cols-5 items-center gap-2 py-2">
                  <div className="col-span-2 flex flex-col gap-1 items-center text-center">
                    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 shadow-xs">
                      <img
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDm-mGD2_kjO_m4SNx1G_-1AlZnZsnm0-U6_vbRQ-kiLj-VvCrqG4cQDYzmplnPmCzsrdOGZQC7GlE-VLNHfZePi-NSOgNR3QH7llZXIv1Hc-t5BeOgz5hN_cGXOu0AECGTxFjA27JUGhDZX9zCpCcrw1ntuTt7sw829z9dQNHGyEbwMm-x_L_2B3YcdlEwG1o2_cDgXDIx7AqdzWhF39ZQhQ5jxfLgD05Y-j3wc_s6_1trEeqD0Q"
                        alt="Bà Nà Hills"
                      />
                    </div>
                    <span className="font-heading font-bold text-[13px] text-slate-800 line-clamp-1">
                      Bà Nà Hills
                    </span>
                    <span className="text-[11px] text-slate-400">Chiều nay</span>
                  </div>

                  <div className="col-span-1 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[#0A1680]">
                      →
                    </div>
                  </div>

                  <div className="col-span-2 flex flex-col gap-1 items-center text-center">
                    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 shadow-xs">
                      <img
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmDX9C4RIFDYBDCu7tkGQpw3NMJhxCXDJAR4ajBLq_JzwEg-YbrSON49BfpnSI82TZLUtU8CRj4ZLJqjaXDfGwwvcHK1mtuVs5b8CvsPNfy-GsnMyUtRms7B3EFA5W-9fVxJniBI3_kMiqOeUBTKYIm9-ymus-UmQCyPzxotz0i62Bs5DZsVi4qEKfnPW-19oT55f4Fe4lAPgojrtUnrMnKm0mGcmEtHYTrBmfnzmxYW1t35efrg"
                        alt="Phố cổ Hội An"
                      />
                    </div>
                    <span className="font-heading font-bold text-[13px] text-[#0A1680] line-clamp-1">
                      Phố cổ Hội An
                    </span>
                    <span className="text-[11px] text-[#0A1680] font-semibold">Chiều nay</span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 flex flex-col gap-1.5 bg-slate-50 rounded-xl p-2.5 text-xs text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Tránh thời tiết xấu</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Vẫn trải nghiệm điểm đến hấp dẫn</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>Thời gian di chuyển hợp lý</span>
                  </div>
                </div>
              </div>

              {/* Option 2: Alternate */}
              <div
                onClick={() => setSelectedWeatherOption(2)}
                className={`bg-white rounded-2xl p-4 shadow-sm transition-all duration-200 cursor-pointer ${
                  selectedWeatherOption === 2
                    ? 'ring-2 ring-[#0A1680] bg-blue-50/20'
                    : 'border border-slate-200/80 hover:border-[#0A1680]/30'
                }`}
              >
                <div className="flex items-center justify-between pb-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 font-heading font-bold text-[11px]">
                    <span>Phương án 2</span>
                  </div>
                  {selectedWeatherOption === 2 ? (
                    <div className="w-6 h-6 rounded-full bg-[#0A1680] text-white flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-slate-300" />
                  )}
                </div>

                <div className="grid grid-cols-5 items-center gap-2 py-2">
                  <div className="col-span-2 flex flex-col gap-1 items-center text-center">
                    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 shadow-xs">
                      <img
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAemgXFHHm8x9cm5xTBJnVP5wR6iHOB_qxR8kblOAyY6WsHPX_o7-BBB0Q7RbPbIomDQohwi7b0ubqo4S5mQHujWwyqb4hsK0rrrY0BMjreh8VjQJy03W4820OM9l6ssH3bxx8CvMF7-wCRlqgycdXGysg4es3hdZFx3yMkeb5cghXR6x-I4sSB0ws2uoIveCAyTVx_zdhxvodqsGa-1VVy12UUWcfmoSH275ZQJjUoRxlZkGrkGQ"
                        alt="Bà Nà"
                      />
                    </div>
                    <span className="font-heading font-bold text-[13px] text-slate-800 line-clamp-1">
                      Bà Nà Hills
                    </span>
                    <span className="text-[11px] text-slate-400">Ngày mai</span>
                  </div>

                  <div className="col-span-1 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                      →
                    </div>
                  </div>

                  <div className="col-span-2 flex flex-col gap-1 items-center text-center">
                    <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 shadow-xs">
                      <img
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLcuETr8Z6wybqkiFwjYhm-FRRvUuK3TdpsUhqgJ7EgtfU3MrNTuIgWLU7W1UlkBHRIGWC5LtjZvvvuKPWzSCuSk7xH8r4HmTo8UYsDrgf8Vp-DhET1jXFYgDuDNFyTSODem-4aMtCtCuqXVLQGE-59Ui5uZfBz4kjHeWsNelJrLSznnXYmHxQQrZhw1JENmBaHyowGXu9cL0JgBxsFv1qTHnGZQpiCP6fvXPLp-N3B2i83HXe5w"
                        alt="Mỹ Khê"
                      />
                    </div>
                    <span className="font-heading font-bold text-[13px] text-slate-800 line-clamp-1">
                      Biển Mỹ Khê
                    </span>
                    <span className="text-[11px] text-slate-400">Chiều nay</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ADAPTIVE TRỄ GIỜ SCENARIO */}
        {activeTab === 'delay' && (
          <div className="flex flex-col gap-3.5">
            {/* Delay Warning */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-heading text-[12px] font-bold">
                  <span>⏱ Phát hiện trễ giờ 60 phút</span>
                </div>
                <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full font-mono">
                  Cập nhật 09:45
                </span>
              </div>
              <p className="text-[13px] text-slate-700 leading-relaxed">
                Bạn dự kiến đến <strong className="text-[#0A1680]">Bán đảo Sơn Trà</strong> trễ 60 phút (từ 09:30 sang 10:30 - 11:00). TravAIy đề xuất 2 nhánh xử lý tự động:
              </p>
            </div>

            {/* Branch Switcher */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#edeef0] rounded-2xl">
              <button
                type="button"
                onClick={() => setSelectedDelayBranch('go')}
                className={`py-2 px-3 rounded-xl font-heading text-[13px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectedDelayBranch === 'go'
                    ? 'bg-[#0A1680] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>✓ Vẫn muốn đi</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedDelayBranch('skip')}
                className={`py-2 px-3 rounded-xl font-heading text-[13px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  selectedDelayBranch === 'skip'
                    ? 'bg-[#0A1680] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>✕ Bỏ qua điểm này</span>
              </button>
            </div>

            {/* Branch 1 Content: Vẫn muốn đi */}
            {selectedDelayBranch === 'go' && (
              <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-3 border border-blue-200">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0A1680]" />
                    <span className="font-heading font-bold text-[14px] text-[#0A1680]">
                      Nhánh 1: Dời giờ & Tối ưu lịch trình
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-[#0A1680]">
                    Khuyên dùng
                  </span>
                </div>

                <div className="flex flex-col gap-2 text-xs">
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">Bán đảo Sơn Trà</span>
                        <span className="font-bold text-[#0A1680]">11:00 – 12:00</span>
                      </div>
                      <span className="text-rose-500 text-[11px]">Lùi 60 phút (Lịch gốc: 09:30)</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">Ăn trưa Hải sản Bé Mặn</span>
                        <span className="font-bold text-slate-800">12:30 – 14:00</span>
                      </div>
                      <span className="text-amber-700 text-[11px]">Ăn trưa lùi 30 phút, thay vì 12:00</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-50 opacity-80">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700">Bãi biển Mỹ Khê</span>
                        <span className="text-slate-500">15:00 – 17:30</span>
                      </div>
                      <span className="text-slate-400 text-[11px]">Giữ nguyên giờ</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/50 text-[12px] text-slate-700">
                  <span className="font-bold text-[#0A1680] block mb-0.5">Đánh giá tác động thời gian:</span>
                  Tổng thời gian dời 60 phút, không ảnh hưởng các điểm chiều & tối. Sơn Trà mở cửa tự do không tốn phí vé.
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleApplyDelayBranch('go')}
                    className="w-full h-11 rounded-full bg-[#0A1680] text-white font-heading font-bold text-xs shadow-md hover:bg-[#071060] cursor-pointer"
                  >
                    Áp dụng lịch mới (Dời 60 phút)
                  </button>
                  <button
                    type="button"
                    onClick={onBack}
                    className="w-full h-10 rounded-full bg-slate-100 text-slate-700 font-heading font-semibold text-xs hover:bg-slate-200 cursor-pointer"
                  >
                    Giữ lịch cũ / Quay lại
                  </button>
                </div>
              </div>
            )}

            {/* Branch 2 Content: Bỏ qua điểm này */}
            {selectedDelayBranch === 'skip' && (
              <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col gap-3 border border-slate-200">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span className="font-heading font-bold text-[14px] text-slate-900">
                      Nhánh 2: Bỏ điểm trễ & Giữ nhịp thư giãn
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    Nghỉ ngơi
                  </span>
                </div>

                <div className="flex flex-col gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-rose-50/60 border border-rose-200/50">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-500 line-through">Bán đảo Sơn Trà</span>
                      <span className="text-rose-600 font-semibold text-[11px]">Bỏ Sơn Trà hôm nay</span>
                    </div>
                    <span className="text-rose-500 text-[11px]">Bỏ qua hôm nay (không dồn ép di chuyển)</span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">Ăn trưa</span>
                      <span className="font-bold text-slate-800">12:00 – 13:30</span>
                    </div>
                    <span className="text-slate-500 text-[11px]">Giữ nguyên giờ gốc 12:00</span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 opacity-80">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700">Bãi biển Mỹ Khê</span>
                      <span className="text-slate-500">15:00 – 17:30</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">Giữ nguyên</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <button
                    type="button"
                    onClick={onOpenPreviewSkip}
                    className="w-full h-10 rounded-full border border-blue-200 bg-blue-50 text-[#0A1680] font-heading font-bold text-xs hover:bg-blue-100 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>🔍</span>
                    <span>Xem chi tiết Nhánh 2 (Bỏ điểm trễ)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyDelayBranch('skip')}
                    className="w-full h-11 rounded-full bg-[#0A1680] text-white font-heading font-bold text-xs shadow-md hover:bg-[#071060] cursor-pointer"
                  >
                    Áp dụng lịch mới (Bỏ Sơn Trà)
                  </button>
                  <button
                    type="button"
                    onClick={onBack}
                    className="w-full h-10 rounded-full bg-slate-100 text-slate-700 font-heading font-semibold text-xs hover:bg-slate-200 cursor-pointer"
                  >
                    Giữ lịch cũ / Quay lại
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Weather Fixed Bottom Action Bar */}
      {activeTab === 'weather' && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md px-5 pt-3 pb-safe border-t border-slate-100 shadow-lg flex flex-col gap-2 max-w-[390px] mx-auto">
          <button
            type="button"
            onClick={() => setShowConfirmApplyModal(true)}
            className="w-full h-12 rounded-full bg-[#0A1680] text-white font-heading text-[15px] font-bold flex items-center justify-center gap-2 shadow-md hover:bg-[#071060] cursor-pointer"
          >
            <span>Áp dụng đề xuất</span>
            <span>✓</span>
          </button>
          <button
            type="button"
            onClick={onBack}
            className="w-full h-10 rounded-full bg-slate-100 text-[#0A1680] font-heading text-[13px] font-bold hover:bg-slate-200 cursor-pointer"
          >
            Giữ lịch trình cũ
          </button>
        </div>
      )}

      {/* POPUP 1: Confirmation Apply Plan Modal */}
      {showConfirmApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setShowConfirmApplyModal(false)}
          />
          <div className="relative bg-white rounded-[28px] p-6 shadow-2xl w-full max-w-[342px] flex flex-col gap-4 z-10 border border-slate-100 text-center animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-[#0A1680] flex items-center justify-center mx-auto text-xl font-bold">
              ✦
            </div>
            <div>
              <h3 className="text-[18px] font-bold text-slate-900 font-heading">
                Xác nhận áp dụng đề xuất
              </h3>
              <p className="text-[12px] text-slate-500 mt-1 leading-relaxed">
                Lịch trình chuyến đi của bạn sẽ được tự động điều chỉnh theo phương án tối ưu:
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-3.5 flex flex-col gap-2 border border-slate-200/80 text-left">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800 block">Bà Nà Hills</span>
                  <span className="text-[10px] text-slate-400">Chiều nay</span>
                </div>
                <span className="text-[#0A1680] font-bold text-sm">→</span>
                <div className="text-right">
                  <span className="font-bold text-[#0A1680] block">
                    {selectedWeatherOption === 1 ? 'Phố cổ Hội An' : 'Biển Mỹ Khê'}
                  </span>
                  <span className="text-[10px] text-[#0A1680]">Chiều nay</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
                ✓ Đã đồng bộ vé cáp treo & dịch vụ đưa đón liên quan
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={handleApplyWeatherPlan}
                className="w-full h-11 rounded-full bg-[#0A1680] text-white font-heading font-semibold text-xs shadow-md hover:bg-[#071060] cursor-pointer"
              >
                Xác nhận áp dụng
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmApplyModal(false)}
                className="w-full h-10 rounded-full text-slate-600 font-heading font-medium text-xs hover:bg-slate-100 cursor-pointer"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP 2: Weather Warning Detail Sheet */}
      {showWeatherWarningSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setShowWeatherWarningSheet(false)}
          />
          <div className="relative bg-white rounded-t-[28px] p-5 w-full max-w-[390px] shadow-2xl z-10 flex flex-col gap-3.5 animate-in slide-in-from-bottom duration-200">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto shrink-0" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-sm font-bold">
                  🌧️
                </div>
                <div>
                  <h3 className="font-bold text-[16px] text-slate-900 font-heading">
                    Radar thời tiết trực tiếp
                  </h3>
                  <p className="text-[11px] text-slate-500">Trạm khí tượng Bà Nà & Đà Nẵng</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowWeatherWarningSheet(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                <span className="text-[11px] text-slate-500 block">Lượng mưa dự kiến</span>
                <span className="text-[20px] font-bold text-rose-600 font-heading">45 mm</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Cấp độ mưa rào kèm dông</span>
              </div>
              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                <span className="text-[11px] text-slate-500 block">Khung giờ ảnh hưởng</span>
                <span className="text-[16px] font-bold text-slate-900 font-heading">14:00 - 17:30</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Xác suất có mưa: 88%</span>
              </div>
            </div>

            {/* Explanation */}
            <div className="bg-blue-50/70 border border-blue-200/50 rounded-2xl p-3.5 text-xs text-slate-700 leading-relaxed">
              <strong className="text-[#0A1680] block mb-1">Lý do TravAIy đề xuất dời lịch:</strong>
              Khu vực đỉnh núi Bà Nà có độ cao 1.487m thường xuyên có sương mù dày đặc và gió lốc khi mưa lớn, khiến cáp treo tạm dừng hoạt động và tầm nhìn dưới 10m. Dời sang ngày mai (dự báo trời nắng 29°C) sẽ giúp trải nghiệm trọn vẹn hơn.
            </div>

            <button
              type="button"
              onClick={() => setShowWeatherWarningSheet(false)}
              className="w-full py-3 rounded-full bg-[#0A1680] text-white text-xs font-bold font-heading hover:bg-[#071060] cursor-pointer mt-1"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}

      {/* POPUP 3: AI Adjust Options Sheet */}
      {showAIOptionsSheet && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setShowAIOptionsSheet(false)}
          />
          <div className="relative bg-white rounded-t-[28px] p-5 w-full max-w-[390px] shadow-2xl z-10 flex flex-col gap-3.5 animate-in slide-in-from-bottom duration-200">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto shrink-0" />
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <h3 className="font-bold text-[16px] text-slate-900 font-heading">
                Tùy chọn gợi ý AI
              </h3>
              <button
                type="button"
                onClick={() => setShowAIOptionsSheet(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-heading">
                Thay đổi tiêu chí đề xuất
              </span>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => setAiCriteria('indoor')}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    aiCriteria === 'indoor'
                      ? 'border-[#0A1680] bg-blue-50/40'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <span className="font-bold text-[13px] text-slate-900 font-heading block">
                      Ưu tiên điểm trong nhà
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Bảo tàng, ẩm thực, workshop văn hóa
                    </span>
                  </div>
                  {aiCriteria === 'indoor' && <span className="text-[#0A1680] font-bold">✓</span>}
                </button>

                <button
                  type="button"
                  onClick={() => setAiCriteria('budget')}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    aiCriteria === 'budget'
                      ? 'border-[#0A1680] bg-blue-50/40'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <span className="font-bold text-[13px] text-slate-900 font-heading block">
                      Tiết kiệm chi phí
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Tận dụng vé đã đặt và điểm miễn phí
                    </span>
                  </div>
                  {aiCriteria === 'budget' && <span className="text-[#0A1680] font-bold">✓</span>}
                </button>

                <button
                  type="button"
                  onClick={() => setAiCriteria('commute')}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    aiCriteria === 'commute'
                      ? 'border-[#0A1680] bg-blue-50/40'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <span className="font-bold text-[13px] text-slate-900 font-heading block">
                      Ít di chuyển nhất
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Bán kính dưới 3km quanh khách sạn
                    </span>
                  </div>
                  {aiCriteria === 'commute' && <span className="text-[#0A1680] font-bold">✓</span>}
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[13px] font-bold text-slate-800 block font-heading">
                  Tự động gợi ý thời tiết
                </span>
                <span className="text-[11px] text-slate-500">Bật thông báo khi có mưa bão</span>
              </div>
              <button
                type="button"
                onClick={() => setAutoWeatherEnabled(!autoWeatherEnabled)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer p-0.5 ${
                  autoWeatherEnabled ? 'bg-[#0A1680]' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                    autoWeatherEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/90 backdrop-blur-md text-white text-xs font-semibold shadow-lg animate-in fade-in zoom-in duration-200">
          <span>{toastMessage}</span>
          {showUndo && (
            <button
              type="button"
              onClick={() => {
                showToast('Đã hoàn tác, lịch trình được giữ nguyên.');
              }}
              className="px-2 py-0.5 rounded-full bg-blue-100 text-[#0A1680] font-bold text-[10px] ml-1 hover:bg-white cursor-pointer"
            >
              Hoàn tác
            </button>
          )}
        </div>
      )}
    </div>
  );
};
