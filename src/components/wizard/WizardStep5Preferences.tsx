import React, { useState } from 'react';
import { IOSStatusBar } from '../common/IOSStatusBar';

interface WizardStep5PreferencesProps {
  interests: string[];
  transport: string;
  accommodation: string;
  selectedStayName?: string;
  onEditStay?: () => void;
  mustVisitPlaces: string[];
  notes: string;
  onChange: (data: {
    interests: string[];
    transport: string;
    accommodation: string;
    mustVisitPlaces: string[];
    notes: string;
  }) => void;
  onNext: () => void;
  onBack: () => void;
}

export const WizardStep5Preferences: React.FC<WizardStep5PreferencesProps> = ({
  interests,
  transport,
  accommodation,
  selectedStayName,
  onEditStay,
  mustVisitPlaces,
  notes,
  onChange,
  onNext,
  onBack,
}) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    interests || ['Thư giãn', 'Văn hóa', 'Ẩm thực']
  );
  const [selectedTransport, setSelectedTransport] = useState<string>(transport || 'Máy bay');
  const [selectedAccommodation, setSelectedAccommodation] = useState<string>(
    accommodation || 'Khách sạn'
  );
  const [isAccordionOpen, setIsAccordionOpen] = useState<boolean>(true);
  const [placesList, setPlacesList] = useState<string[]>(
    mustVisitPlaces || ['Bưu điện Thành phố', 'Thảo Cầm Viên', 'Phố cổ Hội An']
  );
  const [noteText, setNoteText] = useState<string>(notes || '');
  const [showAddPlaceSheet, setShowAddPlaceSheet] = useState<boolean>(false);
  const [searchNewPlaceQuery, setSearchNewPlaceQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const toggleInterest = (item: string) => {
    let next: string[];
    if (selectedInterests.includes(item)) {
      next = selectedInterests.filter((i) => i !== item);
    } else {
      next = [...selectedInterests, item];
    }
    setSelectedInterests(next);
    triggerChange(next, selectedTransport, selectedAccommodation, placesList, noteText);
  };

  const selectTrans = (t: string) => {
    setSelectedTransport(t);
    triggerChange(selectedInterests, t, selectedAccommodation, placesList, noteText);
  };

  const selectAcc = (a: string) => {
    setSelectedAccommodation(a);
    triggerChange(selectedInterests, selectedTransport, a, placesList, noteText);
  };

  const removePlace = (pName: string) => {
    const next = placesList.filter((p) => p !== pName);
    setPlacesList(next);
    triggerChange(selectedInterests, selectedTransport, selectedAccommodation, next, noteText);
  };

  const addPlace = (pName: string) => {
    if (!placesList.includes(pName)) {
      const next = [...placesList, pName];
      setPlacesList(next);
      triggerChange(selectedInterests, selectedTransport, selectedAccommodation, next, noteText);
      showToast(`Đã thêm "${pName}" vào danh sách!`);
    }
  };

  const appendNoteChip = (chip: string) => {
    const updated = noteText ? `${noteText}, ${chip.replace('+ ', '')}` : chip.replace('+ ', '');
    setNoteText(updated);
    triggerChange(selectedInterests, selectedTransport, selectedAccommodation, placesList, updated);
  };

  const triggerChange = (
    ints: string[],
    trans: string,
    acc: string,
    places: string[],
    nt: string
  ) => {
    onChange({
      interests: ints,
      transport: trans,
      accommodation: acc,
      mustVisitPlaces: places,
      notes: nt,
    });
  };

  return (
    <div className="relative w-full h-full min-h-[844px] bg-[#FCFDFF] flex flex-col justify-between overflow-hidden select-none text-slate-800">
      {/* Top Header */}
      <header className="pt-2 px-5 shrink-0 bg-[#FCFDFF] z-20">
        <IOSStatusBar light={false} />
        <div className="flex items-center justify-between pt-1 pb-2">
          <button
            onClick={onBack}
            aria-label="Quay lại"
            type="button"
            className="w-9 h-9 -ml-1 flex items-center justify-center rounded-full text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div className="flex flex-col items-center">
            <h1 className="plan-header-title">
              Sở thích chuyến đi
            </h1>
            <span className="text-[12px] font-medium text-slate-400">Tùy chọn</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 pt-2 pb-24 overflow-y-auto no-scrollbar flex flex-col gap-4 text-left">
        {/* Section 1: Bạn thích gì? */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-[#0A1680] font-heading">Bạn thích gì?</h2>
            <span className="text-[12px] text-slate-400 font-medium">Chọn một hoặc nhiều</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {['Thư giãn', 'Thiên nhiên', 'Văn hóa', 'Ẩm thực', 'Phiêu lưu', 'Chụp ảnh'].map(
              (vibe) => {
                const isSelected = selectedInterests.includes(vibe);
                return (
                  <button
                    key={vibe}
                    type="button"
                    onClick={() => toggleInterest(vibe)}
                    className={`flex items-center justify-center min-h-[44px] px-4 rounded-2xl border text-[14px] transition-all cursor-pointer font-heading ${
                      isSelected
                        ? 'bg-[#0A1680] text-white border-[#0A1680] font-bold shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-[#93B2F8] font-medium'
                    }`}
                  >
                    {vibe}
                  </button>
                );
              }
            )}
          </div>
        </section>

        {/* Section 2: Di chuyển */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-bold text-slate-800 font-heading">Di chuyển</h2>
            <span className="text-[12px] text-slate-400 font-medium">Chọn 1 phương tiện chính</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {['Máy bay', 'Ô tô', 'Tàu hỏa', 'Xe khách'].map((trans) => {
              const isSelected = selectedTransport === trans;
              return (
                <button
                  key={trans}
                  type="button"
                  onClick={() => selectTrans(trans)}
                  className={`min-h-[44px] flex items-center justify-center px-1 rounded-xl border text-[13px] transition-all cursor-pointer font-heading ${
                    isSelected
                      ? 'bg-[#0A1680] text-white border-[#0A1680] font-bold shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-[#93B2F8]'
                  }`}
                >
                  {trans}
                </button>
              );
            })}
          </div>
        </section>

        {selectedStayName ? <section className="wizard-summary-stay"><div><span>Khách sạn đã chọn</span><b>{selectedStayName}</b><small>Ngày ở đã chọn tại bước Thời gian.</small></div><button type="button" onClick={onEditStay}>Sửa</button></section> : <>
        {/* Section 3: Lưu trú */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-[14px] font-bold text-slate-800 font-heading">Ưu tiên chỗ ở</h2>
            <span className="text-[12px] text-slate-400 font-medium">Áp dụng khi chọn chỗ ở sau</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {['Khách sạn', 'Homestay', 'Resort', 'Hostel'].map((stay) => {
              const isSelected = selectedAccommodation === stay;
              return (
                <button
                  key={stay}
                  type="button"
                  onClick={() => selectAcc(stay)}
                  className={`min-h-[44px] flex items-center justify-center px-1 rounded-xl border text-[13px] transition-all cursor-pointer font-heading ${
                    isSelected
                      ? 'bg-[#0A1680] text-white border-[#0A1680] font-bold shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-[#93B2F8]'
                  }`}
                >
                  {stay}
                </button>
              );
            })}
          </div>
        </section>

        </>}
        {/* Section 4: Accordion Điểm muốn đến & ghi chú */}
        <section className="flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
            className="w-full flex items-center justify-between p-3.5 text-left active:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <h3 className="text-[14px] font-bold text-slate-900 font-heading">
                Điểm muốn đến &amp; ghi chú
              </h3>
              <span className="text-[11px] font-bold bg-[#93B2F8]/30 text-[#0A1680] px-2 py-0.5 rounded-full font-heading">
                {placesList.length} điểm
              </span>
            </div>
            <svg
              className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${
                isAccordionOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              viewBox="0 0 24 24"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {isAccordionOpen && (
            <div className="px-3.5 pb-4 flex flex-col gap-3.5 border-t border-slate-100 pt-3">
              {/* Tags */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-semibold text-slate-600">Điểm đến đã lưu</label>
                <div className="flex flex-wrap gap-2">
                  {placesList.map((place) => (
                    <span
                      key={place}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-800 text-[13px] font-medium"
                    >
                      {place}
                      <button
                        type="button"
                        onClick={() => removePlace(place)}
                        className="text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                  <button
                    type="button"
                    onClick={() => setShowAddPlaceSheet(true)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-dashed border-[#0A1680]/50 text-[#0A1680] text-[13px] font-semibold hover:bg-slate-50 transition-colors cursor-pointer font-heading"
                  >
                    + Thêm điểm
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[12px] font-semibold text-slate-600">Ghi chú thêm</label>
                  <span className="text-[11px] text-slate-400">Tối đa 300 ký tự</span>
                </div>
                <textarea
                  rows={2}
                  maxLength={300}
                  value={noteText}
                  onChange={(e) => {
                    setNoteText(e.target.value);
                    triggerChange(
                      selectedInterests,
                      selectedTransport,
                      selectedAccommodation,
                      placesList,
                      e.target.value
                    );
                  }}
                  placeholder="Ví dụ: Ăn chay, người lớn tuổi, cần xe lăn, view biển..."
                  className="w-full px-3 py-2 text-[13px] text-slate-800 placeholder-slate-400 border border-slate-200 rounded-xl focus:outline-none focus:border-[#0A1680] resize-none"
                />
                <div className="flex flex-wrap gap-1.5 mt-0.5">
                  {['+ Ăn chay', '+ Ít đi bộ', '+ View biển', '+ Tour riêng'].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => appendNoteChip(chip)}
                      className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Floating Bottom CTA */}
      <footer className="fixed bottom-0 max-w-[390px] w-full z-40 bg-white/95 backdrop-blur-xl px-5 py-3 border-t border-slate-200/80 shadow-md">
        <button
          onClick={onNext}
          type="button"
          className="w-full h-12 bg-[#0A1680] text-white font-bold text-[15px] rounded-full flex items-center justify-center gap-2 shadow-lg shadow-[#0A1680]/25 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer font-heading"
        >
          <span>Xem lại chuyến đi</span>
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </footer>

      {/* SEARCH & ADD PLACE SHEET */}
      {showAddPlaceSheet && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-[#0A1680]/30 backdrop-blur-xs transition-opacity"
            onClick={() => setShowAddPlaceSheet(false)}
          />
          <div className="relative w-full bg-white rounded-t-[28px] shadow-2xl p-5 flex flex-col gap-4 z-10 animate-in slide-in-from-bottom duration-300 text-left">
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <div className="flex flex-col">
                <h3 className="text-[16px] font-bold text-[#0A1680] font-heading">
                  Thêm điểm muốn đến
                </h3>
                <span className="text-[12px] text-slate-400">
                  Tìm kiếm và gắn vào lịch trình gợi ý
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowAddPlaceSheet(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="relative flex items-center">
              <svg className="w-4 h-4 text-slate-400 absolute left-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={searchNewPlaceQuery}
                onChange={(e) => setSearchNewPlaceQuery(e.target.value)}
                placeholder="Tìm địa điểm (ví dụ: Bảo tàng Thành phố Hồ Chí Minh)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[14px] text-slate-800 focus:outline-none focus:border-[#0A1680]"
              />
            </div>

            <div>
              <span className="text-[12px] font-bold text-slate-500 block mb-2 font-heading">
                Gợi ý phổ biến
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  'Bưu điện Thành phố',
                  'Thảo Cầm Viên',
                  'Phố cổ Hội An',
                  'Bảo tàng Thành phố Hồ Chí Minh',
                  'Dinh Độc Lập',
                  'Công viên Tao Đàn',
                  'Bến Bạch Đằng Phun Lửa',
                ].map((sugg) => (
                  <button
                    key={sugg}
                    type="button"
                    onClick={() => addPlace(sugg)}
                    className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-[12px] font-medium hover:bg-blue-50 hover:text-[#0A1680] cursor-pointer"
                  >
                    + {sugg}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (searchNewPlaceQuery.trim()) {
                  addPlace(searchNewPlaceQuery.trim());
                  setSearchNewPlaceQuery('');
                }
                setShowAddPlaceSheet(false);
              }}
              className="w-full h-12 bg-[#0A1680] text-white font-semibold text-[14px] rounded-full flex items-center justify-center font-heading cursor-pointer shadow-md"
            >
              Hoàn tất thêm
            </button>
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
