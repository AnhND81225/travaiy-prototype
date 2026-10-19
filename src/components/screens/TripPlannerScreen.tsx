import React, { useState } from 'react';
import { IOSStatusBar } from '../common/IOSStatusBar';
import { BottomNav } from '../common/BottomNav';
import { ModalSheet } from '../common/ModalSheet';
import { NavTab, TripPlan, UserPreferences } from '../../types/travel';
import { MOCK_TRIP } from '../../data/mockData';

interface TripPlannerScreenProps {
  onNavigateTab: (tab: NavTab) => void;
  userPreferences: UserPreferences;
  onOpenPlaceDetail: (placeId: string) => void;
}

export const TripPlannerScreen: React.FC<TripPlannerScreenProps> = ({
  onNavigateTab,
  userPreferences,
  onOpenPlaceDetail,
}) => {
  const [activeDay, setActiveDay] = useState(1);
  const [tripPlan, setTripPlan] = useState<TripPlan>(MOCK_TRIP);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Generator form fields
  const [genDestination, setGenDestination] = useState('Đà Lạt');
  const [genDuration, setGenDuration] = useState('3N2Đ');
  const [genCompanion, setGenCompanion] = useState('Cặp đôi');
  const [genPace, setGenPace] = useState(userPreferences.travelStyle || 'Cân bằng');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleGenerateAI = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowGenerateModal(false);
      showToast(`AI đã kiến tạo lịch trình ${genDestination} ${genDuration} hoàn hảo cho bạn! ✨`);
    }, 1200);
  };

  const currentDaySchedule =
    tripPlan.daysSchedule.find((d) => d.dayNumber === activeDay) || tripPlan.daysSchedule[0];

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#f8f9fb] text-slate-800 select-none">
      {/* iOS Status Bar */}
      <IOSStatusBar light={false} />

      {/* Header */}
      <header className="shrink-0 z-30 px-5 pt-1 pb-3 flex items-center justify-between bg-white border-b border-slate-100">
        <div>
          <span className="text-[11px] font-bold text-[#0A1680] uppercase tracking-wider font-heading">
            Lịch trình thông minh
          </span>
          <h1 className="text-[20px] font-bold text-slate-900 leading-tight font-heading">
            {tripPlan.destination}
          </h1>
        </div>

        <button
          onClick={() => setShowGenerateModal(true)}
          type="button"
          className="px-3.5 py-1.5 rounded-full bg-[#0A1680] text-white text-[12px] font-bold shadow-sm flex items-center gap-1.5 active:scale-95 transition-transform cursor-pointer font-heading"
        >
          <span>✦ Tạo mới</span>
        </button>
      </header>

      {/* Scrollable Body */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar pb-28">
        {/* Trip Cover Banner */}
        <div className="relative h-44 w-full overflow-hidden">
        <img src={tripPlan.coverImage} alt={tripPlan.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
        <div className="absolute bottom-3 left-5 right-5 text-white">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-medium mb-1">
            <span>📅 {tripPlan.dates}</span>
          </div>
          <h2 className="text-[18px] font-bold tracking-tight leading-snug font-heading">
            {tripPlan.title}
          </h2>
        </div>
      </div>

      {/* Days Tabs (Ngày 1, Ngày 2, Ngày 3) */}
      <div className="px-5 pt-3 bg-white border-b border-slate-100">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          {tripPlan.daysSchedule.map((d) => {
            const isActive = activeDay === d.dayNumber;
            return (
              <button
                key={d.dayNumber}
                type="button"
                onClick={() => setActiveDay(d.dayNumber)}
                className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all cursor-pointer font-heading shrink-0 ${
                  isActive
                    ? 'bg-[#0A1680] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Ngày {d.dayNumber}
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline Schedule for Active Day */}
      <main className="px-5 pt-4 pb-20 space-y-3.5 text-left">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-[15px] font-bold text-slate-800 font-heading">
            {currentDaySchedule.title}
          </h3>
          <span className="text-[12px] text-slate-400 font-medium">
            {currentDaySchedule.items.length} hoạt động
          </span>
        </div>

        <div className="relative border-l-2 border-[#93B2F8]/40 ml-3 pl-4 space-y-4">
          {currentDaySchedule.items.map((item, idx) => (
            <div
              key={idx}
              onClick={() => onOpenPlaceDetail('tiem-tu-lung')}
              className="relative bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs hover:shadow-sm transition-all cursor-pointer group"
            >
              {/* Dot on timeline */}
              <div className="absolute -left-[23px] top-4 w-3.5 h-3.5 rounded-full bg-[#0A1680] ring-4 ring-white" />

              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-bold text-[#0A1680] font-heading">{item.time}</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                  {item.category}
                </span>
              </div>

              <h4 className="text-[14px] font-bold text-slate-900 font-heading group-hover:text-[#0A1680] transition-colors">
                {item.placeName}
              </h4>
              <p className="text-[12px] text-slate-500 mt-1 leading-relaxed">{item.note}</p>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                <span>⏱️ {item.duration}</span>
                <span className="font-semibold text-slate-700">Chi phí: ~{item.cost}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
      </div>

      {/* Floating Bottom Nav */}
      <BottomNav activeTab="trips" onTabChange={onNavigateTab} />

      {/* GENERATE AI TRIP MODAL */}
      <ModalSheet
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        title="Tạo lịch trình thông minh"
        ariaLabel="Tạo lịch trình thông minh cùng AI"
      >
        <div className="p-5 pb-8 flex flex-col gap-4 text-left">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#0A1680] uppercase tracking-wider font-heading">
                AI Travel Assistant
              </span>
              <h3 className="text-[18px] font-bold text-slate-900 font-heading">
                Tạo lịch trình thông minh
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowGenerateModal(false)}
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600"
            >
              ✕
            </button>
          </div>

            <div className="space-y-3">
              {/* Destination */}
              <div>
                <label className="text-[12px] font-bold text-slate-600 mb-1 block">Điểm đến</label>
                <div className="grid grid-cols-4 gap-2">
                  {['Đà Lạt', 'Phú Quốc', 'Hội An', 'Đà Nẵng'].map((dest) => (
                    <button
                      key={dest}
                      type="button"
                      onClick={() => setGenDestination(dest)}
                      className={`py-2 rounded-xl text-[12px] font-bold font-heading cursor-pointer ${
                        genDestination === dest
                          ? 'bg-[#0A1680] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {dest}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="text-[12px] font-bold text-slate-600 mb-1 block">Thời lượng</label>
                <div className="grid grid-cols-3 gap-2">
                  {['2N1Đ', '3N2Đ', '4N3Đ'].map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setGenDuration(dur)}
                      className={`py-2 rounded-xl text-[12px] font-bold font-heading cursor-pointer ${
                        genDuration === dur
                          ? 'bg-[#0A1680] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              </div>

              {/* Companion */}
              <div>
                <label className="text-[12px] font-bold text-slate-600 mb-1 block">
                  Người đồng hành
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {['Một mình', 'Cặp đôi', 'Nhóm bạn', 'Gia đình'].map((comp) => (
                    <button
                      key={comp}
                      type="button"
                      onClick={() => setGenCompanion(comp)}
                      className={`py-2 rounded-xl text-[11px] font-bold font-heading cursor-pointer ${
                        genCompanion === comp
                          ? 'bg-[#0A1680] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {comp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferred Style */}
              <div>
                <label className="text-[12px] font-bold text-slate-600 mb-1 block">
                  Phong cách lịch trình
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Thư thả', 'Cân bằng', 'Khám phá nhiều'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setGenPace(st)}
                      className={`py-2 rounded-xl text-[11px] font-bold font-heading cursor-pointer ${
                        genPace === st
                          ? 'bg-[#0A1680] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={isGenerating}
              onClick={handleGenerateAI}
              className="w-full h-12 rounded-full bg-[#0A1680] text-white font-bold text-[14px] shadow-lg shadow-[#0A1680]/25 flex items-center justify-center gap-2 mt-2 font-heading cursor-pointer disabled:opacity-60"
            >
              {isGenerating ? (
                <span>Đang kiến tạo lịch trình... ⏳</span>
              ) : (
                <span>Kiến tạo lịch trình cùng AI ✦</span>
              )}
            </button>
        </div>
      </ModalSheet>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-[#0A1680] text-white px-4 py-2 rounded-full shadow-xl text-[13px] font-semibold flex items-center gap-2">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
