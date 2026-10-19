import React, { useState } from 'react';
import { IOSStatusBar } from '../common/IOSStatusBar';
import { BottomNav } from '../common/BottomNav';
import { Collection, NavTab, Place } from '../../types/travel';
import { MOCK_COLLECTIONS, MOCK_PLACES } from '../../data/mockData';

interface WishlistScreenProps {
  onNavigateTab: (tab: NavTab) => void;
  onOpenPlaceDetail: (placeId: string) => void;
  onBack: () => void;
}

export const WishlistScreen: React.FC<WishlistScreenProps> = ({
  onNavigateTab,
  onOpenPlaceDetail,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'collections' | 'saved'>('collections');
  const [collections, setCollections] = useState<Collection[]>(MOCK_COLLECTIONS);
  const [places, setPlaces] = useState<Place[]>(MOCK_PLACES);
  const [showCreateSheet, setShowCreateSheet] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [selectedCover, setSelectedCover] = useState(MOCK_COLLECTIONS[0].image);
  const [activeCollectionAction, setActiveCollectionAction] = useState<Collection | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [undoItem, setUndoItem] = useState<Place | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreateCollection = () => {
    if (!newCollectionName.trim()) {
      showToast('Vui lòng nhập tên bộ sưu tập');
      return;
    }
    const newCol: Collection = {
      id: `c_${Date.now()}`,
      title: newCollectionName.trim(),
      updatedTime: 'Vừa tạo xong',
      tags: 'Khám phá, Mới',
      placesCount: 0,
      image: selectedCover,
    };
    setCollections([newCol, ...collections]);
    setNewCollectionName('');
    setShowCreateSheet(false);
    showToast(`Đã tạo bộ sưu tập "${newCol.title}" thành công!`);
  };

  const handleDeleteCollection = () => {
    if (activeCollectionAction) {
      setCollections(collections.filter((c) => c.id !== activeCollectionAction.id));
      showToast(`Đã xóa bộ sưu tập "${activeCollectionAction.title}"`);
      setShowDeleteDialog(false);
      setActiveCollectionAction(null);
    }
  };

  const handleToggleSavePlace = (place: Place) => {
    const updated = places.map((p) => {
      if (p.id === place.id) {
        return { ...p, isSaved: !p.isSaved };
      }
      return p;
    });
    setPlaces(updated);

    if (place.isSaved) {
      setUndoItem(place);
      showToast('Đã bỏ lưu địa điểm');
    } else {
      showToast(`Đã lưu "${place.name}" vào Wishlist ❤️`);
    }
  };

  const handleUndo = () => {
    if (undoItem) {
      setPlaces(
        places.map((p) => (p.id === undoItem.id ? { ...p, isSaved: true } : p))
      );
      setUndoItem(null);
      showToast('Đã hoàn tác thao tác bỏ lưu!');
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#FCFDFF] select-none text-slate-800">
      {/* iOS Status Bar */}
      <IOSStatusBar light={false} />

      {/* Top Header */}
      <header className="shrink-0 z-30 h-[52px] px-5 bg-[#FCFDFF] flex items-center justify-between border-b border-slate-100/70">
        <div className="flex items-center">
          <button
            onClick={onBack}
            aria-label="Quay lại"
            type="button"
            className="w-9 h-9 flex items-center justify-center rounded-full text-[#0A1680] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>
        <h1 className="text-[18px] font-bold text-[#0A1680] text-center tracking-tight truncate flex-1 px-2 font-heading">
          Travel Wishlist
        </h1>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowShareSheet(true)}
            aria-label="Chia sẻ wishlist"
            type="button"
            className="w-9 h-9 flex items-center justify-center rounded-full text-[#0A1680] hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>
        </div>
      </header>

      {/* Scrollable Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar pb-28">
        {/* Segmented Tab Switcher */}
        <div className="px-5 mt-2.5">
          <div className="flex items-center bg-[#edeef0]/70 p-1 rounded-full relative">
          <button
            type="button"
            onClick={() => setActiveTab('collections')}
            className={`flex-1 py-2 px-3 rounded-full text-[13px] font-semibold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer font-heading ${
              activeTab === 'collections'
                ? 'text-[#FCFDFF] bg-[#0A1680] shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            <span>Bộ sưu tập của tôi</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`flex-1 py-2 px-3 rounded-full text-[13px] font-medium transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer font-heading ${
              activeTab === 'saved'
                ? 'text-[#FCFDFF] bg-[#0A1680] shadow-sm font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span>Đã lưu (32)</span>
          </button>
        </div>
      </div>

      {/* Create New Collection Button: Pill viền thanh mảnh 44px */}
      {activeTab === 'collections' && (
        <div className="px-5 mt-3">
          <button
            onClick={() => setShowCreateSheet(true)}
            type="button"
            className="w-full h-11 rounded-full bg-[#FCFDFF] border border-[#0A1680]/20 hover:border-[#0A1680]/60 hover:bg-[#93B2F8]/10 active:scale-[0.99] transition-all flex items-center justify-center gap-2 text-[#0A1680] shadow-2xs cursor-pointer font-heading"
          >
            <svg className="w-5 h-5 text-[#0A1680]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            <span className="text-[14px] font-semibold text-[#0A1680]">Tạo bộ sưu tập mới</span>
          </button>
        </div>
      )}

      {/* Main Content: Collections Feed */}
      {activeTab === 'collections' ? (
        <div className="px-5 mt-4 flex flex-col items-center gap-4 w-full">
          {collections.map((col) => (
            <div
              key={col.id}
              onClick={() => onOpenPlaceDetail(MOCK_PLACES[0].id)}
              className="relative w-full max-w-[350px] h-[250px] rounded-[32px] overflow-hidden shadow-xs group cursor-pointer transition-all duration-300 hover:shadow-md"
            >
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                alt={col.title}
                src={col.image}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

              {/* Top Row: Places Badge & Options */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <div className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-[#FCFDFF] text-[12px] font-semibold flex items-center gap-1.5 border border-white/10 font-heading">
                  <svg className="w-3.5 h-3.5 text-[#FBEDB0]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                  <span>{col.placesCount} địa điểm</span>
                </div>
                <button
                  type="button"
                  aria-label={`Tùy chọn ${col.title}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveCollectionAction(col);
                  }}
                  className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-md text-[#FCFDFF] flex items-center justify-center hover:bg-black/50 transition-colors pointer-events-auto cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="12" cy="5" r="1" />
                    <circle cx="12" cy="19" r="1" />
                  </svg>
                </button>
              </div>

              {/* Bottom Info Row */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div className="min-w-0 pr-2 text-left">
                  <h2 className="text-[20px] text-[#FCFDFF] font-bold tracking-tight truncate drop-shadow-xs font-heading">
                    {col.title}
                  </h2>
                  <p className="text-[13px] text-white/80 truncate mt-0.5">
                    {col.updatedTime} • {col.tags}
                  </p>
                </div>
                <div className="w-9 h-9 rounded-full bg-[#FCFDFF]/20 backdrop-blur-md flex items-center justify-center text-[#FCFDFF] shrink-0 border border-white/20">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
          {collections.length === 0 && (
            <div className="py-16 text-center flex flex-col items-center justify-center gap-3">
              <img
                src="/images/mascot-map.png"
                alt="Bé Sao Aly"
                className="w-16 h-16 object-contain animate-mascot-float"
              />
              <h3 className="text-base font-bold text-[#0A1680] font-heading">Chưa có bộ sưu tập nào</h3>
              <p className="text-xs text-slate-500 max-w-[240px]">Cùng Bé Sao Aly tạo bộ sưu tập đầu tiên để gom các điểm đến yêu thích nhé!</p>
            </div>
          )}
        </div>
      ) : (
        /* Saved Places Full Grid */
        <div className="px-5 mt-4 grid grid-cols-1 gap-3">
          {places
            .filter((p) => p.isSaved)
            .map((place) => (
              <div
                key={place.id}
                onClick={() => onOpenPlaceDetail(place.id)}
                className="flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs hover:shadow-sm cursor-pointer"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                  <img src={place.images[0]} alt={place.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <h3 className="text-[15px] font-bold text-slate-900 truncate font-heading">{place.name}</h3>
                  <p className="text-[12px] text-slate-500 mt-0.5 truncate">{place.address}</p>
                  <div className="flex items-center gap-1.5 mt-1.5 text-[11px] font-semibold text-[#0A1680]">
                    <span>★ {place.rating}</span>
                    <span>•</span>
                    <span>{place.priceRange}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleSavePlace(place);
                  }}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-rose-500"
                >
                  ♥
                </button>
              </div>
            ))}
          {places.filter((p) => p.isSaved).length === 0 && (
            <div className="py-16 text-center flex flex-col items-center justify-center gap-3">
              <img
                src="/images/mascot-cool.png"
                alt="Bé Sao Aly"
                className="w-16 h-16 object-contain animate-mascot-float"
              />
              <h3 className="text-base font-bold text-[#0A1680] font-heading">Chưa có địa điểm đã lưu</h3>
              <p className="text-xs text-slate-500 max-w-[240px]">Khám phá thêm các điểm đến thú vị và thả tim để lưu lại cùng Bé Sao nhé!</p>
            </div>
          )}
        </div>
      )}

      {/* Section: Recently Saved Places Carousel */}
      <div className="mt-7 flex flex-col pb-8">
        <div className="px-5 flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <svg className="w-5 h-5 text-[#0A1680]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <h2 className="text-[17px] text-[#0A1680] font-bold tracking-tight font-heading">
              Địa điểm đã lưu gần đây
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('saved')}
            className="text-[13px] text-[#0A1680] hover:underline flex items-center gap-0.5 font-semibold cursor-pointer"
          >
            <span>Xem tất cả</span>
            <svg className="w-4 h-4 text-[#0A1680]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Carousel */}
        <div className="flex gap-3 overflow-x-auto px-5 no-scrollbar pb-2">
          {places.map((place) => (
            <div
              key={place.id}
              onClick={() => onOpenPlaceDetail(place.id)}
              className="w-48 shrink-0 bg-[#FCFDFF] rounded-[18px] overflow-hidden border border-slate-200/60 shadow-[0_2px_10px_rgba(10,22,128,0.03)] flex flex-col group cursor-pointer"
            >
              <div className="relative h-28 w-full overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  alt={place.name}
                  src={place.images[0]}
                />
                <button
                  type="button"
                  aria-label={`Bỏ lưu ${place.name}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleSavePlace(place);
                  }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-rose-500 shadow-xs active:scale-90 transition-transform cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </button>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/70 text-white text-[10px] backdrop-blur-xs flex items-center gap-1 font-semibold">
                  <span className="text-[#F1B94C]">★</span>
                  <span>{place.rating}</span>
                </div>
              </div>

              <div className="p-3 flex flex-col flex-1 justify-between text-left">
                <div>
                  <h3 className="text-[14px] text-slate-900 font-bold truncate font-heading">
                    {place.name}
                  </h3>
                  <p className="text-[12px] text-slate-500 truncate mt-0.5">{place.city}</p>
                </div>
                <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100">
                  <span className="text-[11px] text-[#0A1680] font-medium truncate">
                    {place.category}
                  </span>
                  <span className="text-[11px] text-slate-500">{place.distance}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>

      {/* Floating Bottom Nav */}
      <BottomNav activeTab="explore" onTabChange={onNavigateTab} />

      {/* TOAST WITH UNDO ACTION */}
      {undoItem && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 transition-all flex items-center justify-between gap-3 px-4 py-2.5 rounded-full bg-[#191c1e] text-[#FCFDFF] shadow-2xl border border-white/10 w-[90%] max-w-[340px] animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[#FBEDB0] text-sm">ⓘ</span>
            <span className="text-[13px] truncate">Đã bỏ lưu {undoItem.name}</span>
          </div>
          <button
            type="button"
            onClick={handleUndo}
            className="text-[13px] font-bold text-[#93B2F8] hover:text-[#FBEDB0] shrink-0 active:scale-95 transition-transform cursor-pointer font-heading"
          >
            Hoàn tác
          </button>
        </div>
      )}

      {/* CREATE COLLECTION BOTTOM SHEET */}
      {showCreateSheet && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setShowCreateSheet(false)}
          />
          <div className="relative z-10 w-full bg-[#FCFDFF] rounded-t-[32px] p-5 shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300 text-left">
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-4" />
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[18px] font-bold text-[#0A1680] tracking-tight font-heading">
                Tạo bộ sưu tập mới
              </h2>
              <button
                type="button"
                onClick={() => setShowCreateSheet(false)}
                className="w-8 h-8 rounded-full text-slate-500 hover:bg-slate-100 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 mb-5">
              <label className="text-[13px] font-semibold text-slate-900">Tên bộ sưu tập</label>
              <input
                type="text"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                placeholder="Ví dụ: Chuyến đi Phú Quốc, Cafe sống ảo..."
                className="w-full h-12 px-4 rounded-[16px] bg-slate-50 border border-slate-200 text-[14px] text-slate-800 focus:outline-none focus:border-[#0A1680] transition-colors"
              />

              <label className="text-[13px] font-semibold text-slate-900 mt-2 block">
                Chọn ảnh bìa đề xuất
              </label>
              <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
                {collections.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCover(c.image)}
                    className={`w-16 h-16 rounded-[14px] overflow-hidden shrink-0 cursor-pointer relative ${
                      selectedCover === c.image ? 'border-2 border-[#0A1680]' : 'border border-slate-200 opacity-70'
                    }`}
                  >
                    <img className="w-full h-full object-cover" src={c.image} alt={c.title} />
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleCreateCollection}
              className="w-full h-12 rounded-full bg-[#0A1680] text-white font-semibold text-[14px] hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center shadow-md font-heading cursor-pointer"
            >
              Tạo bộ sưu tập
            </button>
          </div>
        </div>
      )}

      {/* COLLECTION ACTIONS MENU SHEET */}
      {activeCollectionAction && !showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setActiveCollectionAction(null)}
          />
          <div className="relative z-10 w-full bg-[#FCFDFF] rounded-t-[32px] p-5 shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-300 text-left">
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-3" />
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
              <h2 className="text-[16px] font-bold text-[#0A1680] truncate font-heading">
                {activeCollectionAction.title}
              </h2>
              <button
                type="button"
                onClick={() => setActiveCollectionAction(null)}
                className="w-8 h-8 rounded-full text-slate-500 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => {
                  showToast('Đang mở chỉnh sửa bộ sưu tập');
                  setActiveCollectionAction(null);
                }}
                className="w-full h-11 px-3 rounded-[16px] flex items-center gap-3 text-[14px] text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                <span>✏️</span>
                <span>Đổi tên bộ sưu tập</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowShareSheet(true);
                  setActiveCollectionAction(null);
                }}
                className="w-full h-11 px-3 rounded-[16px] flex items-center gap-3 text-[14px] text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                <span>🔗</span>
                <span>Chia sẻ liên kết</span>
              </button>
              <div className="h-px bg-slate-100 my-1" />
              <button
                type="button"
                onClick={() => setShowDeleteDialog(true)}
                className="w-full h-11 px-3 rounded-[16px] flex items-center gap-3 text-[14px] text-rose-600 font-semibold hover:bg-rose-50 transition-colors"
              >
                <span>🗑️</span>
                <span>Xóa bộ sưu tập</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setShowDeleteDialog(false)}
          />
          <div className="relative z-10 w-[340px] max-w-[90vw] bg-[#FCFDFF] rounded-[28px] p-6 shadow-2xl border border-slate-200 text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3 className="text-[18px] font-bold text-[#0A1680] mb-2 font-heading">
              Xóa bộ sưu tập này?
            </h3>
            <p className="text-[13px] text-slate-500 leading-relaxed mb-6">
              Bạn có chắc muốn xóa "{activeCollectionAction?.title}"? Các địa điểm đã lưu vẫn sẽ được giữ lại trong danh sách của bạn.
            </p>
            <div className="flex items-center gap-2.5 w-full">
              <button
                type="button"
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 h-11 rounded-full border border-slate-300 bg-slate-50 text-slate-700 font-semibold text-[13px] hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleDeleteCollection}
                className="flex-1 h-11 rounded-full bg-rose-600 text-white font-semibold text-[13px] hover:bg-rose-700 shadow-xs cursor-pointer font-heading"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SHARE SHEET MODAL */}
      {showShareSheet && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setShowShareSheet(false)}
          />
          <div className="relative z-10 w-full bg-[#FCFDFF] rounded-t-[32px] p-5 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-bottom duration-300 text-left">
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mb-1" />
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-[17px] font-bold text-[#0A1680] font-heading">
                Chia sẻ bộ sưu tập
              </h2>
              <button
                type="button"
                onClick={() => setShowShareSheet(false)}
                className="w-8 h-8 rounded-full text-slate-500 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-2 p-1.5 pl-3.5 bg-slate-50 rounded-full border border-slate-200">
              <span className="text-[12px] text-slate-500 truncate flex-1 font-mono">
                https://travel.app/wishlist/dalat-chill
              </span>
              <button
                type="button"
                onClick={() => {
                  showToast('Đã sao chép liên kết vào bộ nhớ tạm!');
                  setShowShareSheet(false);
                }}
                className="px-4 py-2 rounded-full bg-[#0A1680] text-white text-[12px] font-semibold hover:opacity-95 shrink-0 cursor-pointer"
              >
                Sao chép
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3 py-2 text-center">
              {[
                { name: 'Tin nhắn', icon: '💬', bg: 'bg-emerald-50 text-emerald-600' },
                { name: 'Facebook', icon: '👥', bg: 'bg-indigo-50 text-indigo-600' },
                { name: 'Zalo', icon: '⚡', bg: 'bg-blue-50 text-blue-600' },
                { name: 'Khác', icon: '▦', bg: 'bg-slate-100 text-slate-700' },
              ].map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => {
                    showToast(`Chia sẻ qua ${item.name}`);
                    setShowShareSheet(false);
                  }}
                  className="flex flex-col items-center gap-1.5 cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg ${item.bg}`}>
                    {item.icon}
                  </div>
                  <span className="text-[11px] text-slate-600 font-medium">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* General Toast Alert */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-[#0A1680] text-white px-4 py-2 rounded-full shadow-xl text-[13px] font-semibold flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
