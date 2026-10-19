import React, { useState } from 'react';
import { IOSStatusBar } from '../common/IOSStatusBar';

interface WizardStep4BudgetProps {
  budgetTier: 'Tiết kiệm' | 'Vừa túi tiền' | 'Thoải mái' | 'Tùy chỉnh';
  budgetAmount: number;
  hotelBudgetPerNight: number;
  roomCount: number;
  nights: number;
  onHotelBudgetChange: (value:number)=>void;
  onRoomsChange: (value:number)=>void;
  onChange: (data: {
    budgetTier: 'Tiết kiệm' | 'Vừa túi tiền' | 'Thoải mái' | 'Tùy chỉnh';
    budgetAmount: number;
  }) => void;
  onNext: () => void;
  onBack: () => void;
}

export const WizardStep4Budget: React.FC<WizardStep4BudgetProps> = ({
  budgetTier,
  budgetAmount,
  hotelBudgetPerNight,roomCount,nights,onHotelBudgetChange,onRoomsChange,
  onChange,
  onNext,
  onBack,
}) => {
  const [tier, setTier] = useState(budgetTier || 'Vừa túi tiền');
  const [amount, setAmount] = useState(budgetAmount || 2500000);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [breakdownData, setBreakdownData] = useState({ name: 'Vừa túi tiền', total: 2500000 });
  const [showCustomSheet, setShowCustomSheet] = useState(false);
  const [customScope, setCustomScope] = useState<'person' | 'group'>('person');
  const [customInputVal, setCustomInputVal] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const tiers = [
    { name: 'Tiết kiệm', badge: 'Phổ biến', amount: 1000000, desc: '1.000.000' },
    { name: 'Vừa túi tiền', badge: '', amount: 2500000, desc: '2.500.000' },
    { name: 'Thoải mái', badge: '', amount: 5000000, desc: '5.000.000' },
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleChooseTier = (tName: string, tAmt: number) => {
    setTier(tName as any);
    setAmount(tAmt);
    onChange({
      budgetTier: tName as any,
      budgetAmount: tAmt,
    });
  };

  const handleSliderChange = (newVal: number) => {
    setAmount(newVal);
    setTier('Tùy chỉnh');
    onChange({
      budgetTier: 'Tùy chỉnh',
      budgetAmount: newVal,
    });
  };

  const openBreakdown = (tName: string, tAmt: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setBreakdownData({ name: tName, total: tAmt });
    setShowBreakdown(true);
  };

  const confirmCustomAmount = () => {
    const raw = parseInt(customInputVal.replace(/[^0-9]/g, ''), 10);
    if (isNaN(raw) || raw < 500000 || raw > 100000000) {
      showToast('Vui lòng nhập từ 500.000đ đến 100.000.000đ');
      return;
    }
    setAmount(raw);
    setTier('Tùy chỉnh');
    onChange({
      budgetTier: 'Tùy chỉnh',
      budgetAmount: raw,
    });
    setShowCustomSheet(false);
    showToast(`Đã lưu ngân sách: ${raw.toLocaleString('vi-VN')} đ/người`);
  };

  return (
    <div className="relative w-full h-full min-h-[844px] bg-[#FCFDFF] flex flex-col justify-between overflow-hidden select-none text-slate-800">
      {/* Top Header */}
      <header className="pt-2 px-5 shrink-0 bg-[#FCFDFF] z-20">
        <IOSStatusBar light={false} />
        <div className="flex items-center justify-between pt-1 pb-2">
          <button
            onClick={onBack}
            aria-label="Quay lại"
            type="button"
            className="w-9 h-9 -ml-1 flex items-center justify-center rounded-full text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <span className="plan-header-title">Ngân sách</span>
          <div className="w-9" />
        </div>

        {/* Progress bar (66.7%) */}
        <div className="pt-1 pb-1">
          <div className="flex items-center justify-between mb-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0A1680] animate-pulse" />
              <span className="text-[11px] font-bold text-[#0A1680] uppercase tracking-wider font-heading">
                Bước 5/8
              </span>
            </div>
            <span className="text-xs font-semibold text-slate-400">Ngân sách dự kiến</span>
          </div>
          <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-[#0A1680] rounded-full w-[62.5%] transition-all duration-300" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 pt-2 pb-24 overflow-y-auto no-scrollbar flex flex-col gap-3.5 text-left">
        <div>
          <h1 className="plan-content-title">
            Ngân sách dự kiến?
          </h1>
          <p className="text-[13px] text-slate-500 mt-0.5">
            Chọn mức chi tiêu phù hợp cho mỗi người
          </p>
        </div>

        {/* 3 Flat Budget Option Cards */}
        <div className="flex flex-col gap-2.5">
          {tiers.map((t) => {
            const isSelected = tier === t.name;
            return (
              <div
                key={t.name}
                onClick={() => handleChooseTier(t.name, t.amount)}
                className={`cursor-pointer rounded-2xl p-4 flex items-center justify-between shadow-xs transition-all active:scale-[0.99] ${
                  isSelected
                    ? 'border-2 border-[#0A1680] bg-white'
                    : 'border border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[15px] font-heading ${
                        isSelected ? 'text-[#0A1680] font-bold' : 'text-slate-800 font-semibold'
                      }`}
                    >
                      {t.name}
                    </span>
                    {t.badge && (
                      <span className="px-2 py-0.5 rounded-full bg-[#FBEDB0] text-[#0A1680] text-[10px] font-bold font-heading">
                        {t.badge}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => openBreakdown(t.name, t.amount, e)}
                      className="w-5 h-5 flex items-center justify-center rounded-full text-slate-400 hover:text-[#0A1680]"
                      title="Chi tiết phân bổ"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`text-[24px] font-extrabold tracking-tight font-heading ${
                        isSelected ? 'text-[#0A1680]' : 'text-slate-800'
                      }`}
                    >
                      ~ {t.desc}
                    </span>
                    <span className="text-[12px] font-medium text-slate-500">đ/người</span>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    isSelected ? 'border-[#0A1680]' : 'border-slate-300'
                  }`}
                >
                  {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#0A1680]" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Slider Card */}
        <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-heading">
              Ngân sách tùy chỉnh
            </span>
            <span className="text-xs font-medium text-slate-400">Kéo để điều chỉnh</span>
          </div>

          <div className="flex items-baseline justify-center gap-1.5 py-2">
            <span className="text-[32px] font-extrabold text-[#0A1680] tracking-tight leading-none font-heading">
              {amount.toLocaleString('vi-VN')}
            </span>
            <span className="text-[14px] font-bold text-slate-500">VNĐ/người</span>
          </div>

          <div className="my-2">
            <input
              type="range"
              min={500000}
              max={10000000}
              step={200000}
              value={amount}
              onChange={(e) => handleSliderChange(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0A1680]"
            />
          </div>

          <div className="flex justify-between items-center text-[11px] font-medium text-slate-400 pt-0.5">
            <span>500.000đ</span>
            <span>5.000.000đ</span>
            <span>10.000.000đ+</span>
          </div>
        </div>

        {/* Custom Exact Input Trigger */}
        <div className="flex flex-col">
          <label className="text-[13px] font-semibold text-slate-700 mb-1.5">
            Hoặc nhập chính xác số tiền
          </label>
          <div
            onClick={() => {
              setCustomInputVal(amount.toLocaleString('vi-VN'));
              setShowCustomSheet(true);
            }}
            className="h-12 rounded-[16px] bg-white border border-slate-200 px-3.5 flex items-center justify-between shadow-xs hover:border-[#0A1680] cursor-pointer"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0 mr-2">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400 shrink-0">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
              <span className="text-[15px] font-semibold text-slate-800 font-heading">
                {amount.toLocaleString('vi-VN')}
              </span>
            </div>
            <span className="text-[12px] text-slate-500 font-medium px-2 py-0.5 rounded-lg bg-slate-100">
              VNĐ/người
            </span>
          </div>
        </div>
        {nights>0&&<section className="hotel-budget-card"><h2>Ngân sách khách sạn</h2><p>Mức tối đa để đề xuất chỗ ở ở bước sau.</p><div><label>Mỗi phòng / đêm<input aria-label="Ngân sách khách sạn mỗi phòng mỗi đêm" type="number" min="100000" step="50000" value={hotelBudgetPerNight||''} onChange={e=>onHotelBudgetChange(Number(e.currentTarget.value))}/></label><label>Số phòng<input aria-label="Số phòng" type="number" min="1" max="20" value={roomCount} onChange={e=>onRoomsChange(Math.max(1,Math.min(20,Number(e.currentTarget.value))))}/></label></div><small>Gợi ý ban đầu dành 35% ngân sách cho chỗ ở, 2 người/phòng. Bạn có thể đổi.</small><p><b>{(hotelBudgetPerNight*roomCount*nights).toLocaleString('vi-VN')}đ</b> cho {roomCount} phòng · {nights} đêm</p>{hotelBudgetPerNight<100000&&<p role="alert">Nhập mức từ 100.000đ/phòng/đêm.</p>}</section>}
      </main>

      {/* Floating Bottom CTA */}
      <footer className="fixed bottom-0 max-w-[390px] w-full z-40 bg-white/95 backdrop-blur-xl px-5 py-3 border-t border-slate-200/80 shadow-md">
        <button
          onClick={onNext}
          disabled={nights>0&&hotelBudgetPerNight<100000}
          type="button"
          className="w-full h-12 rounded-full bg-[#0A1680] text-white font-bold text-[16px] flex items-center justify-center gap-2 shadow-lg shadow-[#0A1680]/25 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer font-heading"
        >
          <span>Tiếp tục</span>
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </footer>

      {/* BREAKDOWN SHEET MODAL */}
      {showBreakdown && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-[#0A1680]/30 backdrop-blur-xs transition-opacity"
            onClick={() => setShowBreakdown(false)}
          />
          <div className="w-full bg-white rounded-t-[28px] p-5 pb-8 shadow-2xl z-10 flex flex-col gap-4 animate-in slide-in-from-bottom duration-300 text-left">
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto" />
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-[#0A1680] uppercase tracking-wider font-heading">
                  Phân bổ chi phí ước tính
                </span>
                <h3 className="text-[17px] font-bold text-slate-900 font-heading">
                  Gói {breakdownData.name} (~ {breakdownData.total.toLocaleString('vi-VN')} đ)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowBreakdown(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start gap-2.5">
              <span className="text-base text-[#0A1680]">✦</span>
              <p className="text-[12px] leading-relaxed text-slate-700">
                Cơ chế AI tự động phân tích thị giá tại điểm đến và tối ưu ngân sách theo tỷ lệ tiêu chuẩn cho mỗi ngày lịch trình.
              </p>
            </div>

            {/* Breakdown Bars */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center text-[13px] mb-1">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0A1680]" />
                    Ăn uống (35%)
                  </span>
                  <span className="font-bold text-[#0A1680]">
                    {Math.round(breakdownData.total * 0.35).toLocaleString('vi-VN')}đ
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-[#0A1680] w-[35%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-[13px] mb-1">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#3d5d9d]" />
                    Lưu trú (30%)
                  </span>
                  <span className="font-bold text-[#3d5d9d]">
                    {Math.round(breakdownData.total * 0.3).toLocaleString('vi-VN')}đ
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-[#3d5d9d] w-[30%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-[13px] mb-1">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#99b8ff]" />
                    Di chuyển (20%)
                  </span>
                  <span className="font-bold text-[#254786]">
                    {Math.round(breakdownData.total * 0.2).toLocaleString('vi-VN')}đ
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-[#99b8ff] w-[20%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-[13px] mb-1">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f6bd50]" />
                    Vé &amp; hoạt động (15%)
                  </span>
                  <span className="font-bold text-amber-700">
                    {Math.round(breakdownData.total * 0.15).toLocaleString('vi-VN')}đ
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div className="h-full rounded-full bg-[#f6bd50] w-[15%]" />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowBreakdown(false)}
              className="w-full h-12 rounded-full bg-[#0A1680] text-white font-bold text-[14px] flex items-center justify-center font-heading cursor-pointer shadow-md"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}

      {/* CUSTOM EXACT AMOUNT SHEET */}
      {showCustomSheet && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-[#0A1680]/30 backdrop-blur-xs transition-opacity"
            onClick={() => setShowCustomSheet(false)}
          />
          <div className="w-full bg-white rounded-t-[28px] p-5 pb-8 shadow-2xl z-10 flex flex-col gap-4 animate-in slide-in-from-bottom duration-300 text-left">
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto" />
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-[17px] font-bold text-slate-900 font-heading">
                Nhập mức ngân sách riêng
              </h3>
              <button
                type="button"
                onClick={() => setShowCustomSheet(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[12px] font-semibold text-slate-600 mb-1 block">
                  Phạm vi tính toán
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setCustomScope('person')}
                    className={`py-2 text-[13px] font-semibold rounded-lg transition-all ${
                      customScope === 'person' ? 'bg-white text-[#0A1680] shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Mỗi người
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomScope('group')}
                    className={`py-2 text-[13px] font-semibold rounded-lg transition-all ${
                      customScope === 'group' ? 'bg-white text-[#0A1680] shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Toàn đoàn (ước tính)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[12px] font-semibold text-slate-600 mb-1 block">
                  Số tiền (VND)
                </label>
                <div className="h-12 rounded-[16px] bg-slate-50 border border-slate-200 px-3.5 flex items-center justify-between">
                  <input
                    type="text"
                    value={customInputVal}
                    onChange={(e) => setCustomInputVal(e.target.value)}
                    placeholder="VD: 3.500.000"
                    className="w-full bg-transparent text-[16px] font-bold text-[#0A1680] outline-none font-heading"
                  />
                  <span className="text-[12px] font-bold text-slate-400">
                    {customScope === 'person' ? 'đ/người' : 'đ/đoàn'}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {[1500000, 3000000, 7000000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setCustomInputVal(amt.toLocaleString('vi-VN'))}
                    className="px-3 py-1.5 rounded-full border border-slate-200 text-[12px] font-semibold text-slate-700 hover:border-[#0A1680]"
                  >
                    {amt.toLocaleString('vi-VN')}đ
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={confirmCustomAmount}
              className="w-full h-12 rounded-full bg-[#0A1680] text-white font-bold text-[14px] flex items-center justify-center font-heading cursor-pointer shadow-md"
            >
              Xác nhận ngân sách
            </button>
          </div>
        </div>
      )}

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-[#0A1680] text-white px-4 py-2 rounded-full shadow-xl text-[13px] font-semibold flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
