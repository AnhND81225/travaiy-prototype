import React, { useState } from 'react';
import './TodayScheduleScreen.css';
import { ModalSheet } from '../common/ModalSheet';
import { IOSStatusBar } from '../common/IOSStatusBar';
import { BottomNav } from '../common/BottomNav';
import { NavTab } from '../../types/travel';

interface TodayScheduleScreenProps {
  onNavigateTab: (tab: NavTab) => void;
  onOpenAdaptive: () => void;
  onOpenExpenses: () => void;
  onOpenGroupSpace: () => void;
  onOpenGroupLocation: () => void;
  onOpenPlaceDetail?: (id: string) => void;
}

export const TodayScheduleScreen: React.FC<TodayScheduleScreenProps> = ({
  onNavigateTab,
  onOpenAdaptive,
  onOpenExpenses,
  onOpenGroupSpace,
  onOpenGroupLocation,
  onOpenPlaceDetail,
}) => {
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [showWeatherForecastSheet, setShowWeatherForecastSheet] = useState(false);
  const [showNotificationsSheet, setShowNotificationsSheet] = useState(false);
  const [showDestinationPicker, setShowDestinationPicker] = useState(false);
  const [showRouteOptions, setShowRouteOptions] = useState(false);
  const [showDelayPrompt, setShowDelayPrompt] = useState(false);
  const [showUtilitiesDrawer, setShowUtilitiesDrawer] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [showDelayBanner, setShowDelayBanner] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCheckin = () => {
    setIsCheckedIn(true);
    setShowDelayBanner(false);
    showToast('Đã đánh dấu đến Sơn Trà trong lịch mẫu.');
  };

  return (
    <div className="today-schedule relative w-full h-full flex flex-col overflow-hidden bg-[#FCFDFF] text-[#191c1e] antialiased select-none">
      {/* Header */}
      <header className="shrink-0 z-30 bg-white/90 backdrop-blur-xl border-b border-[#edeef0]">
        <IOSStatusBar light={false} />
        <div className="px-5 py-2.5 flex items-center justify-between">
          <button
            onClick={() => setShowDestinationPicker(true)}
            aria-label="Chọn điểm đến"
            className="flex items-center gap-2 min-h-[44px] text-left hover:opacity-80 transition-opacity cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-[#0A1680]/10 flex items-center justify-center shrink-0 text-[#0A1680]">
              📍
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-heading font-bold text-[18px] text-[#191c1e] leading-tight">
                  Đà Nẵng
                </span>
                <span className="text-xs text-slate-400">▾</span>
              </div>
              <p className="text-[11px] text-[#454652] leading-none mt-0.5">
                Lịch minh họa · Ngày 2
              </p>
            </div>
          </button>

          <button
            onClick={() => setShowNotificationsSheet(true)}
            aria-label="Thông báo"
            className="w-10 h-10 flex items-center justify-center rounded-full text-[#454652] hover:bg-slate-100 transition-colors relative cursor-pointer"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
            </svg>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="today-scroll flex-1 min-h-0 overflow-y-auto no-scrollbar px-5 pt-2 flex flex-col gap-3.5 pb-28">
        {/* Compact Weather Bar (Cao 54px) */}
        <div
          onClick={() => setShowWeatherForecastSheet(true)}
          role="button" tabIndex={0} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setShowWeatherForecastSheet(true);}}} aria-label="Xem thời tiết minh họa" className="today-weather px-3.5 rounded-[20px] bg-white border border-[#d8e2ff]/50 shadow-xs flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-full bg-[#ffdea8]/60 flex items-center justify-center shrink-0 text-xl">
              ☀️
            </div>
            <div className="min-w-0 flex items-baseline gap-2">
              <span className="text-[20px] font-bold leading-none tracking-tight text-[#0A1680] font-heading shrink-0">
                28°C
              </span>
              <p className="text-[12px] font-medium text-slate-800 today-wrap">
                Nắng · Chiều có mưa nhẹ
              </p>
            </div>
          </div>
          <span className="text-slate-400 text-xs">›</span>
        </div>

        {/* Adaptive Delay Warning Banner */}
        {showDelayBanner && (
          <div className="today-delay p-3.5 rounded-[20px] bg-gradient-to-r from-amber-50 via-white to-white border border-amber-200/80 shadow-xs flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-amber-700 text-sm">
                ⏱
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.2 rounded-full bg-rose-100 text-rose-600 font-bold text-[10px]">
                    Đã trễ 60 phút
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Lịch: 09:30 • Hiện tại: 10:30
                  </span>
                </div>
                <p className="text-[12px] text-slate-900 font-bold today-wrap mt-0.5 font-heading">
                  Bạn vẫn muốn đến Sơn Trà chứ?
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setShowDelayPrompt(true)}
                className="h-8 px-2.5 rounded-full bg-[#0A1680] text-white text-[11px] font-semibold flex items-center gap-1 shadow-xs hover:bg-[#071060] cursor-pointer font-heading"
              >
                <span>Tùy chọn</span>
                <span>›</span>
              </button>
              <button
                type="button"
                onClick={() => setShowDelayBanner(false)}
                aria-label="Ẩn nhắc trễ giờ" className="w-7 h-7 rounded-full text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Normal-flow layers keep controls separate even inside short device frames. */}
        <section className="today-hero" aria-label="Điểm đến đang xem">
          <img src="https://images.unsplash.com/photo-1570789210967-2cac24afeb00?auto=format&fit=crop&w=900&q=80" alt="Ảnh địa điểm minh họa" className="today-hero-image" />
          <div className="today-hero-scrim" aria-hidden="true" />
          <div className="today-hero-content">
            <div className="today-hero-badges">
              {showDelayBanner ? <button type="button" onClick={()=>setShowDelayPrompt(true)} className="today-hero-status">Trễ 60 phút · Tùy chọn</button> : <span className="today-hero-status neutral">{isCheckedIn?'Đã đánh dấu đến nơi':'Điểm đang xem'}</span>}
              <span className="today-hero-sample">Lịch mẫu</span>
            </div>
            <div className="today-hero-info">
              <h2>Bán đảo Sơn Trà</h2>
              <p>Khoảng 8 km · 20 phút di chuyển (mẫu)</p>
              <div className="today-hero-actions">
                <button type="button" onClick={handleCheckin} aria-pressed={isCheckedIn} className="today-checkin">{isCheckedIn?'✓ Đã đến nơi':'✓ Đánh dấu đến nơi'}</button>
                <button type="button" onClick={()=>setShowRouteOptions(true)} className="today-directions">Chỉ đường <span aria-hidden="true">↗</span></button>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline: Điểm tiếp theo hôm nay (2 chặng) */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-[#0A1680] font-bold text-sm">⏱</span>
              <h3 className="font-heading font-bold text-[15px] text-slate-900">
                Điểm tiếp theo hôm nay
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#0A1680] text-[11px] font-semibold">
              2 chặng
            </span>
          </div>

          {/* Stop 1 */}
          <div
            onClick={() => {
              if (onOpenPlaceDetail) onOpenPlaceDetail('tiem-tu-lung');
            }}
            className="flex items-center gap-3 p-3 rounded-[20px] bg-white border border-slate-200/80 shadow-xs hover:border-[#0A1680]/30 transition-all cursor-pointer"
          >
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80"
              alt="Bãi biển Mỹ Khê"
              className="w-16 h-16 rounded-[16px] object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-slate-900 font-heading">
                  15:00
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium">
                  Nghỉ ngơi
                </span>
              </div>
              <p className="text-[14px] font-bold text-slate-900 font-heading truncate mt-0.5">
                Bãi biển Mỹ Khê
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                Tắm biển, lướt ván & ngắm hoàng hôn
              </p>
            </div>
          </div>

          {/* Stop 2 */}
          <div
            onClick={() => onOpenGroupSpace()}
            className="flex items-center gap-3 p-3 rounded-[20px] bg-white border border-slate-200/80 shadow-xs hover:border-[#0A1680]/30 transition-all cursor-pointer"
          >
            <img
              src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=200&q=80"
              alt="Ăn tối cùng nhóm"
              className="w-16 h-16 rounded-[16px] object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[12px] font-bold text-slate-900 font-heading">
                    19:00
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                    Cả nhóm
                  </span>
                </div>
                <div className="flex -space-x-1.5">
                  <div className="w-5 h-5 rounded-full bg-[#0A1680] text-white text-[9px] flex items-center justify-center font-bold ring-1 ring-white">MA</div>
                  <div className="w-5 h-5 rounded-full bg-sky-500 text-white text-[9px] flex items-center justify-center font-bold ring-1 ring-white">LC</div>
                  <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-900 text-[9px] flex items-center justify-center font-bold ring-1 ring-white">+4</div>
                </div>
              </div>
              <p className="text-[14px] font-bold text-slate-900 font-heading truncate mt-0.5">
                Ăn tối cùng nhóm
              </p>
              <p className="text-[11px] text-slate-500 truncate">
                Hải sản Năm Đảnh & ngắm Cầu Rồng phun lửa
              </p>
            </div>
          </div>

          {/* Toggle Full Schedule Accordion */}
          <button
            type="button"
            onClick={() => setShowFullSchedule(!showFullSchedule)}
            className="w-full py-2.5 px-4 rounded-xl bg-white border border-slate-200/80 text-slate-600 hover:text-[#0A1680] transition-colors flex items-center justify-center gap-1.5 text-[12px] font-semibold cursor-pointer shadow-xs"
          >
            <span>{showFullSchedule ? 'Thu gọn lịch trình' : 'Xem toàn bộ lịch trình ngày 2 (5 điểm)'}</span>
            <span className={`transform transition-transform ${showFullSchedule ? 'rotate-180' : ''}`}>▾</span>
          </button>

          {/* Full Schedule List Drawer */}
          {showFullSchedule && (
            <div className="space-y-2 pt-1">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3 text-xs">
                <span className="font-bold text-[#0A1680] px-2 py-0.5 rounded-full bg-blue-100">08:00</span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-800 truncate">Cà phê sáng & điểm tâm Cầu Rồng</p>
                  <p className="text-[11px] text-slate-400 truncate">Bún chả cá & Cà phê muối</p>
                </div>
                <span className="text-[10px] text-slate-400">Đã qua</span>
              </div>
              <div className="p-3 rounded-xl bg-blue-50/60 border border-[#0A1680]/20 flex items-center gap-3 text-xs">
                <span className="font-bold text-white px-2 py-0.5 rounded-full bg-[#0A1680]">10:30</span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-[#0A1680] truncate">Bán đảo Sơn Trà & Chùa Linh Ứng</p>
                  <p className="text-[11px] text-slate-500 truncate">Đang diễn ra • Đỉnh Bàn Cờ</p>
                </div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Hiện tại</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3 text-xs">
                <span className="font-bold text-[#0A1680] px-2 py-0.5 rounded-full bg-blue-100">12:30</span>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-slate-800 truncate">Ăn trưa Bánh tráng thịt heo Đại Lộc</p>
                  <p className="text-[11px] text-slate-400 truncate">Đặc sản Đà Nẵng</p>
                </div>
                <span className="text-[10px] text-slate-400">Kế tiếp</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Trip Utilities Accordion */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowUtilitiesDrawer(!showUtilitiesDrawer)}
            className="w-full p-4 rounded-[20px] bg-gradient-to-br from-blue-100/70 via-sky-50 to-white border border-blue-200/50 shadow-xs flex items-center justify-between text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0A1680] text-white flex items-center justify-center shadow-xs text-base">
                ⚡
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[14px] text-slate-900 font-heading">
                    Tiện ích chuyến đi
                  </span>
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                </div>
                <p className="text-[11px] text-slate-500">
                  Đổi lịch, Tìm quán ăn, Chia sẻ vị trí, Chi tiêu
                </p>
              </div>
            </div>
            <span className="text-slate-400">›</span>
          </button>

          {showUtilitiesDrawer && (
            <div className="mt-2.5 p-3 rounded-[20px] bg-white border border-slate-200/80 shadow-md grid grid-cols-4 gap-2 text-center">
              <button
                type="button"
                onClick={onOpenAdaptive}
                className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-[#0A1680] text-sm">
                  📅
                </div>
                <span className="text-[11px] font-semibold text-slate-800">Đổi lịch</span>
              </button>

              <button
                type="button"
                onClick={() => showToast('Đang tìm quán ăn ngon gần Sơn Trà & Mỹ Khê 🍜')}
                className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-sm">
                  🍴
                </div>
                <span className="text-[11px] font-semibold text-slate-800">Ăn uống</span>
              </button>

              <button
                type="button"
                onClick={onOpenGroupLocation}
                className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-sm">
                  📍
                </div>
                <span className="text-[11px] font-semibold text-slate-800">Vị trí</span>
              </button>

              <button
                type="button"
                onClick={onOpenExpenses}
                className="flex flex-col items-center gap-1 p-2 rounded-xl hover:bg-slate-50 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-sm">
                  💳
                </div>
                <span className="text-[11px] font-semibold text-slate-800">Chi tiêu</span>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* POPUP 1: Weather Forecast Bottom Sheet */}
      <ModalSheet isOpen={showWeatherForecastSheet} onClose={()=>setShowWeatherForecastSheet(false)} title="Thời tiết minh họa" showHandleBar={false} contentClassName="today-sheet">
          <div className="today-sheet-content relative w-full bg-white rounded-t-[28px] p-5 pb-8 shadow-2xl flex flex-col gap-3.5 z-10 animate-in slide-in-from-bottom duration-200">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto shrink-0" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-xl">
                  ☀️
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-slate-900 font-heading">
                    Thời tiết Đà Nẵng (mẫu)
                  </h3>
                  <p className="text-[11px] text-slate-500">Dữ liệu minh họa · chưa nối dịch vụ thời tiết</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowWeatherForecastSheet(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div>
                <span className="text-[34px] font-extrabold text-[#0A1680] leading-none font-heading">
                  28°C
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">Cảm giác như 31°C</p>
              </div>
              <div className="text-right text-[11px] text-slate-500 space-y-1">
                <div>Độ ẩm: <strong className="text-slate-800">76%</strong></div>
                <div>Gió biển: <strong className="text-slate-800">14 km/h</strong></div>
                <div>UV: <strong className="text-amber-600">6 (Cao)</strong></div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block">12:00</span>
                <span className="font-bold text-slate-800 block my-0.5">31°C</span>
                <span className="text-[10px] text-slate-500">Nắng</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block">15:00</span>
                <span className="font-bold text-slate-800 block my-0.5">29°C</span>
                <span className="text-[10px] text-blue-600 font-semibold">Mưa nhẹ</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block">18:00</span>
                <span className="font-bold text-slate-800 block my-0.5">27°C</span>
                <span className="text-[10px] text-slate-500">Mát dịu</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 block">21:00</span>
                <span className="font-bold text-slate-800 block my-0.5">25°C</span>
                <span className="text-[10px] text-slate-500">Gió nhẹ</span>
              </div>
            </div>
          </div>
      </ModalSheet>

      {/* POPUP 2: Route Options Sheet (Chỉ đường: Bán đảo Sơn Trà) */}
      <ModalSheet isOpen={showRouteOptions} onClose={()=>setShowRouteOptions(false)} title="Tùy chọn chỉ đường" showHandleBar={false} contentClassName="today-sheet">
          <div className="today-sheet-content relative w-full bg-white rounded-t-[28px] p-5 pb-8 shadow-2xl flex flex-col gap-3.5 z-10 animate-in slide-in-from-bottom duration-200">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto shrink-0" />
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[16px] font-bold text-slate-900 font-heading">
                  Chỉ đường: Bán đảo Sơn Trà
                </h3>
                <p className="text-[11px] text-slate-500">Khoảng cách minh họa: 8 km. Chưa dùng vị trí thực.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowRouteOptions(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <div
                onClick={() => {
                  showToast('Đã chọn điều hướng bằng Ô tô / Grab Car 🚗');
                  setShowRouteOptions(false);
                }}
                className="p-3.5 rounded-2xl bg-blue-50/50 border-2 border-[#0A1680] flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚗</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[13px] text-slate-900 font-heading">Ô tô / Grab Car</span>
                      <span className="px-2 py-0.2 rounded-full bg-blue-100 text-[#0A1680] text-[10px] font-bold">Nhanh nhất</span>
                    </div>
                    <p className="text-[11px] text-slate-500">15 phút • Đường Hoàng Sa ven biển</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[13px] text-slate-900 font-heading">85.000đ</span>
                  <p className="text-[10px] text-slate-400">Ước tính</p>
                </div>
              </div>

              <div
                onClick={() => {
                  showToast('Đã chọn điều hướng bằng Xe máy 🛵');
                  setShowRouteOptions(false);
                }}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🛵</span>
                  <div>
                    <span className="font-bold text-[13px] text-slate-900 font-heading">Xe máy / Thuê xe</span>
                    <p className="text-[11px] text-slate-500">18 phút • Thích hợp ngắm cảnh</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-[13px] text-slate-900 font-heading">35.000đ</span>
                  <p className="text-[10px] text-slate-400">Xăng xe</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  showToast('Đang mở bản đồ Google Maps...');
                  setShowRouteOptions(false);
                }}
                className="flex-1 h-11 rounded-full border border-[#0A1680] text-[#0A1680] font-heading font-bold text-xs hover:bg-blue-50 cursor-pointer"
              >
                Mở Google Maps
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast('Bắt đầu điều hướng đến Bán đảo Sơn Trà! 🧭');
                  setShowRouteOptions(false);
                }}
                className="flex-1 h-11 rounded-full bg-[#0A1680] text-white font-heading font-bold text-xs shadow-md hover:bg-[#071060] cursor-pointer"
              >
                Bắt đầu đi
              </button>
            </div>
          </div>
      </ModalSheet>

      {/* POPUP 3: Delay Prompt Modal */}
      <ModalSheet isOpen={showDelayPrompt} onClose={()=>setShowDelayPrompt(false)} title="Tùy chọn khi trễ giờ" showHandleBar={false} contentClassName="today-sheet">
          <div className="today-sheet-content relative w-full bg-white rounded-t-[28px] p-5 pb-8 shadow-2xl flex flex-col gap-3.5 z-10 animate-in slide-in-from-bottom duration-200">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto shrink-0" />
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold">
                <span>⏱ Đã trễ 60 phút • Dự kiến 09:30</span>
              </div>
              <button
                type="button"
                onClick={() => setShowDelayPrompt(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div>
              <h3 className="text-[17px] font-bold text-slate-900 font-heading">
                Bạn vẫn muốn đến Sơn Trà chứ?
              </h3>
              <p className="text-[12px] text-slate-500 mt-1">
                Xem trước phương án điều chỉnh thời gian trước khi áp dụng vào lịch trình.
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowDelayPrompt(false);
                  onOpenAdaptive();
                }}
                className="w-full h-12 rounded-full bg-[#0A1680] text-white font-heading font-bold text-xs shadow-sm hover:bg-[#071060] cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Vẫn muốn đi (Dời lịch 30 phút)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDelayPrompt(false);
                  setShowDelayBanner(false);
                  showToast('Đã bỏ qua Sơn Trà, chuyển thẳng đến Bãi biển Mỹ Khê! 🏖️');
                }}
                className="w-full h-11 rounded-full border border-slate-200 bg-white text-slate-700 font-heading font-semibold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Bỏ qua điểm này
              </button>
            </div>
          </div>
      </ModalSheet>

      {/* POPUP 4: Notifications Sheet */}
      <ModalSheet isOpen={showNotificationsSheet} onClose={()=>setShowNotificationsSheet(false)} title="Thông báo hành trình" showHandleBar={false} contentClassName="today-sheet">
          <div className="today-sheet-content relative w-full bg-white rounded-t-[28px] p-5 pb-8 shadow-2xl flex flex-col gap-3.5 z-10 animate-in slide-in-from-bottom duration-200">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto shrink-0" />
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-bold text-slate-900 font-heading">
                  Thông báo hành trình
                </h3>
                <span className="px-2 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                  2 mới
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowNotificationsSheet(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 max-h-[50vh] overflow-y-auto">
              <div className="p-3.5 rounded-2xl bg-white border-l-4 border-l-[#0A1680] border border-slate-100 shadow-xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#0A1680]">15:00 • Lịch trình tiếp theo</span>
                  <span className="text-[10px] text-slate-400">10 phút trước</span>
                </div>
                <p className="font-bold text-slate-900 text-[13px] mt-1 font-heading">
                  Nhắc nhở: Di chuyển đến Bãi biển Mỹ Khê
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Thời gian di chuyển ước tính 20 phút từ Sơn Trà. Hãy chuẩn bị đồ bơi và kem chống nắng!
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border-l-4 border-l-sky-500 border border-slate-100 shadow-xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-sky-600">12:00 • Dự báo thời tiết</span>
                  <span className="text-[10px] text-slate-400">1 giờ trước</span>
                </div>
                <p className="font-bold text-slate-900 text-[13px] mt-1 font-heading">
                  Chiều có mưa nhẹ tại Sơn Trà
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Mưa có thể kéo dài tầm 30-40 phút quanh khu vực Chùa Linh Ứng. Bạn nên căn thời gian tham quan.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowNotificationsSheet(false)}
              className="w-full py-2.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-heading hover:bg-slate-200 cursor-pointer"
            >
              Đóng
            </button>
          </div>
      </ModalSheet>

      {/* POPUP 5: Destination Picker Sheet */}
      <ModalSheet isOpen={showDestinationPicker} onClose={()=>setShowDestinationPicker(false)} title="Chọn chuyến đi" showHandleBar={false} contentClassName="today-sheet">
          <div className="today-sheet-content relative w-full bg-white rounded-t-[28px] p-5 pb-8 shadow-2xl flex flex-col gap-3.5 z-10 animate-in slide-in-from-bottom duration-200">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto shrink-0" />
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <h3 className="text-[16px] font-bold text-slate-900 font-heading">
                Chọn chuyến đi của bạn
              </h3>
              <button
                type="button"
                onClick={() => setShowDestinationPicker(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <div
                onClick={() => setShowDestinationPicker(false)}
                className="p-3.5 rounded-2xl bg-blue-50/70 border-2 border-[#0A1680] flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0A1680] text-white flex items-center justify-center font-bold">
                    📍
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[13px] text-slate-900 font-heading">Đà Nẵng (Hiện tại)</span>
                      <span className="px-2 py-0.2 rounded-full bg-[#0A1680] text-white text-[9px] font-bold">Đang đi</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Lịch minh họa • 6 thành viên mẫu</p>
                  </div>
                </div>
                <span className="text-[#0A1680] font-bold">✓</span>
              </div>

              <div
                onClick={() => {
                  showToast('Chuyển sang chuyến đi Phú Quốc 4N3Đ 🌴');
                  setShowDestinationPicker(false);
                }}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold">
                    📍
                  </div>
                  <div>
                    <span className="font-bold text-[13px] text-slate-900 font-heading">Phú Quốc 4N3Đ</span>
                    <p className="text-[11px] text-slate-500">Khởi hành 28/07 • Đã lập kế hoạch</p>
                  </div>
                </div>
                <span className="text-xs text-[#0A1680] font-bold">Chọn</span>
              </div>
            </div>
          </div>
      </ModalSheet>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-slate-900/90 backdrop-blur-md text-white text-xs font-semibold shadow-lg animate-in fade-in zoom-in duration-200">
          {toastMessage}
        </div>
      )}

      {/* Floating Capsule Dock */}
      <BottomNav activeTab="trips" onTabChange={onNavigateTab} />
    </div>
  );
};
