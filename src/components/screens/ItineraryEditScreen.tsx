import React, { useState } from 'react';
import { IOSStatusBar } from '../common/IOSStatusBar';
import { ModalSheet } from '../common/ModalSheet';
import { TripDayItem, TripPlan } from '../../types/travel';
import { useTravel } from '../../features/travel/TravelContext';
import { STAYS } from '../../features/travel/fixtures';
import { optimizePlan } from '../../features/travel/model';

interface ItineraryEditScreenProps {
  initialDay?: number;
  onSave: (updatedPlan: TripPlan) => void;
  onCancel: () => void;
}

export const ItineraryEditScreen: React.FC<ItineraryEditScreenProps> = ({
  initialDay = 1,
  onSave,
  onCancel,
}) => {
  const [activeDay, setActiveDay] = useState<number>(initialDay);
  const {plan:activePlan} = useTravel();
  const [tripPlan, setTripPlan] = useState<TripPlan>(activePlan);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlaceName, setNewPlaceName] = useState('');
  const [newPlaceCategory, setNewPlaceCategory] = useState('Tham quan');
  const [newPlaceTime, setNewPlaceTime] = useState('16:00');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const currentDayIndex = tripPlan.daysSchedule.findIndex((d) => d.dayNumber === activeDay);
  const currentDay = tripPlan.daysSchedule[currentDayIndex] || tripPlan.daysSchedule[0];

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...currentDay.items];
    const temp = newItems[index - 1];
    newItems[index - 1] = newItems[index];
    newItems[index] = temp;

    updateDayItems(newItems);
    showToast('Đã đổi thứ tự hoạt động');
  };

  const handleMoveDown = (index: number) => {
    if (index === currentDay.items.length - 1) return;
    const newItems = [...currentDay.items];
    const temp = newItems[index + 1];
    newItems[index + 1] = newItems[index];
    newItems[index] = temp;

    updateDayItems(newItems);
    showToast('Đã đổi thứ tự hoạt động');
  };

  const handleDeleteItem = (itemId: string) => {
    const newItems = currentDay.items.filter((i) => i.id !== itemId);
    updateDayItems(newItems);
    showToast('Đã xóa hoạt động khỏi ngày');
  };

  const updateDayItems = (newItems: TripDayItem[]) => {
    setTripPlan((prev) => ({
      ...prev,
      daysSchedule: prev.daysSchedule.map((d) =>
        d.dayNumber === activeDay ? { ...d, items: newItems } : d
      ),
    }));
  };

  const handleOptimizeAI = () => {
    const stay = STAYS.find(s=>s.id===activePlan.stayId);
    if(!stay){showToast('Chọn chỗ ở trong Tổng quan trước khi gợi ý thứ tự.');return;}
    setTripPlan(optimizePlan(tripPlan,stay));
    showToast('Đã gợi ý theo khoảng cách. Giữ giờ ăn; lưu để áp dụng.');
  };

  const handleAddActivity = () => {
    if (!newPlaceName.trim()) {
      showToast('Vui lòng nhập tên địa điểm!');
      return;
    }

    const newItem: TripDayItem = {
      id: `custom-${Date.now()}`,
      time: newPlaceTime,
      placeName: newPlaceName,
      category: newPlaceCategory,
      note: 'Địa điểm do bạn thêm vào lịch trình',
      cost: '100.000đ',
      duration: '1.5 giờ',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      address: 'Đà Nẵng',
    };

    const newItems = [...currentDay.items, newItem].sort((a, b) => a.time.localeCompare(b.time));
    updateDayItems(newItems);
    setNewPlaceName('');
    setShowAddModal(false);
    showToast(`Đã thêm "${newPlaceName}" vào Ngày ${activeDay}! 🎉`);
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#FCFDFF] select-none text-slate-800">
      {/* Header */}
      <header className="shrink-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <IOSStatusBar light={false} />
        <div className="h-14 px-5 flex items-center justify-between">
          <button
            onClick={onCancel}
            type="button"
            className="text-sm font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Hủy
          </button>
          
          <h1 className="font-bold text-[16px] text-slate-900 font-heading">
            Chỉnh sửa lịch trình
          </h1>

          <button
            onClick={() => onSave(tripPlan)}
            type="button"
            className="px-3.5 py-1.5 rounded-full bg-[#0A1680] text-white text-[12px] font-bold shadow-xs hover:bg-[#071060] transition-colors font-heading cursor-pointer"
          >
            Lưu
          </button>
        </div>

        {/* Day Switcher */}
        <div className="px-5 pb-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {tripPlan.daysSchedule.map((d) => (
            <button
              key={d.dayNumber}
              type="button"
              onClick={() => setActiveDay(d.dayNumber)}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold transition-all cursor-pointer font-heading ${
                activeDay === d.dayNumber
                  ? 'bg-[#0A1680] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Ngày {d.dayNumber} ({d.items.length} điểm)
            </button>
          ))}
        </div>
      </header>

      {/* Main Edit Body */}
      <main className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-5 pt-3 space-y-3 pb-24">
        {/* AI Auto Optimization Banner */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-200/80 flex items-center justify-between">
          <div>
            <span className="text-[12px] font-bold text-[#0A1680] font-heading block">
              ✦ Gợi ý từ chỗ ở
            </span>
            <span className="text-[10px] text-slate-500">
              Gợi ý theo khoảng cách ước tính; giữ giờ ăn.
            </span>
          </div>
          <button
            onClick={handleOptimizeAI}
            type="button"
            className="px-3 py-1.5 rounded-xl bg-white text-[#0A1680] text-[11px] font-bold font-heading border border-[#0A1680]/20 shadow-xs hover:bg-blue-50 cursor-pointer"
          >
            Gợi ý thứ tự
          </button>
        </div>

        {/* Editable Items */}
        <div className="space-y-2.5">
          {currentDay.items.map((item, index) => (
            <div
              key={item.id}
              className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-2.5"
            >
              {/* Up / Down Order Buttons */}
              <div className="flex flex-col gap-1 text-slate-400">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => handleMoveUp(index)}
                  className="w-6 h-6 rounded flex items-center justify-center hover:bg-slate-100 disabled:opacity-20 cursor-pointer"
                >
                  ▲
                </button>
                <button
                  type="button"
                  disabled={index === currentDay.items.length - 1}
                  onClick={() => handleMoveDown(index)}
                  className="w-6 h-6 rounded flex items-center justify-center hover:bg-slate-100 disabled:opacity-20 cursor-pointer"
                >
                  ▼
                </button>
              </div>

              {/* Thumbnail */}
              {item.image && (
                <img
                  src={item.image}
                  alt={item.placeName}
                  className="w-14 h-14 rounded-xl object-cover shrink-0"
                />
              )}

              {/* Item Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="px-1.5 py-0.2 rounded bg-slate-100 font-mono text-[10px] font-bold text-slate-700">
                    {item.time}
                  </span>
                  <span className="text-[10px] font-semibold text-amber-700">
                    {item.category}
                  </span>
                </div>
                <h4 className="font-bold text-[13px] text-slate-900 truncate font-heading">
                  {item.placeName}
                </h4>
                <span className="text-[10px] text-slate-400">
                  {item.duration} • {item.cost || 'Miễn phí'}
                </span>
              </div>

              {/* Delete Button */}
              <button
                type="button"
                onClick={() => handleDeleteItem(item.id)}
                className="w-8 h-8 rounded-full text-rose-500 hover:bg-rose-50 flex items-center justify-center cursor-pointer transition-colors"
                title="Xóa địa điểm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Add Activity Button */}
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="w-full py-3 rounded-2xl border border-dashed border-[#0A1680]/40 bg-white text-[#0A1680] text-[13px] font-bold font-heading flex items-center justify-center gap-1.5 hover:bg-blue-50/50 transition-colors cursor-pointer"
        >
          <span>+ Thêm địa điểm mới vào Ngày {activeDay}</span>
        </button>
      </main>

      {/* Add Modal */}
      <ModalSheet
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={`Thêm hoạt động vào Ngày ${activeDay}`}
        ariaLabel={`Thêm hoạt động vào Ngày ${activeDay}`}
      >
        <div className="space-y-4">
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Tên địa điểm hoặc hoạt động
            </label>
            <input
              type="text"
              placeholder="VD: Quán chè Liên, Cà phê Sơn Trà..."
              value={newPlaceName}
              onChange={(e) => setNewPlaceName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0A1680]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Thời gian bắt đầu
              </label>
              <input
                type="text"
                placeholder="16:00"
                value={newPlaceTime}
                onChange={(e) => setNewPlaceTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Phân loại
              </label>
              <select
                value={newPlaceCategory}
                onChange={(e) => setNewPlaceCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
              >
                <option value="Tham quan">Tham quan</option>
                <option value="Ăn uống">Ăn uống</option>
                <option value="Cà phê">Cà phê</option>
                <option value="Mua sắm">Mua sắm</option>
                <option value="Nghỉ ngơi">Nghỉ ngơi</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs font-heading hover:bg-slate-200 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleAddActivity}
              className="flex-1 py-2.5 rounded-xl bg-[#0A1680] text-white font-bold text-xs font-heading hover:bg-[#071060] cursor-pointer"
            >
              Thêm vào lịch trình
            </button>
          </div>
        </div>
      </ModalSheet>

      {/* Save Floating Bar */}
      <div className="shrink-0 w-full p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 z-40 flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium">
          {currentDay.items.length} điểm trong ngày
        </span>
        <button
          onClick={() => onSave(tripPlan)}
          type="button"
          className="px-5 py-2.5 rounded-full bg-[#0A1680] text-white text-xs font-bold font-heading shadow-md hover:bg-[#071060] cursor-pointer"
        >
          Lưu lịch trình
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-slate-900/90 backdrop-blur-md text-white text-xs font-semibold shadow-lg animate-in fade-in zoom-in duration-200">
          {toastMessage}
        </div>
      )}
    </div>
  );
};
