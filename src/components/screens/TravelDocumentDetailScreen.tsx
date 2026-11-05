import React, { useState } from 'react';
import { IOSStatusBar } from '../common/IOSStatusBar';

interface TravelDocumentDetailScreenProps {
  onBack: () => void;
  onDeleteSuccess?: () => void;
}

export const TravelDocumentDetailScreen: React.FC<TravelDocumentDetailScreenProps> = ({
  onBack,
  onDeleteSuccess,
}) => {
  const [isMasked, setIsMasked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2400);
  };

  const handleDelete = () => {
    setShowDeleteDialog(false);
    showToast('Đã xóa tài liệu khỏi ví!');
    setTimeout(() => {
      if (onDeleteSuccess) onDeleteSuccess();
      else onBack();
    }, 600);
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#f8f9fb] text-[#191c1e] font-body-md antialiased select-none">
      {/* Header */}
      <header className="shrink-0 z-30 bg-[#f8f9fb]/90 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_1px_8px_rgba(10,22,128,0.04)]">
        <IOSStatusBar light={false} />
        <div className="h-14 px-5 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={onBack}
              aria-label="Quay lại"
              className="w-10 h-10 -ml-1 flex items-center justify-center rounded-full text-[#191c1e] hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5 text-[#191c1e]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="font-heading font-bold text-[18px] text-[#191c1e] tracking-tight truncate">
              Chi tiết vé máy bay
            </h1>
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
      <main className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-5 pt-3 pb-24 space-y-4">
        {/* Top Status Pill */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d8e2ff] text-[#001a43] text-xs font-bold font-heading">
            <span>✓</span>
            <span>Đã đồng bộ AI Wallet</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Thêm lúc: 08 Thg 6, 2025</span>
        </div>

        {/* Boarding Pass Card */}
        <div className="relative w-full rounded-3xl bg-white shadow-xl overflow-hidden flex flex-col border border-slate-200">
          {/* Top Brand Banner */}
          <div className="px-5 pt-5 pb-4 bg-[#0A1680] text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#ffdea8] flex items-center justify-center text-[#271900] shadow-sm text-base">
                ✈️
              </div>
              <div>
                <span className="block font-heading font-black text-[17px] text-white">Vietjet Air</span>
                <span className="block text-[11px] text-[#dfe0ff] font-medium">Chuyến bay VJ628</span>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full bg-[#f6bd50] text-[#1e1300] font-heading font-bold text-[11px]">
              Hạng phổ thông
            </div>
          </div>

          {/* Flight Path */}
          <div className="p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-heading font-black text-[30px] text-[#000552] tracking-tight leading-none">
                  SGN
                </span>
                <span className="font-bold text-[15px] text-slate-800 mt-1">06:15</span>
                <span className="text-[11px] text-slate-500">Tân Sơn Nhất</span>
              </div>
              <div className="flex-1 flex flex-col items-center px-4">
                <span className="text-[11px] font-bold text-slate-500 mb-1">⏱ 1h 20m</span>
                <div className="w-full relative flex items-center justify-center">
                  <div className="w-full h-[2px] bg-[#d8e2ff]" />
                  <div className="absolute w-7 h-7 rounded-full bg-[#f2f4f6] border border-blue-200 flex items-center justify-center text-[#3d5d9d] text-xs">
                    ✈
                  </div>
                </div>
                <span className="text-[10px] text-[#3d5d9d] font-bold mt-1 uppercase">Bay thẳng</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-heading font-black text-[30px] text-[#000552] tracking-tight leading-none">
                  DAD
                </span>
                <span className="font-bold text-[15px] text-slate-800 mt-1">07:35</span>
                <span className="text-[11px] text-slate-500">TP.HCM</span>
              </div>
            </div>

            {/* Passenger Meta Bento */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hành khách</span>
                <span className="font-heading font-bold text-[12px] text-slate-900 truncate mt-0.5">NGUYEN HOANG</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cửa ra / Cổng</span>
                <span className="font-heading font-bold text-[12px] text-slate-900 mt-0.5">Gate 12B</span>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 flex flex-col">
                <span className="text-[10px] text-[#0A1680] font-bold uppercase tracking-wider">Chỗ ngồi</span>
                <span className="font-heading font-black text-[14px] text-[#0A1680] mt-0.5">14A</span>
              </div>
            </div>

            {/* Booking Code with Privacy Toggle */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] text-slate-500">Mã đặt chỗ (PNR)</span>
                <span className="font-heading font-bold text-[17px] tracking-wider text-[#0A1680]">
                  {isMasked ? '••••••••' : 'VJ-883921'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsMasked(!isMasked)}
                className="w-10 h-10 rounded-full bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 cursor-pointer"
                title={isMasked ? 'Hiện mã' : 'Ẩn mã'}
              >
                {isMasked ? '👁️' : '🕶️'}
              </button>
            </div>
          </div>

          {/* Perforated Cutout Separator */}
          <div className="relative w-full h-6 flex items-center justify-between overflow-hidden px-3 bg-white">
            <div className="absolute -left-3.5 w-7 h-7 rounded-full bg-[#f8f9fb] border-r border-slate-200" />
            <div className="w-full border-t-2 border-dashed border-slate-200 mx-4" />
            <div className="absolute -right-3.5 w-7 h-7 rounded-full bg-[#f8f9fb] border-l border-slate-200" />
          </div>

          {/* Vector Barcode Section */}
          <div className="p-5 flex flex-col items-center gap-2 bg-white">
            <div className="w-full flex items-center justify-center py-1">
              {/* Scalable Barcode SVG */}
              <svg className="w-64 h-12 text-slate-800" fill="currentColor" viewBox="0 0 240 50">
                <rect x="0" y="0" width="4" height="50" />
                <rect x="6" y="0" width="2" height="50" />
                <rect x="11" y="0" width="6" height="50" />
                <rect x="20" y="0" width="3" height="50" />
                <rect x="25" y="0" width="5" height="50" />
                <rect x="33" y="0" width="2" height="50" />
                <rect x="38" y="0" width="7" height="50" />
                <rect x="48" y="0" width="3" height="50" />
                <rect x="54" y="0" width="2" height="50" />
                <rect x="59" y="0" width="5" height="50" />
                <rect x="67" y="0" width="4" height="50" />
                <rect x="74" y="0" width="2" height="50" />
                <rect x="79" y="0" width="6" height="50" />
                <rect x="88" y="0" width="3" height="50" />
                <rect x="94" y="0" width="7" height="50" />
                <rect x="104" y="0" width="2" height="50" />
                <rect x="109" y="0" width="5" height="50" />
                <rect x="117" y="0" width="4" height="50" />
                <rect x="124" y="0" width="2" height="50" />
                <rect x="129" y="0" width="6" height="50" />
                <rect x="138" y="0" width="3" height="50" />
                <rect x="144" y="0" width="7" height="50" />
                <rect x="154" y="0" width="2" height="50" />
                <rect x="159" y="0" width="5" height="50" />
                <rect x="167" y="0" width="3" height="50" />
                <rect x="173" y="0" width="2" height="50" />
                <rect x="178" y="0" width="6" height="50" />
                <rect x="187" y="0" width="4" height="50" />
                <rect x="194" y="0" width="2" height="50" />
                <rect x="199" y="0" width="7" height="50" />
                <rect x="209" y="0" width="3" height="50" />
                <rect x="215" y="0" width="5" height="50" />
                <rect x="223" y="0" width="2" height="50" />
                <rect x="228" y="0" width="6" height="50" />
                <rect x="237" y="0" width="3" height="50" />
              </svg>
            </div>
            <span className="text-[11px] font-mono text-slate-500 tracking-widest text-center">
              VJ628-SGN-DAD-120625
            </span>
          </div>
        </div>

        {/* AI Companion Scout Note */}
        <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/60 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#0A1680] text-white flex items-center justify-center shrink-0 text-sm">
            🤖
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-[12px] text-[#0A1680]">Trợ lý TravAIy nhắc nhở</span>
            <p className="text-[12px] text-slate-600 mt-0.5 leading-relaxed">
              Nên có mặt tại Cột số 3, Ga Quốc nội Tân Sơn Nhất lúc 04:30 sáng để làm thủ tục ký gửi hành lý kịp giờ.
            </p>
          </div>
        </div>

        {/* Document Management Info */}
        <div className="rounded-2xl bg-white p-4 shadow-xs border border-slate-200 space-y-3">
          <h2 className="font-heading font-bold text-[14px] text-slate-900">Thông tin quản lý giấy tờ</h2>
          <div className="flex items-center justify-between py-1 text-xs border-b border-slate-100 pb-2">
            <span className="text-slate-500">Loại giấy tờ</span>
            <span className="font-bold text-slate-800">Vé máy bay điện tử</span>
          </div>
          <div className="flex items-center justify-between py-1 text-xs border-b border-slate-100 pb-2">
            <span className="text-slate-500">Quyền xem</span>
            <div className="flex items-center gap-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-[#d8e2ff] text-[#001a43] text-[10px] font-bold">
                ● Nhóm (4 người)
              </span>
              <button
                onClick={() => showToast('Mở bảng đổi quyền riêng tư...')}
                className="text-[#0A1680] font-bold hover:underline"
              >
                Đổi
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between py-1 text-xs">
            <span className="text-slate-500">Tập tin gốc</span>
            <span className="font-medium text-slate-700">Vietjet_VJ628.pdf (1.4 MB)</span>
          </div>
        </div>

        {/* Action Utility Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={() => showToast('Đang tải file PDF về điện thoại...')}
            className="w-full h-12 rounded-full bg-[#0A1680] text-white font-heading font-bold text-[14px] flex items-center justify-center gap-2 shadow-md hover:bg-[#071060] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>⬇</span>
            <span>Tải file đính kèm (PDF)</span>
          </button>
          <button
            onClick={() => setShowShareModal(true)}
            className="w-full h-11 rounded-full bg-[#d8e2ff] text-[#001a43] font-heading font-bold text-[13px] flex items-center justify-center gap-2 hover:bg-[#c6d7ff] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>🔗</span>
            <span>Chia sẻ link giấy tờ</span>
          </button>
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="w-full py-3 rounded-full bg-rose-50 text-rose-600 font-heading font-bold text-[12px] flex items-center justify-center gap-1.5 hover:bg-rose-100 transition-colors cursor-pointer"
          >
            <span>🗑</span>
            <span>Xóa tài liệu này khỏi ví</span>
          </button>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="w-[342px] bg-white rounded-[28px] p-6 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xl mb-3">
              🗑️
            </div>
            <h3 className="font-heading font-bold text-[17px] text-slate-900 mb-1">
              Xóa tài liệu này?
            </h3>
            <p className="text-[12px] text-slate-500 mb-5 leading-relaxed">
              Vé máy bay VJ628 sẽ bị xóa khỏi ví giấy tờ của bạn và nhóm.
            </p>
            <div className="flex gap-2.5 w-full">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 h-11 rounded-full border border-slate-200 text-slate-700 font-heading text-xs font-semibold"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 h-11 rounded-full bg-rose-600 text-white font-heading text-xs font-bold shadow-md hover:bg-rose-700"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-[390px] bg-white rounded-t-[28px] p-5 shadow-2xl flex flex-col gap-3 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-heading font-bold text-[16px]">Chia sẻ thẻ lên máy bay</h3>
              <button onClick={() => setShowShareModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100">
                ✕
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3 py-2 text-center">
              {[
                { name: 'Sao chép', icon: '🔗', act: () => showToast('Đã sao chép link vé!') },
                { name: 'Zalo', icon: '💬', act: () => showToast('Đang mở Zalo...') },
                { name: 'In vé', icon: '🖨️', act: () => showToast('Đang kết nối máy in...') },
                { name: 'Apple Wallet', icon: '🎟️', act: () => showToast('Đã thêm vào Apple Wallet!') },
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

      {/* More Options Modal */}
      {showMoreOptions && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-[390px] bg-white rounded-t-[28px] p-5 shadow-2xl flex flex-col gap-2 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-heading font-bold text-[16px]">Tùy chọn vé VJ628</h3>
              <button onClick={() => setShowMoreOptions(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100">
                ✕
              </button>
            </div>
            <button
              onClick={() => {
                setShowMoreOptions(false);
                showToast('Đang kiểm tra tình trạng chuyến bay thời gian thực...');
              }}
              className="w-full p-3 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-800 flex items-center gap-2"
            >
              <span>✈️</span>
              <span>Theo dõi chuyến bay thời gian thực (Flight Radar)</span>
            </button>
            <button
              onClick={() => {
                setShowMoreOptions(false);
                showToast('Mở màn hình chỉnh sửa vé...');
              }}
              className="w-full p-3 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-800 flex items-center gap-2"
            >
              <span>✏️</span>
              <span>Chỉnh sửa thông tin vé</span>
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-slate-900/90 text-white text-xs font-semibold shadow-xl animate-in fade-in duration-200">
          {toastMessage}
        </div>
      )}
    </div>
  );
};
