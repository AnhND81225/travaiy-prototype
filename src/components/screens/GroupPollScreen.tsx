import React, { useState } from 'react';
import { IOSStatusBar } from '../common/IOSStatusBar';

interface GroupPollScreenProps {
  onBack: () => void;
}

interface PollOption {
  id: number;
  name: string;
  tagline: string;
  image: string;
  votes: number;
  totalVotes: number;
  voterAvatars: string[];
}

export const GroupPollScreen: React.FC<GroupPollScreenProps> = ({ onBack }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<number>(1);
  const [pollOptions, setPollOptions] = useState<PollOption[]>([
    {
      id: 1,
      name: 'Bữa tối Sài Gòn',
      tagline: 'Hải sản tươi sống • View biển',
      image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=700&q=80',
      votes: 3,
      totalVotes: 6,
      voterAvatars: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAdvFOMCd3iB5IDfHsQSFrHpVBBRTJ6OIOQvoYJqme7FxQYn-yv6dlBh1jJJiWDyG0rTApgi6tbpgOW6YInIXCqKxyxnebkDsUvyNgEj-VDFG_TsNJf_tnwTaZCpbnqY5jtgWo0dOTaInFYA3WPb8oLga-RtS1SRS0f_8AO51xmW2FlVRQ66A5uKX40_pqbEGHVXRNc8bFmXvABnNKtzTV5UlbZY0B5NAGAk4MC8GUSEiwAZMSYAg',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuC73gPHlSVSfalrtCpq8M1Lfb7PxBAC821kufcttmqgkkPAjswavkCo5i3iFkvSj7P1bJV4k8UbLAPviP4FLWuEYISVg07E84HVdXdfaCchWdGFAZYe6tFwM3kg9gx1iLzxDPKSSJxhO0J5-E7x8uQ2DVDAdeQX7BF9XT2tuVRl2Zj9M3Hb_avp5qsjPnNg2yK0JUq8819iJq9MQaV62gN5zyiK-LhsbSPgRbE46AFvUE_VMP-Ycg',
      ],
    },
    {
      id: 2,
      name: 'Mì Quảng Bà Mua',
      tagline: 'Đặc sản TP.HCM • Vị đậm đà',
      image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=700&q=80',
      votes: 2,
      totalVotes: 6,
      voterAvatars: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCEDwNWFZ-sX0BSdPMNstPPQnLMiBLbGvSeXS-C32wD5E0sdD2MDkozZrn9eBzU-C2yyk_TBPrGX7j6Y005JCDRobIDEAztSDch7iosrRxzuZL3U9MCcyOd9nsWphBuBwFqPh0bSCZtbXXZiRIljzuJASSzGX-tp0Edj9q21kcVKQ6iHqCOBL5Bvf8EYQKJb5Lj5xUiR-AZ3ALeqUsx5WUnb2mWUPvj3shkhysMvrrwnq8L4Rg39A',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCqQrItoX06OARFywYRhUbj80A79RDFF37VkHFShKPLLeQA7DNREmIXKJrPlUAWNLCjCfmddePY9JHkBrLY21V6ySsipJCVyD7Ff94sA45TtuodD0_usqP0OxMT7_CHMdzGYrAC_qRbt-Fc0v2VpbQWLH0g8akNTO0VUV70_qn8P-RYVLjCRQ99U5gXA6kuMooao79OZfYyKB1Jc5Rhz6GuXDKuyoiADWDi44QMJaDWzBqeLzuClg',
      ],
    },
    {
      id: 3,
      name: 'Bánh xèo Bà Dưỡng',
      tagline: 'Ngon - rẻ - giòn rụm',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=700&q=80',
      votes: 1,
      totalVotes: 6,
      voterAvatars: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD5UBlDteg_L6L-UQKWJZwAyAWZb_Nhb4Vm1SZKrIN48gUpQUF-snWhVdkZsVoEWV99YhG-hjGARddiFUtVhEhQ9wO5e3tIpAif1LGN2GrFKMCw1FfbYSSmQs53wIJ-fMLTulZy3C_LOnJeSxwOAaJU1mqQkwMN-MRZ-iEPgArfCAAHAUi9pgAWXys6tidsGt6Iv5Rmvg5rpOzfa_DMeDwfStvQQENLRe2hUOCXFeq_Ok_l6PWibg',
      ],
    },
  ]);

  // Modals state
  const [showAddOptionModal, setShowAddOptionModal] = useState(false);
  const [showVoterListModal, setShowVoterListModal] = useState(false);
  const [showConfirmVoteModal, setShowConfirmVoteModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);
  const [showClosePollModal, setShowClosePollModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New option fields
  const [newOptionName, setNewOptionName] = useState('');
  const [newOptionAddress, setNewOptionAddress] = useState('');
  const [newOptionNote, setNewOptionNote] = useState('');

  // Chat message field
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'Linh Chi',
      time: '2 phút trước',
      text: 'Bữa tối Sài Gòn ngon lắm, mình đi rồi nè! 😋🦀',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCANPLlSnUDlymN7kdv5lycVO8No5OObky32lrx2sMZSBCue4zyhZsOAKmTJqO2-q1BMxLBo_uswsDOQCQB3y7fLKrA6LWNtQbK02HzCITtufOYUFUeh3f81aNBQxKO4UmbxqzyHiNMLnqhZAkZKtn91BVNbak5XGjZ5hriZGz0DEMbk8P1uapfvL25ZhsbPuN9GNjLAWYDtT84pe6LRllOAiuGkS2W0oIjmAAihtBj4ZjIj7DVzA',
    },
    {
      sender: 'Phương Thảo',
      time: '5 phút trước',
      text: 'Bánh xèo Bà Dưỡng cũng gần khách sạn, tiện đi bộ hơn.',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEDwNWFZ-sX0BSdPMNstPPQnLMiBLbGvSeXS-C32wD5E0sdD2MDkozZrn9eBzU-C2yyk_TBPrGX7j6Y005JCDRobIDEAztSDch7iosrRxzuZL3U9MCcyOd9nsWphBuBwFqPh0bSCZtbXXZiRIljzuJASSzGX-tp0Edj9q21kcVKQ6iHqCOBL5Bvf8EYQKJb5Lj5xUiR-AZ3ALeqUsx5WUnb2mWUPvj3shkhysMvrrwnq8L4Rg39A',
    },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      {
        sender: 'Bạn',
        time: 'Vừa xong',
        text: chatInput.trim(),
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdvFOMCd3iB5IDfHsQSFrHpVBBRTJ6OIOQvoYJqme7FxQYn-yv6dlBh1jJJiWDyG0rTApgi6tbpgOW6YInIXCqKxyxnebkDsUvyNgEj-VDFG_TsNJf_tnwTaZCpbnqY5jtgWo0dOTaInFYA3WPb8oLga-RtS1SRS0f_8AO51xmW2FlVRQ66A5uKX40_pqbEGHVXRNc8bFmXvABnNKtzTV5UlbZY0B5NAGAk4MC8GUSEiwAZMSYAg',
      },
    ]);
    setChatInput('');
  };

  const handleAddNewOption = () => {
    if (!newOptionName.trim()) {
      showToast('Vui lòng nhập tên món hoặc quán!');
      return;
    }
    const newOpt: PollOption = {
      id: Date.now(),
      name: newOptionName.trim(),
      tagline: newOptionAddress.trim() || 'Gợi ý từ bạn',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=700&q=80',
      votes: 1,
      totalVotes: 7,
      voterAvatars: [],
    };
    setPollOptions((prev) => [...prev, newOpt]);
    setSelectedOptionId(newOpt.id);
    setNewOptionName('');
    setNewOptionAddress('');
    setNewOptionNote('');
    setShowAddOptionModal(false);
    showToast(`Đã thêm lựa chọn "${newOpt.name}" vào cuộc bình chọn! ✨`);
  };

  const handleConfirmVote = () => {
    setShowConfirmVoteModal(false);
    const chosen = pollOptions.find((p) => p.id === selectedOptionId);
    showToast(`Đã ghi nhận bình chọn cho "${chosen?.name}"! ✓`);
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-[#f8f9fb] text-[#191c1e] antialiased select-none">
      {/* Header */}
      <header className="shrink-0 z-30 bg-[#f8f9fb]/90 backdrop-blur-xl border-b border-[#edeef0]">
        <IOSStatusBar light={false} />
        <div className="h-14 px-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              aria-label="Quay lại"
              className="w-10 h-10 -ml-2 flex items-center justify-center rounded-full text-[#191c1e] hover:bg-[#edeef0] transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <h1 className="font-bold text-[18px] text-[#191c1e] truncate max-w-[200px] font-heading">
              Bình chọn nhóm
            </h1>
          </div>
          <button
            onClick={() => setShowManageModal(true)}
            aria-label="Tùy chọn bổ sung"
            className="w-10 h-10 flex items-center justify-center rounded-full text-[#454652] hover:bg-[#edeef0] transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 min-h-0 overflow-y-auto no-scrollbar px-5 pt-3 pb-24 flex flex-col gap-3.5">
        {/* Status & Timer Badges */}
        <div className="flex items-center justify-between pt-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF0FF] text-[#0A1680]">
            <span className="w-2 h-2 rounded-full bg-[#0A1680] animate-pulse" />
            <span className="text-[12px] font-bold text-[#0A1680] font-heading">
              Đang diễn ra
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 text-[#454652] text-[12px]">
            <svg className="w-4 h-4 text-[#454652]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="font-medium">Kết thúc sau 2 giờ 15 phút</span>
          </div>
        </div>

        {/* Poll Question Header */}
        <div>
          <h2 className="text-[24px] font-extrabold text-[#0A1680] tracking-tight font-heading leading-tight">
            Tối nay ăn gì đây?
          </h2>
        </div>

        {/* Voting Options List */}
        <div className="flex flex-col gap-3.5 mt-1">
          {pollOptions.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            const pct = Math.round((opt.votes / opt.totalVotes) * 100);
            return (
              <div
                key={opt.id}
                onClick={() => setSelectedOptionId(opt.id)}
                className={`group relative overflow-hidden bg-white rounded-[20px] shadow-sm transition-all duration-200 cursor-pointer flex flex-col ${
                  isSelected
                    ? 'border-2 border-[#0A1680] ring-1 ring-[#0A1680]/20'
                    : 'border border-[#edeef0] hover:border-[#0A1680]/40'
                }`}
              >
                {/* Photo Header */}
                <div className="relative w-full h-[140px] overflow-hidden bg-slate-100">
                  <img
                    src={opt.image}
                    alt={opt.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  {/* Radio Indicator */}
                  {isSelected ? (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#0A1680] text-white flex items-center justify-center shadow-md">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                  ) : (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full border-2 border-white/80 bg-black/20 backdrop-blur-sm shadow-md" />
                  )}

                  <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-end justify-between">
                    <span className="inline-block px-2 py-0.5 rounded-full text-white bg-black/40 backdrop-blur-md text-[11px] font-medium truncate max-w-[200px]">
                      {opt.tagline}
                    </span>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowVoterListModal(true);
                      }}
                      className="flex items-center -space-x-1.5 ring-1 ring-white/30 rounded-full p-0.5 bg-black/20 backdrop-blur-sm"
                    >
                      {opt.voterAvatars.map((av, idx) => (
                        <div key={idx} className="w-5 h-5 rounded-full overflow-hidden shrink-0 ring-1 ring-white">
                          <img src={av} alt="voter" className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#0A1680] text-white flex items-center justify-center text-[9px] font-bold shrink-0 ring-1 ring-white font-heading">
                          Bạn
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress Bar & Details */}
                <div className="p-3.5 flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-[16px] text-slate-900 font-bold truncate font-heading">
                      {opt.name}
                    </h3>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowVoterListModal(true);
                      }}
                      className="text-[13px] text-[#0A1680] font-bold shrink-0 cursor-pointer font-heading hover:underline"
                    >
                      {opt.votes}/{opt.totalVotes} phiếu ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#edeef0] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isSelected ? 'bg-[#0A1680]' : 'bg-[#3d5d9d]'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add option button */}
        <button
          type="button"
          onClick={() => setShowAddOptionModal(true)}
          className="w-full h-11 py-2 flex items-center justify-center gap-1.5 border border-dashed border-[#93B2F8] text-[#0A1680] hover:bg-[#EBF0FF]/40 active:bg-[#EBF0FF] rounded-[14px] transition-colors mt-0.5 cursor-pointer font-heading font-semibold text-[14px]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          <span>Thêm lựa chọn khác</span>
        </button>

        {/* Primary CTA */}
        <button
          type="button"
          onClick={() => setShowConfirmVoteModal(true)}
          className="w-full h-12 py-3 px-6 rounded-full bg-[#0A1680] text-white font-heading text-[16px] flex items-center justify-center gap-2 shadow-md hover:bg-[#071060] active:scale-[0.98] transition-all cursor-pointer font-bold"
        >
          <span>Xác nhận bình chọn</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </button>

        {/* Mini Chat Widget */}
        <div className="mt-2 pt-1 flex flex-col gap-2.5">
          <div
            onClick={() => setShowChatModal(true)}
            className="w-full bg-white rounded-2xl p-3.5 shadow-sm border border-[#edeef0] flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 ring-2 ring-blue-100">
                  <img
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCANPLlSnUDlymN7kdv5lycVO8No5OObky32lrx2sMZSBCue4zyhZsOAKmTJqO2-q1BMxLBo_uswsDOQCQB3y7fLKrA6LWNtQbK02HzCITtufOYUFUeh3f81aNBQxKO4UmbxqzyHiNMLnqhZAkZKtn91BVNbak5XGjZ5hriZGz0DEMbk8P1uapfvL25ZhsbPuN9GNjLAWYDtT84pe6LRllOAiuGkS2W0oIjmAAihtBj4ZjIj7DVzA"
                    alt="Linh Chi"
                  />
                </div>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                  {chatMessages.length}
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-slate-900 font-heading">
                    Trao đổi nhóm ({chatMessages.length + 2})
                  </span>
                  <span className="text-[11px] text-[#454652]">2 phút trước</span>
                </div>
                <p className="text-[12px] text-[#454652] truncate">
                  {chatMessages[chatMessages.length - 1].sender}: {chatMessages[chatMessages.length - 1].text}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[#0A1680] text-[13px] font-semibold shrink-0 font-heading">
              <span>Mở chat</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path d="M5 15l7-7 7 7" />
              </svg>
            </div>
          </div>
        </div>
      </main>

      {/* POPUP 1: Thêm lựa chọn mới */}
      {showAddOptionModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setShowAddOptionModal(false)}
          />
          <div className="relative bg-white rounded-t-[24px] shadow-2xl p-5 w-full max-w-[390px] z-10 flex flex-col gap-4 animate-in slide-in-from-bottom duration-200">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-1 shrink-0" />
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-[18px] font-bold text-slate-900 font-heading">
                Thêm lựa chọn mới
              </h3>
              <button
                type="button"
                onClick={() => setShowAddOptionModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[12px] font-bold text-slate-700 block mb-1">
                  Tên món ăn hoặc quán
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Cơm gà Bà Buội, Chè Liên..."
                  value={newOptionName}
                  onChange={(e) => setNewOptionName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0A1680]"
                />
              </div>
              <div>
                <label className="text-[12px] font-bold text-slate-700 block mb-1">
                  Địa chỉ hoặc vị trí gợi ý
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: 22 Phan Chu Trinh, Hội An"
                  value={newOptionAddress}
                  onChange={(e) => setNewOptionAddress(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0A1680]"
                />
              </div>
              <div>
                <label className="text-[12px] font-bold text-slate-700 block mb-1">
                  Ghi chú thêm cho nhóm
                </label>
                <textarea
                  rows={2}
                  placeholder="Lý do nên thử, khoảng giá, lưu ý đặt bàn trước..."
                  value={newOptionNote}
                  onChange={(e) => setNewOptionNote(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0A1680]"
                />
              </div>
              <button
                type="button"
                onClick={handleAddNewOption}
                className="w-full h-12 rounded-full bg-[#0A1680] text-white font-heading font-semibold text-[15px] flex items-center justify-center gap-2 shadow-md hover:bg-[#071060] transition-all cursor-pointer mt-1"
              >
                <span>Thêm vào bình chọn</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP 2: Voter List */}
      {showVoterListModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setShowVoterListModal(false)}
          />
          <div className="relative bg-white rounded-t-[24px] shadow-2xl p-5 w-full max-w-[390px] z-10 flex flex-col gap-3 animate-in slide-in-from-bottom duration-200">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto shrink-0" />
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <h3 className="text-[17px] font-bold text-slate-900 font-heading">
                  Thành viên đã bình chọn
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#EBF0FF] text-[#0A1680] text-[11px] font-bold">
                  3 người
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowVoterListModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-2.5 max-h-[50vh] overflow-y-auto">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0A1680] text-white flex items-center justify-center font-bold text-xs">
                    Bạn
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-slate-900 font-heading">Bạn (Tôi)</p>
                    <p className="text-[11px] text-slate-500">Đã bình chọn lúc 17:45</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#EBF0FF] text-[#0A1680] text-[10px] font-bold">
                  Đã chốt
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200">
                    <img
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdvFOMCd3iB5IDfHsQSFrHpVBBRTJ6OIOQvoYJqme7FxQYn-yv6dlBh1jJJiWDyG0rTApgi6tbpgOW6YInIXCqKxyxnebkDsUvyNgEj-VDFG_TsNJf_tnwTaZCpbnqY5jtgWo0dOTaInFYA3WPb8oLga-RtS1SRS0f_8AO51xmW2FlVRQ66A5uKX40_pqbEGHVXRNc8bFmXvABnNKtzTV5UlbZY0B5NAGAk4MC8GUSEiwAZMSYAg"
                      alt="Minh Anh"
                    />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-slate-900 font-heading">Minh Anh</p>
                    <p className="text-[11px] text-slate-500">Đã bình chọn lúc 17:30</p>
                  </div>
                </div>
                <span className="text-[#0A1680] font-bold text-sm">✓</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200">
                    <img
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuC73gPHlSVSfalrtCpq8M1Lfb7PxBAC821kufcttmqgkkPAjswavkCo5i3iFkvSj7P1bJV4k8UbLAPviP4FLWuEYISVg07E84HVdXdfaCchWdGFAZYe6tFwM3kg9gx1iLzxDPKSSJxhO0J5-E7x8uQ2DVDAdeQX7BF9XT2tuVRl2Zj9M3Hb_avp5qsjPnNg2yK0JUq8819iJq9MQaV62gN5zyiK-LhsbSPgRbE46AFvUE_VMP-Ycg"
                      alt="Quang Huy"
                    />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-slate-900 font-heading">Quang Huy</p>
                    <p className="text-[11px] text-slate-500">Đã bình chọn lúc 17:15</p>
                  </div>
                </div>
                <span className="text-[#0A1680] font-bold text-sm">✓</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowVoterListModal(false)}
              className="w-full py-2.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold font-heading hover:bg-slate-200 cursor-pointer mt-1"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* POPUP 3: Confirm Vote */}
      {showConfirmVoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setShowConfirmVoteModal(false)}
          />
          <div className="relative bg-white rounded-[28px] shadow-2xl w-full max-w-[342px] p-6 flex flex-col gap-4 z-10 border border-slate-100 animate-in zoom-in-95 duration-150 text-center">
            <div className="w-12 h-12 rounded-full bg-[#EBF0FF] text-[#0A1680] flex items-center justify-center mx-auto text-xl">
              ✓
            </div>
            <div>
              <h3 className="text-[18px] font-bold text-slate-900 font-heading">
                Xác nhận bình chọn
              </h3>
              <p className="text-[13px] text-slate-500 mt-1 leading-relaxed">
                Bạn chọn bỏ phiếu cho{' '}
                <strong className="text-[#0A1680]">
                  {pollOptions.find((p) => p.id === selectedOptionId)?.name}
                </strong>
                . Bạn vẫn có thể đổi lại ý kiến trước khi cuộc bình chọn kết thúc.
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={handleConfirmVote}
                className="w-full h-12 rounded-full bg-[#0A1680] text-white font-heading font-semibold text-[15px] shadow-md hover:bg-[#071060] cursor-pointer"
              >
                Xác nhận
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmVoteModal(false)}
                className="w-full h-11 rounded-full text-slate-600 font-heading text-[14px] font-medium hover:bg-slate-100 cursor-pointer"
              >
                Quay lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP 4: Manage Poll Sheet */}
      {showManageModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setShowManageModal(false)}
          />
          <div className="relative bg-white rounded-t-[24px] shadow-2xl p-5 w-full max-w-[390px] z-10 flex flex-col gap-3 animate-in slide-in-from-bottom duration-200">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto shrink-0" />
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-[17px] font-bold text-slate-900 font-heading">
                Quản lý bình chọn
              </h3>
              <button
                type="button"
                onClick={() => setShowManageModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  showToast('Đã gia hạn thời gian thêm 3 giờ!');
                  setShowManageModal(false);
                }}
                className="w-full p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#EBF0FF] text-[#0A1680] flex items-center justify-center text-sm">
                    ⏰
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-slate-900 font-heading">Đổi thời gian kết thúc</p>
                    <p className="text-[11px] text-slate-500">Hiện tại: Sau 2 giờ 15 phút</p>
                  </div>
                </div>
                <span className="text-slate-400">→</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowManageModal(false);
                  setShowClosePollModal(true);
                }}
                className="w-full p-3.5 rounded-2xl bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-sm">
                    🔒
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-rose-700 font-heading">Đóng bình chọn sớm</p>
                    <p className="text-[11px] text-rose-500">Khóa lượt bỏ phiếu & công bố kết quả</p>
                  </div>
                </div>
                <span className="text-rose-400">→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP 5: Close Poll Modal */}
      {showClosePollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setShowClosePollModal(false)}
          />
          <div className="relative bg-white rounded-[28px] shadow-2xl w-full max-w-[342px] p-6 flex flex-col gap-4 z-10 border border-slate-100 animate-in zoom-in-95 duration-150 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-xl">
              ⚠️
            </div>
            <div>
              <h3 className="text-[18px] font-bold text-slate-900 font-heading">
                Đóng cuộc bình chọn?
              </h3>
              <p className="text-[13px] text-slate-500 mt-1 leading-relaxed">
                Sau khi đóng, các thành viên khác sẽ không thể tiếp tục bỏ phiếu hoặc thay đổi kết quả.
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setShowClosePollModal(false);
                  showToast('Đã đóng bình chọn! Món Bữa tối Sài Gòn thắng phiếu 🎉');
                }}
                className="w-full h-12 rounded-full bg-rose-600 text-white font-heading font-semibold text-[15px] shadow-md hover:bg-rose-700 cursor-pointer"
              >
                Đóng bình chọn ngay
              </button>
              <button
                type="button"
                onClick={() => setShowClosePollModal(false)}
                className="w-full h-11 rounded-full text-slate-600 font-heading text-[14px] font-medium hover:bg-slate-100 cursor-pointer"
              >
                Giữ tiếp tục
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP 6: Mini Chat Bottom Sheet */}
      {showChatModal && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setShowChatModal(false)}
          />
          <div className="relative bg-white rounded-t-[24px] shadow-2xl max-h-[80vh] flex flex-col z-10 animate-in slide-in-from-bottom duration-300">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-2 shrink-0" />
            <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-[17px] font-bold text-slate-900 font-heading">
                  Trao đổi trong nhóm
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#EBF0FF] text-[#0A1680] text-[11px] font-bold">
                  {chatMessages.length} tin
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowChatModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Message list */}
            <div className="p-5 flex flex-col gap-3.5 overflow-y-auto max-h-[46vh]">
              {chatMessages.map((msg, index) => (
                <div key={index} className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-100 shrink-0">
                    <img src={msg.avatar} alt={msg.sender} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col gap-1 max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-bold text-slate-900 font-heading">
                        {msg.sender}
                      </span>
                      <span className="text-[10px] text-slate-400">{msg.time}</span>
                    </div>
                    <div className="bg-slate-100/90 p-3 rounded-2xl rounded-tl-xs shadow-2xs text-slate-800 text-[13px] leading-relaxed">
                      <p>{msg.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input bar */}
            <div className="p-4 border-t border-slate-100 bg-white">
              <div className="flex items-center gap-2 bg-slate-50 h-11 pl-4 pr-1.5 rounded-full border border-slate-200">
                <input
                  type="text"
                  placeholder="Nhắn tin cho nhóm..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  className="flex-1 bg-transparent text-[13px] text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSendMessage}
                  className="w-8 h-8 rounded-full bg-[#0A1680] text-white flex items-center justify-center shadow-xs hover:bg-[#071060] cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </div>
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
