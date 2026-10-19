import React from 'react';
import { NavTab } from '../../types/travel';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="absolute bottom-4 left-0 right-0 w-full flex justify-center z-40 pointer-events-none px-3">
      <nav
        aria-label="Thanh điều hướng"
        className="pointer-events-auto w-[276px] h-[64px] bg-white/95 backdrop-blur-xl border border-[#93B2F8]/35 rounded-full shadow-xl shadow-[#0A1680]/12 px-2.5 flex justify-between items-center transition-all duration-300"
      >
        {/* 1. Trang chủ */}
        {activeTab === 'home' ? (
          <button
            type="button"
            className="h-11 flex items-center space-x-1.5 px-3.5 rounded-full bg-[#0A1680] text-white shadow-xs shrink-0 active:scale-95 transition-all"
            aria-label="Trang chủ"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span className="text-[12px] font-bold tracking-tight">Trang chủ</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#F1B94C] shrink-0 shadow-2xs" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onTabChange('home')}
            className="w-10 h-10 flex items-center justify-center text-[#657580] hover:text-[#0A1680] transition-colors rounded-full active:scale-90"
            aria-label="Trang chủ"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </button>
        )}

        {/* 2. Tạo chuyến */}
        {activeTab === 'create-trip' ? (
          <button
            type="button"
            className="h-11 flex items-center space-x-1.5 px-3.5 rounded-full bg-[#0A1680] text-white shadow-xs shrink-0 active:scale-95 transition-all"
            aria-label="Tạo chuyến"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
            <span className="text-[12px] font-bold tracking-tight">Tạo chuyến</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#F1B94C] shrink-0 shadow-2xs" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onTabChange('create-trip')}
            className="w-10 h-10 flex items-center justify-center text-[#657580] hover:text-[#0A1680] transition-colors rounded-full active:scale-90"
            aria-label="Tạo chuyến"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </button>
        )}

        {/* 3. Khám phá */}
        {activeTab === 'explore' ? (
          <button
            type="button"
            className="h-11 flex items-center space-x-1.5 px-3.5 rounded-full bg-[#0A1680] text-white shadow-xs shrink-0 active:scale-95 transition-all"
            aria-label="Khám phá"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
            <span className="text-[12px] font-bold tracking-tight">Khám phá</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#F1B94C] shrink-0 shadow-2xs" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onTabChange('explore')}
            className="w-10 h-10 flex items-center justify-center text-[#657580] hover:text-[#0A1680] transition-colors rounded-full active:scale-90"
            aria-label="Khám phá"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
          </button>
        )}

        {/* 4. Chuyến đi */}
        {activeTab === 'trips' ? (
          <button
            type="button"
            className="h-11 flex items-center space-x-1.5 px-3.5 rounded-full bg-[#0A1680] text-white shadow-xs shrink-0 active:scale-95 transition-all"
            aria-label="Chuyến đi"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            <span className="text-[12px] font-bold tracking-tight">Chuyến đi</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#F1B94C] shrink-0 shadow-2xs" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onTabChange('trips')}
            className="w-10 h-10 flex items-center justify-center text-[#657580] hover:text-[#0A1680] transition-colors rounded-full active:scale-90"
            aria-label="Chuyến đi"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </button>
        )}

        {/* 5. Tài khoản */}
        {activeTab === 'profile' ? (
          <button
            type="button"
            className="h-11 flex items-center space-x-1.5 px-3.5 rounded-full bg-[#0A1680] text-white shadow-xs shrink-0 active:scale-95 transition-all"
            aria-label="Tài khoản"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="text-[12px] font-bold tracking-tight">Tài khoản</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#F1B94C] shrink-0 shadow-2xs" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onTabChange('profile')}
            className="w-10 h-10 flex items-center justify-center text-[#657580] hover:text-[#0A1680] transition-colors rounded-full active:scale-90"
            aria-label="Tài khoản"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        )}
      </nav>
    </div>
  );
};
