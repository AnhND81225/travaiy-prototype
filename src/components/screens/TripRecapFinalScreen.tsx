import { exportRecap } from '../../features/travel/exportRecap';
import { images as recapImages } from '../../features/travel/fixtures';
import { useTravel } from '../../features/travel/TravelContext';
import React, { useState, useEffect } from 'react';
import { IOSStatusBar } from '../common/IOSStatusBar';

interface TripRecapFinalScreenProps {
  onBack: () => void;
  onFinish: () => void;
  onShareToCommunity?: () => void;
}

export const TripRecapFinalScreen: React.FC<TripRecapFinalScreenProps> = ({
  onBack,
  onFinish,
  onShareToCommunity,
}) => {
  const {plan,photos,setLocalPosts}=useTravel();
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedMusic, setSelectedMusic] = useState('Chill Summer Beats 🎵');
  const [showShareModal, setShowShareModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const recapSlides = [
    {
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBu23qKE7ytT0HiKJHXejjyg7ERfPC7J4dnTYIAro4qUXz4NgI2hxpQKZ4WIFeDkWjyYMdoZuN56uHh6NYbFz8RCbHZeuQWSJplPDv9DDLQFH7SiZyt73OAxjLDESPiFlzo0NQvlUzMr5fb6FPPbKEd3mD-dtcmMqqzVDUt22VSH2FNZYLVxoxMrdknz4NzGV7aU4X8CTIy9IXOgJBPeBIQDJfyv6CwhZ8u1eOKMnCgdz4zJ-cZ-w',
      title: 'Hành trình Phú Quốc 3N2Đ',
      subtitle: 'Khởi đầu với biển xanh Bãi Sao',
      tag: 'Ngày 1',
    },
    {
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdrDMa6B0vgD_SZQJ9nB95HY9MWdma1TwHE7BqfatoWmdICeVPO-IW31jj8OPElUeA4GkAWGQdppg1zzqR7UscwUJpmjiTN3GZHd76PtzcdKckyaoYCTs3-TaOp7e-MeIW6-0Osimzat6sOJSVVvthWKmXdmzNw8hBJiu7deyXho--c2xwF2AxAyAM5rIe60PMjKFiwyzKSW3nNmkpf4QFhM32lWPvibe09CbF4kyYkuACac7o7A',
      title: 'Lặn ngắm san hô Hòn Móng Tay',
      subtitle: 'Thế giới đại dương rực rỡ',
      tag: 'Ngày 2',
    },
    {
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVVnBXGRFKepzpuukUx8ccVz9iAPeDKSBVXacpGmMaRWYOW700G12GrNS49d2bFVkp1qf-gz-nEVXz8FTp9YNH8mODDqOArhCrMPvq-84n7bdacGUkrXLgVYUNm0iLSmjoG8HPXc_jDP4WgicenDDjbL5q3OyNkBxZj8l_pFeTyq5jDT9iVZd358Cyqc9LhSxo15bJtZarIDrZnajqnCxrKBB4XLGy9uydMSWLHIkEtIgzRYgRqg',
      title: 'Hoàng hôn rực rỡ Bãi Trường',
      subtitle: 'Khoảnh khắc trọn vẹn bên bạn bè',
      tag: 'Ngày 3',
    },
  ];

  // Auto slide when playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % recapSlides.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [isPlaying, recapSlides.length]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleExportVideo = async () => {
    setIsExporting(true);
    try {
      const selected=photos.filter(p=>p.tripId===plan.id).slice(0,3);
      const slides=selected.length?selected.map(p=>({image:p.src,title:p.title,subtitle:plan.destination})):Object.values({a:recapImages.beach,b:recapImages.bridge,c:recapImages.town}).map((image,index)=>({image,title:`${plan.destination} · Kỷ niệm ${index+1}`,subtitle:'Ảnh mẫu · Video demo không âm thanh'}));
      await exportRecap(slides);showToast('Đã tạo tệp video demo và bắt đầu tải xuống.');
    }catch(error){showToast(error instanceof Error?error.message:'Không thể xuất video.');}
    finally{setIsExporting(false);}
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-slate-950 text-white font-body-md antialiased select-none">
      {/* Header */}
      <header className="shrink-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <IOSStatusBar light={true} />
        <div className="h-[52px] px-5 flex items-center justify-between">
          <button
            onClick={onBack}
            aria-label="Quay lại"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div className="text-center">
            <h1 className="font-heading font-bold text-[16px] text-white">
              AI Story Recap
            </h1>
            <p className="text-[10px] text-slate-400">Xem trước & Xuất bản (Bước 3/3)</p>
          </div>
          <button
            onClick={() => setShowShareModal(true)}
            aria-label="Chia sẻ"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content: Story Player Canvas */}
      <main className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-5 py-4 pb-20 flex flex-col items-center max-w-md mx-auto w-full">
        {/* Story Video Container */}
        <div className="relative w-full aspect-[9/14] rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-900 group">
          {/* Progress Indicators */}
          <div className="absolute top-3 left-4 right-4 z-30 flex items-center gap-1.5">
            {recapSlides.map((_, idx) => (
              <div
                key={idx}
                className="h-1 flex-1 rounded-full bg-white/30 overflow-hidden cursor-pointer"
                onClick={() => setActiveSlide(idx)}
              >
                <div
                  className={`h-full bg-white transition-all duration-300 ${
                    idx === activeSlide ? 'w-full' : idx < activeSlide ? 'w-full' : 'w-0'
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Current Slide Image with smooth fade */}
          <img
            src={recapSlides[activeSlide].image}
            alt={recapSlides[activeSlide].title}
            className="w-full h-full object-cover transition-opacity duration-500"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 z-10 pointer-events-none" />

          {/* Top Story Info */}
          <div className="absolute top-7 left-4 z-20 flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#0A1680]/80 backdrop-blur-md text-[11px] font-bold text-white font-heading">
              {recapSlides[activeSlide].tag}
            </span>
            <span className="text-[12px] font-medium text-white/90 drop-shadow-md">
              Phú Quốc 2026
            </span>
          </div>

          {/* Play/Pause Button overlay */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label="Tạm dừng hoặc phát"
            className="absolute top-6 right-4 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white text-xs hover:bg-black/60 transition-colors cursor-pointer"
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          {/* Bottom Story Captions */}
          <div className="absolute bottom-6 left-5 right-5 z-20 flex flex-col gap-2">
            <h2 className="font-heading font-black text-[22px] text-white leading-tight drop-shadow-lg">
              {recapSlides[activeSlide].title}
            </h2>
            <p className="text-[13px] text-slate-200 line-clamp-2 drop-shadow-md">
              {recapSlides[activeSlide].subtitle}
            </p>

            {/* AI Generated Highlight Badges */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-semibold text-white">
                📍 8 địa điểm
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-semibold text-white">
                🌊 3 ngày biển đảo
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-semibold text-white">
                👥 4 bạn đồng hành
              </span>
            </div>
          </div>

          {/* Mascot Watermark inside Story */}
          <div className="absolute bottom-4 right-4 z-30 pointer-events-none opacity-90">
            <img
              src="/images/mascot-waving.png"
              alt="TravAly Mascot"
              className="w-10 h-10 object-contain drop-shadow-lg animate-mascot-float"
            />
          </div>
        </div>

        {/* Mascot Celebration Banner */}
        <div className="w-full mt-3 p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
          <img
            src="/images/mascot-suitcase.png"
            alt="Bé Sao Lumi chúc mừng"
            className="w-10 h-10 object-contain shrink-0 drop-shadow-xs"
          />
          <div className="min-w-0">
            <p className="text-[12px] font-bold text-white font-heading">Chuyến đi đáng nhớ cùng TravAly!</p>
            <p className="text-[10px] text-slate-300">Bé Sao Lumi chúc bạn lưu giữ trọn vẹn những khoảnh khắc đẹp nhất.</p>
          </div>
        </div>

        {/* Music Track Bar */}
        <div className="w-full mt-4 p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm animate-spin">
              💿
            </span>
            <div>
              <p className="text-[12px] font-bold text-white font-heading">{selectedMusic}</p>
              <p className="text-[10px] text-slate-400">Nhạc nền tự động tối ưu bởi AI</p>
            </div>
          </div>
          <button
            onClick={() => {
              const tracks = ['Chill Summer Beats 🎵', 'Sunset Acoustic 🎸', 'Tropical House 🏖️', 'Vlog Aesthetic ☕'];
              const nextIdx = (tracks.indexOf(selectedMusic) + 1) % tracks.length;
              setSelectedMusic(tracks[nextIdx]);
              showToast(`Đã đổi nhạc: ${tracks[nextIdx]}`);
            }}
            className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded-lg bg-indigo-500/10 cursor-pointer"
          >
            Đổi nhạc
          </button>
        </div>

        {/* Action Buttons */}
        <div className="w-full mt-4 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={handleExportVideo}
            disabled={isExporting}
            className="w-full h-12 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-[#0A1680] text-white font-heading text-[15px] font-bold shadow-lg flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer"
          >
            {isExporting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Đang tạo video demo…</span>
              </>
            ) : (
              <>
                <span>⬇</span>
                <span>Tải video demo không âm thanh</span>
              </>
            )}
          </button>

          <div className="flex gap-2.5 w-full">
            <button
              type="button"
              onClick={() => {
                setLocalPosts(p=>[{id:`recap-${Date.now()}`,text:`Kỷ niệm chuyến đi ${plan.destination} · ${plan.days} ngày.`,location:plan.destination,tags:['#Travaiy','#Recap'],audience:'Công khai (demo)',createdAt:new Date().toISOString()},...p]);if (onShareToCommunity) onShareToCommunity();
                else showToast('Đã chia sẻ lên Bảng tin cộng đồng TravAIy! 🎉');
              }}
              className="flex-1 h-11 rounded-full bg-white/10 text-white font-heading text-xs font-bold border border-white/20 hover:bg-white/20 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>🌐</span>
              <span>Đăng cộng đồng</span>
            </button>
            <button
              type="button"
              onClick={onFinish}
              className="flex-1 h-11 rounded-full bg-emerald-600 text-white font-heading text-xs font-bold hover:bg-emerald-500 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>✓</span>
              <span>Hoàn tất & Lưu</span>
            </button>
          </div>
        </div>
      </main>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-[390px] bg-slate-900 rounded-t-[28px] p-5 shadow-2xl flex flex-col gap-3 border-t border-slate-800 text-white animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-heading font-bold text-[16px]">Chia sẻ Story Recap</h3>
              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-800"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3 py-3 text-center">
              {[
                { name: 'Instagram', icon: '📸', color: 'from-pink-500 to-rose-500' },
                { name: 'TikTok', icon: '🎵', color: 'from-slate-700 to-black' },
                { name: 'Facebook', icon: '👥', color: 'from-blue-600 to-blue-700' },
                { name: 'Sao chép link', icon: '🔗', color: 'from-indigo-600 to-purple-600' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setShowShareModal(false);
                    showToast(`Đã chuẩn bị liên kết cho ${item.name}!`);
                  }}
                  className="flex flex-col items-center gap-1.5 cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} flex items-center justify-center text-xl shadow-md`}>
                    {item.icon}
                  </div>
                  <span className="text-[10px] text-slate-300 font-medium">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-white text-slate-900 text-xs font-bold shadow-xl animate-in fade-in zoom-in duration-200 flex items-center gap-2">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
