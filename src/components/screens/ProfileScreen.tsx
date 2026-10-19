import React, { useState } from 'react';
import { IOSStatusBar } from '../common/IOSStatusBar';
import { BottomNav } from '../common/BottomNav';
import { NavTab, UserPreferences } from '../../types/travel';
import { useNavigate } from 'react-router-dom';
import { useTravel } from '../../features/travel/TravelContext';
import { images } from '../../features/travel/fixtures';
import { ChevronRight, MapPin, Check } from 'lucide-react';

interface ProfileScreenProps {
  userName: string;
  preferences: UserPreferences;
  onNavigateTab: (tab: NavTab) => void;
  onEditPreferences: () => void;
  onEditName?: () => void;
  onLogout: () => void;
  onOpenWishlist: () => void;
  onOpenSavedItems?: () => void;
  onOpenCommunityFeed?: () => void;
  isSimulatorMode: boolean;
  onToggleSimulatorMode: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  userName,
  preferences,
  onNavigateTab,
  onEditPreferences,
  onEditName,
  onLogout,
  onOpenWishlist,
  onOpenSavedItems,
  onOpenCommunityFeed,
  isSimulatorMode,
  onToggleSimulatorMode,
}) => {
  const [pushEnabled, setPushEnabled] = useState(true);
  const navigate = useNavigate();
  const { trips, tripStatuses, plan, accessFor, accessLimit } = useTravel();
  const access=accessFor(plan.id);
  const completedTrips = trips.filter(trip => tripStatuses[trip.id] === 'completed');

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#f8f9fb] text-slate-800 select-none">
      {/* iOS Status Bar */}
      <IOSStatusBar light={false} />

      {/* Scrollable Content */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar pb-28">
        {/* Profile Header */}
        <div className="bg-white px-5 pt-3 pb-6 border-b border-slate-100 flex flex-col items-center text-center">
        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-full bg-[#0A1680] text-white flex items-center justify-center text-2xl font-bold font-heading shadow-md ring-4 ring-blue-50">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#F1B94C] text-[#0A1680] flex items-center justify-center text-xs font-bold ring-2 ring-white shadow-xs">
            ★
          </div>
        </div>

        <button type="button" onClick={onEditName} aria-label="Đổi tên hồ sơ" className="text-[20px] font-bold text-slate-900 font-heading">{userName} <span className="text-[12px] text-slate-400">✎</span></button>
        <p className="text-[12px] text-slate-500 mt-0.5">Thành viên khám phá cao cấp • Gen Z Explorer</p>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-2 w-full mt-4 pt-4 border-t border-slate-100 text-center">
          <div className="cursor-pointer" onClick={() => onNavigateTab('trips')}>
            <span className="block text-[16px] font-bold text-[#0A1680] font-heading">{trips.length}</span>
            <span className="text-[11px] text-slate-400">Chuyến đi</span>
          </div>
          <div className="cursor-pointer" onClick={onOpenWishlist}>
            <span className="block text-[16px] font-bold text-[#0A1680] font-heading">32</span>
            <span className="text-[11px] text-slate-400">Đã lưu</span>
          </div>
          <div className="cursor-pointer" onClick={onOpenWishlist}>
            <span className="block text-[16px] font-bold text-[#0A1680] font-heading">4</span>
            <span className="text-[11px] text-slate-400">Bộ sưu tập</span>
          </div>
          <div>
            <span className="block text-[16px] font-bold text-[#0A1680] font-heading">12</span>
            <span className="text-[11px] text-slate-400">Đánh giá</span>
          </div>
        </div>
      </div>

      {/* Travel DNA Summary Card */}
      <div className="px-5 mt-4 space-y-4">
        <div className="profile-dna-card bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs text-left">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-base">🧭</span>
              <h2 className="text-[14px] font-bold text-slate-900 font-heading">
                DNA Du lịch cá nhân
              </h2>
            </div>
            <button
              onClick={onEditPreferences}
              type="button"
              className="text-[12px] font-bold text-[#0A1680] hover:underline cursor-pointer font-heading"
            >
              Chỉnh sửa
            </button>
          </div>

          <div className="flex items-center gap-2 mb-2 text-[11px]">
            <span className="rounded-full bg-[#0A1680] text-white px-2.5 py-1">{preferences.travelStyle}</span>
            <span className="text-slate-500">{preferences.timeOfDay.join(' · ')}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {preferences.interests.slice(0, 2).map(interest => (
              <span key={interest} className="rounded-lg bg-blue-50 px-2 py-1 text-[11px] text-[#0A1680]">{interest}</span>
            ))}
          </div>
          <details className="mt-2 text-[11px]">
            <summary className="cursor-pointer text-slate-500 py-1">Xem thêm DNA du lịch</summary>
            <div className="mt-2 space-y-2 border-t border-slate-100 pt-2">
              <p><span className="text-slate-400">Sở thích: </span>{preferences.interests.join(' · ') || 'Chưa chọn'}</p>
              <p><span className="text-slate-400">Ưu tiên: </span>{preferences.priorities.join(' · ') || 'Chưa chọn'}</p>
            </div>
          </details>
        </div>

        <section aria-labelledby="past-trips-title" className="text-left">
          <div className="flex items-center justify-between mb-3">
            <h2 id="past-trips-title" className="font-heading font-bold text-[15px] text-slate-900">Những chuyến đã đi</h2>
            <button type="button" onClick={() => onNavigateTab('trips')} className="text-[11px] font-semibold text-[#0A1680] flex items-center gap-0.5">Chuyến đi của tôi <ChevronRight size={14} /></button>
          </div>
          {completedTrips.length > 0 ? (
            <div className="space-y-2">
              {completedTrips.map(trip => (
                <button key={trip.id} type="button" onClick={() => navigate(`/trips/${encodeURIComponent(trip.id)}/memories`)} className="w-full flex items-center gap-3 rounded-2xl bg-white p-2 border border-slate-100 text-left">
                  <img src={trip.coverImage} alt={trip.destination} className="w-[76px] h-[76px] rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-emerald-700 flex items-center gap-1"><Check size={11} /> Đã hoàn tất</span>
                    <h3 className="font-heading font-bold text-[13px] mt-1">{trip.destination}</h3>
                    <p className="text-[11px] text-slate-500 mt-1">{trip.days} ngày · {trip.dates}</p>
                  </div>
                  <ChevronRight size={16} className="text-slate-400 mr-1" />
                </button>
              ))}
            </div>
          ) : (
            <>
              <p className="text-[11px] text-slate-500 mb-3">Chưa có chuyến hoàn tất. Khám phá bố cục với các chuyến mẫu bên dưới.</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'sample-dalat', name: 'Đà Lạt', image: images.dalatCabin, length: '3 ngày 2 đêm', highlights: 'Săn mây · Cà phê · Dạo hồ' },
                  { id: 'sample-phuquoc', name: 'Phú Quốc', image: images.resort, length: '4 ngày 3 đêm', highlights: 'Ngắm hoàng hôn · Biển đảo · Chợ đêm' },
                ].map(trip => (
                  <button type="button" key={trip.id} onClick={()=>navigate(`/trips/${trip.id}/memories`)} aria-label={`Xem kỷ niệm ${trip.name}`} className="rounded-2xl overflow-hidden bg-white border border-slate-100 text-left">
                      <div className="relative">
                        <img src={trip.image} alt={trip.name} className="w-full h-[100px] object-cover" />
                        <span className="absolute top-2 left-2 rounded-full bg-white/95 px-2 py-0.5 text-[9px] text-slate-600">Chuyến mẫu</span>
                      </div>
                      <div className="p-3">
                        <h3 className="font-heading font-bold text-[13px] flex items-center gap-1"><MapPin size={12} className="text-[#0A1680]" />{trip.name}</h3>
                        <p className="text-[11px] text-slate-500 mt-1">{trip.length}</p>
                        <span className="text-[10px] text-[#0A1680] mt-2 inline-block">Xem kỷ niệm ›</span>
                      </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </section>

        <button type="button" onClick={()=>navigate('/subscription')} className="profile-plan-card">
          <span className="profile-plan-icon">✦</span><span><b>Gói chuyến đi</b><small>{plan.destination} · {access.tier==='free'?'Miễn phí':access.tier==='solo'?'Solo':'Group'}</small><small>{access.used}/{accessLimit(access.tier)} lượt AI đã dùng</small></span><ChevronRight size={17}/>
        </button>
        {/* Settings List */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-2xs divide-y divide-slate-100 text-left">
          <div
            onClick={onOpenCommunityFeed}
            className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-base">🌐</span>
              <div>
                <span className="text-[13px] font-semibold text-slate-800 block">Cộng đồng TravAIy</span>
                <span className="text-[11px] text-slate-400">Bảng tin chia sẻ lịch trình & kinh nghiệm</span>
              </div>
            </div>
            <span className="text-slate-400 text-sm">›</span>
          </div>

          <div
            onClick={onOpenSavedItems}
            className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-base">🔖</span>
              <div>
                <span className="text-[13px] font-semibold text-slate-800 block">Mục đã lưu & Bộ sưu tập</span>
                <span className="text-[11px] text-slate-400">Bài viết, quán ăn và địa điểm check-in</span>
              </div>
            </div>
            <span className="text-slate-400 text-sm">›</span>
          </div>

          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-base">🔔</span>
              <span className="text-[13px] font-semibold text-slate-800">Thông báo chuyến đi</span>
            </div>
            <button
              type="button"
              onClick={() => setPushEnabled(!pushEnabled)}
              className={`w-11 h-6 px-0.5 rounded-full flex items-center transition-colors cursor-pointer ${
                pushEnabled ? 'bg-[#0A1680]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  pushEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div
            onClick={onToggleSimulatorMode}
            className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-base">📱</span>
              <span className="text-[13px] font-semibold text-slate-800">
                Khung iPhone Simulator ({isSimulatorMode ? 'Bật' : 'Toàn màn hình'})
              </span>
            </div>
            <span className="text-slate-400 text-sm">›</span>
          </div>

          <div className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-3">
              <span className="text-base">🌐</span>
              <span className="text-[13px] font-semibold text-slate-800">Ngôn ngữ</span>
            </div>
            <span className="text-[12px] font-semibold text-[#0A1680]">Tiếng Việt</span>
          </div>

          <div
            onClick={onLogout}
            className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-rose-50 transition-colors text-rose-600"
          >
            <div className="flex items-center gap-3">
              <span className="text-base">🚪</span>
              <span className="text-[13px] font-semibold">Đăng xuất</span>
            </div>
            <span className="text-rose-400 text-sm">›</span>
          </div>
        </div>
      </div>
      </div>

      {/* Floating Bottom Nav */}
      <BottomNav activeTab="profile" onTabChange={onNavigateTab} />
    </div>
  );
};
