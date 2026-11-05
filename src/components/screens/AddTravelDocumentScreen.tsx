import { useTravel } from '../../features/travel/TravelContext';
import { storeDocumentFile } from '../../features/travel/localFiles';
import React, { useState } from 'react';
import { IOSStatusBar } from '../common/IOSStatusBar';

interface AddTravelDocumentScreenProps {
  onBack: () => void;
  onSaveSuccess: () => void;
}

export const AddTravelDocumentScreen: React.FC<AddTravelDocumentScreenProps> = ({
  onBack,
  onSaveSuccess,
}) => {
  const {plan,setDocuments}=useTravel();
  const [selectedFile,setSelectedFile]=useState<File|null>(null);
  const [selectedType, setSelectedType] = useState<'flight' | 'hotel' | 'id' | 'insurance' | 'other'>('flight');
  const [docTitle, setDocTitle] = useState('Vé máy bay Vietnam Airlines chiều về');
  const [validDate, setValidDate] = useState('15 Thg 6, 2025');
  const [notes, setNotes] = useState('Chuyến bay VN128 lúc 18:30 tại ga T1, cổng số 4. Mã PNR: QW89KL.');
  const [privacy, setPrivacy] = useState<'private' | 'group'>('group');
  const [hasFile, setHasFile] = useState(true);
  const [fileName, setFileName] = useState('Ve_may_bay_chieu_ve.pdf');
  const [fileSize, setFileSize] = useState('1.2 MB');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2400);
  };

  const docTypes = [
    {
      id: 'flight',
      label: 'Vé máy bay / Tàu',
      sub: 'Check-in, boarding',
      icon: '✈️',
      defaultTitle: 'Vé máy bay Vietnam Airlines chiều về',
    },
    {
      id: 'hotel',
      label: 'Khách sạn / Chỗ ở',
      sub: 'Xác nhận đặt phòng',
      icon: '🏨',
      defaultTitle: 'Xác nhận đặt phòng Pullman Danang Resort',
    },
    {
      id: 'id',
      label: 'CCCD / Hộ chiếu',
      sub: 'Giấy tờ tùy thân',
      icon: '🪪',
      defaultTitle: 'Hộ chiếu / Căn cước công dân gắn chip',
    },
    {
      id: 'insurance',
      label: 'Bảo hiểm du lịch',
      sub: 'Hợp đồng & hotline',
      icon: '🛡️',
      defaultTitle: 'Chứng nhận Bảo hiểm Du lịch Bảo Việt',
    },
    {
      id: 'other',
      label: 'Tài liệu khác',
      sub: 'Vé tham quan, voucher, hợp đồng xe',
      icon: '📂',
      defaultTitle: 'Vé tham quan Dinh Độc Lập kèm cáp treo',
    },
  ];

  const handleSelectType = (typeId: any) => {
    setSelectedType(typeId);
    const item = docTypes.find((d) => d.id === typeId);
    if (item) setDocTitle(item.defaultTitle);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setHasFile(true);
      setFileName(file.name);
      setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      showToast(`Đã đính kèm: ${file.name}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) {
      showToast('Vui lòng nhập tên tài liệu!');
      return;
    }
    const id=`local-doc-${Date.now()}`;
    try{if(selectedFile&&hasFile)await storeDocumentFile(id,selectedFile);}catch{showToast('Không thể lưu tệp. Kiểm tra dung lượng trình duyệt rồi thử lại.');return;}
    setDocuments(p=>[{id,tripId:plan.id,title:docTitle,type:selectedType,validDate,notes,privacy,fileName:selectedFile?.name||'',hasFile:!!selectedFile&&hasFile},...p]);
    showToast(`Đã lưu thông tin giấy tờ: ${docTitle}`);
    setTimeout(() => {
      onSaveSuccess();
    }, 800);
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#f8f9fb] text-[#191c1e] font-body-md antialiased select-none">
      {/* Header */}
      <header className="shrink-0 z-30 bg-[#f8f9fb]/90 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_1px_8px_rgba(10,22,128,0.04)]">
        <IOSStatusBar light={false} />
        <div className="h-14 px-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              aria-label="Quay lại"
              className="w-10 h-10 -ml-1 flex items-center justify-center rounded-full text-[#191c1e] hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5 text-[#191c1e]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="font-heading font-bold text-[18px] text-[#191c1e] tracking-tight">
              Thêm giấy tờ mới
            </h1>
          </div>
          <button
            onClick={onBack}
            aria-label="Đóng biểu mẫu"
            className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-300 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>
      </header>

      {/* Main Content Form */}
      <main className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-5 pt-3 pb-24 space-y-4">
        <div className="flex items-center gap-1.5 text-xs text-[#3d5d9d] font-heading font-bold">
          <span>✈️</span>
          <span>TP.HCM 3N2Đ • 14 - 16 Thg 6, 2025</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Document Type Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-heading font-bold text-[13px] text-slate-900">Loại tài liệu</label>
              <span className="text-[10px] font-bold text-[#3d5d9d] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                Bắt buộc
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {docTypes.slice(0, 4).map((type) => {
                const isSelected = selectedType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleSelectType(type.id)}
                    className={`p-3 rounded-2xl flex items-center gap-2.5 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0A1680] text-white shadow-xs'
                        : 'bg-white text-slate-800 border border-slate-200/80 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-base ${
                        isSelected ? 'bg-white/20' : 'bg-slate-100'
                      }`}
                    >
                      {type.icon}
                    </div>
                    <div className="min-w-0">
                      <span className="font-heading font-bold text-[12px] block truncate">{type.label}</span>
                      <span className={`text-[10px] block truncate ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                        {type.sub}
                      </span>
                    </div>
                  </button>
                );
              })}
              {/* Option 5: Other (Span 2 cols) */}
              <button
                type="button"
                onClick={() => handleSelectType('other')}
                className={`col-span-2 p-3 rounded-2xl flex items-center gap-2.5 text-left transition-all cursor-pointer ${
                  selectedType === 'other'
                    ? 'bg-[#0A1680] text-white shadow-xs'
                    : 'bg-white text-slate-800 border border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-base ${
                    selectedType === 'other' ? 'bg-white/20' : 'bg-slate-100'
                  }`}
                >
                  📂
                </div>
                <div className="min-w-0">
                  <span className="font-heading font-bold text-[12px] block">Tài liệu khác</span>
                  <span className={`text-[10px] block ${selectedType === 'other' ? 'text-white/80' : 'text-slate-400'}`}>
                    Vé tham quan, voucher, hợp đồng xe
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label className="font-heading font-bold text-[13px] text-slate-900 block mb-1.5" htmlFor="doc-title">
              Tên tài liệu
            </label>
            <div className="relative">
              <input
                id="doc-title"
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="VD: Vé máy bay Vietnam Airlines chiều về"
                className="w-full h-12 px-4 pr-10 rounded-2xl bg-white text-xs font-semibold text-slate-800 border border-slate-200 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#0A1680]/20"
              />
              {docTitle && (
                <button
                  type="button"
                  onClick={() => setDocTitle('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Attachment / Photos */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-heading font-bold text-[13px] text-slate-900">
                Tệp đính kèm / Ảnh chụp
              </label>
              <span className="text-[11px] text-slate-400">Tối đa 15MB</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col gap-3">
              {hasFile && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-sm shrink-0">
                      PDF
                    </div>
                    <div className="min-w-0">
                      <span className="text-[12px] font-bold text-slate-800 block truncate">{fileName}</span>
                      <span className="text-[10px] text-slate-400">{fileSize} • Đã tải lên</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => showToast('Mở xem trước tệp...')}
                      className="text-xs text-[#0A1680] font-bold px-2 py-1 hover:underline"
                    >
                      Xem
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setHasFile(false);
                        showToast('Đã gỡ tệp đính kèm');
                      }}
                      className="text-xs text-rose-600 font-bold px-2 py-1 hover:underline"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              )}

              <div className="p-4 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center gap-2">
                <span className="text-2xl">☁️</span>
                <p className="text-[11px] text-slate-500">Kéo thả hoặc tải thêm tài liệu xác nhận</p>
                <div className="grid grid-cols-2 gap-2 w-full pt-1">
                  <label className="h-10 rounded-full bg-blue-50 text-[#0A1680] border border-blue-200 font-heading text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer hover:bg-blue-100 transition-colors">
                    <span>📎</span>
                    <span>Chọn tệp PDF/JPG</span>
                    <input type="file" accept=".pdf,image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                  <button
                    type="button"
                    onClick={() => showToast('Đang khởi động camera quét tài liệu OCR...')}
                    className="h-10 rounded-full bg-slate-100 text-slate-700 font-heading text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <span>📷</span>
                    <span>Chụp tài liệu</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Valid Date & Departure */}
          <div>
            <label className="font-heading font-bold text-[13px] text-slate-900 block mb-1.5" htmlFor="doc-date">
              Ngày hiệu lực / Ngày khởi hành
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">📅</span>
              <input
                id="doc-date"
                type="text"
                value={validDate}
                onChange={(e) => setValidDate(e.target.value)}
                placeholder="Chọn ngày"
                className="w-full h-12 pl-10 pr-4 rounded-2xl bg-white text-xs font-semibold text-slate-800 border border-slate-200 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#0A1680]/20"
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="font-heading font-bold text-[13px] text-slate-900 block mb-1.5" htmlFor="doc-notes">
              Ghi chú thêm (Tùy chọn)
            </label>
            <textarea
              id="doc-notes"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Chuyến bay VN128 lúc 18:30 tại ga T1..."
              className="w-full p-3 rounded-2xl bg-white text-xs text-slate-800 border border-slate-200 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#0A1680]/20 resize-none"
            />
          </div>

          {/* Privacy & Sharing Options */}
          <div>
            <label className="font-heading font-bold text-[13px] text-slate-900 block mb-2">
              Quyền riêng tư & Chia sẻ
            </label>
            <div className="space-y-2.5">
              <label
                onClick={() => setPrivacy('private')}
                className={`p-3.5 rounded-2xl shadow-2xs flex items-start gap-3 cursor-pointer border transition-all ${
                  privacy === 'private'
                    ? 'bg-blue-50/60 border-[#0A1680]'
                    : 'bg-white border-slate-200'
                }`}
              >
                <input
                  type="radio"
                  name="privacy"
                  checked={privacy === 'private'}
                  onChange={() => setPrivacy('private')}
                  className="mt-1 accent-[#0A1680]"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">🔒</span>
                    <span className="font-heading font-bold text-[13px] text-slate-900">Chỉ mình tôi</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Giấy tờ được lưu trữ mã hóa an toàn, không hiển thị cho ai khác.
                  </p>
                </div>
              </label>

              <label
                onClick={() => setPrivacy('group')}
                className={`p-3.5 rounded-2xl shadow-2xs flex items-start gap-3 cursor-pointer border transition-all ${
                  privacy === 'group'
                    ? 'bg-blue-50/60 border-[#0A1680]'
                    : 'bg-white border-slate-200'
                }`}
              >
                <input
                  type="radio"
                  name="privacy"
                  checked={privacy === 'group'}
                  onChange={() => setPrivacy('group')}
                  className="mt-1 accent-[#0A1680]"
                />
                <div className="flex flex-col flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">👥</span>
                      <span className="font-heading font-bold text-[13px] text-slate-900">Chia sẻ với nhóm</span>
                    </div>
                    <span className="text-[10px] font-bold text-[#0A1680] bg-blue-100 px-2 py-0.5 rounded-full">
                      4 thành viên
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Đoàn "TP.HCM 3N2Đ". Mọi người có thể đồng bộ giờ bay và mã đặt chỗ.
                  </p>
                  <div className="mt-2 p-2 rounded-xl bg-white/80 border border-blue-100 flex items-center gap-1.5 text-[10px] text-slate-600">
                    <span>🛡️</span>
                    <span>Thông tin nhạy cảm (số CCCD/mã thanh toán) được tự động ẩn.</span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              className="w-full h-12 rounded-full bg-[#0A1680] text-white font-heading font-bold text-[14px] shadow-lg hover:bg-[#071060] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>💾</span>
              <span>Lưu vào ví giấy tờ</span>
            </button>
            <button
              type="button"
              onClick={onBack}
              className="w-full h-10 rounded-full text-slate-600 font-heading font-semibold text-xs hover:bg-slate-100 transition-colors"
            >
              Hủy bỏ
            </button>
          </div>
        </form>
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-slate-900/90 text-white text-xs font-semibold shadow-xl animate-in fade-in duration-200">
          {toastMessage}
        </div>
      )}
    </div>
  );
};
