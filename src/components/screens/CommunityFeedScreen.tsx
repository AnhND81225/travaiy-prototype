import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTravel } from '../../features/travel/TravelContext';
import { IOSStatusBar } from '../common/IOSStatusBar';
import { BottomNav } from '../common/BottomNav';
import { NavTab } from '../../types/travel';

interface CommunityFeedScreenProps {
  onNavigateTab: (tab: NavTab) => void;
  onCreatePost: () => void;
}

export const CommunityFeedScreen: React.FC<CommunityFeedScreenProps> = ({
  onNavigateTab,
  onCreatePost,
}) => {
  const [activeTab, setActiveTab] = useState<'kham-pha' | 'theo-doi' | 'gan-day'>('kham-pha');
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPostOptionsModal, setShowPostOptionsModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Likes & bookmarks states
  const {likedPosts, toggleLike, localPosts, setLocalPosts} = useTravel();
  const [params] = useSearchParams();
  useEffect(()=>{const id=params.get('post');if(id){document.getElementById(id)?.scrollIntoView({block:'start'});if(params.get('comments')==='1')setShowCommentsModal(true);}},[params]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<{ [key: string]: boolean }>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };


  const toggleBookmark = (postId: string) => {
    setBookmarkedPosts((prev) => {
      const next = !prev[postId];
      showToast(next ? 'Đã lưu bài viết vào bộ sưu tập!' : 'Đã bỏ lưu bài viết');
      return { ...prev, [postId]: next };
    });
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#f5faff] text-[#191c1e] font-body-md antialiased select-none">
      {/* Header */}
      <header className="shrink-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-200/60">
        <IOSStatusBar light={false} />
        <div className="h-[56px] px-5 flex items-center justify-between gap-3">
          <div className="flex-1 flex items-center gap-2.5 bg-slate-100 border border-slate-200/60 px-4 py-2 rounded-full text-slate-500 text-xs">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Tìm kiếm cộng đồng TravAIy..."
              className="bg-transparent w-full text-xs text-slate-900 focus:outline-none"
            />
          </div>
          <button
            onClick={() => setShowNotificationsModal(true)}
            aria-label="Thông báo"
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:text-[#0A1680] shrink-0 bg-white border border-slate-200/80 shadow-xs cursor-pointer relative"
          >
            🔔
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>
        </div>
      </header>

        {/* Feed Tabs */}
        <nav aria-label="Bộ lọc cộng đồng" className="shrink-0 flex items-center gap-2 overflow-x-auto no-scrollbar px-5 py-3 bg-[#f5faff]">
          {[
            { id: 'kham-pha', label: 'Khám phá' },
            { id: 'theo-doi', label: 'Đang theo dõi' },
            { id: 'gan-day', label: 'Gần đây' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveTab(tab.id as any)}
                className={`h-9 px-5 rounded-full font-heading text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0A1680] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

      {/* Feed content scrolls without compressing the filter bar. */}
      <main className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-5 pt-1 pb-36 space-y-4">
        {localPosts.map(post=><article key={post.id} className="adaptive-change"><b>Bạn · {post.audience}</b><p>{post.text}</p><p>{post.location} · {post.tags.join(' ')}</p><small>Lưu trên trình duyệt này · {new Date(post.createdAt).toLocaleString('vi-VN')}</small><button className="wizard-text-button" onClick={()=>setLocalPosts(p=>p.filter(x=>x.id!==post.id))}>Gỡ bài khỏi bản demo</button></article>)}

        {/* Feed Posts List */}
        <div className="flex flex-col gap-5 items-center w-full">
          {/* Post 1: Linh Chi */}
          <article id="post-1" className="w-full bg-white rounded-[28px] overflow-hidden border border-slate-200/80 shadow-xs flex flex-col">
            <div className="relative w-full h-[280px] overflow-hidden bg-slate-100">
              <img
                className="w-full h-full object-cover"
                alt="Hoàng hôn Bãi Sao"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0JCNh20LK9QLCgodpv-FsEf6YuyfGAIIslMT4Ft5SsmOc05IESx0tTX3imKxuqIMb30s2G9SBqbmjlqBqlHCpiYEHiPxgvYgtmB5w64UcErV0u_OSig-SMG4SuiM9PSRVVKbesfehqpIFo9VM41abyYrCJhfhJbQpv_PQK93XTli28BdpYJDeyQ9zJ620TJtnEVo9RcY0RaB1Hq9cnTi0EWx1abtYXSRVVipMdoI-fegzZPvY7Q"
              />
              <div className="absolute inset-x-0 top-0 p-4 bg-gradient-to-b from-black/60 via-black/20 to-transparent flex items-center justify-between text-white">
                <div className="flex items-center gap-2.5">
                  <img
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-white/80 shrink-0"
                    alt="Linh Chi"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfDGmAp1h8WJ5IWRdqzzY8sPGW9aZEagx2WXbSKzqVTgI0QmMzQftJvW45H4qXzvAHc4bg1uiqtJrmdYP9nEpiz3TJl7y3nmlTUbqqWmSg87CVnGjV-EV7tW6YkSYKpRRvVz2p6fS2RZVsL6k2xLsE0oRrtMZL8C0FAlr78bjd56Q1Cnata_6HCqIJ-906IY6qMotbhiFFgkrZVVuAHZJYwJ6H_HM_5Ovd1i-VP93R-l4P2IbzBw"
                  />
                  <div className="flex flex-col leading-tight">
                    <div className="flex items-center gap-1.5">
                      <span className="font-heading text-xs font-bold text-white drop-shadow-xs">Linh Chi</span>
                      <span className="text-[10px] text-white/80">• 2 giờ</span>
                    </div>
                    <span className="text-[10px] text-white/90 font-medium">Bãi Sao, Phú Quốc</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPostOptionsModal(true)}
                  className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 cursor-pointer"
                >
                  •••
                </button>
              </div>
            </div>

            <div className="p-4 flex flex-col gap-2.5 bg-white">
              <p className="text-xs text-slate-800 leading-relaxed line-clamp-2">
                Hoàng hôn ở Bãi Sao thật sự đẹp ngoài mong đợi! Nước biển trong xanh, cát trắng mịn.{' '}
                <span className="text-[#0A1680] font-bold cursor-pointer hover:underline">Xem thêm</span>
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-slate-500 text-xs">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => toggleLike('post-1')}
                    className={`flex items-center gap-1 cursor-pointer transition-colors ${
                      likedPosts['post-1'] ? 'text-rose-600 font-bold' : 'hover:text-rose-600'
                    }`}
                  >
                    <span>{likedPosts['post-1'] ? '❤️' : '🤍'}</span>
                    <span className="font-mono">{likedPosts['post-1'] ? 244 : 243}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCommentsModal(true)}
                    className="flex items-center gap-1 hover:text-[#0A1680] cursor-pointer"
                  >
                    <span>💬</span>
                    <span className="font-mono">32</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowShareModal(true)}
                    className="flex items-center gap-1 hover:text-[#0A1680] cursor-pointer"
                  >
                    <span>↗</span>
                    <span className="font-mono">18</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => toggleBookmark('post-1')}
                  className="text-base cursor-pointer hover:text-[#0A1680]"
                >
                  {bookmarkedPosts['post-1'] ? '★' : '☆'}
                </button>
              </div>
            </div>
          </article>

          {/* Post 2: Minh Khang */}
          <article id="post-2" className="w-full bg-white rounded-[28px] overflow-hidden border border-slate-200/80 shadow-xs flex flex-col">
            <div className="relative w-full h-[280px] overflow-hidden bg-slate-100">
              <img
                className="w-full h-full object-cover"
                alt="Phố cổ Hội An"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqHN6u_i4757cqi53MGWhBzA57aKsWI_0NlYibavulXSkp64gxbz5I_2OiG3u3ifPIhgw_-I_U_iO1n6XvQ-GTeSt-ukDiW9WWaiYIEHh03KJIA7r-txTdxlm-XL3s4fww2RGzz9FIjOOqb9E0-SJ4SCnc2eiNk2RJhNZ9Ee6FQy9GtbtH-xtSy-q3at5JG_LirzGFPGKNT9eGJjw8aMjUDmvzhKZyHlbJhuIUWyp66ltoaLinEA"
              />
              <div className="absolute inset-x-0 top-0 p-4 bg-gradient-to-b from-black/60 via-black/20 to-transparent flex items-center justify-between text-white">
                <div className="flex items-center gap-2.5">
                  <img
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-white/80 shrink-0"
                    alt="Minh Khang"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_tL6Afe_exctDdOXmYhuIyu36ti50SVPgZyzQue-fG0Iy9kE90antj5DbiL5Ob3hToKIXIJEpKyfdDQDZGmGlaLI3SgKaXsWP3fow5TywyOkxJUUpLIn5FlLsn61uxJ4Y1fvHP-WDTeYQNlkik8B7QD0fYzf4nakmKQi0-8vcvmdTNkhnPiNocQay5DPyDAtHbdV08CvXYIGLBIis6C7bOZKYrL574jKliu_6Y0OMmMgVc8B2Qw"
                  />
                  <div className="flex flex-col leading-tight">
                    <div className="flex items-center gap-1.5">
                      <span className="font-heading text-xs font-bold text-white drop-shadow-xs">Minh Khang</span>
                      <span className="text-[10px] text-white/80">• 5 giờ</span>
                    </div>
                    <span className="text-[10px] text-white/90 font-medium">Phố cổ Hội An, Quảng Nam</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPostOptionsModal(true)}
                  className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 cursor-pointer"
                >
                  •••
                </button>
              </div>
            </div>

            <div className="p-4 flex flex-col gap-2.5 bg-white">
              <p className="text-xs text-slate-800 leading-relaxed line-clamp-2">
                Phố cổ Hội An lúc nào cũng mang một vẻ đẹp rất riêng. Đèn lồng lung linh, ẩm thực đậm đà.{' '}
                <span className="text-[#0A1680] font-bold cursor-pointer hover:underline">Xem thêm</span>
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-slate-500 text-xs">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => toggleLike('post-2')}
                    className={`flex items-center gap-1 cursor-pointer transition-colors ${
                      likedPosts['post-2'] ? 'text-rose-600 font-bold' : 'hover:text-rose-600'
                    }`}
                  >
                    <span>{likedPosts['post-2'] ? '❤️' : '🤍'}</span>
                    <span className="font-mono">{likedPosts['post-2'] ? 190 : 189}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCommentsModal(true)}
                    className="flex items-center gap-1 hover:text-[#0A1680] cursor-pointer"
                  >
                    <span>💬</span>
                    <span className="font-mono">19</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowShareModal(true)}
                    className="flex items-center gap-1 hover:text-[#0A1680] cursor-pointer"
                  >
                    <span>↗</span>
                    <span className="font-mono">12</span>
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => toggleBookmark('post-2')}
                  className="text-base cursor-pointer hover:text-[#0A1680]"
                >
                  {bookmarkedPosts['post-2'] ? '★' : '☆'}
                </button>
              </div>
            </div>
          </article>
        </div>

      </main>

        {/* Keep the create action beside Lumi, outside the scrolling feed. */}
        <div className="absolute bottom-[102px] left-5 z-30">
          <button
            type="button"
            onClick={onCreatePost}
            className="h-12 flex items-center gap-2 px-5 rounded-full bg-[#0A1680] text-white shadow-lg shadow-[#0A1680]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer font-heading font-bold text-xs"
          >
            <span>+</span>
            <span>Tạo bài viết</span>
          </button>
        </div>

      {/* POPUP 1: Bottom Sheet Comments */}
      {showCommentsModal && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setShowCommentsModal(false)}
          />
          <div className="relative w-full max-w-[390px] mx-auto bg-white rounded-t-[28px] shadow-2xl flex flex-col max-h-[82vh] z-10 animate-in slide-in-from-bottom duration-200">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-1 shrink-0" />
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-[16px] text-[#0A1680]">Bình luận</h2>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[11px] font-bold text-slate-500">32</span>
              </div>
              <button
                type="button"
                onClick={() => setShowCommentsModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="w-8 h-8 rounded-full bg-blue-100 text-[#0A1680] font-bold flex items-center justify-center text-xs shrink-0">TT</span>
                <div className="flex-1 bg-slate-50 rounded-2xl p-3 border border-slate-100">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-heading font-bold text-slate-900">Thuỳ Trang</span>
                    <span className="text-[10px] text-slate-400">1 giờ trước</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">Góc chụp đón hoàng hôn đỉnh thật bạn ơi! Đi tầm mấy giờ chiều là đẹp nhất vậy ạ?</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs shrink-0">BN</span>
                <div className="flex-1 bg-slate-50 rounded-2xl p-3 border border-slate-100">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-heading font-bold text-slate-900">Bảo Nam</span>
                    <span className="text-[10px] text-slate-400">45 phút trước</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">Phú Quốc mùa này thời tiết quá lý tưởng luôn, nhìn ảnh muốn xách balo lên đi ngay!</p>
                </div>
              </div>
            </div>
            <div className="p-3 px-4 border-t border-slate-100 bg-white">
              <form
                className="flex items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast('Đã gửi bình luận!');
                }}
              >
                <input
                  type="text"
                  placeholder="Viết bình luận chân thật..."
                  className="flex-1 h-10 px-3.5 text-xs bg-slate-100 rounded-full focus:outline-none focus:bg-white border border-slate-200"
                />
                <button
                  type="submit"
                  className="h-10 px-4 rounded-full bg-[#0A1680] text-white font-heading font-bold text-xs"
                >
                  Gửi
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* POPUP 2: Share Sheet */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setShowShareModal(false)}
          />
          <div className="relative w-full max-w-[390px] mx-auto bg-white rounded-t-[28px] shadow-2xl p-5 flex flex-col gap-3.5 z-10 animate-in slide-in-from-bottom duration-200">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto shrink-0" />
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-bold text-[16px] text-[#0A1680]">Chia sẻ bài viết</h2>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center text-xs py-2">
              <button
                type="button"
                onClick={() => {
                  showToast('Đã sao chép liên kết bài viết! 📋');
                  setShowShareModal(false);
                }}
                className="flex flex-col items-center gap-1.5 cursor-pointer"
              >
                <div className="w-11 h-11 rounded-full bg-slate-100 text-[#0A1680] flex items-center justify-center text-lg">
                  🔗
                </div>
                <span className="text-[11px] font-medium text-slate-700">Sao chép</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast('Đã mở chia sẻ tin nhắn TravAIy');
                  setShowShareModal(false);
                }}
                className="flex flex-col items-center gap-1.5 cursor-pointer"
              >
                <div className="w-11 h-11 rounded-full bg-blue-100 text-[#0A1680] flex items-center justify-center text-lg">
                  💬
                </div>
                <span className="text-[11px] font-medium text-slate-700">Tin nhắn</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast('Mở Facebook');
                  setShowShareModal(false);
                }}
                className="flex flex-col items-center gap-1.5 cursor-pointer"
              >
                <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
                  f
                </div>
                <span className="text-[11px] font-medium text-slate-700">Facebook</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast('Tạo mã QR chia sẻ 📱');
                  setShowShareModal(false);
                }}
                className="flex flex-col items-center gap-1.5 cursor-pointer"
              >
                <div className="w-11 h-11 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-lg">
                  QR
                </div>
                <span className="text-[11px] font-medium text-slate-700">Mã QR</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP 3: Post Options Sheet */}
      {showPostOptionsModal && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setShowPostOptionsModal(false)}
          />
          <div className="relative w-full max-w-[390px] mx-auto bg-white rounded-t-[28px] shadow-2xl p-5 flex flex-col gap-2 z-10 animate-in slide-in-from-bottom duration-200 text-xs">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto shrink-0 mb-1" />
            <button
              type="button"
              onClick={() => {
                showToast('Đã lưu bài viết vào bộ sưu tập của bạn!');
                setShowPostOptionsModal(false);
              }}
              className="p-3 rounded-2xl hover:bg-slate-50 text-left font-heading font-bold text-slate-800 flex items-center gap-2.5 cursor-pointer"
            >
              <span>★</span>
              <span>Lưu bài viết</span>
            </button>
            <button
              type="button"
              onClick={() => {
                showToast('Đã ẩn bài viết này. TravAIy sẽ gợi ý ít hơn.');
                setShowPostOptionsModal(false);
              }}
              className="p-3 rounded-2xl hover:bg-slate-50 text-left font-heading font-bold text-slate-600 flex items-center gap-2.5 cursor-pointer"
            >
              <span>👁️‍🗨️</span>
              <span>Ẩn bài viết này</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setShowPostOptionsModal(false);
                setShowReportModal(true);
              }}
              className="p-3 rounded-2xl hover:bg-rose-50 text-left font-heading font-bold text-rose-600 flex items-center gap-2.5 cursor-pointer"
            >
              <span>⚠️</span>
              <span>Báo cáo bài viết</span>
            </button>
          </div>
        </div>
      )}

      {/* POPUP 4: Report Post Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setShowReportModal(false)}
          />
          <div className="relative w-full max-w-[390px] mx-auto bg-white rounded-t-[28px] shadow-2xl p-5 pb-8 flex flex-col gap-3.5 z-10 animate-in slide-in-from-bottom duration-200">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto shrink-0" />
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-[16px] text-rose-600">Báo cáo vi phạm</h3>
              <button onClick={() => setShowReportModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100">✕</button>
            </div>
            <div className="space-y-2 text-xs">
              {['Thông tin sai lệch / Lừa đảo', 'Nội dung phản cảm / Không phù hợp', 'Spam / Quảng cáo trái phép'].map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => {
                    setShowReportModal(false);
                    showToast('Cảm ơn bạn đã phản ánh! Đội ngũ kiểm duyệt sẽ xử lý trong 24h.');
                  }}
                  className="w-full p-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-left font-heading font-semibold text-slate-800"
                >
                  {reason}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* POPUP 5: Community Notifications Sheet */}
      {showNotificationsModal && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setShowNotificationsModal(false)}
          />
          <div className="relative w-full max-w-[390px] mx-auto bg-white rounded-t-[28px] shadow-2xl flex flex-col max-h-[82vh] z-10 animate-in slide-in-from-bottom duration-200">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-1 shrink-0" />
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-[16px] text-[#0A1680]">Thông báo cộng đồng</h2>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[10px] font-bold text-[#0A1680]">Mới</span>
              </div>
              <button onClick={() => setShowNotificationsModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5 text-xs">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-blue-50/50 border border-blue-100">
                <span className="text-xl">❤️</span>
                <div>
                  <p className="text-slate-800 leading-snug"><strong className="text-[#0A1680]">Linh Chi</strong> và 14 người khác đã thích bài viết của bạn.</p>
                  <span className="text-[10px] text-slate-400">10 phút trước</span>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200">
                <span className="text-xl">💬</span>
                <div>
                  <p className="text-slate-800 leading-snug"><strong className="text-[#0A1680]">Minh Khang</strong> đã bình luận: "Chuyến đi tuyệt vời quá em ơi..."</p>
                  <span className="text-[10px] text-slate-400">35 phút trước</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-slate-900/90 backdrop-blur-md text-white text-xs font-semibold shadow-lg animate-in fade-in zoom-in duration-200">
          {toastMessage}
        </div>
      )}

      {/* Bottom Floating Navigation Dock with "Cộng đồng" active */}
      <BottomNav activeTab="explore" onTabChange={onNavigateTab} />
    </div>
  );
};
