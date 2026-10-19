import { ModalSheet } from '../common/ModalSheet';
import { useStored, useTravel } from '../../features/travel/TravelContext';
import '../../features/travel/product-polish.css';
import React, { useState } from 'react';
import { IOSStatusBar } from '../common/IOSStatusBar';
import { BottomNav } from '../common/BottomNav';
import { NavTab, PackingItem } from '../../types/travel';
import { MOCK_PACKING_ITEMS } from '../../data/mockData';

interface PackingListScreenProps {
  onNavigateTab: (tab: NavTab) => void;
  onBack: () => void;
}

export const PackingListScreen: React.FC<PackingListScreenProps> = ({
  onNavigateTab,
  onBack,
}) => {
  const {plan}=useTravel();
  const [packing,setPacking]=useStored<Record<string,PackingItem[]>>('travaiy-packing-v1',{});
  const items=packing[plan.id]||MOCK_PACKING_ITEMS;
  const setItems=(update:(items:PackingItem[])=>PackingItem[])=>setPacking(prev=>({...prev,[plan.id]:update(prev[plan.id]||MOCK_PACKING_ITEMS)}));
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [newItemName, setNewItemName] = useState('');
  const [addingItem,setAddingItem]=useState(false);
  const [newItemCategory, setNewItemCategory] = useState('cat-2');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Tất cả' },
    { id: 'cat-1', label: '📄 Giấy tờ' },
    { id: 'cat-2', label: '👕 Quần áo' },
    { id: 'cat-3', label: '🔋 Điện tử' },
    { id: 'cat-4', label: '🧴 Vệ sinh' },
    { id: 'cat-5', label: '🏖️ Hoạt động' },
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleToggle = (id: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isChecked: !item.isChecked } : item))
    );
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    showToast('Đã xóa món đồ khỏi danh sách');
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    const newItem: PackingItem = {
      id: `custom-pack-${Date.now()}`,
      name: newItemName.trim(),
      categoryId: newItemCategory,
      isChecked: false,
    };

    setItems((prev) => [newItem, ...prev]);
    setActiveCategory(newItemCategory);
    setNewItemName('');
    setAddingItem(false);
    showToast(`Đã thêm "${newItem.name}" vào danh sách! 🎒`);
  };

  const handleAddAISuggestion = (suggestionName: string, catId: string) => {
    const newItem: PackingItem = {
      id: `ai-pack-${Date.now()}`,
      name: suggestionName,
      categoryId: catId,
      isChecked: false,
    };
    setItems((prev) => [newItem, ...prev]);
    showToast(`AI đã thêm "${suggestionName}"! ✨`);
  };

  const filteredItems =
    activeCategory === 'all'
      ? items
      : items.filter((item) => item.categoryId === activeCategory);

  const completedCount = items.filter((i) => i.isChecked).length;
  const progressPercent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#FCFDFF] select-none text-slate-800">
      {/* Header */}
      <header className="shrink-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <IOSStatusBar light={false} />
        <div className="h-14 px-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              aria-label="Quay lại"
              type="button"
              className="w-10 h-10 -ml-1 flex items-center justify-center rounded-full text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5 text-slate-800" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <span className="text-[10px] font-bold text-[#0A1680] uppercase tracking-wider font-heading">
                Hành lý thông minh
              </span>
              <h1 className="font-bold text-[18px] text-slate-900 leading-tight font-heading">
                {plan.destination} ({plan.days} ngày)
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[12px] font-bold text-[#0A1680] font-heading px-2.5 py-1 rounded-full bg-blue-50">
              {completedCount}/{items.length}
            </span>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="px-5 pb-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((c) => {
            const isSelected = activeCategory === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCategory(c.id)}
                className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold transition-all cursor-pointer font-heading shrink-0 ${
                  isSelected
                    ? 'bg-[#0A1680] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-5 pt-3 space-y-4 pb-28">
        {/* Progress Card with Mascot */}
        <div className="p-4 rounded-3xl bg-white border border-[#E8EEFB] shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3 relative z-10">
            <div className="flex items-center gap-3">
              <img
                src="/images/mascot-suitcase.png"
                alt="Bé Sao Aly kéo vali"
                className="w-12 h-12 object-contain animate-mascot-float drop-shadow-xs shrink-0"
              />
              <div>
                <span className="text-[11px] text-[#454652] block font-medium">Bé Sao Aly đồng hành</span>
                <h3 className="text-[15px] font-bold text-[#0A1680] font-heading">
                  {progressPercent === 100 ? 'Sẵn sàng lên đường! 🎉' : `Đã chuẩn bị ${progressPercent}%`}
                </h3>
              </div>
            </div>
            <span className="text-xl font-black text-[#0A1680] font-heading shrink-0">
              {completedCount} <span className="text-xs font-normal text-slate-400">/ {items.length}</span>
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden relative z-10">
            <div
              className="h-full bg-gradient-to-r from-[#0A1680] via-[#93B2F8] to-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Gợi ý cho chuyến đi biển mùa hè */}
        <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-amber-700 text-xs font-bold">💡 Gợi ý hành lý mẫu:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleAddAISuggestion('Kem chống nắng & nhả nắng', 'cat-4')}
              className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 text-[11px] font-medium hover:bg-amber-100/50 transition-colors cursor-pointer"
            >
              + Kem chống nắng & nhả nắng
            </button>
            <button
              type="button"
              onClick={() => handleAddAISuggestion('Túi chống nước điện thoại', 'cat-3')}
              className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 text-[11px] font-medium hover:bg-amber-100/50 transition-colors cursor-pointer"
            >
              + Túi chống nước điện thoại
            </button>
            <button
              type="button"
              onClick={() => handleAddAISuggestion('Kính mát chống UV', 'cat-5')}
              className="px-2.5 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 text-[11px] font-medium hover:bg-amber-100/50 transition-colors cursor-pointer"
            >
              + Kính mát chống UV
            </button>
          </div>
        </div>

        {/* Packing Items List */}
        <div className="space-y-2">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                item.isChecked
                  ? 'bg-slate-50/60 border-slate-200 text-slate-400'
                  : 'bg-white border-slate-200 text-slate-800 shadow-xs hover:border-[#0A1680]/30'
              }`}
            >
              <div
                onClick={() => handleToggle(item.id)}
                role="checkbox" aria-checked={item.isChecked} tabIndex={0} onKeyDown={e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();handleToggle(item.id);}}}
                className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
              >
                <div
                  className={`w-5 h-5 rounded-lg border flex items-center justify-center text-xs transition-colors shrink-0 ${
                    item.isChecked
                      ? 'bg-emerald-500 border-emerald-500 text-white font-bold'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {item.isChecked && '✓'}
                </div>
                <span
                  className={`text-[13px] font-medium truncate ${
                    item.isChecked ? 'line-through text-slate-400' : 'text-slate-800'
                  }`}
                >
                  {item.name}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="w-7 h-7 rounded-full text-slate-300 hover:text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                title="Xóa món"
              >
                ✕
              </button>
            </div>
          ))}
          {filteredItems.length === 0 && (
            <div className="py-10 text-center flex flex-col items-center justify-center gap-2">
              <img
                src="/images/mascot-cool.png"
                alt="Bé Sao Aly"
                className="w-14 h-14 object-contain animate-mascot-float opacity-80"
              />
              <p className="text-slate-600 text-xs font-semibold">Chưa có món đồ nào trong danh mục này</p>
              <span className="text-[11px] text-slate-400">Bấm nút bên dưới để thêm món đồ cùng Bé Sao nhé!</span>
            </div>
          )}
        </div>
      </main>

      <footer className="shrink-0 w-full p-4 bg-white border-t border-blue-100"><button type="button" className="travel-pill w-full" onClick={()=>{if(activeCategory!=='all')setNewItemCategory(activeCategory);setAddingItem(true);}}>+ Thêm món đồ</button></footer>
      <ModalSheet isOpen={addingItem} onClose={()=>setAddingItem(false)} title="Thêm hành lý">
        <form onSubmit={handleAddItem} className="travel-modal-content polish-form">
          <div className="polish-heading"><h2>Thêm món đồ</h2><button type="button" className="travel-icon" aria-label="Đóng thêm hành lý" onClick={()=>setAddingItem(false)}>✕</button></div>
          <label>Tên món đồ<input required aria-label="Tên món đồ" maxLength={100} placeholder="Ví dụ: Áo khoác" value={newItemName} onChange={e=>setNewItemName(e.target.value)}/></label>
          <fieldset><legend>Phân loại món đồ</legend><div className="packing-category-picker">{categories.filter(c=>c.id!=='all').map(c=><button type="button" key={c.id} aria-pressed={newItemCategory===c.id} onClick={()=>setNewItemCategory(c.id)}>{c.label}</button>)}</div></fieldset>
          <button type="submit" className="travel-pill">Thêm vào hành lý</button>
        </form>
      </ModalSheet>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-slate-900/90 backdrop-blur-md text-white text-xs font-semibold shadow-lg animate-in fade-in zoom-in duration-200">
          {toastMessage}
        </div>
      )}
    </div>
  );
};
