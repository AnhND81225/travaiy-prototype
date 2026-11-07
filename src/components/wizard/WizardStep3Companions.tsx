import React, { useState } from 'react';
import { IOSStatusBar } from '../common/IOSStatusBar';

interface WizardStep3CompanionsProps {
  companionType: 'solo' | 'group';
  companionCount: number;
  inviteCode: string;
  onChange: (data: {
    companionType: 'solo' | 'group';
    companionCount: number;
    inviteCode: string;
  }) => void;
  onNext: () => void;
  onBack: () => void;
}

export const WizardStep3Companions: React.FC<WizardStep3CompanionsProps> = ({
  companionType,
  companionCount,
  inviteCode,
  onChange,
  onNext,
  onBack,
}) => {
  const [type, setType] = useState<'solo' | 'group'>(companionType || 'group');
  const [count, setCount] = useState<number>(companionCount || 4);
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSelectType = (newType: 'solo' | 'group') => {
    setType(newType);
    const newCount = newType === 'solo' ? 1 : Math.max(2, count);
    setCount(newCount);
    onChange({
      companionType: newType,
      companionCount: newCount,
      inviteCode: 'TRAV123',
    });
  };

  const handleCountChange = (delta: number) => {
    if (type === 'solo') return;
    const nextCount = Math.max(2, Math.min(20, count + delta));
    setCount(nextCount);
    onChange({
      companionType: type,
      companionCount: nextCount,
      inviteCode: 'TRAV123',
    });
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText('TRAV123');
    showToast('Đã sao chép mã tham gia nhóm: ' + ('TRAV123'));
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(`${window.location.origin}/join/TRAV123`);
    showToast('Đã sao chép liên kết mời!');
  };

  return (
    <div className="relative w-full h-full min-h-0 bg-[#FCFDFF] flex flex-col justify-between overflow-hidden select-none text-slate-800">
      {/* Top Header */}
      <header className="pt-2 px-5 shrink-0 bg-[#FCFDFF] z-20">
        <IOSStatusBar light={false} />
        <div className="flex items-center justify-between pt-1 pb-2">
          <button
            onClick={onBack}
            aria-label="Quay lại"
            type="button"
            className="w-9 h-9 -ml-1 flex items-center justify-center rounded-full text-[#0A1680] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <span className="plan-header-title">
            Bước 4/8
          </span>
          <div className="w-9" />
        </div>

        {/* Progress bar (50%) */}
        <div className="w-full h-[3px] bg-[#E6EAF2] rounded-full overflow-hidden mb-1">
          <div className="h-full w-[50%] bg-[#0A1680] rounded-full transition-all duration-300" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 pt-2 pb-24 overflow-y-auto no-scrollbar flex flex-col gap-3.5 text-left">
        <div>
          <h1 className="plan-content-title">
            Bạn đi cùng ai?
          </h1>
          <p className="text-sm text-slate-500 font-normal mt-0.5">
            Chọn cách bạn muốn đồng hành
          </p>
        </div>

        {/* Companion Options */}
        <div className="flex flex-col gap-2.5">
          {/* Card 1: Một mình */}
          <div
            onClick={() => handleSelectType('solo')}
            className={`w-full rounded-[24px] p-4 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] shadow-xs ${
              type === 'solo'
                ? 'border-2 border-[#0A1680] bg-[#93B2F8]/15'
                : 'border border-slate-200 bg-white hover:border-[#93B2F8]'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                  type === 'solo' ? 'bg-[#0A1680] text-white' : 'bg-[#93B2F8]/20 text-[#0A1680]'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <div>
                <div className="text-[17px] font-bold text-[#0A1680] leading-snug font-heading">
                  Một mình
                </div>
                <div className="text-sm text-slate-500">Tự do theo nhịp riêng</div>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                type === 'solo'
                  ? 'bg-[#0A1680] text-white'
                  : 'border-2 border-slate-300'
              }`}
            >
              {type === 'solo' && (
                <svg className="w-3 h-3 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              )}
            </div>
          </div>

          {/* Card 2: Cùng bạn bè */}
          <div
            onClick={() => handleSelectType('group')}
            className={`w-full rounded-[24px] p-4 flex items-center justify-between cursor-pointer transition-all active:scale-[0.99] shadow-xs ${
              type === 'group'
                ? 'border-2 border-[#0A1680] bg-[#93B2F8]/15'
                : 'border border-slate-200 bg-white hover:border-[#93B2F8]'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                  type === 'group' ? 'bg-[#0A1680] text-white' : 'bg-[#93B2F8]/20 text-[#0A1680]'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.999-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <div>
                <div className="text-[17px] font-bold text-[#0A1680] leading-snug font-heading">
                  Cùng bạn bè
                </div>
                <div className="text-sm text-slate-500">Chia sẻ hành trình</div>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center ${
                type === 'group'
                  ? 'bg-[#0A1680] text-white'
                  : 'border-2 border-slate-300'
              }`}
            >
              {type === 'group' && (
                <svg className="w-3 h-3 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Group Details Section (Count & Invite) */}
        {type === 'group' && (
          <div className="flex flex-col gap-3 transition-all duration-300">
            {/* Counter Card */}
            <div className="w-full rounded-[24px] bg-white border border-[#E6EAF2] p-5 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-600">Số người</span>
                <span className="text-xs text-slate-400">(Bao gồm bạn)</span>
              </div>
              <div className="flex items-center justify-center gap-6 py-1">
                <button
                  type="button"
                  onClick={() => handleCountChange(-1)}
                  aria-label="Giảm số người"
                  className="w-11 h-11 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center text-[#0A1680] hover:bg-slate-100 active:scale-95 transition-all shadow-xs cursor-pointer font-bold text-lg"
                >
                  −
                </button>
                <span className="text-[40px] font-bold text-[#0A1680] tracking-tight w-16 text-center select-none font-heading">
                  {count}
                </span>
                <button
                  type="button"
                  onClick={() => handleCountChange(1)}
                  aria-label="Tăng số người"
                  className="w-11 h-11 rounded-full bg-[#0A1680] flex items-center justify-center text-white hover:bg-[#00105C] active:scale-95 transition-all shadow-xs cursor-pointer font-bold text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Invite Card Box */}
            <div
              onClick={() => setShowInviteModal(true)}
              className="rounded-[20px] border border-dashed border-[#93B2F8] bg-white p-3.5 shadow-xs cursor-pointer hover:bg-blue-50/20 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#93B2F8]/20 flex items-center justify-center text-[#0A1680]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#0A1680] font-heading">
                      Mời bạn đồng hành
                    </div>
                    <div className="text-xs text-slate-400">Có thể mời sau</div>
                  </div>
                </div>
                <span className="text-slate-400">›</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom CTA */}
      <footer className="shrink-0 w-full z-40 bg-white/95 backdrop-blur-xl px-5 py-3 border-t border-slate-200/80 shadow-md">
        <button
          onClick={onNext}
          type="button"
          className="w-full h-12 rounded-full bg-[#0A1680] text-white font-bold text-[16px] flex items-center justify-center gap-2 shadow-lg shadow-[#0A1680]/25 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer font-heading"
        >
          <span>Tiếp tục</span>
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </button>
      </footer>

      {/* INVITE MODAL SHEET */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setShowInviteModal(false)}
          />
          <div className="w-full bg-white rounded-t-[28px] p-5 shadow-2xl z-10 flex flex-col gap-4 animate-in slide-in-from-bottom duration-300 text-left">
            <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-[#93B2F8]/20 flex items-center justify-center text-[#0A1680]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0A1680] font-heading">
                    Mời bạn đồng hành
                  </h3>
                  <p className="text-xs text-slate-500">Chia sẻ mã hoặc liên kết để lập nhóm</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-200">
                <div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                    Mã tham gia nhóm
                  </div>
                  <div className="font-mono font-bold text-base text-[#0A1680] tracking-wider">
                    {'TRAV123'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="text-xs text-[#0A1680] font-semibold bg-[#93B2F8]/20 px-3 py-1.5 rounded-full hover:bg-[#93B2F8]/30 flex items-center gap-1 active:scale-95 transition-transform cursor-pointer font-heading"
                >
                  <span>Sao chép mã</span>
                </button>
              </div>

              <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-200 text-xs text-slate-600">
                <div className="truncate pr-2">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                    Liên kết trực tiếp
                  </div>
                  <div className="font-mono text-xs text-[#0A1680] truncate">
                    {window.location.origin}/join/TRAV123
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="text-xs text-[#0A1680] font-semibold bg-[#93B2F8]/20 px-3 py-1.5 rounded-full hover:bg-[#93B2F8]/30 shrink-0 active:scale-95 transition-transform cursor-pointer font-heading"
                >
                  Sao chép link
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  showToast('Đang mở ứng dụng để chia sẻ link mời!');
                  setShowInviteModal(false);
                }}
                className="w-full rounded-full bg-[#0A1680] text-white py-3 px-4 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#00105C] active:scale-[0.98] transition-all shadow-md font-heading cursor-pointer"
              >
                Chia sẻ link mời
              </button>
            </div>
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
