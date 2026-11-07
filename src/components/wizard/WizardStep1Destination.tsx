import React, { useState } from 'react';
import { IOSStatusBar } from '../common/IOSStatusBar';
import { MOCK_DESTINATIONS } from '../../data/mockData';

interface WizardStep1DestinationProps {
  selectedDestination: string;
  onSelect: (destName: string, tagline?: string, img?: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const WizardStep1Destination: React.FC<WizardStep1DestinationProps> = ({
  selectedDestination,
  onSelect,
  onNext,
  onBack,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(['TP.HCM']);

  const popular = [{name:'TP.HCM',sub:'Khám phá Sài Gòn theo sở thích của bạn',img:'/images/vietnam-hero.png'}];
  const others:typeof popular=[];

  const toggleFav = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorites.includes(name)) {
      setFavorites(favorites.filter((f) => f !== name));
    } else {
      setFavorites([...favorites, name]);
    }
  };

  return (
    <div className="relative w-full h-full min-h-0 bg-[#FCFDFF] flex flex-col justify-between overflow-hidden select-none text-slate-800">
      {/* Header & Progress */}
      <header className="pt-2 px-5 shrink-0 bg-[#FCFDFF] z-20">
        <IOSStatusBar light={false} />
        <div className="flex items-center justify-between pt-1 pb-2">
          <button
            onClick={onBack}
            aria-label="Quay lại"
            type="button"
            className="w-9 h-9 -ml-1 flex items-center justify-center rounded-full text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="plan-header-title">
            Bước 1/8
          </span>
          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-[#0A1680]">
            <svg className="w-5 h-5 text-[#0A1680]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </div>
        </div>

        {/* Progress bar (16.7%) */}
        <div className="pt-1 pb-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-[#0A1680] uppercase tracking-wider font-heading">
              Chọn điểm đến
            </span>
            <span className="text-xs text-slate-400 font-medium">1/8</span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-[#0A1680] rounded-full w-[12.5%] transition-all duration-300" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 min-h-0 px-5 pt-2 pb-4 overflow-y-auto no-scrollbar flex flex-col gap-3.5 text-left">
        <div>
          <h1 className="plan-content-title">
            Bạn muốn đi đâu?
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Bản demo hiện hỗ trợ lên lịch trong TP.HCM.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative flex items-center h-12 bg-white rounded-full shadow-xs px-4 border-0 focus-within:shadow-md transition-shadow">
          <svg className="w-5 h-5 text-[#FFA62B] mr-2.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm thành phố, điểm du lịch..."
            className="w-full bg-transparent text-sm text-[#0F2C59] placeholder:text-slate-400 focus:outline-none border-0 shadow-none"
          />
        </div>

        {/* Gợi ý phổ biến (2x2 Grid) */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[15px] font-bold text-slate-900 font-heading">Gợi ý phổ biến</span>
              <span className="text-[#FFA62B] text-sm">✨</span>
            </div>
            <span className="text-xs text-[#0A1680] font-semibold cursor-pointer hover:underline">
              Xem tất cả
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {popular.map((item) => {
              const isSelected = selectedDestination === item.name;
              const isFav = favorites.includes(item.name);
              return (
                <div
                  key={item.name}
                  onClick={() => onSelect(item.name, item.sub, item.img)}
                  className={`group relative flex flex-col rounded-[24px] overflow-hidden bg-white cursor-pointer transition-all active:scale-[0.98] ${
                    isSelected ? 'shadow-md shadow-[#0F2C59]/15 ring-2 ring-[#0F2C59]' : 'shadow-xs hover:shadow-sm'
                  }`}
                >
                  <div className="relative w-full h-[116px] overflow-hidden bg-slate-100">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    {/* Heart Button */}
                    <button
                      type="button"
                      aria-label={`Yêu thích ${item.name}`}
                      onClick={(e) => toggleFav(item.name, e)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-xs active:scale-90 transition-transform cursor-pointer"
                    >
                      <svg className={`w-4 h-4 ${isFav ? 'text-rose-500 fill-rose-500' : 'text-slate-400 fill-none'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                    {/* Selected Badge */}
                    {isSelected && (
                      <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-[#0A1680] text-white flex items-center justify-center shadow-md">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex flex-col bg-white">
                    <span className="font-bold text-sm text-slate-900 leading-tight truncate font-heading">
                      {item.name}
                    </span>
                    <span className="text-xs text-slate-500 truncate mt-0.5">{item.sub}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Các điểm đến khác (2-column grid) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[15px] font-bold text-slate-900 font-heading">
              Các điểm đến khác
            </span>
            <span className="text-xs text-slate-400 font-medium">Khám phá thêm</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {others.map((item) => {
              const isSelected = selectedDestination === item.name;
              const isFav = favorites.includes(item.name);
              return (
                <div
                  key={item.name}
                  onClick={() => onSelect(item.name, item.sub, item.img)}
                  className={`group relative flex flex-col rounded-[24px] overflow-hidden bg-white shadow-xs cursor-pointer transition-all active:scale-[0.98] ${
                    isSelected ? 'border-2 border-[#0A1680]' : 'border border-slate-200'
                  }`}
                >
                  <div className="relative w-full h-[116px] overflow-hidden bg-slate-100">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    {/* Heart Button */}
                    <button
                      type="button"
                      aria-label={`Yêu thích ${item.name}`}
                      onClick={(e) => toggleFav(item.name, e)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-xs active:scale-90 transition-transform cursor-pointer"
                    >
                      <svg className={`w-4 h-4 ${isFav ? 'text-rose-500 fill-rose-500' : 'text-slate-400 fill-none'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                    {/* Selected Badge */}
                    {isSelected && (
                      <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-[#0A1680] text-white flex items-center justify-center shadow-md">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex flex-col bg-white">
                    <span className="font-bold text-sm text-slate-900 leading-tight truncate font-heading">
                      {item.name}
                    </span>
                    <span className="text-xs text-slate-500 truncate mt-0.5">{item.sub}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Floating Bottom CTA */}
      <footer className="shrink-0 w-full z-40 bg-white/95 backdrop-blur-xl px-5 py-3 border-t border-slate-200/80 shadow-md">
        <button
          onClick={onNext}
          type="button"
          className="w-full h-12 rounded-full bg-[#0A1680] text-white font-bold text-[16px] flex items-center justify-center gap-2 shadow-lg shadow-[#0A1680]/25 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer font-heading"
        >
          <span>Tiếp tục</span>
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </footer>
    </div>
  );
};
