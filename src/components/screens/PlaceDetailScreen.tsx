import {mockReviewsFor} from '../../data/explorePlaceMocks';
import React, { useState } from 'react';
import { IOSStatusBar } from '../common/IOSStatusBar';
import { ModalSheet } from '../common/ModalSheet';
import { Place } from '../../types/travel';
import { MOCK_PLACES } from '../../data/mockData';

interface PlaceDetailScreenProps {
  placeId?: string;
  onBack: () => void;
  onSelectPlace: (id: string) => void;
  onOpenMap: () => void;
  onCreatePlan: (place: Place) => void;
}

export const PlaceDetailScreen: React.FC<PlaceDetailScreenProps> = ({
  placeId = 'tiem-tu-lung',
  onBack,
  onSelectPlace,
  onOpenMap,
  onCreatePlan,
}) => {
  const currentPlace: Place =
    MOCK_PLACES.find((p) => p.id === placeId) || MOCK_PLACES[0];

  const [isSaved, setIsSaved] = useState(currentPlace.isSaved || false);
  const [activeTab, setActiveTab] = useState<'overview' | 'photos' | 'reviews'>('overview');
  const [isExpandedDesc, setIsExpandedDesc] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [showShare, setShowShare] = useState(false);
  const [showCollectionPicker, setShowCollectionPicker] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const galleryImages = currentPlace.images;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCopyLink = () => {
    showToast('Đã sao chép liên kết vào bộ nhớ tạm!');
    setShowShare(false);
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden text-slate-800 select-none">
      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* HERO IMAGE HEADER (h-[420px]) */}
        <div className="relative w-full h-[400px] overflow-hidden bg-slate-900 shrink-0">
        <img
          src={currentPlace.images[0]}
          alt={currentPlace.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/35" />

        {/* Floating Top Navigation */}
        <div className="absolute top-2 left-0 right-0 z-30">
          <IOSStatusBar light={true} />
          <div className="px-5 pt-1 flex items-center justify-between">
            <button
              onClick={onBack}
              aria-label="Quay lại"
              type="button"
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-800 shadow-md active:scale-95 transition-transform cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowShare(true)}
                aria-label="Chia sẻ địa điểm"
                type="button"
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-800 shadow-md active:scale-95 transition-transform cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              </button>

              <button
                onClick={() => {
                  const nextState = !isSaved;
                  setIsSaved(nextState);
                  if (nextState) {
                    setShowCollectionPicker(true);
                  } else {
                    showToast('Đã bỏ lưu địa điểm');
                  }
                }}
                aria-label="Lưu địa điểm"
                type="button"
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md active:scale-95 transition-transform cursor-pointer"
              >
                <svg
                  className={`w-5 h-5 transition-colors ${isSaved ? 'text-rose-500 fill-rose-500' : 'text-slate-800 fill-none'}`}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Photo Gallery Counter Badge */}
        <button
          onClick={() => setShowGallery(true)}
          type="button"
          className="absolute bottom-12 right-5 px-3 py-1 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md flex items-center gap-1.5 text-white shadow-xs cursor-pointer transition-all active:scale-95 text-[12px] font-semibold"
        >
          <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          <span>1/{galleryImages.length}</span>
        </button>
      </div>

      {/* DETAIL CONTENT CARD (rounded-t-[32px], -mt-8) */}
      <div className="relative -mt-8 bg-white rounded-t-[32px] px-5 pt-6 pb-20 shadow-sm flex flex-col gap-5 z-10">
        {/* Title & Rating */}
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-[23px] leading-[30px] text-slate-900 tracking-tight font-bold font-heading">
              {currentPlace.name}
            </h1>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fef7ec] border border-[#fbdc9a] shadow-xs shrink-0">
              <svg className="w-4 h-4 fill-[#F1B94C] text-[#F1B94C]" viewBox="0 0 24 24">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span className="text-[13px] font-bold text-[#8d6200] font-heading">
                {currentPlace.rating}
              </span>
              <span className="text-[11px] text-slate-500">({currentPlace.reviewsCount})</span>
            </div>
          </div>

          {/* Quick info row */}
          <div className="flex items-center flex-wrap gap-2 text-[12px] text-slate-600">
            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {currentPlace.openHours}
            </span>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-slate-800">{currentPlace.priceRange}</span>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1 text-slate-600">
              <svg className="w-3.5 h-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{currentPlace.distance==='Chưa xác định'?'Khoảng cách chưa xác định':`Cách trung tâm ~${currentPlace.distance}`}</span>
            </span>
          </div>
        </div>

        {/* Segmented Tab Buttons */}
        <div>
          <div className="flex items-center bg-slate-100 p-1 rounded-full">
            <button
              onClick={() => setActiveTab('overview')}
              type="button"
              className={`flex-1 py-2 rounded-full text-center text-[13px] font-semibold transition-all cursor-pointer font-heading ${
                activeTab === 'overview'
                  ? 'bg-[#0a1680] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tổng quan
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              type="button"
              className={`flex-1 py-2 rounded-full text-center text-[13px] font-semibold transition-all cursor-pointer font-heading ${
                activeTab === 'photos'
                  ? 'bg-[#0a1680] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hình ảnh
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              type="button"
              className={`flex-1 py-2 rounded-full text-center text-[13px] font-semibold transition-all cursor-pointer font-heading ${
                activeTab === 'reviews'
                  ? 'bg-[#0a1680] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Đánh giá
            </button>
          </div>
        </div>

        {/* Tab 1: Tổng quan */}
        {activeTab === 'overview' && (
          <>
            <p className="text-[10px] text-slate-400">Nội dung, ảnh, giá và đánh giá mẫu để demo.</p>
            {/* Description */}
            <div className="flex flex-col gap-1.5 text-left">
              <p className={`text-[13px] text-slate-600 leading-relaxed ${isExpandedDesc ? '' : 'line-clamp-2'}`}>
                {currentPlace.description}
              </p>
              <button
                type="button"
                onClick={() => setIsExpandedDesc(!isExpandedDesc)}
                className="text-left font-semibold text-[13px] text-[#0a1680] hover:underline self-start cursor-pointer"
              >
                {isExpandedDesc ? 'Thu gọn' : 'Xem thêm'}
              </button>
            </div>

            {/* Điểm nổi bật */}
            <div className="flex flex-col gap-2.5 text-left">
              <h2 className="text-[17px] text-slate-900 font-semibold font-heading">
                Điểm nổi bật
              </h2>
              <div className="flex flex-wrap gap-2">{currentPlace.tags.map(tag=><span key={tag} className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-800 text-[12px]">{tag}</span>)}</div>
            </div>

            {/* Địa điểm lân cận & Tương tự */}
            <div className="flex flex-col gap-3 pt-1 text-left">
              <div className="flex items-center justify-between">
                <h2 className="text-[17px] text-slate-900 font-semibold font-heading">
                  Địa điểm lân cận &amp; Tương tự
                </h2>
                <span className="text-[12px] text-[#0a1680] font-semibold font-heading">Gợi ý</span>
              </div>
              <div className="grid grid-cols-2 gap-3">{MOCK_PLACES.filter(p=>p.id!==currentPlace.id&&p.category===currentPlace.category).slice(0,2).map(place=><button key={place.id} type="button" onClick={()=>onSelectPlace(place.id)} className="rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 text-left"><img src={place.images[0]} alt={place.name} className="w-full h-28 object-cover"/><div className="p-3"><b className="text-[12px]">{place.name}</b><p className="text-[10px] text-slate-500 mt-1">{place.city} · {place.rating} ★</p></div></button>)}</div>
            </div>

            {/* Vị trí & Chỉ đường */}
            <div className="flex flex-col gap-2.5 pt-1 text-left">
              <div className="flex items-center justify-between">
                <h2 className="text-[17px] text-slate-900 font-semibold font-heading">
                  Vị trí &amp; Chỉ đường
                </h2>
                <button
                  onClick={onOpenMap}
                  type="button"
                  className="text-[12px] text-[#0a1680] font-semibold hover:underline flex items-center gap-1 cursor-pointer font-heading"
                >
                  <span>Xem bản đồ</span>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>

              <div
                onClick={onOpenMap}
                className="relative w-full h-32 rounded-[24px] overflow-hidden shadow-2xs group cursor-pointer border border-slate-200"
              >
                <img
                  src={currentPlace.images[0]}
                  alt="Ảnh minh họa khu vực"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 p-2.5 rounded-xl bg-white/95 backdrop-blur-md flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-[#0a1680] text-white flex items-center justify-center shrink-0">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div className="truncate text-left">
                      <p className="text-[12px] font-bold text-slate-900 truncate font-heading">
                        {currentPlace.address}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {currentPlace.distance==='Chưa xác định'?'Khoảng cách chưa xác định':`Cách trung tâm ~${currentPlace.distance}`}
                      </p>
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-[#0a1680] shrink-0 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Tab 2: Hình ảnh */}
        {activeTab === 'photos' && (
          <div className="grid grid-cols-2 gap-2.5">
            {currentPlace.images.map((img, i) => (
              <div
                key={i}
                onClick={() => {
                  setGalleryIdx(i);
                  setShowGallery(true);
                }}
                className="h-36 rounded-2xl overflow-hidden cursor-pointer shadow-xs hover:opacity-90"
              >
                <img src={img} alt={`Ảnh minh họa ${currentPlace.name}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Đánh giá */}
        {activeTab === 'reviews' && (
          <div className="space-y-3 text-left">
            <p className="text-[11px] text-slate-400">Đánh giá từ nhân vật mẫu, dùng để minh họa giao diện.</p>
            {mockReviewsFor(currentPlace).map((r, idx) => (
              <div key={idx} className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#0a1680] text-white flex items-center justify-center font-bold text-xs">
                      {r.user.charAt(0)}
                    </div>
                    <span className="text-[13px] font-bold text-slate-800 font-heading">{r.user}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">{r.time}</span>
                </div>
                <div className="flex items-center gap-1 text-[#F1B94C] mb-1">
                  {'★'.repeat(r.rating)}
                </div>
                <p className="text-[12px] text-slate-600 leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>

      {/* STICKY BOTTOM BUTTON "Thêm vào chuyến đi" */}
      <div className="absolute bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl px-5 pt-3 pb-6 sm:pb-7 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] border-t border-slate-200/60 w-full">
        <button
          onClick={() => onCreatePlan(currentPlace)}
          type="button"
          className="w-full h-12 rounded-full bg-[#0a1680] hover:bg-[#071060] text-white font-semibold text-[15px] flex items-center justify-center gap-2 shadow-lg shadow-[#0a1680]/25 active:scale-98 transition-all cursor-pointer font-heading"
        >
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          <span className="tracking-wide">Thêm vào chuyến đi</span>
        </button>
      </div>

      {/* FULLSCREEN IMAGE GALLERY MODAL */}
      <ModalSheet
        isOpen={showGallery}
        onClose={() => setShowGallery(false)}
        type="fullscreen"
        ariaLabel="Xem ảnh chi tiết"
        contentClassName="p-4 justify-between"
      >
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-semibold text-white/90">
            {galleryIdx + 1} / {galleryImages.length}
          </span>
          <button
            type="button"
            aria-label="Đóng thư viện ảnh"
            onClick={() => setShowGallery(false)}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="relative flex-1 flex items-center justify-center p-2">
          <button
            type="button"
            aria-label="Ảnh trước"
            onClick={() =>
              setGalleryIdx((galleryIdx - 1 + galleryImages.length) % galleryImages.length)
            }
            className="absolute left-2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white z-10 cursor-pointer"
          >
            ‹
          </button>
          <img
            src={galleryImages[galleryIdx]}
            alt="Ảnh phóng to"
            className="max-h-[70vh] max-w-full object-contain rounded-xl shadow-2xl"
          />
          <button
            type="button"
            aria-label="Ảnh sau"
            onClick={() => setGalleryIdx((galleryIdx + 1) % galleryImages.length)}
            className="absolute right-2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white z-10 cursor-pointer"
          >
            ›
          </button>
        </div>

        <div className="p-3 text-center text-white/70 text-[13px]">
          {currentPlace.name} · {currentPlace.city}
        </div>
      </ModalSheet>

      {/* SHARE SHEET MODAL */}
      <ModalSheet
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        title="Chia sẻ địa điểm"
        ariaLabel="Chia sẻ địa điểm"
        contentClassName="p-5 gap-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-[18px] font-bold text-slate-900 font-heading">Chia sẻ địa điểm</h3>
          <button
            type="button"
            aria-label="Đóng chia sẻ"
            onClick={() => setShowShare(false)}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-[13px] text-slate-600 truncate mr-2 font-mono">
            https://travaly.app/place/{currentPlace.id}
          </span>
          <button
            type="button"
            onClick={handleCopyLink}
            className="px-3.5 py-1.5 rounded-full bg-[#0a1680] text-white font-semibold text-[12px] shrink-0 active:scale-95 cursor-pointer"
          >
            Sao chép
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3 text-center py-1">
          {[
            { name: 'Tin nhắn', icon: '💬', bg: 'bg-emerald-50 text-emerald-600' },
            { name: 'Zalo', icon: '⚡', bg: 'bg-blue-50 text-blue-600' },
            { name: 'Facebook', icon: '👥', bg: 'bg-indigo-50 text-indigo-600' },
            { name: 'Mã QR', icon: '▦', bg: 'bg-slate-100 text-[#0a1680]' },
          ].map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => {
                showToast(`Đang chia sẻ qua ${item.name}...`);
                setShowShare(false);
              }}
              className="flex flex-col items-center gap-1.5 cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg ${item.bg} group-hover:scale-105 transition-transform`}>
                {item.icon}
              </div>
              <span className="text-[12px] font-medium text-slate-700">{item.name}</span>
            </button>
          ))}
        </div>
      </ModalSheet>

      {/* COLLECTION PICKER SHEET MODAL (Image 5) */}
      <ModalSheet
        isOpen={showCollectionPicker}
        onClose={() => setShowCollectionPicker(false)}
        title="Lưu vào bộ sưu tập"
        ariaLabel="Lưu vào bộ sưu tập"
        contentClassName="p-6 gap-3"
      >
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <h3 className="text-lg font-bold text-[#0A1680] font-heading">Lưu vào bộ sưu tập</h3>
          <button
            type="button"
            aria-label="Đóng lưu bộ sưu tập"
            onClick={() => setShowCollectionPicker(false)}
            className="w-11 h-11 -mr-2 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Location Summary Card */}
        <div className="flex items-center gap-3.5 my-4 p-2.5 bg-[#FCFDFF] border border-blue-50 rounded-2xl shadow-2xs">
          <img
            src={currentPlace.images[0]}
            alt={currentPlace.name}
            className="w-14 h-14 rounded-xl object-cover shrink-0 shadow-xs"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 truncate font-heading">{currentPlace.name}</h4>
            <p className="text-[13px] text-gray-500 truncate mt-0.5">{currentPlace.address}</p>
          </div>
        </div>

        {/* Collections Choices */}
        <div className="space-y-2.5 my-1">
          {[
            { id: 'cafe', title: 'Quán cà phê muốn thử', count: '8 địa điểm', active: true },
            { id: 'dalat', title: 'Muốn đi Đà Lạt', count: '12 địa điểm', active: false },
            { id: 'sunset', title: 'Chill & Ngắm hoàng hôn', count: '5 địa điểm', active: false },
          ].map((col) => (
            <label
              key={col.id}
              className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer border transition-all ${
                col.active
                  ? 'bg-blue-50/50 border-[#0A1680]/20'
                  : 'bg-[#FCFDFF] border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[#0A1680] font-heading">{col.title}</span>
                <span className="text-xs text-gray-500 mt-0.5">{col.count}</span>
              </div>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  col.active ? 'bg-[#0A1680] text-white' : 'border-2 border-gray-300'
                }`}
              >
                {col.active && <span className="text-xs">✓</span>}
              </div>
            </label>
          ))}
        </div>

        {/* New Collection Dashed Button */}
        <button
          type="button"
          onClick={() => showToast('Mở hộp thoại tạo bộ sưu tập mới...')}
          className="flex items-center justify-center gap-2 w-full py-3 mt-2 mb-4 border-2 border-dashed border-[#0A1680]/30 rounded-2xl text-[#0A1680] hover:bg-blue-50/40 font-heading font-medium text-sm transition-colors cursor-pointer"
        >
          <span>+</span>
          <span>Tạo bộ sưu tập mới</span>
        </button>

        {/* Primary CTA */}
        <button
          type="button"
          onClick={() => {
            setShowCollectionPicker(false);
            showToast(`Đã lưu "${currentPlace.name}" vào bộ sưu tập! ❤️`);
          }}
          className="w-full h-12 bg-[#0A1680] hover:bg-[#08126b] active:scale-[0.98] text-white font-heading font-semibold text-sm rounded-full shadow-md shadow-blue-900/20 transition-all flex items-center justify-center cursor-pointer"
        >
          Lưu địa điểm
        </button>
      </ModalSheet>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 bg-[#0A1680] text-white px-4 py-2 rounded-full shadow-xl text-[13px] font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top duration-200 pointer-events-none">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
