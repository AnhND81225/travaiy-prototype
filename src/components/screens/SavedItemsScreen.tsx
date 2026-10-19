import React, { useState } from 'react';
import { IOSStatusBar } from '../common/IOSStatusBar';
import { BottomNav } from '../common/BottomNav';
import { NavTab } from '../../types/travel';

interface SavedItemsScreenProps {
  onBack: () => void;
  onNavigateTab: (tab: NavTab) => void;
  onOpenPlaceDetail?: (id: string) => void;
}

export const SavedItemsScreen: React.FC<SavedItemsScreenProps> = ({
  onBack,
  onNavigateTab,
  onOpenPlaceDetail,
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'places'>('posts');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState('Tất cả');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [savedPosts, setSavedPosts] = useState([
    {
      id: 'p1',
      title: 'Hoàng hôn tuyệt đẹp tại Bãi Sao',
      author: 'Linh Chi',
      authorCode: 'LC',
      location: 'Phú Quốc',
      tag: 'Check-in',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVm0-CRmLFHTTsbdM7RbvdQKxTqJd9LmqxMyx5kkMFbuHTMxy0oUlmwKBYaR3YVlublLajoBSvQE0qXbryP6fkaUeEnaDvoI5iBW8-NW_81m1zujdvVmsK2nJ6WoXlqIhPaFmzMEfa5-88rZE-NCTpnoo0BWziF7jpjCtftorpaCDkPgRmhokzgKksIyeIVbhnsWnNHE7EIQCHvKe4PRW7Z8oA3Z4OR9HoEnLCAwsTVaB8R4YHog',
    },
    {
      id: 'p2',
      title: 'Phố cổ Hội An về đêm',
      author: 'Minh Khang',
      authorCode: 'MK',
      location: 'Hội An',
      tag: 'Văn hóa',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB14z7VLwGdCIAFerXHANV41fWIXcMAosVT_vVBmZv-N4FvrW00ZIBepZFhNoXg32l2SjTFvK_F0xpN3a0nCXhoM3tl4DKvvy4omY7RioLlmM1-UH0A-5US_YhyqtNZDc-rL_4ilrF0btb0mbwxepxIpcMsaN0EQkk9sig8ZgpM0pgQtTyr8S4DYCynQ2VyL_INt8HByPX8Udi-mZYgGKWajxf-bqlWVMgODdsKYreHea2JWzdgeA',
    },
    {
      id: 'p3',
      title: 'Kinh nghiệm lặn ngắm san hô ở Hòn Thơm',
      author: 'Ngọc Anh',
      authorCode: 'NA',
      location: 'Phú Quốc',
      tag: 'Trải nghiệm',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxlCNLSnGwSIXkqp-MXBsVax3XIDBrfLt4XznshzqKL5rmZLBtAFxo0hgFtezD-jhKcaE0C5zKNRnoe0MwoIaUN5BVOAkpSlaFuAGYJ36fj0QBAXtSuy-9bAhyGFq8haNN0PiL_ZNiop8gkETSCfvVgRYfB0HMlKoj8cvOJGRFozGVBIrTNZNxkpTL8cRBMZnaiog6LJWBOIKe-HRxVqSP9XTT-tP8QryyT0q6WNjKfz0xzWUSJQ',
    },
    {
      id: 'p4',
      title: 'Săn mây ở Đà Lạt',
      author: 'Travel With Me',
      authorCode: 'TM',
      location: 'Đà Lạt',
      tag: 'Khám phá',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDg_jfI2de7piREKNn6G7j2TI5bQicfDtZCWqUGBOZwoJFSHHzjbTBm7hdk583SGhrIrfDBrN1MI3w6NnQDPUSd5wFHLJ_JN7x8Bea-_gWkSnmbl2yUlp8cwIewoW0m3-6U9I-0o3POqCSUQFjr9MNA5pNVOo4TxUmBqJltHasycjWfNrS180eD25dgby6hws36qyzcq7LxlgddghzR6faAkNs7bz-1dD8vnftxVrCrd9U0x4o_rw',
    },
  ]);

  const [savedPlaces, setSavedPlaces] = useState([
    {
      id: 'pl-1',
      title: 'Đảo Phú Quốc',
      province: 'Kiên Giang',
      rating: 4.9,
      category: 'Bãi biển & Lặn san hô',
      desc: 'Khám phá bờ cát trắng mịn và hệ sinh thái biển phong phú',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxmXkk91vob13N2AzJoWBLm0DQ2F0ousfbAiuzMMytXF1XVElLOwWHGeVnt6y6fjO-xKvqWBjID-fsGm73S1F8nedFaB3rn1EkXV3UzfL6OrFenNaO10GK_7PA2h5bfzINK2OdN7DI8ZFMOZAsXAvsVxuloS_NfJzZaXbxl1CSvRwqdnnnHnwkPG7bUYBs8ukq-wMbeogxBQNapYOw77RFEnTvTbh6QVMgfV4Pzky1OZ1mPTVECA',
    },
    {
      id: 'pl-2',
      title: 'Đồi Đa Phú, Đà Lạt',
      province: 'Lâm Đồng',
      rating: 4.8,
      category: 'Cắm trại & Săn mây',
      desc: 'Khung cảnh bình minh trên biển mây ngút ngàn giữa rừng thông',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-TqjGemcyJs-IveqDm37Y5-5RPPG2ZsIGItMpl3ffoLHL1MO1-j6cat3DAYBnnPh8CQBVsbAUW-D66bt3uEknvXo993a0L4xPMnbOU5WRTjbBUDdN-bUUkMXRxPEpomeIP-W-8jvZWV8r594cgF0ZRfG_rO3sZoCR1z32bo2m1f1hy28jeR9HN917oi-Ba8uT2KLIGDjnW7498UTkSw1cM161v4hFrnKH_nX4wc7ZmqOPus5bWQ',
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRemovePost = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const removed = savedPosts.find((p) => p.id === id);
    setSavedPosts((prev) => prev.filter((p) => p.id !== id));
    showToast(`Đã bỏ lưu bài viết "${removed?.title}"`);
  };

  const handleRemovePlace = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const removed = savedPlaces.find((p) => p.id === id);
    setSavedPlaces((prev) => prev.filter((p) => p.id !== id));
    showToast(`Đã bỏ lưu địa điểm "${removed?.title}"`);
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#f8f9fb] text-[#191c1e] font-body-md antialiased select-none">
      {/* Header */}
      <header className="shrink-0 z-30 bg-white/90 backdrop-blur-xl border-b border-[#edeef0]">
        <IOSStatusBar light={false} />
        <div className="h-[52px] px-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              aria-label="Quay lại"
              className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-[#0A1680] active:scale-95 transition-transform cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <h1 className="font-heading font-bold text-[18px] text-[#0A1680] tracking-tight ml-1">
              Đã lưu
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#FBEDB0] text-[#0A1680] rounded-full">
              <span className="font-heading text-[12px] font-bold text-[#0A1680]">
                {activeTab === 'posts' ? savedPosts.length : savedPlaces.length} mục
              </span>
            </div>
            <button
              onClick={() => setShowFilterModal(true)}
              aria-label="Bộ lọc"
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-[#0A1680] transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <circle cx="12" cy="4" r="2" />
                <circle cx="10" cy="12" r="2" />
                <circle cx="14" cy="20" r="2" />
                <line x1="21" x2="14" y1="4" y2="4" />
                <line x1="10" x2="3" y1="4" y2="4" />
                <line x1="21" x2="12" y1="12" y2="12" />
                <line x1="8" x2="3" y1="12" y2="12" />
                <line x1="21" x2="16" y1="20" y2="20" />
                <line x1="12" x2="3" y1="20" y2="20" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-5 pt-3 pb-28 flex flex-col gap-3.5">
        {/* Segment Tabs */}
        <div className="flex items-center bg-[#f2f4f6] p-1 rounded-full">
          <button
            type="button"
            onClick={() => setActiveTab('posts')}
            className={`flex-1 py-2 text-center rounded-full font-heading text-[13px] font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'posts'
                ? 'bg-[#0A1680] text-white shadow-sm'
                : 'text-slate-500 hover:text-[#0A1680]'
            }`}
          >
            <span>Bài viết đã lưu</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('places')}
            className={`flex-1 py-2 text-center rounded-full font-heading text-[13px] font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'places'
                ? 'bg-[#0A1680] text-white shadow-sm'
                : 'text-slate-500 hover:text-[#0A1680]'
            }`}
          >
            <span>Địa điểm đã lưu</span>
          </button>
        </div>

        {/* TAB 1: Bài viết đã lưu */}
        {activeTab === 'posts' && (
          <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between pb-0.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-heading">
                Gần đây nhất ({savedPosts.length} bài viết)
              </span>
              <button
                type="button"
                onClick={() => setShowFilterModal(true)}
                className="text-[#0A1680] font-heading text-[12px] font-bold hover:underline cursor-pointer"
              >
                Lọc thẻ
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {savedPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-[24px] overflow-hidden shadow-xs border border-slate-200/80 flex flex-col group transition-all"
                >
                  <div className="relative w-full h-[180px] overflow-hidden bg-slate-100">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      type="button"
                      onClick={(e) => handleRemovePost(post.id, e)}
                      aria-label="Bỏ lưu"
                      className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#0A1680] shadow-sm active:scale-90 cursor-pointer"
                    >
                      ★
                    </button>
                    <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-[#0A1680]/80 backdrop-blur-md text-white font-heading text-[10px] font-bold">
                      {post.tag}
                    </span>
                  </div>

                  <div className="p-3 flex flex-col flex-1 justify-between gap-1.5">
                    <h2 className="font-heading font-bold text-[13px] text-[#0A1680] truncate leading-tight">
                      {post.title}
                    </h2>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-[#0A1680] text-[10px] font-bold flex items-center justify-center">
                        {post.authorCode}
                      </span>
                      <span className="truncate text-[11px]">{post.author}</span>
                      <span className="text-[10px] text-slate-400">• {post.location}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* TAB 2: Địa điểm đã lưu */}
        {activeTab === 'places' && (
          <section className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between pb-0.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-heading">
                Bộ sưu tập điểm đến ({savedPlaces.length})
              </span>
            </div>

            <div className="flex flex-col gap-3.5">
              {savedPlaces.map((place) => (
                <article
                  key={place.id}
                  onClick={() => {
                    if (onOpenPlaceDetail) onOpenPlaceDetail('tiem-tu-lung');
                  }}
                  className="relative w-full h-[250px] rounded-[28px] overflow-hidden shadow-md group border border-slate-200 cursor-pointer"
                >
                  <img
                    src={place.image}
                    alt={place.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#000552]/85 via-[#000552]/30 to-black/10" />

                  <div className="absolute top-3.5 right-3.5">
                    <button
                      type="button"
                      onClick={(e) => handleRemovePlace(place.id, e)}
                      aria-label="Bỏ lưu địa điểm"
                      className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-[#0A1680] shadow-sm cursor-pointer"
                    >
                      ★
                    </button>
                  </div>

                  <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md text-[#0A1680] font-heading text-[11px] font-bold flex items-center gap-1">
                    <span className="text-amber-500">★ {place.rating}</span>
                    <span>• {place.province}</span>
                  </div>

                  <div className="absolute bottom-0 inset-x-0 p-5 flex items-end justify-between gap-3 text-white">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-medium text-white/80 uppercase tracking-wider">
                        {place.category}
                      </span>
                      <h3 className="text-[18px] font-bold text-white font-heading drop-shadow-sm leading-tight">
                        {place.title}
                      </h3>
                      <p className="text-[11px] text-white/90 line-clamp-1 mt-0.5">
                        {place.desc}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="w-9 h-9 rounded-full bg-[#FBEDB0] text-[#0A1680] flex items-center justify-center shrink-0 shadow-lg font-bold"
                    >
                      ›
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* POPUP: Filter Saved Sheet */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-[390px] bg-white rounded-t-[28px] p-5 pb-8 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-bottom duration-200">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto shrink-0" />
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-heading font-bold text-[17px] text-[#0A1680]">Bộ lọc & Sắp xếp</h3>
              <button onClick={() => setShowFilterModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100">✕</button>
            </div>
            <div>
              <span className="text-[12px] font-bold text-slate-700 block mb-2 uppercase tracking-wider font-heading">
                Phân loại thẻ
              </span>
              <div className="flex flex-wrap gap-2">
                {['Tất cả', 'Check-in', 'Văn hóa', 'Trải nghiệm', 'Khám phá'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-heading font-semibold cursor-pointer ${
                      selectedTag === tag
                        ? 'bg-[#0A1680] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setShowFilterModal(false);
                showToast(`Đã áp dụng bộ lọc: ${selectedTag}`);
              }}
              className="w-full py-3 rounded-full bg-[#0A1680] text-white font-heading font-bold text-xs shadow-md mt-2 cursor-pointer"
            >
              Áp dụng bộ lọc
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-slate-900/90 backdrop-blur-md text-white text-xs font-semibold shadow-lg animate-in fade-in zoom-in duration-200">
          {toastMessage}
        </div>
      )}

      {/* Floating Capsule Dock */}
      <BottomNav activeTab="explore" onTabChange={onNavigateTab} />
    </div>
  );
};
