import React, { useState } from 'react';
import { IOSStatusBar } from '../common/IOSStatusBar';
import { BottomNav } from '../common/BottomNav';
import { NavTab, Place } from '../../types/travel';
import { MOCK_PLACES } from '../../data/mockData';

interface SearchFilterScreenProps {
  onNavigateTab: (tab: NavTab) => void;
  onOpenPlaceDetail: (placeId: string) => void;
  onOpenMap: () => void;
  onBack: () => void;
}

export const SearchFilterScreen: React.FC<SearchFilterScreenProps> = ({
  onNavigateTab,
  onOpenPlaceDetail,
  onOpenMap,
  onBack,
}) => {
  // Screen mode: 'results' or 'filter-sheet'
  const [screenMode, setScreenMode] = useState<'results' | 'filter-sheet'>('results');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('cà phê Đà Lạt');
  const [selectedCategory, setSelectedCategory] = useState('Cà phê (24)');
  const [selectedSort, setSelectedSort] = useState('Đánh giá cao nhất');

  // Filter sheet states
  const [selectedCity, setSelectedCity] = useState('Đà Lạt, Lâm Đồng');
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [selectedFilterCategories, setSelectedFilterCategories] = useState<string[]>(['Ăn uống', 'Cà phê']);
  const [priceRange, setPriceRange] = useState<[number, number]>([100000, 500000]);
  const [openNowOnly, setOpenNowOnly] = useState(true);
  const [minRating, setMinRating] = useState('4.0+');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(['Đậu xe', 'Wifi free']);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showSortSheet, setShowSortSheet] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const categories = [
    'Tất cả (24)',
    'Ăn uống (18)',
    'Cà phê (24)',
    'Tham quan (6)',
    'Điểm check-in (12)',
  ];

  const sortOptions = ['Đánh giá cao nhất', 'Gần nhất', 'Phổ biến', 'Giá tốt'];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleResetFilter = () => {
    setSelectedCity('Đà Lạt, Lâm Đồng');
    setSelectedFilterCategories(['Ăn uống']);
    setPriceRange([100000, 500000]);
    setOpenNowOnly(true);
    setMinRating('4.0+');
    setSelectedAmenities(['Đậu xe']);
    setShowResetConfirm(false);
    showToast('Đã đặt lại bộ lọc về mặc định');
  };

  const toggleCategory = (cat: string) => {
    if (selectedFilterCategories.includes(cat)) {
      setSelectedFilterCategories(selectedFilterCategories.filter((c) => c !== cat));
    } else {
      setSelectedFilterCategories([...selectedFilterCategories, cat]);
    }
  };

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  // If viewMode switches to map, we can redirect or show MapViewScreen
  const handleViewModeToggle = (mode: 'list' | 'map') => {
    if (mode === 'map') {
      onOpenMap();
    } else {
      setViewMode('list');
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#FCFDFF] text-slate-800 select-none">
      {screenMode === 'results' ? (
        /* ================= RESULTS VIEW ================= */
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* iOS Status Bar */}
          <IOSStatusBar light={false} />

          {/* Search Header */}
          <div className="px-5 pt-1 pb-2 flex flex-col gap-3 bg-[#FCFDFF]">
            <header className="h-12 flex items-center w-full shrink-0 gap-2">
              <button
                onClick={onBack}
                aria-label="Quay lại"
                type="button"
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-all shrink-0 text-[#0A1680] cursor-pointer"
              >
                <svg className="w-5 h-5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div className="flex-1 flex items-center bg-white rounded-full px-4 py-2.5 shadow-sm gap-2 min-w-0">
                <svg className="w-4 h-4 text-[#FFA62B] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  className="bg-transparent flex-1 text-[#0F2C59] text-[14px] font-medium outline-none placeholder:text-slate-400 w-full min-w-0 border-0 shadow-none"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm địa điểm, quán ăn..."
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Xóa tìm kiếm"
                    className="w-6 h-6 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Filter Button */}
              <button
                type="button"
                onClick={() => setScreenMode('filter-sheet')}
                aria-label="Bộ lọc tìm kiếm"
                className="w-10 h-10 flex items-center justify-center rounded-full text-[#0F2C59] hover:bg-slate-50 transition-all shrink-0 relative bg-white shadow-sm cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="21" x2="14" y1="4" y2="4" />
                  <line x1="10" x2="3" y1="4" y2="4" />
                  <line x1="21" x2="12" y1="12" y2="12" />
                  <line x1="8" x2="3" y1="12" y2="12" />
                  <line x1="21" x2="16" y1="20" y2="20" />
                  <line x1="12" x2="3" y1="20" y2="20" />
                </svg>
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#0A1680]" />
              </button>
            </header>

            {/* Category Chips Carousel */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 -mx-5 px-5 min-w-0">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all cursor-pointer font-heading ${
                      isActive
                        ? 'bg-[#0A1680] text-white shadow-xs'
                        : 'bg-white border border-slate-200/80 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Quick Sorting Row */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              <button
                type="button"
                onClick={() => setShowSortSheet(true)}
                className="px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[12px] font-medium whitespace-nowrap hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="m3 16 4 4 4-4" />
                  <path d="M7 20V4" />
                  <path d="m21 8-4-4-4 4" />
                  <path d="M17 4v16" />
                </svg>
                <span>Sắp xếp</span>
              </button>
              {sortOptions.map((opt) => {
                const isActive = selectedSort === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setSelectedSort(opt)}
                    className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#001a43] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* View Mode Switcher Header */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-baseline gap-1.5">
                <h1 className="text-[20px] font-bold tracking-tight text-[#0f1d26] font-heading">
                  Kết quả tìm kiếm
                </h1>
                <span className="text-[12px] font-medium text-slate-500">(2 nổi bật)</span>
              </div>

              {/* Segment Switcher */}
              <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200/50">
                <button
                  type="button"
                  onClick={() => handleViewModeToggle('list')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold transition-all cursor-pointer font-heading ${
                    viewMode === 'list' ? 'bg-white text-[#0A1680] shadow-xs' : 'text-slate-600'
                  }`}
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" x2="21" y1="6" y2="6" />
                    <line x1="8" x2="21" y1="12" y2="12" />
                    <line x1="8" x2="21" y1="18" y2="18" />
                  </svg>
                  <span>Danh sách</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleViewModeToggle('map')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium transition-all cursor-pointer font-heading ${
                    viewMode === 'map' ? 'bg-white text-[#0A1680] shadow-xs' : 'text-slate-600'
                  }`}
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                  </svg>
                  <span>Bản đồ</span>
                </button>
              </div>
            </div>
          </div>

          {/* Places Vertical Card Feed */}
          <div className="px-5 flex flex-col gap-4 mt-2 pb-24 overflow-y-auto no-scrollbar flex-1">
            {/* Large Card 1: Tiệm cà phê Tú Lưng */}
            <div
              onClick={() => onOpenPlaceDetail(MOCK_PLACES[0].id)}
              className="flex flex-col bg-white p-3 shadow-md hover:shadow-lg transition-all cursor-pointer rounded-[28px] border border-slate-100"
            >
              <div className="relative w-full h-[230px] rounded-[24px] overflow-hidden bg-slate-100 shrink-0">
                <img
                  alt="Tiệm cà phê Tú Lưng"
                  className="w-full h-full object-cover"
                  src={MOCK_PLACES[0].images[0]}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md flex items-center gap-1.5 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[11px] font-bold text-[#0A1680] font-heading">
                    Mở cửa • 07:00 - 21:00
                  </span>
                </div>

                <button
                  type="button"
                  aria-label="Lưu Tiệm cà phê Tú Lưng"
                  onClick={(e) => {
                    e.stopPropagation();
                    showToast('Đã lưu Tiệm cà phê Tú Lưng vào Wishlist ❤️');
                  }}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-rose-500 shadow-md hover:scale-110 transition-transform cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </button>

                <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
                  <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-[12px] font-medium">
                    <span>2.1 km</span>
                  </div>
                  <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-[12px] font-medium">
                    <span>Cà phê ngắm mây</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 pb-1 px-1">
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <h3 className="text-[17px] font-bold text-[#0f1d26] truncate tracking-tight font-heading">
                    Tiệm cà phê Tú Lưng
                  </h3>
                  <div className="flex items-center gap-1 bg-[#FBEDB0]/50 px-2 py-0.5 rounded-full shrink-0">
                    <svg className="w-3.5 h-3.5 fill-[#F1B94C] text-[#F1B94C]" viewBox="0 0 24 24">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span className="text-[12px] text-[#0f1d26] font-bold">4.8</span>
                  </div>
                </div>
                <span className="text-[13px] font-bold text-[#0A1680] shrink-0 font-heading">
                  50.000đ - 100.000đ
                </span>
              </div>
            </div>

            {/* Large Card 2: Kong Coffee */}
            <div
              onClick={() => onOpenPlaceDetail(MOCK_PLACES[3].id)}
              className="flex flex-col bg-white p-3 shadow-md hover:shadow-lg transition-all cursor-pointer rounded-[28px] border border-slate-100"
            >
              <div className="relative w-full h-[230px] rounded-[24px] overflow-hidden bg-slate-100 shrink-0">
                <img
                  alt="Kong Coffee"
                  className="w-full h-full object-cover"
                  src={MOCK_PLACES[3].images[0]}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md flex items-center gap-1.5 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[11px] font-bold text-[#0A1680] font-heading">
                    Mở cửa • 07:00 - 22:00
                  </span>
                </div>

                <button
                  type="button"
                  aria-label="Lưu Kong Coffee"
                  onClick={(e) => {
                    e.stopPropagation();
                    showToast('Đã lưu Kong Coffee vào Wishlist ❤️');
                  }}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-rose-500 shadow-md hover:scale-110 transition-transform cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </button>

                <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
                  <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-[12px] font-medium">
                    <span>2.8 km</span>
                  </div>
                  <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-[12px] font-medium">
                    <span>Hoàng hôn &amp; acoustic</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 pb-1 px-1">
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <h3 className="text-[17px] font-bold text-[#0f1d26] truncate tracking-tight font-heading">
                    Kong Coffee
                  </h3>
                  <div className="flex items-center gap-1 bg-[#FBEDB0]/50 px-2 py-0.5 rounded-full shrink-0">
                    <svg className="w-3.5 h-3.5 fill-[#F1B94C] text-[#F1B94C]" viewBox="0 0 24 24">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span className="text-[12px] text-[#0f1d26] font-bold">4.7</span>
                  </div>
                </div>
                <span className="text-[13px] font-bold text-[#0A1680] shrink-0 font-heading">
                  50.000đ - 120.000đ
                </span>
              </div>
            </div>
          </div>

          <BottomNav activeTab="explore" onTabChange={onNavigateTab} />
        </div>
      ) : (
        /* ================= DETAILED FILTER SHEET ================= */
        <div className="flex-1 flex flex-col bg-[#f8f9fb] overflow-y-auto no-scrollbar">
          {/* Header */}
          <header className="sticky top-0 w-full z-40 bg-[#FCFDFF] backdrop-blur-xl border-b border-slate-200/60">
            <IOSStatusBar light={false} />
            <div className="h-[52px] px-5 flex items-center justify-between">
              <button
                onClick={() => setScreenMode('results')}
                aria-label="Quay lại"
                type="button"
                className="w-9 h-9 flex items-center justify-center rounded-full text-[#0A1680] hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
              </button>
              <h1 className="font-bold text-[17px] text-[#0A1680] text-center flex-1 font-heading">
                Bộ lọc tìm kiếm
              </h1>
              <button
                onClick={() => setScreenMode('results')}
                aria-label="Đóng"
                type="button"
                className="w-9 h-9 flex items-center justify-center rounded-full text-[#0A1680] hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </header>

          <main className="px-5 pt-28 pb-28 space-y-4 text-left">
            {/* 1. City / Location */}
            <div className="bg-white p-5 rounded-[24px] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[15px] font-bold text-[#0A1680] font-heading">
                  Thành phố / Khu vực
                </span>
                <span className="text-[12px] font-medium text-slate-400">Hiện tại</span>
              </div>
              <button
                type="button"
                onClick={() => setShowCityPicker(true)}
                className="w-full flex items-center justify-between px-4 py-3 bg-[#f8f9fb] rounded-xl text-left active:scale-[0.99] transition-all hover:bg-slate-100 border border-transparent cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#93B2F8]/20 flex items-center justify-center text-[#0A1680]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <polygon points="3 11 22 2 13 21 11 13 3 11" />
                    </svg>
                  </div>
                  <span className="text-[14px] font-semibold text-slate-800 font-heading">
                    {selectedCity}
                  </span>
                </div>
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            </div>

            {/* 2. Categories Grid */}
            <div className="bg-white p-5 rounded-[24px] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[15px] font-bold text-[#0A1680] font-heading">
                  Danh mục
                </span>
                <span className="text-[12px] text-slate-400">Chọn nhiều mục</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  'Ăn uống',
                  'Cà phê',
                  'Tham quan',
                  'Biển',
                  'Núi',
                  'Mua sắm',
                  'Giải trí',
                  'Văn hóa',
                  'Khác',
                ].map((cat) => {
                  const isChecked = selectedFilterCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-[13px] font-semibold transition-all cursor-pointer font-heading ${
                        isChecked
                          ? 'bg-[#0A1680] text-white shadow-xs'
                          : 'bg-[#f8f9fb] text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Price Range */}
            <div className="bg-white p-5 rounded-[24px] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[15px] font-bold text-[#0A1680] font-heading">
                  Khoảng chi phí (mỗi người)
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#93B2F8]/20 text-[#0A1680] text-[12px] font-bold font-heading">
                  100.000đ - 500.000đ
                </span>
              </div>
              <div className="pt-3 pb-1 px-1">
                <div className="relative w-full h-1.5 bg-slate-200 rounded-full">
                  <div className="absolute left-[15%] right-[45%] top-0 bottom-0 bg-[#0A1680] rounded-full" />
                  <div className="absolute left-[15%] top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white border-2 border-[#0A1680] shadow-sm cursor-pointer" />
                  <div className="absolute right-[45%] top-1/2 -translate-y-1/2 translate-x-1/2 w-5 h-5 rounded-full bg-white border-2 border-[#0A1680] shadow-sm cursor-pointer" />
                </div>
                <div className="flex justify-between items-center mt-3 text-slate-400 text-[11px] font-medium">
                  <span>0đ</span>
                  <span>300.000đ</span>
                  <span>1.000.000đ</span>
                  <span>2.000.000đ+</span>
                </div>
              </div>
            </div>

            {/* 4. Opening Hours */}
            <div className="bg-white p-5 rounded-[24px] shadow-sm flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-bold text-slate-800 font-heading">Giờ mở cửa</h3>
                <p className="text-[12px] text-slate-500 mt-0.5">
                  Chỉ hiển thị địa điểm đang mở
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpenNowOnly(!openNowOnly)}
                className={`w-12 h-6 px-0.5 rounded-full flex items-center transition-colors cursor-pointer ${
                  openNowOnly ? 'bg-[#0A1680]' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                    openNowOnly ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 5. Rating */}
            <div className="bg-white p-5 rounded-[24px] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[15px] font-bold text-[#0A1680] font-heading">
                  Đánh giá tối thiểu
                </span>
                <span className="text-[12px] text-slate-400">Từ 4.0 sao trở lên</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {['Tất cả', '3.5+', '4.0+', '4.5+'].map((rate) => {
                  const isSelected = minRating === rate;
                  return (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setMinRating(rate)}
                      className={`py-2.5 rounded-xl text-[13px] font-medium text-center flex items-center justify-center gap-1 transition-all cursor-pointer font-heading ${
                        isSelected
                          ? 'bg-[#FBEDB0] text-[#0A1680] font-bold border border-[#F1B94C]/40 shadow-xs'
                          : 'bg-[#f8f9fb] text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {rate !== 'Tất cả' && <span className="text-[#F1B94C]">★</span>}
                      <span>{rate}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 6. Amenities */}
            <div className="bg-white p-5 rounded-[24px] shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[15px] font-bold text-[#0A1680] font-heading">
                  Tiện ích
                </span>
                <span className="text-[12px] text-slate-400">Chọn nhiều mục</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { name: 'Đậu xe', icon: 'P' },
                  { name: 'Wifi free', icon: '📶' },
                  { name: 'Gia đình', icon: '👨‍👩‍👧' },
                  { name: 'Thú cưng', icon: '🐾' },
                ].map((am) => {
                  const isChecked = selectedAmenities.includes(am.name);
                  return (
                    <button
                      key={am.name}
                      type="button"
                      onClick={() => toggleAmenity(am.name)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[#93B2F8]/20 border border-[#93B2F8]'
                          : 'bg-[#f8f9fb] hover:bg-slate-100'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#0A1680] font-bold mb-1 shadow-2xs">
                        {am.icon}
                      </div>
                      <span className="text-[11px] font-semibold text-slate-800 text-center font-heading">
                        {am.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </main>

          {/* Sticky Bottom Actions */}
          <div className="fixed bottom-0 max-w-[390px] w-full z-40 bg-white/95 backdrop-blur-xl px-5 py-3 border-t border-slate-200 shadow-md">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="h-[46px] px-5 rounded-full border border-slate-300 bg-white text-[#0A1680] text-[14px] font-bold active:scale-95 transition-all hover:bg-slate-50 shrink-0 flex items-center justify-center gap-2 shadow-xs cursor-pointer font-heading"
              >
                <span>Đặt lại</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setScreenMode('results');
                  showToast('Đã áp dụng bộ lọc (24 kết quả)');
                }}
                className="flex-1 h-[48px] px-6 rounded-full bg-[#0A1680] text-white text-[14px] font-bold shadow-lg shadow-[#0A1680]/25 flex items-center justify-center gap-2 active:scale-98 transition-transform cursor-pointer font-heading"
              >
                <span>Áp dụng (24 kết quả)</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CITY PICKER SHEET MODAL */}
      {showCityPicker && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-[#0A1680]/25 backdrop-blur-xs transition-opacity"
            onClick={() => setShowCityPicker(false)}
          />
          <div className="relative w-full bg-white rounded-t-[28px] shadow-2xl flex flex-col max-h-[80vh] z-10 overflow-hidden pb-6 animate-in slide-in-from-bottom duration-300">
            <div className="pt-3 pb-2 px-5 flex items-center justify-between border-b border-slate-100">
              <div className="w-8" />
              <div className="flex flex-col items-center">
                <div className="w-10 h-1 bg-slate-200 rounded-full mb-2" />
                <h2 className="text-[16px] font-bold text-[#0A1680] font-heading">
                  Chọn Thành phố / Khu vực
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowCityPicker(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-1.5 overflow-y-auto">
              {[
                'Đà Lạt, Lâm Đồng',
                'TP.HCM',
                'Phú Quốc, Kiên Giang',
                'Hội An, Quảng Nam',
                'Nha Trang, Khánh Hòa',
                'Sa Pa, Lào Cai',
                'Hà Nội',
              ].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setSelectedCity(c);
                    setShowCityPicker(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors cursor-pointer text-left ${
                    selectedCity === c ? 'bg-[#93B2F8]/15 text-[#0A1680]' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className="font-semibold text-[14px] font-heading">{c}</span>
                  {selectedCity === c && <span className="text-[#0A1680] font-bold">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SORT OPTIONS SHEET MODAL */}
      {showSortSheet && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setShowSortSheet(false)}
          />
          <div className="w-full bg-white rounded-t-[28px] p-5 pb-8 shadow-2xl z-10 flex flex-col gap-4 animate-in slide-in-from-bottom duration-300">
            <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto" />
            <div className="flex items-center justify-between">
              <h2 className="text-[18px] font-bold text-[#0f1d26] font-heading">Sắp xếp theo</h2>
              <button
                type="button"
                onClick={() => setShowSortSheet(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400"
              >
                ✕
              </button>
            </div>
            <div className="space-y-1">
              {['Gần nhất', 'Đánh giá cao nhất', 'Phổ biến nhất', 'Giá thấp đến cao'].map(
                (sort) => (
                  <label
                    key={sort}
                    onClick={() => {
                      setSelectedSort(sort);
                      setShowSortSheet(false);
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer ${
                      selectedSort === sort ? 'bg-[#0A1680]/5 text-[#0A1680] font-bold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-[14px]">{sort}</span>
                    <input
                      type="radio"
                      name="sort_opt"
                      checked={selectedSort === sort}
                      onChange={() => {}}
                      className="w-4 h-4 accent-[#0A1680]"
                    />
                  </label>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* RESET CONFIRM DIALOG */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-[#0A1680]/25 backdrop-blur-xs transition-opacity"
            onClick={() => setShowResetConfirm(false)}
          />
          <div className="relative bg-white rounded-[28px] w-[340px] max-w-[90vw] p-6 shadow-2xl z-10 text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            </div>
            <h3 className="text-[17px] font-bold text-slate-900 mb-1.5 font-heading">
              Đặt lại bộ lọc?
            </h3>
            <p className="text-[13px] text-slate-500 leading-relaxed mb-6">
              Mọi tùy chọn danh mục, khoảng giá và tiện ích sẽ trở về mặc định ban đầu.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 h-[44px] rounded-full border border-slate-300 bg-white text-slate-700 font-bold text-[13px] hover:bg-slate-50 cursor-pointer font-heading"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleResetFilter}
                className="flex-1 h-[44px] rounded-full bg-[#0A1680] text-white font-bold text-[13px] shadow-md hover:bg-[#071060] cursor-pointer font-heading"
              >
                Đặt lại
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
