import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { IOSStatusBar } from '../common/IOSStatusBar';

export type TripAccessPlan = 'free' | 'solo' | 'group';
export function isPlanAvailable(plan: TripAccessPlan | null, companionType: 'solo' | 'group') {
  return plan === 'free' || plan === companionType;
}
const plans: { id: TripAccessPlan; name: string; price: string; description: string; features: string[] }[] = [
  { id: 'free', name: 'Miễn phí', price: '0đ', description: 'Bắt đầu lên kế hoạch cho chuyến đi', features: ['3 lượt tạo hoặc tạo lại plan bằng AI / chuyến đi', 'Xem, lưu và chỉnh sửa lịch trình thủ công'] },
  { id: 'solo', name: 'Solo', price: '39.000đ', description: 'Dành cho chuyến đi cá nhân', features: ['12 lượt lập kế hoạch AI / chuyến trong bản demo', 'Vé, giấy tờ và checklist cá nhân'] },
  { id: 'group', name: 'Group', price: '79.000đ', description: 'Cả nhóm cùng lên kế hoạch', features: ['30 lượt lập kế hoạch AI / chuyến trong bản demo', 'Cộng tác và điều phối chuyến đi'] },
];

export function WizardSubscriptionScreen({ destination, duration, initialPlan, companionType, used, planningMode = 'ai', purpose = 'create', onBack, onContinue }: {
  destination: string;
  duration: string;
  initialPlan: TripAccessPlan | null;
  companionType: 'solo' | 'group';
  used: number;
  planningMode?: 'ai' | 'manual';
  purpose?: 'create' | 'upgrade';
  onBack: () => void;
  onContinue: (plan: TripAccessPlan) => void;
}) {
  const [selection, setSelected] = useState<TripAccessPlan | null>(initialPlan);
  const selected = isPlanAvailable(selection, companionType) ? selection : null;
  const availablePlans = plans.filter(plan => isPlanAvailable(plan.id, companionType));
  return (
    <div className="relative w-full h-full min-h-0 flex flex-col bg-[#FCFDFF] text-slate-800">
      <header className="shrink-0 px-5 pb-4 border-b border-slate-100">
        <IOSStatusBar />
        <div className="flex items-center gap-3 py-2">
          <button type="button" onClick={onBack} aria-label="Quay lại xác nhận chuyến đi" className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100"><ArrowLeft size={20} /></button>
          <h1 className="plan-header-title">Chọn gói chuyến đi</h1>
        </div>
        {purpose === 'create' && <p className="text-xs text-slate-400 mb-2">Bước 8/8 · {planningMode === 'manual' ? 'Tự xếp lịch' : 'AI xếp lịch'}</p>}
        <p className="text-sm font-semibold text-[#0A1680]">{destination} · {duration}</p>
        <p className="text-xs text-slate-500 mt-1">{purpose === 'upgrade' ? 'Chọn gói áp dụng cho chuyến đi.' : planningMode === 'manual' ? 'Tự xếp lịch không trừ lượt AI. Có thể bắt đầu với gói Miễn phí.' : `Chọn gói để tạo lịch trình. Đã dùng ${used} lượt AI.`}</p>
      </header>
      <main className="flex-1 min-h-0 overflow-y-auto px-5 py-4 no-scrollbar">
        <fieldset className="flex flex-col gap-3">
          <legend className="sr-only">Gói áp dụng cho chuyến đi này</legend>
          {availablePlans.map(plan => (
            <label key={plan.id} className={`relative cursor-pointer rounded-3xl border-2 p-4 transition-colors ${selected === plan.id ? 'border-[#0A1680] bg-[#F1F4FF]' : 'border-slate-200 bg-white'}`}>
              <div className="flex items-start justify-between gap-3">
                <div><h2 className="font-heading font-bold text-base">{plan.name}</h2><p className="text-xs text-slate-500 mt-1">{plan.description}</p></div>
                <input type="radio" name="trip-access-plan" value={plan.id} checked={selected === plan.id} onChange={() => setSelected(plan.id)} aria-label={`Chọn gói ${plan.name}`} className="w-5 h-5 accent-[#0A1680] shrink-0" />
              </div>
              <p className="font-heading text-xl font-bold text-[#0A1680] mt-3">{plan.price}<span className="text-xs font-normal text-slate-500"> / chuyến đi</span></p>
              <ul className="mt-3 space-y-2">{plan.features.map(feature => <li key={feature} className="flex items-start gap-2 text-xs leading-5"><Check size={15} className="shrink-0 mt-0.5 text-[#0A1680]" /><span>{feature}</span></li>)}</ul>
            </label>
          ))}
        </fieldset>
        <p className="text-xs leading-5 text-slate-500 mt-4">Gói được áp dụng ngay trong bản xem trước, không thu tiền.</p>
      </main>
      <footer className="shrink-0 border-t border-slate-100 bg-white px-5 pt-3 pb-5">
        <p aria-live="polite" className="text-xs text-center text-slate-500 mb-2">{selected === 'free' ? `Còn ${Math.max(0,3-used)}/3 lượt AI miễn phí cho chuyến đi này` : selected ? 'Bạn có thể đổi gói bằng cách quay lại' : 'Vui lòng chọn một gói để tiếp tục'}</p>
        <button type="button" disabled={!selected} onClick={() => { if (selected) onContinue(selected); }} className="w-full h-12 rounded-full bg-[#0A1680] text-white font-heading font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">{purpose === 'upgrade' ? 'Áp dụng gói' : planningMode === 'manual' ? 'Mở lịch trình thủ công' : 'Tạo lịch trình AI'}<ArrowRight size={18} /></button>
      </footer>
    </div>
  );
}
