import React, { useState, useRef } from 'react';
import { ScreenId } from '../../types/travel';
import { useModalA11y } from './useModalA11y';

interface DeviceFrameProps {
  children: React.ReactNode;
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  isSimulatorMode: boolean;
  onToggleSimulatorMode: () => void;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  children,
  currentScreen,
  onSelectScreen,
  isSimulatorMode,
  onToggleSimulatorMode,
}) => {
  const [showScreenDrawer, setShowScreenDrawer] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useModalA11y({
    isOpen: showScreenDrawer,
    onClose: () => setShowScreenDrawer(false),
    modalRef: drawerRef,
  });

  const screenList: { id: ScreenId; label: string; tag: string }[] = [
    {id:'stays',label:'46. Khám phá chỗ ở',tag:'Chỗ ở'},
    {id:'stay-detail',label:'47. Chi tiết chỗ ở',tag:'Chỗ nghỉ'},
    {id:'memory-map',label:'48. Bản đồ kỷ niệm Việt Nam',tag:'Bản đồ ảnh'},
    { id: 'welcome', label: '01. Welcome (Màn hình chào & Đăng nhập)', tag: 'Khởi đầu' },
    { id: 'onboarding-1', label: '02. Bước 1/4: Sở thích du lịch', tag: 'Sở thích' },
    { id: 'onboarding-2', label: '03. Bước 2/4: Phong cách du lịch', tag: 'Phong cách' },
    { id: 'onboarding-3', label: '04. Bước 3/4: Ưu tiên chuyến đi', tag: 'Ưu tiên' },
    { id: 'onboarding-4', label: '05. Bước 4/4: Thời điểm trong ngày', tag: 'Thời điểm' },
    { id: 'onboarding-complete', label: '06. Hoàn tất hồ sơ cá nhân', tag: 'Hoàn thành' },
    { id: 'home', label: '07. Trang chủ (10_Home)', tag: 'Trang chủ' },
    { id: 'explore', label: '08. Khám phá (04_Explore)', tag: 'Khám phá' },
    { id: 'map', label: '09. Bản đồ tương tác (03_Map)', tag: 'Bản đồ' },
    { id: 'place-detail', label: '10. Chi tiết địa điểm (Tú Lưng)', tag: 'Chi tiết' },
    { id: 'search', label: '11. Tìm kiếm & Bộ lọc (05_Filter)', tag: 'Bộ lọc' },
    { id: 'wishlist', label: '12. Travel Wishlist & Bộ sưu tập', tag: 'Wishlist' },
    { id: 'wizard-destination', label: 'Chọn thành phố (Bước 1/8)', tag: 'Wizard 1' },
    { id: 'wizard-places', label: 'Chọn địa điểm yêu thích (Bước 2/8)', tag: 'Chọn địa điểm' },
    { id: 'wizard-dates', label: 'Ngày & giờ (Bước 3/8)', tag: 'Wizard 3' },
    { id: 'wizard-companions', label: 'Đồng hành (Bước 4/8)', tag: 'Wizard 4' },
    { id: 'wizard-budget', label: 'Ngân sách (Bước 5/8)', tag: 'Wizard 5' },
    { id: 'wizard-stay', label: 'Khách sạn (Bước 6/8)', tag: 'Khách sạn' },
    { id: 'wizard-preferences', label: 'Sở thích (Tùy chọn)', tag: 'Sở thích' },
    { id: 'wizard-summary', label: 'Chọn cách lên lịch (Bước 7/8)', tag: 'Wizard 7' },
    { id: 'ai-generating', label: '19. AI đang tạo lịch trình (Animation)', tag: 'AI Tạo' },
    { id: 'trip-overview', label: '20. Tổng quan chuyến đi (Đà Nẵng 3N2Đ)', tag: 'Tổng quan' },
    { id: 'day-itinerary', label: '21. Lịch trình chi tiết theo ngày', tag: 'Theo ngày' },
    { id: 'itinerary-edit', label: '22. Chỉnh sửa & Tối ưu lộ trình', tag: 'Sửa lịch' },
    { id: 'trip-preparation', label: '23. Chuẩn bị trước chuyến đi', tag: 'Chuẩn bị' },
    { id: 'packing-list', label: '24. Danh sách hành lý thông minh', tag: 'Hành lý' },
    { id: 'today-schedule', label: '25. Lịch trình hôm nay (Live Companion)', tag: 'Hôm nay' },
    { id: 'adaptive-schedule', label: '26. Điều chỉnh AI (Thời tiết & Hoãn giờ)', tag: 'AI Đổi Lịch' },
    { id: 'group-space', label: '27. Không gian nhóm & Trung tâm điều phối', tag: 'Nhóm' },
    { id: 'group-poll', label: '28. Bình chọn nhóm (Biểu quyết ăn uống & chơi)', tag: 'Bình chọn' },
    { id: 'group-location', label: '29. Vị trí nhóm & Radar thời gian thực', tag: 'Radar vị trí' },
    { id: 'group-expense-split', label: '30. Chia tiền nhóm & Quyết toán công bằng', tag: 'Chia tiền' },
    { id: 'trip-expenses', label: '31. Quản lý chi tiêu & Ngân sách chuyến đi', tag: 'Chi tiêu' },
    { id: 'photobooth', label: '32. Photobooth & Chụp ảnh lưu niệm du lịch', tag: 'Photobooth' },
    { id: 'journal-album', label: '33. Nhật ký & Album chuyến đi', tag: 'Nhật ký' },
    { id: 'create-recap', label: '34. Tạo Video Recap & Kỷ niệm (Bước 2/3)', tag: 'Tạo Recap' },
    { id: 'trip-recap-final', label: '35. AI Story Recap & Xuất bản (Bước 3/3)', tag: 'Story Recap' },
    { id: 'community-feed', label: '36. Cộng đồng du lịch (TravAIy Feed)', tag: 'Cộng đồng' },
    { id: 'create-post', label: '37. Đăng bài chia sẻ chuyến đi', tag: 'Đăng bài' },
    { id: 'saved-items', label: '38. Bài viết & Địa điểm đã lưu', tag: 'Đã lưu' },
    { id: 'travel-wallet', label: '39. Ví giấy tờ du lịch (60_TravelWallet)', tag: 'Ví giấy tờ' },
    { id: 'add-travel-document', label: '40. Thêm giấy tờ mới (61_AddDocument)', tag: 'Thêm vé' },
    { id: 'travel-document-detail', label: '41. Chi tiết vé máy bay (62_BoardingPass)', tag: 'Vé bay' },
    { id: 'trip-subscription', label: '42. Gói chuyến đi & Nâng cấp (50_Subscription)', tag: 'Gói chuyến' },
    { id: 'ai-itinerary-proposal', label: '43. Đề xuất lịch trình từ AI (Proposal Draft)', tag: 'Bản nháp AI' },
    { id: 'adaptive-preview-skip', label: '44. Xem trước điều chỉnh (Bỏ Sơn Trà)', tag: 'Bỏ điểm trễ' },
    { id: 'profile', label: '45. Tài khoản & DNA Du lịch', tag: 'Tài khoản' },
  ];

  return (
    <div className="relative w-full h-[100dvh] sm:h-screen bg-gradient-to-br from-[#EBF2FE] via-[#F4F7FD] to-[#FEF8E7] flex flex-col items-center justify-start sm:justify-center p-0 sm:py-2 sm:px-4 overflow-hidden">
      {/* Decorative Brand Gradient Orbs based on Mascot Colors */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="hidden sm:block absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-[#93B2F8]/25 blur-3xl" />
        <div className="hidden sm:block absolute -bottom-32 -right-32 w-[420px] h-[420px] rounded-full bg-[#FBEDB0]/45 blur-3xl" />
        <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-white/40 blur-2xl" />
      </div>

      {/* Top Floating Dev & Navigator Toolbar */}
      <aside
        aria-label="Dev Toolbar"
        className="w-full max-w-[480px] shrink-0 px-2 py-1.5 sm:mb-2 sm:px-3 flex items-center justify-between gap-2 z-40 bg-white/85 sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none border-b sm:border-none border-slate-200/80"
      >
        <div className="flex items-center gap-1.5">
          {/* Brand Tag */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white shadow-2xs border border-slate-200">
            <img src="/images/app-icon-dark.png" alt="TravAly" className="w-4 h-4 rounded-md object-contain" />
            <span className="text-[11px] sm:text-[12px] font-bold text-[#0A1680] font-heading">
              TravAly
            </span>
          </div>

          {/* Quick Jump Dropdown Trigger */}
          <button
            type="button"
            onClick={() => setShowScreenDrawer(!showScreenDrawer)}
            aria-expanded={showScreenDrawer}
            aria-haspopup="dialog"
            className="px-2.5 py-1 rounded-full bg-[#0A1680] text-white text-[11px] sm:text-[12px] font-bold shadow-2xs hover:bg-[#071060] transition-colors flex items-center gap-1 font-heading cursor-pointer active:scale-95"
          >
            <span>📱 {screenList.find((s) => s.id === currentScreen)?.tag || 'Menu'}</span>
            <span className="text-xs">▾</span>
          </button>
        </div>

        {/* Simulator Frame Toggle */}
        <button
          type="button"
          onClick={onToggleSimulatorMode}
          className="px-2.5 py-1 rounded-full bg-white text-slate-700 text-[11px] sm:text-[12px] font-semibold shadow-2xs border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-1 font-heading cursor-pointer active:scale-95 shrink-0"
        >
          <span>{isSimulatorMode ? '🔍 Xem to' : '📱 Khung iPhone'}</span>
        </button>
      </aside>

      {/* Screen Drawer Modal / Dropdown */}
      {showScreenDrawer && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Danh sách màn hình giao diện"
          ref={drawerRef}
          className="fixed inset-0 z-50 flex items-start justify-center pt-14 px-3 sm:pt-16 sm:px-4"
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setShowScreenDrawer(false)}
            aria-hidden="true"
          />
          <div className="relative bg-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-slate-200 max-w-md w-full max-h-[82vh] overflow-y-auto no-scrollbar text-left z-10 animate-in slide-in-from-top duration-200">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-2.5">
              <h2 className="text-[15px] sm:text-[16px] font-bold text-[#0A1680] font-heading">
                Danh sách màn hình giao diện
              </h2>
              <button
                type="button"
                aria-label="Đóng danh sách màn hình"
                onClick={() => setShowScreenDrawer(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="space-y-1">
              {screenList.map((screen) => {
                const isSelected = currentScreen === screen.id;
                return (
                  <button
                    key={screen.id}
                    type="button"
                    onClick={() => {
                      onSelectScreen(screen.id);
                      setShowScreenDrawer(false);
                    }}
                    className={`w-full text-left p-2 rounded-xl text-[12px] sm:text-[13px] font-semibold transition-all flex items-center justify-between cursor-pointer font-heading ${
                      isSelected
                        ? 'bg-[#0A1680] text-white shadow-2xs'
                        : 'hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <span className="truncate pr-2">{screen.label}</span>
                    <span
                      className={`text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-md shrink-0 ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {screen.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* iPhone Device Simulator Frame or Full Screen */}
      <main
        className={`w-full flex-1 sm:flex-initial transition-all duration-300 relative [transform:translateZ(0)] isolate travel-device overflow-hidden flex flex-col justify-between ${
          isSimulatorMode
            ? 'sm:w-[390px] sm:max-w-[390px] sm:h-[844px] sm:max-h-[calc(100vh-70px)] bg-[#FCFDFF] sm:rounded-[48px] shadow-2xl sm:border-[8px] sm:border-slate-900'
            : 'sm:w-[480px] sm:max-w-[480px] sm:h-[844px] sm:max-h-[calc(100vh-70px)] bg-[#FCFDFF] sm:rounded-3xl shadow-xl sm:border sm:border-slate-200'
        }`}
      >
        {children}
      </main>
    </div>
  );
};
