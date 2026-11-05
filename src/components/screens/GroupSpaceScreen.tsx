import { useTravel } from '../../features/travel/TravelContext';
import React, { useState } from 'react';
import { IOSStatusBar } from '../common/IOSStatusBar';
import { TripWorkspaceNav } from '../../features/travel/TripWorkspaceNav';

interface GroupSpaceScreenProps {
  onBack: () => void;
  onOpenPoll: () => void;
  onOpenChat: () => void;
  onOpenLocation: () => void;
  onOpenExpenseSplit: () => void;
  onOpenSchedule: () => void;
}

export const GroupSpaceScreen: React.FC<GroupSpaceScreenProps> = ({
  onBack,
  onOpenPoll,
  onOpenChat,
  onOpenLocation,
  onOpenExpenseSplit,
  onOpenSchedule,
}) => {
  const {plan}=useTravel();
  const [showEditTripModal, setShowEditTripModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showManageMembersModal, setShowManageMembersModal] = useState(false);
  const [showGroupSettingsModal, setShowGroupSettingsModal] = useState(false);
  const [showLeaveGroupModal, setShowLeaveGroupModal] = useState(false);
  const [showEndTripModal, setShowEndTripModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [tripTitle, setTripTitle] = useState(plan.title);
  const [tripDates, setTripDates] = useState(plan.dates);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
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
            className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full bg-white shadow-xs text-on-surface hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <h1 className="font-heading font-bold text-[18px] text-[#191c1e] tracking-tight">
            Không gian nhóm
          </h1>
          <button
            onClick={() => setShowGroupSettingsModal(true)}
            aria-label="Tùy chọn bổ sung"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-xs text-on-surface hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="19" cy="12" r="1.5" />
              <circle cx="5" cy="12" r="1.5" />
            </svg>
          </button>
        </div>
      </header>

      <TripWorkspaceNav />

      {/* Main Container */}
      <main className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-5 pt-3 pb-7 flex flex-col gap-3.5">
        {/* 1. Header & Cover Card TP.HCM */}
        <div className="relative w-full rounded-[28px] overflow-hidden shadow-md h-[270px] select-none border border-slate-200/40">
          <img
            src="https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80"
            alt="TP.HCM"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-between p-5">
            <div className="flex items-center justify-between">
              <div className="bg-[#FBEDB0] text-[#5e4200] px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#F1B94C] inline-block animate-pulse" />
                <span className="font-heading text-[11px] font-bold uppercase tracking-wider">
                  Đang diễn ra
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowEditTripModal(true)}
                aria-label="Chỉnh sửa"
                className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            </div>

            <div className="flex items-end justify-between gap-2 text-white">
              <div className="flex flex-col">
                <h2 className="font-bold text-[22px] leading-tight font-heading drop-shadow-sm">
                  {tripTitle}
                </h2>
                <p className="text-white/85 text-[12px] font-medium mt-1 drop-shadow-sm">
                  {tripDates} • {plan.days} ngày
                </p>
              </div>
              <div className="flex items-center -space-x-2 shrink-0 pb-0.5">
                <img
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-white"
                  alt="Thành viên"
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                />
                <img
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-white"
                  alt="Thành viên"
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                />
                <img
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-white"
                  alt="Thành viên"
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                />
                <div className="w-7 h-7 rounded-full bg-[#93B2F8] text-[#001a43] font-bold text-[10px] flex items-center justify-center ring-2 ring-white font-heading">
                  +2
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Mã mời tham gia (Row Pill 48px) */}
        <div className="h-12 w-full bg-white rounded-full px-4 flex items-center justify-between border border-[#93B2F8]/40 shadow-xs">
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-[#0A1680] font-bold">#</span>
            <span className="font-medium text-[#454652]">Mã nhóm:</span>
            <span className="font-bold text-[#0A1680] tracking-wider font-mono text-[14px]">
              TRAV123
            </span>
          </div>
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => {
                navigator.clipboard?.writeText('TRAV123');showToast('Đã sao chép mã nhóm TRAV123! 📋');
              }}
              title="Sao chép mã"
              className="px-2.5 py-1 rounded-full bg-blue-50 text-[#0A1680] text-[11px] font-bold font-heading hover:bg-blue-100 transition-colors cursor-pointer"
            >
              Sao chép
            </button>
            <button
              onClick={() => setShowInviteModal(true)}
              title="Chia sẻ mã"
              className="p-1 text-slate-500 hover:text-[#0A1680] cursor-pointer"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </button>
          </div>
        </div>

        {/* 3. Chi tiêu nhóm tóm tắt */}
        <div
          onClick={onOpenExpenseSplit}
          className="bg-white rounded-2xl px-4 py-3 flex items-center justify-between border border-[#93B2F8]/30 shadow-xs cursor-pointer hover:border-[#0A1680]/30 transition-all"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-lg">
              💳
            </div>
            <div>
              <p className="text-[11px] text-[#454652] font-medium">Tổng chi nhóm</p>
              <p className="text-[17px] text-[#191c1e] font-extrabold font-heading">
                7.800.000đ
              </p>
            </div>
          </div>
          <span className="text-[12px] font-bold text-[#0A1680] font-heading flex items-center gap-1">
            Chi tiết →
          </span>
        </div>

        {/* 4. Menu danh sách tính năng */}
        <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden divide-y divide-slate-100">
          {/* Quản lý thành viên */}
          <button
            onClick={() => setShowManageMembersModal(true)}
            className="w-full h-14 px-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-[#001a43] flex items-center justify-center">
                👥
              </div>
              <div>
                <p className="text-[14px] font-bold text-[#191c1e] font-heading">Quản lý thành viên</p>
                <p className="text-[11px] text-[#454652]">6 thành viên tham gia</p>
              </div>
            </div>
            <span className="text-slate-400">›</span>
          </button>

          {/* Xem lịch trình chung */}
          <button
            onClick={onOpenSchedule}
            className="w-full h-14 px-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-[#000866] flex items-center justify-center">
                📅
              </div>
              <div>
                <p className="text-[14px] font-bold text-[#191c1e] font-heading">Xem lịch trình chung</p>
                <p className="text-[11px] text-[#454652]">Cập nhật mới nhất</p>
              </div>
            </div>
            <span className="text-slate-400">›</span>
          </button>

          {/* Bình chọn nhóm */}
          <button
            onClick={onOpenPoll}
            className="w-full h-14 px-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
                🗳️
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-[14px] font-bold text-[#191c1e] font-heading">Bình chọn nhóm</p>
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                </div>
                <p className="text-[11px] text-sky-700 font-medium">2 cuộc bình chọn đang mở</p>
              </div>
            </div>
            <span className="text-slate-400">›</span>
          </button>

          {/* Vị trí của mọi người */}
          <button
            onClick={onOpenLocation}
            className="w-full h-14 px-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                📍
              </div>
              <div>
                <p className="text-[14px] font-bold text-[#191c1e] font-heading">Vị trí của mọi người</p>
                <p className="text-[11px] text-[#454652]">5 vị trí mẫu trong bản demo</p>
              </div>
            </div>
            <span className="text-slate-400">›</span>
          </button>

          {/* Cài đặt nhóm */}
          <button
            onClick={() => setShowGroupSettingsModal(true)}
            className="w-full h-14 px-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center space-x-3.5">
              <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                ⚙️
              </div>
              <div>
                <p className="text-[14px] font-bold text-[#191c1e] font-heading">Cài đặt nhóm</p>
                <p className="text-[11px] text-[#454652]">Thông báo, quyền chỉnh sửa</p>
              </div>
            </div>
            <span className="text-slate-400">›</span>
          </button>
        </div>

      </main>

      {/* CTA cố định: nội dung phía trên vẫn có thể cuộn hết, không bị che. */}
      <footer className="shrink-0 border-t border-[#e7ebf4] bg-[#f8f9fb]/95 px-5 pt-3 pb-5 backdrop-blur-xl">
        <button
          type="button"
          onClick={onOpenChat}
          className="w-full h-12 bg-[#0A1680] text-white rounded-full font-heading font-bold text-[15px] flex items-center justify-center space-x-2 shadow-md hover:bg-[#071060] active:scale-[0.98] transition-all cursor-pointer"
        >
          <span>💬 Nhắn tin nhóm</span>
        </button>
      </footer>

      {/* Sheet 1: Chỉnh sửa thông tin nhóm */}
      {showEditTripModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setShowEditTripModal(false)}
          />
          <div className="w-full max-w-[390px] bg-white rounded-t-[28px] p-5 pb-8 shadow-xl flex flex-col space-y-4 z-10 animate-in slide-in-from-bottom duration-200">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto" />
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-bold text-slate-900 font-heading">Chỉnh sửa thông tin nhóm</h3>
              <button
                type="button"
                onClick={() => setShowEditTripModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-left">
              <div>
                <label className="text-[12px] font-bold text-slate-600 block mb-1">Tên chuyến đi</label>
                <input
                  type="text"
                  value={tripTitle}
                  onChange={(e) => setTripTitle(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0A1680]"
                />
              </div>
              <div>
                <label className="text-[12px] font-bold text-slate-600 block mb-1">Thời gian</label>
                <input
                  type="text"
                  value={tripDates}
                  onChange={(e) => setTripDates(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0A1680]"
                />
              </div>
            </div>
            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setShowEditTripModal(false)}
                className="flex-1 h-11 rounded-full border border-slate-200 text-slate-700 font-heading font-semibold text-xs"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowEditTripModal(false);
                  showToast('Đã lưu thay đổi thông tin nhóm!');
                }}
                className="flex-1 h-11 rounded-full bg-[#0A1680] text-white font-heading font-bold text-xs shadow-md"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sheet 2: Mời bạn bè */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setShowInviteModal(false)}
          />
          <div className="w-full max-w-[390px] bg-white rounded-t-[28px] p-5 pb-8 shadow-xl flex flex-col space-y-4 z-10 animate-in slide-in-from-bottom duration-200">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto" />
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-bold text-slate-900 font-heading">Mời bạn vào nhóm</h3>
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>
            <p className="text-[12px] text-slate-500">
              Gửi mã hoặc liên kết này cho bạn bè cùng đi TP.HCM để tham gia nhóm.
            </p>
            <div className="bg-slate-50 rounded-2xl p-4 flex flex-col items-center justify-center space-y-2 border border-slate-200">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Mã tham gia</span>
              <span className="text-[28px] font-bold text-[#0A1680] font-mono tracking-widest">TRAV123</span>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText('TRAV123');showToast('Đã sao chép mã TRAV123! 📋');
                }}
                className="px-4 py-1.5 rounded-full bg-blue-100 text-[#0A1680] text-[12px] font-bold font-heading hover:bg-blue-200 transition-colors"
              >
                Sao chép mã
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(`${window.location.origin}/join/TRAV123`);showToast('Đã sao chép link mời demo TRAV123');
                setShowInviteModal(false);
              }}
              className="w-full h-12 rounded-full bg-[#0A1680] text-white font-heading font-bold text-xs shadow-md"
            >
              Sao chép liên kết chia sẻ
            </button>
          </div>
        </div>
      )}

      {/* Sheet 3: Quản lý thành viên */}
      {showManageMembersModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setShowManageMembersModal(false)}
          />
          <div className="w-full max-w-[390px] bg-white rounded-t-[28px] p-5 pb-8 shadow-xl flex flex-col space-y-3 z-10 max-h-[85vh] animate-in slide-in-from-bottom duration-200">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto" />
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <div>
                <h3 className="text-[17px] font-bold text-slate-900 font-heading">Thành viên trong nhóm</h3>
                <p className="text-[11px] text-slate-500">6 thành viên tham gia</p>
              </div>
              <button
                type="button"
                onClick={() => setShowManageMembersModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto divide-y divide-slate-100 text-xs max-h-[50vh]">
              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-9 h-9 rounded-full bg-[#0A1680] text-white flex items-center justify-center font-bold">Bạn</span>
                  <div>
                    <p className="font-bold text-slate-900 font-heading">Bạn (Tôi)</p>
                    <p className="text-[10px] text-slate-400">Trưởng nhóm • Sáng lập</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">Trưởng nhóm</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-9 h-9 rounded-full bg-blue-100 text-[#0A1680] flex items-center justify-center font-bold">MA</span>
                  <div>
                    <p className="font-bold text-slate-900 font-heading">Minh Anh</p>
                    <p className="text-[10px] text-slate-400">Đồng tổ chức lịch trình</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0A1680] font-bold text-[10px]">Phó nhóm</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold">LC</span>
                  <div>
                    <p className="font-bold text-slate-900 font-heading">Linh Chi</p>
                    <p className="text-[10px] text-slate-400">Quản lý quỹ chuyến đi</p>
                  </div>
                </div>
                <span className="text-slate-400">Thành viên</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowManageMembersModal(false);
                setShowInviteModal(true);
              }}
              className="w-full h-11 rounded-full bg-slate-100 text-[#0A1680] font-heading font-bold text-xs hover:bg-slate-200 transition-colors"
            >
              + Thêm thành viên mới
            </button>
          </div>
        </div>
      )}

      {/* Sheet 4: Cài đặt nhóm */}
      {showGroupSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setShowGroupSettingsModal(false)}
          />
          <div className="w-full max-w-[390px] bg-white rounded-t-[28px] p-5 pb-8 shadow-xl flex flex-col space-y-4 z-10 animate-in slide-in-from-bottom duration-200">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto" />
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-bold text-slate-900 font-heading">Cài đặt nhóm</h3>
              <button
                type="button"
                onClick={() => setShowGroupSettingsModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-left divide-y divide-slate-100 text-xs">
              <div className="pt-1 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 font-heading text-[13px]">Thông báo nhóm</p>
                  <p className="text-slate-500 text-[11px]">Nhận thông báo bình chọn & lịch trình</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#0A1680] rounded cursor-pointer" />
              </div>
              <div className="pt-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900 font-heading text-[13px]">Tự động duyệt thành viên</p>
                  <p className="text-slate-500 text-[11px]">Ai có mã nhóm đều có thể vào ngay</p>
                </div>
                <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#0A1680] rounded cursor-pointer" />
              </div>
              <div className="pt-3 flex flex-col space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowGroupSettingsModal(false);
                    setShowEndTripModal(true);
                  }}
                  className="w-full h-11 rounded-xl text-left px-3 text-[13px] font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 transition-colors flex items-center justify-between cursor-pointer font-heading"
                >
                  <span>Kết thúc chuyến đi</span>
                  <span>›</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowGroupSettingsModal(false);
                    setShowLeaveGroupModal(true);
                  }}
                  className="w-full h-11 rounded-xl text-left px-3 text-[13px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors flex items-center justify-between cursor-pointer font-heading"
                >
                  <span>Rời khỏi nhóm</span>
                  <span>›</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dialog: Xác nhận rời nhóm */}
      {showLeaveGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setShowLeaveGroupModal(false)}
          />
          <div className="w-full max-w-[342px] bg-white rounded-[28px] p-6 shadow-2xl flex flex-col items-center text-center space-y-3 z-10 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xl">
              ⚠️
            </div>
            <h4 className="text-[18px] font-bold text-slate-900 font-heading">Rời khỏi nhóm này?</h4>
            <p className="text-[12px] text-slate-500 leading-relaxed">
              Bạn sẽ không còn theo dõi được lịch trình cập nhật và vị trí trực tiếp của các thành viên.
            </p>
            <div className="w-full pt-2 flex space-x-2">
              <button
                type="button"
                onClick={() => setShowLeaveGroupModal(false)}
                className="flex-1 h-11 rounded-full border border-slate-200 text-slate-700 font-heading font-semibold text-xs"
              >
                Ở lại
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLeaveGroupModal(false);
                  showToast('Đã rời khỏi nhóm TP.HCM.');
                  onBack();
                }}
                className="flex-1 h-11 rounded-full bg-rose-600 text-white font-heading font-bold text-xs shadow-md"
              >
                Rời nhóm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog: Kết thúc chuyến đi */}
      {showEndTripModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setShowEndTripModal(false)}
          />
          <div className="w-full max-w-[342px] bg-white rounded-[28px] p-6 shadow-2xl flex flex-col items-center text-center space-y-3 z-10 animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xl">
              ✓
            </div>
            <h4 className="text-[18px] font-bold text-slate-900 font-heading">Kết thúc chuyến đi?</h4>
            <p className="text-[12px] text-slate-500 leading-relaxed">
              Trạng thái chuyến đi sẽ chuyển thành hoàn tất và khóa các bình chọn đang mở.
            </p>
            <div className="w-full pt-2 flex space-x-2">
              <button
                type="button"
                onClick={() => setShowEndTripModal(false)}
                className="flex-1 h-11 rounded-full border border-slate-200 text-slate-700 font-heading font-semibold text-xs"
              >
                Quay lại
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowEndTripModal(false);
                  showToast('Chuyến đi đã kết thúc! Chúc bạn có những kỷ niệm đẹp.');
                }}
                className="flex-1 h-11 rounded-full bg-[#0A1680] text-white font-heading font-bold text-xs shadow-md"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-slate-900/90 backdrop-blur-md text-white text-xs font-semibold shadow-lg animate-in fade-in zoom-in duration-200">
          {toastMessage}
        </div>
      )}
    </div>
  );
};
