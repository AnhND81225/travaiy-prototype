import React, { useState } from 'react';
import { IOSStatusBar } from '../common/IOSStatusBar';

interface CreateRecapScreenProps {
  onBack: () => void;
  onNext: () => void;
}

export const CreateRecapScreen: React.FC<CreateRecapScreenProps> = ({ onBack, onNext }) => {
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [selectedFeeling, setSelectedFeeling] = useState<string>('Tuyệt vời');
  const [tripNote, setTripNote] = useState<string>(
    'Phú Quốc thực sự là một thiên đường biển đảo! Biển xanh, đồ ăn ngon và những con người siêu thân thiện! 🌴☀️'
  );

  // Modals state
  const [showPickMoreModal, setShowPickMoreModal] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<{ src: string; title: string } | null>(null);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const photoList = [
    { id: 1, src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBu23qKE7ytT0HiKJHXejjyg7ERfPC7J4dnTYIAro4qUXz4NgI2hxpQKZ4WIFeDkWjyYMdoZuN56uHh6NYbFz8RCbHZeuQWSJplPDv9DDLQFH7SiZyt73OAxjLDESPiFlzo0NQvlUzMr5fb6FPPbKEd3mD-dtcmMqqzVDUt22VSH2FNZYLVxoxMrdknz4NzGV7aU4X8CTIy9IXOgJBPeBIQDJfyv6CwhZ8u1eOKMnCgdz4zJ-cZ-w', title: 'Bãi Sao, Phú Quốc - Ảnh bìa' },
    { id: 2, src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJ1-GGO-Us5WoSGRQ-Xz2wkt29irmDRpE43UKN5f0FGq3IAp2gkWgtrGcnkxYpvZ8V_LR9_X0ErqmDubn4KPzhpXRt-t9Q5wEvHmUmDR-MdPrjairzLpoQmcLUGEO37P76nnMEf3LNaL76cKOWZakRNm424xi8Yd0NEx16RgSB-E2qVfvfql1mFG7wvYr-TGoQVWyfcvGfKBFpeymkLdiB88LNOeBh0zFE0vQYQh7uDmnTQf29Dw', title: 'Thuyền trên vịnh An Thới' },
    { id: 3, src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdrDMa6B0vgD_SZQJ9nB95HY9MWdma1TwHE7BqfatoWmdICeVPO-IW31jj8OPElUeA4GkAWGQdppg1zzqR7UscwUJpmjiTN3GZHd76PtzcdKckyaoYCTs3-TaOp7e-MeIW6-0Osimzat6sOJSVVvthWKmXdmzNw8hBJiu7deyXho--c2xwF2AxAyAM5rIe60PMjKFiwyzKSW3nNmkpf4QFhM32lWPvibe09CbF4kyYkuACac7o7A', title: 'Lặn ngắm san hô Hòn Móng Tay' },
    { id: 4, src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVVnBXGRFKepzpuukUx8ccVz9iAPeDKSBVXacpGmMaRWYOW700G12GrNS49d2bFVkp1qf-gz-nEVXz8FTp9YNH8mODDqOArhCrMPvq-84n7bdacGUkrXLgVYUNm0iLSmjoG8HPXc_jDP4WgicenDDjbL5q3OyNkBxZj8l_pFeTyq5jDT9iVZd358Cyqc9LhSxo15bJtZarIDrZnajqnCxrKBB4XLGy9uydMSWLHIkEtIgzRYgRqg', title: 'Hoàng hôn Bãi Trường' },
    { id: 5, src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlFGjR5B76QDuR-8AKCvgCUFMUqQ-zsZIIqLIc2zMw4UVJkGFpbwEfnv1YW20phuVnZmp0GYI6x1Y8OT74LtyrxRdERY9zWaCPq_vhqsbCv-I0YX565am0tBVs47G4iU74ip4MgbSYUe_yv7xr6d52ovlLkgEf09mA1A-TTXnhpNE93__iwmy0MqlNUNLXZmYUosL8JKaofd-G7ZwvIfzjQqwktqcFbnlNm373VJgw0WhX9_MrlQ', title: 'Hải sản chợ đêm Phú Quốc' },
    { id: 6, src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAA7JsoKvq4oFPo3m519cG7iF8MLnlR3GnTj25Uy2Tll9sRyu27HoGNo9SSO-Ye0WLnZkEQa4tPQK-kPnOle3T2m1itGiiINdobypIxRY7-9fKlfxOszcOdOgd15IGZoGWfEsjvq7tu9l4F0hOHR11r6LuikdQaVt5nU0wcIuElaZyYKeeWnByViYwyUwLQ7NY_t0p68EPo4tlzF2FlE4_B5Z2v7doHIe8_6tUXp59W6moCSSHf5A', title: 'Dạo biển chiều' },
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const toggleSelectPhoto = (id: number) => {
    if (selectedPhotos.includes(id)) {
      setSelectedPhotos(selectedPhotos.filter((p) => p !== id));
    } else {
      if (selectedPhotos.length >= 10) {
        showToast('Tối đa 10 ảnh cho mỗi recap!');
        return;
      }
      setSelectedPhotos([...selectedPhotos, id]);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#FCFDFF] text-[#191c1e] font-body-md antialiased select-none">
      {/* Header */}
      <header className="shrink-0 z-30 bg-[#FCFDFF]/95 backdrop-blur-md border-b border-[#edeef0]">
        <IOSStatusBar light={false} />
        <div className="h-[52px] px-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDiscardModal(true)}
              aria-label="Quay lại"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-[#191c1e] hover:bg-[#edeef0] transition-colors cursor-pointer"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <h1 className="font-heading font-bold text-[17px] text-[#0A1680]">
              Tạo recap chuyến đi
            </h1>
          </div>
          <span className="text-[12px] font-bold text-[#0A1680] bg-[#93B2F8]/20 px-2.5 py-1 rounded-full font-heading">
            Bước 2/3
          </span>
        </div>
      </header>

      {/* Main Form */}
      <main className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-5 pt-3 pb-24 flex flex-col gap-4">
        {/* Cover Preview Card */}
        <div className="relative w-full h-[200px] rounded-[20px] overflow-hidden shadow-sm">
          <img
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBu23qKE7ytT0HiKJHXejjyg7ERfPC7J4dnTYIAro4qUXz4NgI2hxpQKZ4WIFeDkWjyYMdoZuN56uHh6NYbFz8RCbHZeuQWSJplPDv9DDLQFH7SiZyt73OAxjLDESPiFlzo0NQvlUzMr5fb6FPPbKEd3mD-dtcmMqqzVDUt22VSH2FNZYLVxoxMrdknz4NzGV7aU4X8CTIy9IXOgJBPeBIQDJfyv6CwhZ8u1eOKMnCgdz4zJ-cZ-w"
            alt="Preview"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4 text-white">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full font-heading">
                Ảnh bìa nổi bật
              </span>
              <p className="text-[15px] font-bold mt-1 font-heading">Bãi Sao, Phú Quốc</p>
            </div>
          </div>
        </div>

        {/* Section 1: Chọn khoảnh khắc nổi bật */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-[15px] text-[#191c1e]">
              Chọn khoảnh khắc nổi bật{' '}
              <span className="text-[13px] font-medium text-[#767684]">
                (Đã chọn {selectedPhotos.length}/10 ảnh)
              </span>
            </h2>
            <button
              type="button"
              onClick={() => {
                if (selectedPhotos.length === photoList.length) {
                  setSelectedPhotos([]);
                } else {
                  setSelectedPhotos(photoList.map((p) => p.id));
                }
              }}
              className="text-[12px] font-bold text-[#0A1680] hover:underline font-heading cursor-pointer"
            >
              {selectedPhotos.length === photoList.length ? 'Bỏ chọn' : 'Chọn tất cả'}
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {photoList.map((photo) => {
              const isSelected = selectedPhotos.includes(photo.id);
              return (
                <div
                  key={photo.id}
                  onClick={() => setPreviewPhoto(photo)}
                  className={`relative aspect-square rounded-[16px] overflow-hidden shadow-xs cursor-pointer ${
                    isSelected ? 'ring-2 ring-[#0A1680]' : 'opacity-70'
                  }`}
                >
                  <img src={photo.src} alt={photo.title} className="w-full h-full object-cover" />
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#0A1680] text-white flex items-center justify-center text-[9px] font-bold">
                      ✓
                    </div>
                  )}
                </div>
              );
            })}
            <button
              type="button"
              onClick={() => setShowPickMoreModal(true)}
              className="aspect-square rounded-[16px] border-2 border-dashed border-[#93B2F8] bg-[#FCFDFF] hover:bg-blue-50/50 flex flex-col items-center justify-center gap-0.5 text-[#0A1680] cursor-pointer"
            >
              <span className="text-base font-bold">+</span>
              <span className="text-[10px] font-bold font-heading">Thêm</span>
            </button>
          </div>
        </section>

        {/* Section 2: Viết vài dòng về chuyến đi */}
        <section className="flex flex-col gap-1.5">
          <h2 className="font-heading font-bold text-[15px] text-[#191c1e]">
            Viết vài dòng về chuyến đi
          </h2>
          <div className="relative bg-[#FCFDFF] rounded-[16px] border border-[#edeef0] p-3 shadow-xs focus-within:border-[#0A1680] transition-colors">
            <textarea
              className="w-full h-[75px] bg-transparent text-[13px] leading-relaxed text-[#191c1e] placeholder:text-[#767684] resize-none focus:outline-none"
              maxLength={500}
              value={tripNote}
              onChange={(e) => setTripNote(e.target.value)}
              placeholder="Chia sẻ những cảm xúc hoặc ấn tượng sâu sắc nhất của bạn..."
            />
            <div className="flex justify-end pt-1">
              <span className="text-[11px] text-[#767684] font-medium font-mono">
                {tripNote.length}/500
              </span>
            </div>
          </div>
        </section>

        {/* Section 3: Thêm cảm xúc */}
        <section className="flex flex-col gap-2">
          <h2 className="font-heading font-bold text-[15px] text-[#191c1e]">
            Thêm cảm xúc
          </h2>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Tuyệt vời', icon: '💙' },
              { label: 'Thư giãn', icon: '☕' },
              { label: 'Khám phá', icon: '🗺️' },
              { label: 'Ăn ngon', icon: '🍲' },
            ].map((f) => {
              const isActive = selectedFeeling === f.label;
              return (
                <button
                  key={f.label}
                  type="button"
                  onClick={() => setSelectedFeeling(f.label)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-[14px] text-[12px] font-heading font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0A1680] text-white shadow-xs'
                      : 'bg-white border border-[#edeef0] text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{f.icon}</span>
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Next Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onNext}
            className="w-full h-12 rounded-full bg-[#0A1680] text-white font-heading text-[15px] font-bold flex items-center justify-center gap-2 shadow-md hover:bg-[#071060] active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Tiếp tục</span>
            <span>→</span>
          </button>
        </div>
      </main>

      {/* POPUP 1: Pick more photos */}
      {showPickMoreModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-[390px] bg-white rounded-t-[28px] p-5 shadow-2xl flex flex-col max-h-[85vh] animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#edeef0]">
              <div>
                <h3 className="font-heading font-bold text-[16px] text-[#191c1e]">Chọn thêm ảnh</h3>
                <p className="text-[12px] text-slate-500">Thư viện ảnh Phú Quốc ({selectedPhotos.length}/10)</p>
              </div>
              <button
                type="button"
                onClick={() => setShowPickMoreModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2.5 py-4 overflow-y-auto max-h-[50vh]">
              {photoList.map((p) => {
                const isSelected = selectedPhotos.includes(p.id);
                return (
                  <div
                    key={p.id}
                    onClick={() => toggleSelectPhoto(p.id)}
                    className={`relative aspect-square rounded-[16px] overflow-hidden shadow-xs cursor-pointer ${
                      isSelected ? 'ring-2 ring-[#0A1680]' : 'opacity-70'
                    }`}
                  >
                    <img src={p.src} alt={p.title} className="w-full h-full object-cover" />
                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#0A1680] text-white flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setShowPickMoreModal(false)}
              className="w-full h-11 rounded-full bg-[#0A1680] text-white font-heading text-xs font-bold shadow-md cursor-pointer"
            >
              Xác nhận chọn ({selectedPhotos.length} ảnh)
            </button>
          </div>
        </div>
      )}

      {/* POPUP 2: Preview Selected Photo */}
      {previewPhoto && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-[390px] bg-white rounded-t-[28px] p-5 shadow-2xl flex flex-col gap-3 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-heading font-bold text-[15px] text-slate-900">{previewPhoto.title}</h3>
                <p className="text-[11px] text-slate-400">Khoảnh khắc đã chọn</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewPhoto(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100">
              <img src={previewPhoto.src} alt={previewPhoto.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  const match = photoList.find((p) => p.src === previewPhoto.src);
                  if (match) setSelectedPhotos(selectedPhotos.filter((id) => id !== match.id));
                  setPreviewPhoto(null);
                  showToast('Đã bỏ chọn ảnh này');
                }}
                className="flex-1 h-11 rounded-full border border-slate-200 text-rose-600 font-heading text-xs font-bold"
              >
                Bỏ chọn ảnh này
              </button>
              <button
                type="button"
                onClick={() => setPreviewPhoto(null)}
                className="flex-1 h-11 rounded-full bg-[#0A1680] text-white font-heading text-xs font-bold shadow-md"
              >
                Giữ ảnh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP 3: Discard Recap Dialog */}
      {showDiscardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-[342px] bg-white rounded-[28px] p-6 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-[#0A1680] flex items-center justify-center text-xl mb-3">
              ⚠️
            </div>
            <h3 className="font-heading font-bold text-[18px] text-slate-900 mb-1">Rời khỏi tạo recap?</h3>
            <p className="text-[12px] text-slate-500 mb-5 leading-relaxed">
              Các thay đổi chưa hoàn tất sẽ không được lưu.
            </p>
            <div className="flex flex-col gap-2 w-full">
              <button
                type="button"
                onClick={() => {
                  setShowDiscardModal(false);
                  onBack();
                }}
                className="w-full h-11 rounded-full bg-[#0A1680] text-white font-heading font-bold text-xs shadow-md"
              >
                Rời khỏi
              </button>
              <button
                type="button"
                onClick={() => setShowDiscardModal(false)}
                className="w-full h-10 rounded-full border border-slate-200 text-slate-700 font-heading font-semibold text-xs"
              >
                Hủy bỏ
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
