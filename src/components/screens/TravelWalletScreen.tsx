import { useNavigate } from 'react-router-dom';
import { useTravel } from '../../features/travel/TravelContext';
import React, { useState } from 'react';
import { IOSStatusBar } from '../common/IOSStatusBar';

interface TravelWalletScreenProps {
  onBack: () => void;
  onOpenDocumentDetail: (docId: string) => void;
  onOpenAddDocument: () => void;
}

export const TravelWalletScreen: React.FC<TravelWalletScreenProps> = ({
  onBack,
  onOpenDocumentDetail,
  onOpenAddDocument,
}) => {
  const navigate=useNavigate();const {plan,documents:savedDocuments}=useTravel();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentFilter, setCurrentFilter] = useState<'all' | 'ticket' | 'hotel' | 'id' | 'insurance'>('all');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showMoreOptionsModal, setShowMoreOptionsModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2400);
  };

  const documents = [
    {
      id: 'flight-vj628',
      type: 'ticket',
      category: 'HÀNG KHÔNG',
      subCode: 'VJ628',
      title: 'Vé máy bay TP.HCM – TP.HCM',
      provider: 'Vietjet Air',
      timeLabel: 'Thời gian khởi hành',
      timeValue: '12 Thg 6, 2025 · 06:15',
      codeLabel: 'Mã đặt chỗ (PNR)',
      codeValue: 'VJ-88****',
      sharedTag: 'Đã chia sẻ với nhóm',
      isPrivate: false,
      actionText: 'Xem thẻ lên máy bay',
      icon: 'flight_takeoff',
      iconBg: 'bg-[#dfe0ff] text-[#0A1680]',
      searchKeywords: 'vé máy bay tphcm đà nẵng vietjet air vj628 vj-88',
    },
    {
      id: 'hotel-tms',
      type: 'hotel',
      category: 'KHÁCH SẠN',
      subCode: 'Công viên Tao Đàn',
      title: 'TMS Hotel Ho Chi Minh City Beach',
      provider: 'Phòng Ocean King Suite · Tầng cao',
      timeLabel: 'Thời gian lưu trú',
      timeValue: '12 - 15 Thg 6 (3 đêm)',
      codeLabel: 'Mã xác nhận',
      codeValue: 'TMS-91****',
      sharedTag: 'Đã chia sẻ với nhóm',
      isPrivate: false,
      actionText: 'Xem Voucher',
      icon: 'apartment',
      iconBg: 'bg-[#d8e2ff] text-[#254786]',
      searchKeywords: 'xác nhận đặt phòng khách sạn tms hotel da nang beach tms-91',
    },
    {
      id: 'cccd-hoang',
      type: 'id',
      category: 'RIÊNG TƯ',
      subCode: 'CCCD gắn chip',
      title: 'Căn cước công dân (Nguyễn Hoàng)',
      provider: 'Chủ sở hữu chuyến đi',
      timeLabel: 'Thời hạn hiệu lực',
      timeValue: 'Có giá trị đến 2030',
      codeLabel: 'Số định danh cá nhân',
      codeValue: '079201******',
      sharedTag: 'Chỉ mình tôi',
      isPrivate: true,
      actionText: 'Mở khóa xem',
      icon: 'badge',
      iconBg: 'bg-slate-200 text-slate-800',
      searchKeywords: 'căn cước công dân hộ chiếu passport nguyễn hoàng 079201',
    },
    {
      id: 'insurance-baoviet',
      type: 'insurance',
      category: 'BẢO HIỂM HÀNH TRÌNH',
      subCode: 'Bảo Việt',
      title: 'Bảo hiểm du lịch nội địa',
      provider: 'Gói Toàn Diện An Gia (100tr/vụ)',
      timeLabel: 'Thời hạn bảo hiểm',
      timeValue: '12/06 - 15/06/2025',
      codeLabel: 'Số hợp đồng điện tử',
      codeValue: 'BV-2025-****',
      sharedTag: 'Đã chia sẻ với nhóm',
      isPrivate: false,
      actionText: 'Tải file PDF',
      icon: 'health_and_safety',
      iconBg: 'bg-[#ffdea8] text-[#b9881c]',
      searchKeywords: 'bảo hiểm du lịch nội địa bảo việt an gia bv-2025',
    },
  ];

  const filteredDocs = documents.filter((doc) => {
    const matchFilter = currentFilter === 'all' || doc.type === currentFilter;
    const matchSearch =
      !searchTerm.trim() ||
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.searchKeywords.includes(searchTerm.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#f8f9fb] text-[#191c1e] font-body-md antialiased select-none">
      {/* Header */}
      <header className="shrink-0 z-30 bg-[#f8f9fb]/90 backdrop-blur-xl border-b border-[#c6c5d4]/30 shadow-[0_1px_8px_rgba(10,22,128,0.04)]">
        <IOSStatusBar light={false} />
        <div className="h-14 px-4 flex items-center justify-between">
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
              Ví giấy tờ du lịch
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
              onClick={() => setShowMoreOptionsModal(true)}
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
      <main className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-4 pt-2 space-y-4 pb-28">
        {savedDocuments.filter(d=>d.tripId===plan.id&&d.title.toLowerCase().includes(searchTerm.toLowerCase())).map(doc=><button className="adaptive-notification" key={doc.id} onClick={()=>navigate(`/wallet/local/${doc.id}`)}><b>{doc.title}</b><span>{doc.validDate} · {doc.hasFile?'Có tệp đính kèm':'Thông tin giấy tờ'}</span><small>Đã lưu trên máy này</small></button>)}
        {/* Trip Selector Pill */}
        <div className="flex items-center justify-between bg-[#f2f4f6] px-4 py-2.5 rounded-full border border-slate-200/60 shadow-2xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[#0A1680] text-sm">🧭</span>
            <span className="font-heading font-semibold text-[13px] text-[#191c1e] truncate">
              TP.HCM 3N2Đ (12 - 15 Thg 6)
            </span>
          </div>
          <span className="text-xs text-slate-500 font-bold">▾</span>
        </div>

        {/* Warm Minimalist Intro Banner */}
        <div className="bg-gradient-to-br from-[#dfe0ff]/40 via-white to-[#f2f4f6] p-4 rounded-[24px] shadow-xs border border-blue-100 flex items-start justify-between gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[#b9881c] text-sm">📁</span>
              <span className="font-heading font-bold text-[10px] uppercase tracking-wider text-[#b9881c]">
                Kho lưu trữ an toàn
              </span>
            </div>
            <h2 className="font-heading font-bold text-[16px] text-[#000552] tracking-tight leading-snug">
              Mọi giấy tờ cho hành trình, một nơi
            </h2>
            <p className="text-[12px] text-slate-600 mt-1 leading-relaxed">
              Tự động đồng bộ từ email & quét thông minh với mã hóa bảo vệ cao.
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-[#0A1680] shrink-0 shadow-xs border border-blue-100 text-lg">
            🛡️
          </div>
        </div>

        {/* Search Input Container */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm tên vé, khách sạn, số định danh..."
            className="w-full h-11 pl-10 pr-10 bg-white rounded-full text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A1680]/20 shadow-2xs border border-slate-200 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Horizontal Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 -mx-4 px-4">
          {[
            { id: 'all', label: 'Tất cả', count: 4 },
            { id: 'ticket', label: 'Vé', count: 1 },
            { id: 'hotel', label: 'Đặt phòng', count: 1 },
            { id: 'id', label: 'Cá nhân', count: 1 },
            { id: 'insurance', label: 'Bảo hiểm', count: 1 },
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setCurrentFilter(chip.id as any)}
              className={`h-8 px-3.5 rounded-full font-heading text-[12px] font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                currentFilter === chip.id
                  ? 'bg-[#0A1680] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              <span>{chip.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  currentFilter === chip.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {chip.count}
              </span>
            </button>
          ))}
        </div>

        {/* Documents Cards List */}
        <div className="space-y-3">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => onOpenDocumentDetail(doc.id)}
              className="bg-white rounded-[24px] p-4 shadow-xs hover:shadow-md border border-slate-200/80 transition-all flex flex-col gap-3 cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-[18px] ${doc.iconBg} flex items-center justify-center shrink-0 shadow-2xs font-bold text-lg`}
                  >
                    {doc.type === 'ticket' ? '✈️' : doc.type === 'hotel' ? '🏨' : doc.type === 'id' ? '🪪' : '🛡️'}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-heading text-[10px] font-bold text-[#3d5d9d] uppercase tracking-wider">
                        {doc.category}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="text-[11px] text-slate-400 font-medium">{doc.subCode}</span>
                    </div>
                    <h3 className="font-heading font-bold text-[15px] text-slate-900 leading-snug truncate">
                      {doc.title}
                    </h3>
                    <span className="text-[12px] text-slate-500 truncate">{doc.provider}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    showToast(`Tùy chọn cho ${doc.title}`);
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100"
                >
                  ⋮
                </button>
              </div>

              <div className="flex items-center justify-between bg-[#f2f4f6] px-3.5 py-2.5 rounded-[16px] text-xs">
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-500">{doc.timeLabel}</span>
                  <span className="font-bold text-slate-800">{doc.timeValue}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[11px] text-slate-500">{doc.codeLabel}</span>
                  <span className="font-mono font-bold text-[#0A1680] tracking-wider">{doc.codeValue}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-heading font-bold ${
                    doc.isPrivate
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-blue-50 text-[#0A1680] border border-blue-200'
                  }`}
                >
                  <span>{doc.isPrivate ? '🔒' : '👥'}</span>
                  <span>{doc.sharedTag}</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[#0A1680] font-heading text-[12px] font-bold group-hover:translate-x-0.5 transition-transform">
                  <span>{doc.actionText}</span>
                  <span>→</span>
                </span>
              </div>
            </div>
          ))}

          {filteredDocs.length === 0 && (
            <div className="text-center py-12 px-4 bg-white rounded-3xl border border-slate-200">
              <div className="text-3xl mb-2">📁</div>
              <h4 className="font-heading font-bold text-slate-800 text-[15px]">Không tìm thấy giấy tờ phù hợp</h4>
              <p className="text-xs text-slate-500 mt-1">Thử đổi từ khóa hoặc bộ lọc danh mục.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCurrentFilter('all');
                }}
                className="mt-3 px-4 py-1.5 rounded-full bg-slate-100 text-[#0A1680] font-heading text-xs font-bold"
              >
                Xem tất cả
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Floating Bottom Button */}
      <div className="fixed bottom-5 left-0 right-0 max-w-[390px] mx-auto px-4 z-40 pointer-events-none">
        <button
          onClick={onOpenAddDocument}
          className="pointer-events-auto w-full h-12 rounded-full bg-[#0A1680] text-white font-heading font-bold text-[14px] shadow-lg flex items-center justify-center gap-2 hover:bg-[#071060] active:scale-[0.98] transition-all cursor-pointer"
        >
          <span className="text-lg">+</span>
          <span>Thêm giấy tờ mới</span>
        </button>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-[390px] bg-white rounded-t-[28px] p-5 shadow-2xl flex flex-col gap-3 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-heading font-bold text-[16px] text-slate-900">Chia sẻ giấy tờ chuyến đi</h3>
              <button onClick={() => setShowShareModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100">
                ✕
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3 py-2 text-center">
              {[
                { name: 'Sao chép', icon: '🔗', act: () => showToast('Đã sao chép link ví an toàn!') },
                { name: 'Xuất PDF', icon: '📄', act: () => showToast('Đang tạo file PDF gói giấy tờ...') },
                { name: 'Zalo', icon: '💬', act: () => showToast('Đang mở Zalo chia sẻ...') },
                { name: 'AirDrop', icon: '📡', act: () => showToast('Đang tìm thiết bị gần...') },
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
      {showMoreOptionsModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-[390px] bg-white rounded-t-[28px] p-5 shadow-2xl flex flex-col gap-2 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-heading font-bold text-[16px] text-slate-900">Tùy chọn kho giấy tờ</h3>
              <button onClick={() => setShowMoreOptionsModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100">
                ✕
              </button>
            </div>
            <button
              onClick={() => {
                setShowMoreOptionsModal(false);
                showToast('Đang tải dữ liệu lưu trữ ngoại tuyến...');
              }}
              className="w-full p-3 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-800 flex items-center gap-2.5"
            >
              <span>📥</span>
              <span>Tải xuống dùng ngoại tuyến (Offline)</span>
            </button>
            <button
              onClick={() => {
                setShowMoreOptionsModal(false);
                showToast('Đang đồng bộ hóa vé tự động từ Gmail...');
              }}
              className="w-full p-3 rounded-xl hover:bg-slate-50 text-left text-xs font-semibold text-slate-800 flex items-center gap-2.5"
            >
              <span>🔄</span>
              <span>Đồng bộ từ Email / Booking</span>
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
