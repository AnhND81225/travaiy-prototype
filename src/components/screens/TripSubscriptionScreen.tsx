import React, { useState } from 'react';
import { IOSStatusBar } from '../common/IOSStatusBar';

interface TripSubscriptionScreenProps {
  onBack: () => void;
  onUpgradeSuccess?: (planName: string) => void;
}

export const TripSubscriptionScreen: React.FC<TripSubscriptionScreenProps> = ({
  onBack,
  onUpgradeSuccess,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'group' | 'solo'>('group');
  const [activePlan, setActivePlan] = useState<string>('Miễn phí');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showQuotaModal, setShowQuotaModal] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2400);
  };

  const handleConfirmActivation = () => {
    const planName = selectedPlan === 'group' ? 'Gói Group (79k)' : 'Gói Solo (39k)';
    setActivePlan(planName);
    setShowConfirmModal(false);
    showToast(`Đã kích hoạt thành công ${planName} cho chuyến đi! 🎉`);
    if (onUpgradeSuccess) onUpgradeSuccess(planName);
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#f8f9fb] text-[#191c1e] font-body-md antialiased select-none">
      {/* Header */}
      <header className="shrink-0 z-30 bg-[#f8f9fb]/90 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_1px_8px_rgba(10,22,128,0.03)]">
        <IOSStatusBar light={false} />
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={onBack}
              aria-label="Quay lại"
              className="w-10 h-10 -ml-1.5 flex items-center justify-center rounded-full text-[#191c1e] hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <svg className="w-6 h-6 stroke-[#191c1e]" fill="none" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex flex-col min-w-0">
              <h1 className="font-heading text-[17px] font-bold text-[#191c1e] tracking-tight truncate leading-tight">
                Gói chuyến đi
              </h1>
              <span className="text-[11px] text-slate-500 font-medium truncate">
                Đà Nẵng 3N2Đ (12 – 14 Thg 6, 2025)
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowShareModal(true)}
              aria-label="Chia sẻ"
              className="w-10 h-10 flex items-center justify-center rounded-full text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8m-4-6l-4-4-4 4m4-4v13" />
              </svg>
            </button>
            <button
              onClick={() => setShowMoreOptions(true)}
              aria-label="Tùy chọn"
              className="w-10 h-10 flex items-center justify-center rounded-full text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="12" cy="5" r="1.5" />
                <circle cx="12" cy="19" r="1.5" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-4 pt-3 space-y-4 pb-36">
        {/* Trip Context Banner */}
        <div className="flex items-center justify-between bg-[#f2f4f6] px-4 py-3 rounded-2xl border border-slate-200/60 shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#d8e2ff] flex items-center justify-center text-[#0A1680] shrink-0 text-lg">
              ✈️
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-heading text-[15px] font-bold text-slate-900 truncate">
                Đà Nẵng 3N2Đ
              </span>
              <span className="text-[12px] text-slate-500 truncate">
                12 – 14 Thg 6, 2025 · 3 ngày 2 đêm
              </span>
            </div>
          </div>
          <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
            Bản demo
          </span>
        </div>

        {/* Current Plan Card */}
        <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${activePlan === 'Miễn phí' ? 'bg-[#3d5d9d]' : 'bg-[#0A1680]'}`} />
              <span className="font-heading text-[13px] font-semibold text-slate-600">Gói hiện tại của chuyến</span>
            </div>
            <span
              className={`px-2.5 py-0.5 rounded-full font-heading text-[11px] font-bold ${
                activePlan === 'Miễn phí'
                  ? 'bg-slate-100 text-slate-800'
                  : 'bg-[#FBEDB0] text-[#000552]'
              }`}
            >
              {activePlan}
            </span>
          </div>
          <p className="text-[12px] text-slate-500 leading-relaxed">
            {activePlan === 'Miễn phí'
              ? 'Chuyến đi đang áp dụng gói Miễn phí. Bạn có thể chọn mở rộng quyền AI hoặc cộng tác cho chuyến này bất cứ lúc nào.'
              : `Chuyến đi đã kích hoạt ${activePlan}. Toàn bộ tính năng AI và cộng tác được mở đầy đủ.`}
          </p>
        </div>

        {/* Section Heading */}
        <div className="flex items-center justify-between pt-1">
          <h2 className="font-heading text-[15px] font-bold text-[#191c1e]">
            Chọn gói nâng cấp cho chuyến này
          </h2>
          <span className="text-[11px] font-medium text-slate-500 bg-[#f2f4f6] px-2 py-0.5 rounded-md border border-slate-200/60">
            Thanh toán 1 lần
          </span>
        </div>

        {/* Plan Cards Stack */}
        <div className="space-y-3.5">
          {/* 1. Group Plan */}
          <div
            onClick={() => setSelectedPlan('group')}
            className={`relative rounded-3xl p-5 transition-all cursor-pointer border-2 ${
              selectedPlan === 'group'
                ? 'border-[#0A1680] bg-gradient-to-b from-white to-[#d8e2ff]/30 shadow-md'
                : 'border-slate-200/80 bg-white shadow-2xs hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="px-2.5 py-0.5 rounded-full font-heading text-[10px] font-black uppercase tracking-wide flex items-center gap-1 shadow-2xs bg-[#FBEDB0] text-[#000552]">
                <span>⭐</span>
                <span>ĐẦY ĐỦ QUYỀN</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="font-heading text-[12px] font-bold text-[#0A1680]">Dành cho nhóm</span>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedPlan === 'group' ? 'border-[#0A1680] bg-[#0A1680]' : 'border-slate-300'
                  }`}
                >
                  {selectedPlan === 'group' && <span className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-0.5 mb-3">
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="font-heading text-[30px] font-black text-[#0A1680] leading-none tracking-tight">
                  79.000
                </span>
                <span className="font-heading text-[16px] font-bold text-[#0A1680]">đ</span>
                <span className="text-[12px] text-slate-500 font-medium">/ chuyến đi</span>
              </div>
              <span className="font-heading text-[14px] font-bold text-[#0A1680]">
                Gói Group (Cả đoàn cùng dùng)
              </span>
              <p className="text-[12px] text-slate-500 leading-snug">
                Áp dụng trọn gói cho toàn bộ thành viên trong đoàn suốt chuyến đi
              </p>
            </div>

            <div className="space-y-2 pt-1 border-t border-[#0A1680]/15">
              {[
                { bold: true, text: 'Đầy đủ quyền cho chuyến đi nhóm' },
                { bold: false, text: 'Lên kế hoạch và điều chỉnh lịch trình với AI' },
                { bold: false, text: 'Cùng nhóm lên lịch & bình chọn điểm đến' },
                { bold: false, text: 'Chia chi phí nhóm minh bạch & quyết toán' },
                { bold: false, text: 'Chia sẻ vị trí thành viên (khi có quyền chia sẻ)' },
                { bold: false, text: 'Ví giấy tờ chuyến đi cho bạn và nhóm' },
                { bold: false, text: 'Thanh toán một lần cho chuyến này, không tự động gia hạn' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <span className="text-[#0A1680] font-bold text-xs mt-0.5">✓</span>
                  <span className={`text-[12.5px] text-slate-900 ${item.bold ? 'font-bold' : ''}`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Solo Plan */}
          <div
            onClick={() => setSelectedPlan('solo')}
            className={`relative rounded-3xl p-5 transition-all cursor-pointer border-2 ${
              selectedPlan === 'solo'
                ? 'border-[#0A1680] bg-gradient-to-b from-white to-[#d8e2ff]/30 shadow-md'
                : 'border-slate-200/80 bg-white shadow-2xs hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="bg-slate-100 px-2.5 py-0.5 rounded-full font-heading text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                Cá nhân
              </span>
              <div className="flex items-center gap-2">
                <span className="font-heading text-[12px] font-bold text-slate-600">Đi một mình</span>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    selectedPlan === 'solo' ? 'border-[#0A1680] bg-[#0A1680]' : 'border-slate-300'
                  }`}
                >
                  {selectedPlan === 'solo' && <span className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-0.5 mb-3">
              <div className="flex items-baseline gap-1.5 flex-wrap">
                <span className="font-heading text-[30px] font-bold text-slate-900 leading-none tracking-tight">
                  39.000
                </span>
                <span className="font-heading text-[16px] font-bold text-slate-900">đ</span>
                <span className="text-[12px] text-slate-500 font-medium">/ chuyến đi</span>
              </div>
              <span className="font-heading text-[14px] font-bold text-slate-800">Gói Solo</span>
              <p className="text-[12px] text-slate-500 leading-snug">
                Dành cho người đi du lịch độc hành một mình
              </p>
            </div>

            <div className="space-y-2 pt-1 border-t border-slate-200">
              {[
                { bold: true, text: 'Mở thêm quyền lên kế hoạch bằng AI cho chuyến đi cá nhân' },
                { bold: false, text: 'Lưu trữ vé và giấy tờ chuyến đi' },
                { bold: false, text: 'Danh sách hành lý & checklist cá nhân' },
                { bold: false, text: 'Thanh toán một lần cho chuyến này, không tự động gia hạn' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <span className="text-[#3d5d9d] font-bold text-xs mt-0.5">✓</span>
                  <span className={`text-[12.5px] text-slate-900 ${item.bold ? 'font-bold' : ''}`}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Free Plan (Informational) */}
          <div className="bg-white p-5 rounded-3xl shadow-2xs flex flex-col gap-3 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading text-[15px] text-slate-900 font-bold">Gói Miễn phí</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded-full font-heading text-[10px] text-slate-500 font-bold">
                    Đang áp dụng
                  </span>
                </div>
                <span className="text-[12px] text-slate-500">Phù hợp nhu cầu cá nhân cơ bản</span>
              </div>
              <div className="flex items-baseline">
                <span className="font-heading text-[22px] text-slate-900 font-bold leading-none">0</span>
                <span className="font-heading text-[14px] text-slate-900 font-bold ml-0.5">đ</span>
              </div>
            </div>
            <div className="space-y-2 pt-2 border-t border-slate-100 text-[12.5px] text-slate-600">
              <div className="flex items-center gap-2">
                <span>✓</span>
                <span>Lên lịch trình thủ công</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✓</span>
                <span>Lượt lên kế hoạch AI ban đầu có giới hạn</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✓</span>
                <span>Lưu trữ vé và giấy tờ chuyến đi (Ví cơ bản)</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✓</span>
                <span>Danh sách hành lý cần chuẩn bị</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Bottom CTA Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-xl border-t border-slate-200 px-4 pt-3 pb-8 shadow-lg max-w-[390px] mx-auto">
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setShowConfirmModal(true)}
            className="w-full h-12 rounded-full bg-[#0A1680] text-white font-heading font-bold text-[14px] flex items-center justify-center gap-2 shadow-md hover:bg-[#071060] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>
              {selectedPlan === 'group' ? 'Chọn gói Group — 79.000đ' : 'Chọn gói Solo — 39.000đ'}
            </span>
            <span>→</span>
          </button>
          <div className="flex flex-col items-center">
            <button
              onClick={() => showToast('Tiếp tục sử dụng gói Miễn phí cho chuyến này.')}
              className="text-center font-heading text-[13px] font-semibold text-slate-500 hover:text-slate-800 py-1"
            >
              Tiếp tục dùng gói Miễn phí
            </button>
            <span className="text-[11px] text-slate-400 text-center">
              Thanh toán một lần theo từng chuyến · Không tự động gia hạn · Bản demo
            </span>
          </div>
        </div>
      </div>

      {/* POPUP 1: Dialog Confirm Plan */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-[390px] bg-white rounded-t-[28px] p-6 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-bottom duration-200">
            <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto -mt-2" />
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-[17px] font-bold text-slate-900">
                  Xác nhận gói cho chuyến này
                </h3>
                <span className="bg-[#d8e2ff] text-[#001a43] px-2 py-0.5 rounded-full font-heading text-[10px] font-bold uppercase">
                  Bản Demo
                </span>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#f2f4f6] p-4 rounded-2xl flex flex-col gap-3 border border-slate-200">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Chuyến đi</span>
                  <h4 className="font-heading text-[15px] font-bold text-slate-900">Đà Nẵng 3N2Đ</h4>
                  <span className="text-[12px] text-slate-500">12 – 14 Thg 6, 2025 · 3N2Đ</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">Gói lựa chọn</span>
                  <span className="font-heading text-[16px] font-black text-[#0A1680] block">
                    {selectedPlan === 'group' ? 'Gói Group' : 'Gói Solo'}
                  </span>
                  <span className="font-heading text-[15px] font-bold text-[#0A1680]">
                    {selectedPlan === 'group' ? '79.000đ' : '39.000đ'}
                  </span>
                </div>
              </div>
              <div className="h-px bg-slate-200" />
              <div className="flex items-center gap-2 text-slate-600 text-[12px]">
                <span>ℹ️</span>
                <span>Thanh toán một lần cho chuyến này · Không tự động gia hạn</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-1">
              <button
                onClick={handleConfirmActivation}
                className="w-full h-12 rounded-full bg-[#0A1680] text-white font-heading font-bold text-[14px] shadow-md hover:bg-[#071060] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>✓</span>
                <span>Xác nhận kích hoạt (Demo)</span>
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="w-full h-10 rounded-full bg-slate-100 font-heading font-semibold text-[13px] text-slate-700 hover:bg-slate-200"
              >
                Đổi gói / Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP 2: Quota Exceeded Modal */}
      {showQuotaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-[342px] bg-white rounded-[28px] p-6 shadow-2xl flex flex-col items-center text-center gap-3 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-[#ffdea8] flex items-center justify-center text-[#b9881c] text-2xl">
              🤖
            </div>
            <h3 className="font-heading text-[17px] font-bold text-slate-900 leading-snug">
              Bạn đã dùng hết lượt AI miễn phí ban đầu
            </h3>
            <p className="text-[13px] text-slate-500 leading-relaxed">
              Chuyến đi này đã sử dụng hết các lượt lên kế hoạch AI ban đầu. Bạn có thể nâng cấp để tiếp tục sử dụng AI linh hoạt hoặc chuyển sang lập lịch thủ công.
            </p>
            <div className="flex flex-col gap-2 w-full pt-2">
              <button
                onClick={() => setShowQuotaModal(false)}
                className="w-full h-11 rounded-full bg-[#0A1680] text-white font-heading font-bold text-[14px] shadow-sm hover:bg-[#071060]"
              >
                Xem gói chuyến đi
              </button>
              <button
                onClick={() => setShowQuotaModal(false)}
                className="w-full h-10 rounded-full bg-slate-100 font-heading font-semibold text-[13px] text-slate-700 hover:bg-slate-200"
              >
                Tiếp tục lên lịch thủ công
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP 3: More Options Sheet */}
      {showMoreOptions && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-[390px] bg-white rounded-t-[28px] p-6 shadow-2xl flex flex-col gap-3 animate-in slide-in-from-bottom duration-200">
            <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto -mt-2" />
            <div className="flex items-center justify-between pb-1">
              <h3 className="font-heading text-[17px] font-bold text-slate-900">Tùy chọn chuyến đi</h3>
              <button onClick={() => setShowMoreOptions(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100">
                ✕
              </button>
            </div>
            <button
              onClick={() => {
                setShowMoreOptions(false);
                setTimeout(() => setShowQuotaModal(true), 150);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 text-left cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-[#ffdea8] flex items-center justify-center text-[#b9881c] shrink-0 text-base">
                🤖
              </div>
              <div>
                <span className="text-[13px] font-bold text-slate-900 block font-heading">
                  Xem trạng thái hết lượt AI (Demo)
                </span>
                <span className="text-[11px] text-slate-500">Mô phỏng thông báo khi hết hạn ngạch AI</span>
              </div>
            </button>
            <button
              onClick={() => {
                setShowMoreOptions(false);
                showToast('Đã tải dữ liệu chuyến đi để dùng ngoại tuyến!');
              }}
              className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 text-left cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0 text-base">
                📥
              </div>
              <span className="text-[13px] font-bold text-slate-900 font-heading">Tải xuống ngoại tuyến</span>
            </button>
          </div>
        </div>
      )}

      {/* POPUP 4: Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-[390px] bg-white rounded-t-[28px] p-6 shadow-2xl flex flex-col gap-3 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-heading font-bold text-[16px]">Chia sẻ thông tin gói</h3>
              <button onClick={() => setShowShareModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100">
                ✕
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3 py-2 text-center">
              {[
                { name: 'Sao chép', icon: '🔗', act: () => showToast('Đã sao chép link gói!') },
                { name: 'Zalo', icon: '💬', act: () => showToast('Đang mở Zalo...') },
                { name: 'Tin nhắn', icon: '✉️', act: () => showToast('Đã mở tin nhắn...') },
                { name: 'Mời bạn', icon: '👥', act: () => showToast('Đã gửi mã mời tham gia!') },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    item.act();
                    setShowShareModal(false);
                  }}
                  className="flex flex-col items-center gap-1.5 cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-xl shadow-xs hover:bg-slate-200 transition-colors">
                    {item.icon}
                  </div>
                  <span className="text-[11px] text-slate-600 font-medium">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 bg-slate-900/95 text-white text-[13px] font-semibold rounded-full shadow-xl animate-in fade-in duration-200 whitespace-nowrap">
          {toastMessage}
        </div>
      )}
    </div>
  );
};
