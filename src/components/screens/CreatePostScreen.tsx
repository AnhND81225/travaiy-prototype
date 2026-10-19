import { useTravel } from '../../features/travel/TravelContext';
import React, { useState } from 'react';
import { IOSStatusBar } from '../common/IOSStatusBar';

interface CreatePostScreenProps {
  onBack: () => void;
  onPostSuccess: () => void;
}

export const CreatePostScreen: React.FC<CreatePostScreenProps> = ({
  onBack,
  onPostSuccess,
}) => {
  const {setLocalPosts}=useTravel();
  const [postText, setPostText] = useState(
    'Một ngày đáng nhớ tại Phú Quốc! Biển xanh, nắng ấm, đồ ăn siêu ngon và vô vàn trải nghiệm thú vị! 🌴☀️'
  );
  const [hashtags, setHashtags] = useState(['#PhuQuoc', '#BienDep', '#AmThuc', '#DuLichVietnam']);
  const [locationName, setLocationName] = useState('Phú Quốc, Kiên Giang');
  const [audience, setAudience] = useState('Công khai');

  // Modals state
  const [showAddPhotosModal, setShowAddPhotosModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showTagsModal, setShowTagsModal] = useState(false);
  const [showAIWriteModal, setShowAIWriteModal] = useState(false);
  const [showPublishPreviewModal, setShowPublishPreviewModal] = useState(false);
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handlePublish = () => {
    if(!postText.trim()){showToast('Nhập nội dung trước khi đăng.');return;}
    setLocalPosts(p=>[{id:`local-post-${Date.now()}`,text:postText,location:locationName,tags:hashtags,audience,createdAt:new Date().toISOString()},...p]);
    setShowPublishPreviewModal(false);
    showToast('Đã lưu bài viết vào bảng tin trên trình duyệt này.');
    setTimeout(() => {
      onPostSuccess();
    }, 1200);
  };

  const removeTag = (tagToRemove: string) => {
    setHashtags(hashtags.filter((t) => t !== tagToRemove));
  };

  const addTag = (tagToAdd: string) => {
    let formatted = tagToAdd.trim();
    if (!formatted.startsWith('#')) formatted = `#${formatted}`;
    if (!hashtags.includes(formatted)) {
      setHashtags([...hashtags, formatted]);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#FCFDFF] text-[#191c1e] antialiased select-none">
      {/* Header */}
      <header className="shrink-0 z-30 bg-[#FCFDFF]/95 backdrop-blur-md border-b border-[#edeef0]">
        <IOSStatusBar light={false} />
        <div className="h-[52px] px-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDiscardModal(true)}
              aria-label="Quay lại"
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <h1 className="font-heading font-bold text-[17px] text-[#0A1680]">
              Tạo bài viết
            </h1>
          </div>
          <button
            onClick={() => setShowPublishPreviewModal(true)}
            className="bg-[#0A1680] text-white px-4 h-9 rounded-full font-heading text-xs shadow-sm active:scale-95 transition-transform flex items-center gap-1.5 font-bold cursor-pointer"
          >
            <span>Đăng</span>
            <span>›</span>
          </button>
        </div>
      </header>

      {/* Main Form */}
      <main className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-5 pt-3 pb-24 flex flex-col gap-4">
        {/* Selected Photos Tray */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold text-slate-700">
              Đã chọn <strong className="text-[#0A1680]">4</strong>/10 ảnh
            </span>
            <span>Tối đa 10 ảnh</span>
          </div>
          <div className="flex items-center gap-2.5 overflow-x-auto py-1 no-scrollbar">
            <div className="relative flex-shrink-0 w-[210px] h-40 rounded-[20px] overflow-hidden shadow-xs border border-slate-200">
              <img
                className="w-full h-full object-cover"
                alt="Tropical beach"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqn3NvPak6z5iopRK8EFAn9T-cUDFO4jTR00pmo8IMzwhxM65bfDX5JhnInQhQDc7r57GPfIPOFW5wFarS82gttq4cOhlUM0WohEMgTW2hJ0T4nIhoIyZPcp-RGw5QJ228wJyXqtsyf6PIxkuA6YXGIK7I3oNAktsqD3gCqUH1d8sE7v2nDS9KY_SfUjY8GpH0sLx3u_yykfeGZ9bFltTcRBW_Ex8gG8SRLgvWQq_qlM8sL5KPUA"
              />
            </div>
            <div className="relative flex-shrink-0 w-24 h-40 rounded-[20px] overflow-hidden shadow-xs border border-slate-200">
              <img
                className="w-full h-full object-cover"
                alt="Smiling girl"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2UD46DXsAeLk75droevl1WRNXPWGMgE_9KcfvKF-7eq6JAsxtHlfzhGwmkaUy0y3sRmdwzRc0u1eK15iVaTkDsb_KA6O2ra-TP-BgZBF2S4M6sYOeA_5Y9WdB2erwYkoJhyPr3qOgXdBo5MiELnLO8k0PPY-s2Jgd2Ipn-3keHqvJ8iMRgGaQgpcOVm_z29x7Kt-uJ1dbLfkpR32qYveQkMu8Ik0ZOc0qN2rKYxGRXLpCsWDtdg"
              />
            </div>
            <div className="relative flex-shrink-0 w-24 h-40 rounded-[20px] overflow-hidden shadow-xs border border-slate-200">
              <img
                className="w-full h-full object-cover"
                alt="Sunset"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyWqJCbSPFZrrzhWEbzzeFBkBZToK32nCnT1TLBhgRwQt5EBatjGVmXIt60m33B4vxdSewD5HorImRKmEcuBlozGSYxe89jq5Vz_kq889xh1zHFjEvvZSvhVkL01ONJcZLdHyTm_nylyBJk6sTcNp0UeRaM5IiN1iAdK2cSDkdrRZpNgprbf3Arwdi9gVgRWesgwgOG0xXHqJ1rsjLMM1vIoAodXyByZxRbPHGLZbHWLTZmpsjDw"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowAddPhotosModal(true)}
              className="flex-shrink-0 w-24 h-40 rounded-[20px] border-2 border-dashed border-[#93B2F8]/60 bg-[#93B2F8]/10 hover:bg-[#93B2F8]/20 flex flex-col items-center justify-center gap-1 text-[#0A1680] cursor-pointer"
            >
              <span className="text-xl font-bold">+</span>
              <span className="text-[11px] font-bold font-heading">Thêm ảnh</span>
            </button>
          </div>
        </div>

        {/* Textarea Composer */}
        <div className="bg-white border border-slate-200 rounded-[20px] p-4 shadow-xs flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-[#0A1680] font-bold text-xs font-heading">
                NH
              </span>
              <span className="text-[13px] font-bold text-slate-800 font-heading">
                Nguyễn Hoàng
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowAIWriteModal(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#FBEDB0] hover:bg-amber-200 text-[#0A1680] text-[11px] font-bold font-heading border border-amber-300 cursor-pointer"
            >
              <span>✦ AI viết giúp</span>
            </button>
          </div>

          <textarea
            className="w-full bg-transparent text-[13px] leading-relaxed text-slate-800 resize-none focus:outline-none placeholder:text-slate-400"
            maxLength={500}
            rows={4}
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="Chia sẻ hành trình của bạn..."
          />

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <button
                type="button"
                onClick={() => setPostText((prev) => prev + ' 🌴✨')}
                className="hover:text-slate-600"
              >
                😀
              </button>
              <button
                type="button"
                onClick={() => showToast('Đã mở danh sách bạn bè để gắn thẻ')}
                className="hover:text-slate-600"
              >
                👤+
              </button>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">{postText.length}/500</span>
          </div>
        </div>

        {/* Hashtags Row */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[12px] font-bold text-slate-600 font-heading">
            Hashtag liên quan
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {hashtags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 bg-blue-50 text-[#0A1680] pl-3 pr-2 py-1 rounded-full text-[12px] font-medium"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-rose-600 cursor-pointer"
                >
                  ✕
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={() => setShowTagsModal(true)}
              className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-[#0A1680] px-3 py-1 rounded-full text-[12px] font-bold font-heading cursor-pointer"
            >
              + Thêm tag
            </button>
          </div>
        </div>

        {/* Location & Audience Rows */}
        <div className="flex flex-col gap-2">
          <div
            onClick={() => setShowLocationModal(true)}
            className="bg-white border border-slate-200 rounded-[16px] px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors text-xs"
          >
            <div className="flex items-center gap-2 truncate">
              <span>📍</span>
              <span className="text-slate-500">Địa điểm:</span>
              <strong className="text-slate-800 font-heading">{locationName}</strong>
            </div>
            <span className="text-[#0A1680] font-bold font-heading">Đổi</span>
          </div>

          <div
            onClick={() => setShowPublishPreviewModal(true)}
            className="bg-white border border-slate-200 rounded-[16px] px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors text-xs"
          >
            <div className="flex items-center gap-2 truncate">
              <span>🌐</span>
              <span className="text-slate-500">Ai có thể xem:</span>
              <strong className="text-slate-800 font-heading">{audience}</strong>
            </div>
            <span className="text-slate-400">▾</span>
          </div>
        </div>

        {/* Main CTA Publish Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowPublishPreviewModal(true)}
            className="w-full bg-[#0A1680] text-white h-11 rounded-full font-heading text-[15px] font-bold shadow-md hover:bg-[#071060] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Đăng bài</span>
            <span>→</span>
          </button>
        </div>
      </main>

      {/* POPUP 1: Thêm ảnh */}
      {showAddPhotosModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-[390px] rounded-t-[28px] p-5 flex flex-col gap-3 shadow-xl animate-in slide-in-from-bottom duration-200">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto" />
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <h3 className="font-heading font-bold text-[16px] text-[#0A1680]">Chọn ảnh tải lên</h3>
              <button onClick={() => setShowAddPhotosModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100">✕</button>
            </div>
            <div className="grid grid-cols-3 gap-2 py-2">
              {[1, 2, 3, 4].map((idx) => (
                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border-2 border-[#0A1680]">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqn3NvPak6z5iopRK8EFAn9T-cUDFO4jTR00pmo8IMzwhxM65bfDX5JhnInQhQDc7r57GPfIPOFW5wFarS82gttq4cOhlUM0WohEMgTW2hJ0T4nIhoIyZPcp-RGw5QJ228wJyXqtsyf6PIxkuA6YXGIK7I3oNAktsqD3gCqUH1d8sE7v2nDS9KY_SfUjY8GpH0sLx3u_yykfeGZ9bFltTcRBW_Ex8gG8SRLgvWQq_qlM8sL5KPUA"
                    className="w-full h-full object-cover"
                    alt="photo"
                  />
                  <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#0A1680] text-white flex items-center justify-center font-bold text-[10px]">✓</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowAddPhotosModal(false)}
              className="w-full h-11 rounded-full bg-[#0A1680] text-white font-heading font-bold text-xs"
            >
              Xác nhận (4 ảnh)
            </button>
          </div>
        </div>
      )}

      {/* POPUP 2: Đổi địa điểm */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-[390px] rounded-t-[28px] p-5 flex flex-col gap-3 shadow-xl animate-in slide-in-from-bottom duration-200">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto" />
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <h3 className="font-heading font-bold text-[16px] text-[#0A1680]">Chọn điểm đến / Check-in</h3>
              <button onClick={() => setShowLocationModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100">✕</button>
            </div>
            <div className="space-y-1.5 text-xs">
              {['Bãi Sao, An Thới', 'Sunset Sanato Beach Club', 'Dinh Cậu, Dương Đông', 'Hòn Thơm, Phú Quốc'].map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => {
                    setLocationName(loc);
                    setShowLocationModal(false);
                    showToast(`Đã đổi check-in sang ${loc}`);
                  }}
                  className="w-full p-2.5 rounded-xl hover:bg-slate-50 text-left font-heading font-semibold text-slate-800 flex items-center gap-2 cursor-pointer"
                >
                  <span>📍</span>
                  <span>{loc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* POPUP 3: Thêm hashtag */}
      {showTagsModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-[390px] rounded-t-[28px] p-5 flex flex-col gap-3 shadow-xl animate-in slide-in-from-bottom duration-200">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto" />
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <h3 className="font-heading font-bold text-[16px] text-[#0A1680]">Thêm Hashtag</h3>
              <button onClick={() => setShowTagsModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100">✕</button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nhập tag mới..."
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0A1680]"
              />
              <button
                type="button"
                onClick={() => {
                  if (newTagInput) {
                    addTag(newTagInput);
                    setNewTagInput('');
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-[#0A1680] text-white font-heading font-bold text-xs"
              >
                + Thêm
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {['#HoangHonPhuQuoc', '#CheckInKienGiang', '#TravelVietnam2025', '#HaiSanTuoiSong'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => addTag(t)}
                  className="px-3 py-1 rounded-full bg-blue-50 text-[#0A1680] font-heading text-[11px] font-semibold hover:bg-blue-100"
                >
                  {t}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowTagsModal(false)}
              className="w-full py-2.5 rounded-full bg-[#0A1680] text-white font-heading font-bold text-xs mt-2"
            >
              Hoàn tất
            </button>
          </div>
        </div>
      )}

      {/* POPUP 4: AI Viết Giúp */}
      {showAIWriteModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-[390px] rounded-t-[28px] p-5 flex flex-col gap-3.5 shadow-xl animate-in slide-in-from-bottom duration-200">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto" />
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="text-amber-500 font-bold">✦</span>
                <h3 className="font-heading font-bold text-[16px] text-[#0A1680]">AI Viết Bài Giúp Bạn</h3>
              </div>
              <button onClick={() => setShowAIWriteModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100">✕</button>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-xs text-slate-700 leading-relaxed">
              <strong className="block text-[#0A1680] font-heading mb-1">Gợi ý từ TravAIy:</strong>
              "Bỏ lại sau lưng phố xá nhộn nhịp, Phú Quốc chào đón mình bằng bờ cát trắng mịn và biển xanh trong vắt tận đáy. Một ngày dịu dàng để tâm hồn hòa cùng sóng gió ngọc đảo... ✨🏖️"
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowAIWriteModal(false)}
                className="flex-1 py-2.5 rounded-full border border-slate-200 text-slate-700 font-heading font-bold text-xs"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => {
                  setPostText(
                    'Bỏ lại sau lưng phố xá nhộn nhịp, Phú Quốc chào đón mình bằng bờ cát trắng mịn và biển xanh trong vắt tận đáy. Một ngày dịu dàng để tâm hồn hòa cùng sóng gió ngọc đảo... ✨🏖️'
                  );
                  setShowAIWriteModal(false);
                  showToast('Đã áp dụng bản thảo từ AI!');
                }}
                className="flex-1 py-2.5 rounded-full bg-[#0A1680] text-white font-heading font-bold text-xs shadow-md"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP 5: Publish Preview Modal */}
      {showPublishPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-[390px] rounded-t-[28px] p-5 flex flex-col gap-3 shadow-xl animate-in slide-in-from-bottom duration-200">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto" />
            <div className="flex items-center justify-between pb-1 border-b border-slate-100">
              <h3 className="font-heading font-bold text-[16px] text-[#0A1680]">Xem trước & Đăng bài</h3>
              <button onClick={() => setShowPublishPreviewModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100">✕</button>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
              <p className="font-heading font-bold text-slate-900 mb-1">Nguyễn Hoàng • {locationName}</p>
              <p className="line-clamp-2">{postText}</p>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Đối tượng xem
              </span>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {['Công khai', 'Bạn bè', 'Chỉ mình tôi'].map((aud) => (
                  <button
                    key={aud}
                    type="button"
                    onClick={() => setAudience(aud)}
                    className={`py-2 rounded-xl font-heading font-bold cursor-pointer border ${
                      audience === aud
                        ? 'bg-blue-50 border-[#0A1680] text-[#0A1680]'
                        : 'border-slate-200 text-slate-700'
                    }`}
                  >
                    {aud}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={handlePublish}
              className="w-full h-11 rounded-full bg-[#0A1680] text-white font-heading font-bold text-xs shadow-md mt-2 cursor-pointer"
            >
              Xác nhận đăng bài ✓
            </button>
          </div>
        </div>
      )}

      {/* POPUP 6: Discard Dialog */}
      {showDiscardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-[342px] bg-white rounded-[28px] p-6 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-xl mb-3">
              🗑️
            </div>
            <h3 className="font-heading font-bold text-[18px] text-slate-900 mb-1">Hủy bài viết?</h3>
            <p className="text-[12px] text-slate-500 mb-5 leading-relaxed">
              Nếu bạn rời đi bây giờ, tất cả nội dung vừa chỉnh sửa sẽ bị mất.
            </p>
            <div className="flex flex-col gap-2 w-full">
              <button
                type="button"
                onClick={() => {
                  setShowDiscardModal(false);
                  onBack();
                }}
                className="w-full h-11 rounded-full bg-rose-600 text-white font-heading font-bold text-xs shadow-md cursor-pointer"
              >
                Bỏ bài viết
              </button>
              <button
                type="button"
                onClick={() => setShowDiscardModal(false)}
                className="w-full h-10 rounded-full border border-slate-200 text-slate-700 font-heading font-semibold text-xs cursor-pointer"
              >
                Tiếp tục chỉnh sửa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-slate-900/90 backdrop-blur-md text-white text-xs font-semibold shadow-lg animate-in fade-in zoom-in duration-200">
          {toastMessage}
        </div>
      )}
    </div>
  );
};
