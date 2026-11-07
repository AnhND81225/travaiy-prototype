import {ExplorePlaceResults} from '../../features/travel/ExplorePlaceResults';
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Building2, ArrowUpRight } from 'lucide-react';
import { images, STAYS } from '../../features/travel/fixtures';
import { IOSStatusBar } from '../common/IOSStatusBar';
import { BottomNav } from '../common/BottomNav';
import { ModalSheet } from '../common/ModalSheet';
import { Destination, NavTab, Place } from '../../types/travel';
import { MOCK_DESTINATIONS } from '../../data/mockData';

interface ExploreScreenProps {
  onNavigateTab: (tab: NavTab) => void;
  onSelectDestination: (dest: Destination) => void;
  onOpenWishlist: () => void;
  onOpenMap: () => void;
  onOpenPlaceDetail: (placeId: string) => void;
  onOpenFilter: () => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  onNavigateTab,
  onSelectDestination,
  onOpenWishlist,
  onOpenMap,
  onOpenPlaceDetail,
  onOpenFilter,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'trending' | 'nearby' | 'ai'>('trending');
  const [categoryParams,setCategoryParams]=useSearchParams();
  const selectedCategory=categoryParams.get('category')||'Tất cả';
  const setSelectedCategory=(category:string)=>setCategoryParams(category==='Tất cả'?{}:{category},{replace:true});
  const categoryImages:Record<string,string>={'Cà phê':images.dalatCabin,'Biển':images.beach,'Núi':images.hero,'Check-in':images.town,'Ăn uống':images.food,'Khách sạn':images.room};
  const [searchQuery, setSearchQuery] = useState('');
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const categories = ['Tất cả', 'Khách sạn', 'Ăn uống', 'Cà phê', 'Biển', 'Núi', 'Check-in'];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const filteredDestinations = MOCK_DESTINATIONS.filter((d) => {
    if (!searchQuery) return true;
    return (
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden text-slate-800">
      {/* iOS Status Bar */}
      <IOSStatusBar light={false} />

      {/* Header */}
      <header className="px-5 pt-2 pb-2 bg-white/90 backdrop-blur-md sticky top-0 z-20 border-b border-slate-100/80">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-[24px] font-extrabold text-[#0d1d26] tracking-tight leading-none font-heading">
              Khám phá
            </h1>
          </div>
          <div className="flex items-center gap-1.5">
            {/* Map Switcher Button */}
            <button
              onClick={onOpenMap}
              aria-label="Xem bản đồ"
              type="button"
              className="px-3 h-9 rounded-full bg-slate-100 hover:bg-[#0A1680]/10 text-[#0A1680] text-[12px] font-bold flex items-center gap-1 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                <line x1="9" y1="3" x2="9" y2="18" />
                <line x1="15" y1="6" x2="15" y2="21" />
              </svg>
              <span>Bản đồ</span>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              aria-label="Travel Wishlist"
              type="button"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-[#0a1680] shadow-2xs hover:bg-[#f2f4f6] transition-colors cursor-pointer"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2.5 bg-white rounded-full px-4 py-3 shadow-sm border-0 mt-3">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FFA62B] shrink-0">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm điểm đến, món ngon, trải nghiệm..."
            className="w-full bg-transparent text-[13.5px] text-[#0F2C59] placeholder:text-slate-400 focus:outline-none font-medium border-0 shadow-none"
          />
          <button
            type="button"
            aria-label="Voice search"
            onClick={() => setShowVoiceModal(true)}
            className="text-gray-400 hover:text-[#0A1680] transition-colors flex items-center justify-center cursor-pointer"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" y1="19" x2="12" y2="23" />
              <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Filter"
            onClick={onOpenFilter}
            className="text-gray-400 hover:text-[#0A1680] transition-colors flex items-center justify-center cursor-pointer pl-1"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="21" x2="14" y1="4" y2="4" />
              <line x1="10" x2="3" y1="4" y2="4" />
              <line x1="21" x2="12" y1="12" y2="12" />
              <line x1="8" x2="3" y1="12" y2="12" />
              <line x1="21" x2="16" y1="20" y2="20" />
              <line x1="12" x2="3" y1="20" y2="20" />
            </svg>
          </button>
        </div>

        {/* Category Chips Horizontal Carousel */}
        <div className="-mx-5 px-5 overflow-x-auto no-scrollbar flex items-center gap-2 pt-3 pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {if(cat==='Khách sạn')navigate('/explore/stays');else setSelectedCategory(cat);}}
              aria-pressed={selectedCategory===cat}
              className={`shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[13px] font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#0a1680] text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-slate-200/80 hover:text-gray-900 shadow-2xs'
              }`}
            >
              {categoryImages[cat]&&<img src={categoryImages[cat]} alt="" className="explore-category-thumb"/>}{cat}
            </button>
          ))}
        </div>
      </header>

      {/* Main Stream Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar px-5 pt-3 pb-28 space-y-4">
        {/* Tabs Row: Thịnh hành / Gần bạn / Gợi ý AI */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('trending')}
              className={`text-[15px] font-heading cursor-pointer relative pb-1 ${
                activeTab === 'trending' ? 'font-bold text-[#0a1680]' : 'font-medium text-gray-400 hover:text-gray-700'
              }`}
            >
              Thịnh hành
              {activeTab === 'trending' && (
                <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#0a1680] rounded-full" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('nearby')}
              className={`text-[15px] font-heading cursor-pointer relative pb-1 ${
                activeTab === 'nearby' ? 'font-bold text-[#0a1680]' : 'font-medium text-gray-400 hover:text-gray-700'
              }`}
            >
              Gần bạn
              {activeTab === 'nearby' && (
                <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#0a1680] rounded-full" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ai')}
              className={`text-[15px] font-heading cursor-pointer relative pb-1 ${
                activeTab === 'ai' ? 'font-bold text-[#0a1680]' : 'font-medium text-gray-400 hover:text-gray-700'
              }`}
            >
              Gợi ý AI
              {activeTab === 'ai' && (
                <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#F1B94C] rounded-full shadow-2xs" />
              )}
            </button>
          </div>
          <span
            onClick={onOpenMap}
            className="text-[12px] font-semibold text-[#0a1680] flex items-center gap-0.5 cursor-pointer"
          >
            Xem bản đồ <span className="text-xs font-bold text-[#F1B94C]">›</span>
          </span>
        </div>

        {activeTab === 'ai' && (
          <div className="bg-gradient-to-r from-[#FFFDF2] via-[#FFF9E6] to-[#EFF3FF] border border-[#F1B94C]/45 rounded-2xl p-3.5 flex items-center gap-3.5 shadow-xs">
            <img src="/images/mascot-map.png" alt="Bé Sao Lumi" className="w-13 h-13 object-contain animate-mascot-float shrink-0 drop-shadow-xs" />
            <div className="text-left flex-1 min-w-0">
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#D97706] font-heading flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F1B94C] animate-pulse" /> GỢI Ý TỪ BÉ SAO LUMI
              </span>
              <h3 className="text-[14px] font-bold text-slate-800 leading-snug font-heading">Điểm đến phù hợp với bạn</h3>
              <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">Được cá nhân hoá theo lịch trình và phong cách du lịch của bạn.</p>
            </div>
          </div>
        )}

        {selectedCategory!=='Tất cả'&&<ExplorePlaceResults category={selectedCategory} query={searchQuery} onOpen={onOpenPlaceDetail}/>}
        {selectedCategory==='Tất cả'&&<>
        <section className="explore-hotels"><div className="travel-section-title"><div><span className="travel-eyebrow">NƠI NGHỈ CHO CHUYẾN ĐI</span><h2>Khách sạn & chỗ ở</h2></div><button onClick={()=>navigate('/explore/stays')}>Xem tất cả <ArrowUpRight size={15}/></button></div><div className="explore-hotels-row">{STAYS.map(s=><button key={s.id} className="explore-hotel-card" onClick={()=>navigate(`/stay/${s.id}`)}><img src={s.image} alt="Phòng nghỉ minh họa"/><div><span>{s.type} · {s.rating} ★</span><h3>{s.name}</h3><p>{s.area}</p><b>{s.price.toLocaleString('vi-VN')}đ <small>/đêm</small></b></div></button>)}</div><p className="travel-footnote">Chỗ ở hư cấu và giá minh họa; chưa có đặt phòng thật.</p></section>
        {/* Large Destination Cards Feed */}
        <div className="flex flex-col gap-4">
          {filteredDestinations.map((dest) => (
            <div
              key={dest.id}
              onClick={() => onSelectDestination(dest)}
              className="w-full bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-[0_4px_24px_rgba(10,22,128,0.08)] flex flex-col group cursor-pointer transition hover:shadow-lg"
            >
              <div className="relative h-[220px] w-full overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                {/* Heart wishlist button */}
                <button
                  type="button"
                  aria-label="Yêu thích"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSaveModal(true);
                  }}
                  className="absolute top-3.5 right-3.5 w-10 h-10 rounded-full bg-white/85 backdrop-blur-md flex items-center justify-center text-rose-500 shadow-sm hover:scale-110 active:scale-90 transition-transform cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
                <div className="absolute bottom-3.5 left-4 right-4 text-white">
                  <div className="text-[22px] font-bold leading-tight drop-shadow-sm font-heading">
                    {dest.title}
                  </div>
                  <div className="text-[13px] text-white/90 mt-0.5 font-normal">
                    {dest.region}
                  </div>
                </div>
              </div>

              <div className="p-3.5 px-4 flex items-center justify-between text-[13px] bg-white">
                <div className="flex items-center gap-1.5 text-gray-500 font-medium truncate pr-2">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#0a1680" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span className="text-[#0a1680] font-semibold truncate">{dest.tagline}</span>
                </div>
                <div className="flex items-center gap-1 font-bold text-[#0a1680] bg-[#f8f9fb] border border-gray-100 px-3 py-1 rounded-full shrink-0">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="#f1b94c" stroke="#f1b94c" strokeWidth="1.8">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span>{dest.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        </>}
        {/* Wishlist quick navigation banner */}
        <div
          onClick={onOpenWishlist}
          className="w-full bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex items-center justify-between group cursor-pointer hover:bg-[#f8f9fb] transition-all"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#0a1680]/10 flex items-center justify-center text-[#0a1680] shrink-0">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[15px] font-bold text-gray-900 leading-tight font-heading">
                Địa điểm đã lưu của bạn
              </span>
              <span className="text-[12px] text-gray-500 mt-0.5">
                32 địa điểm đang chờ khám phá
              </span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-[#f2f4f6] flex items-center justify-center text-gray-500 group-hover:text-[#0a1680] group-hover:bg-[#0a1680]/10 transition-colors">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
        </div>
      </main>

      {/* Floating Bottom Nav */}
      <BottomNav activeTab="explore" onTabChange={onNavigateTab} />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-[#0A1680] text-white px-4 py-2 rounded-full shadow-xl text-[13px] font-semibold flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* VOICE SEARCH SHEET MODAL */}
      <ModalSheet
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        title="Tìm kiếm bằng giọng nói"
        ariaLabel="Tìm kiếm bằng giọng nói"
        contentClassName="p-6 items-center gap-4"
      >
        <div className="flex items-center justify-between w-full">
          <h2 className="text-[18px] font-bold text-gray-900 font-heading">
            Tìm kiếm bằng giọng nói
          </h2>
          <button
            type="button"
            aria-label="Đóng tìm kiếm bằng giọng nói"
            onClick={() => setShowVoiceModal(false)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col items-center justify-center py-6 gap-3">
          <div className="relative flex items-center justify-center w-24 h-24">
            <div className="absolute inset-0 rounded-full bg-[#0a1680]/15 animate-ping" />
            <div className="relative w-16 h-16 rounded-full bg-[#0a1680] text-white flex items-center justify-center shadow-lg">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
              </svg>
            </div>
          </div>
          <p className="text-[15px] font-semibold text-gray-800 mt-2 font-heading">
            Đang lắng nghe...
          </p>
          <p className="text-[13px] text-gray-400">
            Hãy nói điểm đến hoặc trải nghiệm bạn muốn tìm
          </p>
        </div>

        <div className="w-full flex flex-col gap-2 pt-2 border-t border-gray-100">
          <span className="text-[12px] font-semibold text-gray-400">Gợi ý từ khóa:</span>
          <div className="flex flex-wrap gap-2">
            {['Cà phê ngắm hoàng hôn', 'Hải sản ngon TP.HCM', 'Chỗ check-in Hội An'].map(
              (hint) => (
                <button
                  key={hint}
                  type="button"
                  onClick={() => {
                    setSearchQuery(hint);
                    setShowVoiceModal(false);
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-[#f2f4f6] text-gray-700 text-[12px] font-medium hover:bg-[#0a1680]/10 hover:text-[#0a1680] transition-colors cursor-pointer"
                >
                  {hint}
                </button>
              )
            )}
          </div>
        </div>
      </ModalSheet>

      {/* SAVE TO COLLECTION SHEET MODAL */}
      <ModalSheet
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        title="Lưu vào bộ sưu tập"
        ariaLabel="Lưu vào bộ sưu tập"
        contentClassName="p-5 gap-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-bold text-gray-900 font-heading">
            Lưu vào bộ sưu tập
          </h2>
          <button
            type="button"
            aria-label="Đóng lưu vào bộ sưu tập"
            onClick={() => setShowSaveModal(false)}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2.5">
          {[
            { name: 'Muốn đi Đà Lạt', count: 12 },
            { name: 'Quán cà phê muốn thử', count: 8 },
            { name: 'Biển tuyệt đẹp', count: 15 },
          ].map((c, idx) => (
            <label
              key={c.name}
              className="flex items-center justify-between p-3 rounded-2xl border border-gray-100 hover:bg-[#f8f9fb] cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0a1680]/10 text-[#0a1680] flex items-center justify-center font-bold">
                  ★
                </div>
                <div>
                  <div className="text-[14px] font-bold text-gray-900 font-heading">{c.name}</div>
                  <div className="text-[12px] text-gray-500">{c.count} địa điểm</div>
                </div>
              </div>
              <input
                type="radio"
                name="collection_save"
                defaultChecked={idx === 0}
                className="w-5 h-5 text-[#0a1680] accent-[#0a1680]"
              />
            </label>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            setShowSaveModal(false);
            showToast('Đã lưu vào bộ sưu tập thành công! ❤️');
          }}
          className="w-full h-12 rounded-full bg-[#0a1680] text-white text-[15px] font-bold flex items-center justify-center shadow-md font-heading cursor-pointer"
        >
          Lưu địa điểm
        </button>
      </ModalSheet>
    </div>
  );
};
