'use client';

import React, { useState, useRef, useEffect } from 'react';
import { toPng, toBlob } from 'html-to-image';
import {
  Download,
  Copy,
  Shuffle,
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Clipboard as ClipboardIcon,
  Sun,
  Moon,
  X,
  Image as ImageIcon
} from 'lucide-react';

// SVG cute avatar generator (100% offline, zero CORS)
function generateSvgAvatar(seed) {
  const bgColors = ['#f87171', '#fb923c', '#fbbf24', '#34d399', '#22d3ee', '#818cf8', '#c084fc', '#f472b6', '#38bdf8', '#4ade80'];
  const bg = bgColors[Math.abs(seed) % bgColors.length];
  const characters = [
    '🐱', '🐶', '🦊', '🐼', '🐨', '🐯', '🦁', '🐰', '🐻', '🐹',
    '😎', '🤠', '🥳', '🤓', '👻', '🤖', '👾', '🚀', '⭐', '🔥'
  ];
  const char = characters[Math.abs(seed * 7) % characters.length];

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="50" fill="${bg}"/>
    <text x="50%" y="54%" font-size="52" text-anchor="middle" dominant-baseline="middle" font-family="Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif">${char}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const PRESET_NAMES = [
  'Hoàng Long 🧸', 'Bé Bắp 🌽', 'Hà Linh Reviewer ✨', 'Minh Trí 🎮',
  'Ngọc Ánh 🌸', 'Thanh Hằng 💅', 'Duy Thẩm ⚡', 'Phương Thảo 🥑',
  'Gia Bảo 🧢', 'Hương Giang 🍉', 'Tiến Đạt 🔥', 'Mai Chi 🎀',
  'Lê Tuấn Khang', 'Cẩm Tú 🍀', 'Huy Cung 🎬'
];

const PRESET_TIMES = [
  'Vừa xong', '1 phút trước', '5 phút trước', '12 phút trước',
  '45 phút trước', '1 giờ trước', '2 giờ trước', '5 giờ trước',
  '8 giờ trước', '1 ngày trước', '2 ngày trước', '3 ngày trước',
  '1 tuần trước', '2 tuần trước', '10-24'
];

const PRESET_LIKES = [
  '12', '48', '156', '320', '842', '1.2K', '2.5K', '5.8K',
  '9.4K', '12.3K', '18.7K', '25.4K', '49.1K', '82.6K', '120.5K', '250K', '1.2M'
];

const PRESET_COMMENTS = [
  'Xem clip mà cười xỉu luôn á trời ơi 😂 Đúng tâm trạng của tui mỗi sáng đi làm luôn á hahaha!',
  'Top 1 những video coi đi coi lại không chán 🤣 10 điểm không có nhưng!',
  'Ủa alo bà con ơi, ai cứu tui với, coi 10 lần vẫn cười như được mùa 💀',
  'Xin info cái áo với chủ thớt ơi, nhìn mê quá trời mê luôn nè 🥰✨',
  'Thả tim vì quá đúng! Không lệch đi đâu được một milimet nào luôn á trùi ui!',
  'Tự nhiên thấy mình trong clip này zậy chèn, quê xỉu ngang luôn á 🤡',
  'Chờ mãi mới thấy kênh này ra video mới, xem chữa lành tâm hồn thiệt sự ❤️🌿',
  'Tui lướt trúng lúc 2h sáng và cười rung cả giường =)))',
  'Đang ăn cơm suýt sặc ra ngoài 😂 Nể người nghĩ ra kịch bản ghê!',
  'Bác làm phần 2 đi ạ, hóng từng giây từng phút luôn á trờiiiii 🔥🔥',
  'Nói hộ nỗi lòng của biết bao nhiêu người luôn á chèn ơi 🥺🙏',
  'Tuyệt vời quá bạn ơi, chúc kênh bạn ngày càng triệu view nhéeee 🎉'
];

const EMOJIS = ['😂', '🤣', '🥰', '🥺', '💀', '🤡', '🔥', '❤️', '😭', '👍', '✨', '🙏'];

export default function FakeCommentPage() {
  const [name, setName] = useState('Hoàng Long 🧸');
  const [comment, setComment] = useState('Xem clip mà cười xỉu luôn á trời ơi 😂 Đúng tâm trạng của tui mỗi sáng đi làm luôn á hahaha!');
  const [time, setTime] = useState('2 giờ trước');
  const [likes, setLikes] = useState('15.4K');
  const [avatar, setAvatar] = useState(generateSvgAvatar(8));

  // Toggles
  const [isCreator, setIsCreator] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isLikedByCreator, setIsLikedByCreator] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isLiked, setIsLiked] = useState(true);
  const [isDisliked, setIsDisliked] = useState(false);
  const [showReplyCount, setShowReplyCount] = useState(false);

  // Theme & Mode (Mặc định nền sáng)
  const [theme, setTheme] = useState('light'); // 'dark' | 'light'
  const [mode, setMode] = useState('solo'); // 'solo' | 'frame'
  const [borderStyle, setBorderStyle] = useState('card'); // 'card' | 'gradient' | 'outline' | 'none'

  // Presets and UI state
  const [base64Avatars, setBase64Avatars] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const previewRef = useRef(null);
  const fileInputRef = useRef(null);
  const commentInputRef = useRef(null);

  // Load Base64 presets on mount
  useEffect(() => {
    fetch('/avatars_base64.json')
      .then(res => res.json())
      .then(data => setBase64Avatars(data))
      .catch(err => console.warn('No base64 avatars found', err));
  }, []);

  const showToastMsg = (msg, type = 'success') => {
    setToast({ show: true, message: msg, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 2800);
  };

  // Randomizers
  const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const randomizeName = () => setName(randomItem(PRESET_NAMES));
  const randomizeTime = () => setTime(randomItem(PRESET_TIMES));
  const randomizeLikes = () => setLikes(randomItem(PRESET_LIKES));
  const randomizeComment = () => setComment(randomItem(PRESET_COMMENTS));
  const randomizeAvatar = () => {
    if (base64Avatars.length > 0 && Math.random() < 0.6) {
      setAvatar(randomItem(base64Avatars));
    } else {
      setAvatar(generateSvgAvatar(Math.floor(Math.random() * 100)));
    }
  };

  const randomizeAll = () => {
    randomizeName();
    randomizeTime();
    randomizeLikes();
    randomizeAvatar();
    setIsCreator(Math.random() < 0.2);
    setIsVerified(Math.random() < 0.15);
    setIsLikedByCreator(Math.random() < 0.3);
    setIsPinned(Math.random() < 0.15);
    setIsLiked(Math.random() < 0.7);
    setIsDisliked(false);
    setShowReplyCount(Math.random() < 0.35);
    showToastMsg('Đã random tất cả thông tin! 🎲');
  };

  const resetDefault = () => {
    setName('Hoàng Long 🧸');
    setComment('Xem clip mà cười xỉu luôn á trời ơi 😂 Đúng tâm trạng của tui mỗi sáng đi làm luôn á hahaha!');
    setTime('2 giờ trước');
    setLikes('15.4K');
    setAvatar(generateSvgAvatar(8));
    setIsCreator(false);
    setIsVerified(false);
    setIsLikedByCreator(false);
    setIsPinned(false);
    setIsLiked(true);
    setIsDisliked(false);
    setShowReplyCount(false);
    setTheme('light');
    setMode('solo');
    setBorderStyle('card');
    showToastMsg('Đã khôi phục dữ liệu mặc định!');
  };

  // Upload Avatar
  const handleFileUpload = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      showToastMsg('Vui lòng chọn một file ảnh!', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatar(e.target.result);
      showToastMsg('Đã tải ảnh đại diện lên! 📸');
    };
    reader.readAsDataURL(file);
  };

  const pasteAvatarFromClipboard = async () => {
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        for (const type of item.types) {
          if (type.startsWith('image/')) {
            const blob = await item.getType(type);
            handleFileUpload(blob);
            return;
          }
        }
      }
      showToastMsg('Không tìm thấy ảnh trong Clipboard!', 'error');
    } catch {
      showToastMsg('Bạn có thể nhấn Ctrl+V trực tiếp để dán ảnh', 'info');
    }
  };

  // Global paste handler
  useEffect(() => {
    const handlePaste = (e) => {
      const items = (e.clipboardData || window.clipboardData)?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.indexOf('image') === 0) {
          const blob = item.getAsFile();
          handleFileUpload(blob);
          break;
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  // Insert emoji
  const insertEmoji = (emoji) => {
    setComment(prev => prev + emoji);
    if (commentInputRef.current) {
      commentInputRef.current.focus();
    }
  };

  // Export to PNG (Guaranteed to work 100% via html-to-image)
  const downloadImage = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);

    try {
      const bgColor = mode === 'frame' ? null : (theme === 'dark' ? '#121212' : '#ffffff');
      const dataUrl = await toPng(previewRef.current, {
        pixelRatio: 3, // Crisp 3x Retina resolution
        backgroundColor: bgColor,
        cacheBust: true,
      });

      const safeName = (name.trim() || 'tiktok').replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1E00-\u1EFF]/g, '_');
      const filename = `tiktok-comment-${safeName}-${Date.now()}.png`;

      // Trigger standard browser download
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToastMsg('Tải ảnh thành công! 🎉');
    } catch (err) {
      console.error('Download error:', err);
      // Fallback: Show modal with direct image
      try {
        const fallbackUrl = await toPng(previewRef.current, { pixelRatio: 2 });
        setModalImage(fallbackUrl);
        showToastMsg('Đã mở ảnh! Bạn có thể lưu ảnh trực tiếp.', 'info');
      } catch (innerErr) {
        showToastMsg('Lỗi xuất ảnh: ' + (err.message || 'vui lòng thử lại!'), 'error');
      }
    } finally {
      setIsExporting(false);
    }
  };

  // Copy to Clipboard
  const copyImage = async () => {
    if (!previewRef.current) return;
    setIsExporting(true);

    try {
      const bgColor = mode === 'frame' ? null : (theme === 'dark' ? '#121212' : '#ffffff');
      const blob = await toBlob(previewRef.current, {
        pixelRatio: 3,
        backgroundColor: bgColor,
        cacheBust: true,
      });

      if (!blob) throw new Error('Không tạo được file ảnh');

      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        showToastMsg('Đã copy ảnh vào Clipboard! Dán (Ctrl+V) ngay 📋');
      } else {
        // Fallback: download if clipboard API is not available
        downloadImage();
      }
    } catch (err) {
      console.error('Copy error:', err);
      showToastMsg('Trình duyệt chặn sao chép, hãy dùng nút Tải ảnh!', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#fe2c55] via-[#25f4ee] to-[#fe2c55] p-[2px] flex items-center justify-center shadow-lg shadow-pink-500/20">
              <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center font-black text-white text-lg">
                💬
              </div>
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                TikTok Comment Generator
              </h1>
              <p className="text-xs text-slate-400 font-normal">Tạo bình luận TikTok chuẩn tỉ lệ & typography</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={randomizeAll}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold transition shadow-md active:scale-95"
            >
              <Shuffle className="w-4 h-4" />
              <span className="hidden sm:inline">Random tất cả</span>
            </button>
            <button
              onClick={downloadImage}
              disabled={isExporting}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#fe2c55] hover:bg-[#ff3b5c] text-white text-xs sm:text-sm font-semibold transition shadow-lg shadow-pink-500/25 active:scale-95 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Đang tạo...' : 'Tải ảnh'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Controls */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-[#fe2c55]" />
                  <span>Cài đặt thông tin</span>
                </h2>
                <button
                  onClick={resetDefault}
                  className="text-xs text-slate-400 hover:text-white transition flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Khôi phục mẫu
                </button>
              </div>

              {/* Avatar Section */}
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Avatar (Ảnh đại diện)</span>
                  <button
                    onClick={randomizeAvatar}
                    className="text-xs normal-case font-medium text-pink-400 hover:text-pink-300 flex items-center gap-1"
                  >
                    <Shuffle className="w-3 h-3" /> Random Avatar
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative group cursor-pointer"
                    title="Bấm để đổi ảnh"
                  >
                    <img
                      src={avatar}
                      alt="avatar"
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-slate-700 group-hover:ring-[#fe2c55] transition shadow-inner bg-neutral-800"
                    />
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <Upload className="w-4 h-4 text-white" />
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 flex items-center justify-center gap-2 transition"
                      >
                        <Upload className="w-3.5 h-3.5" /> Tải ảnh từ máy
                      </button>
                      <button
                        type="button"
                        onClick={pasteAvatarFromClipboard}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 flex items-center justify-center gap-1.5 transition"
                      >
                        <ClipboardIcon className="w-3.5 h-3.5" /> Dán ảnh
                      </button>
                    </div>

                    {/* Quick Avatar Presets */}
                    <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                      {[1, 2, 3].map((seed) => {
                        const svg = generateSvgAvatar(seed);
                        return (
                          <img
                            key={seed}
                            src={svg}
                            alt="preset"
                            onClick={() => setAvatar(svg)}
                            className="w-8 h-8 rounded-full object-cover cursor-pointer border-2 border-transparent hover:border-[#fe2c55] hover:scale-110 transition flex-shrink-0"
                          />
                        );
                      })}
                      {base64Avatars.slice(0, 4).map((b64, idx) => (
                        <img
                          key={idx}
                          src={b64}
                          alt="preset"
                          onClick={() => setAvatar(b64)}
                          className="w-8 h-8 rounded-full object-cover cursor-pointer border-2 border-transparent hover:border-[#fe2c55] hover:scale-110 transition flex-shrink-0"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Name Section */}
              <div className="space-y-1.5">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Tên hiển thị</span>
                  <button
                    onClick={randomizeName}
                    className="text-xs normal-case font-medium text-pink-400 hover:text-pink-300 flex items-center gap-1"
                  >
                    <Shuffle className="w-3 h-3" /> Random Tên
                  </button>
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#fe2c55] focus:ring-1 focus:ring-[#fe2c55] transition font-medium"
                  placeholder="Ví dụ: Hoàng Long 🧸"
                />
              </div>

              {/* Comment Content */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Nội dung bình luận
                  </label>
                  <button
                    onClick={randomizeComment}
                    className="text-xs font-medium text-pink-400 hover:text-pink-300 flex items-center gap-1"
                  >
                    <Shuffle className="w-3 h-3" /> Mẫu vui
                  </button>
                </div>
                <textarea
                  ref={commentInputRef}
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#fe2c55] focus:ring-1 focus:ring-[#fe2c55] transition resize-none leading-relaxed"
                  placeholder="Nhập nội dung bình luận tại đây..."
                />
                
                {/* Emoji quick bar */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-xs text-slate-500 mr-1">Chèn nhanh:</span>
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => insertEmoji(emoji)}
                      className="hover:scale-125 transition text-base"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time & Likes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>Thời gian</span>
                    <button
                      onClick={randomizeTime}
                      className="text-xs normal-case font-medium text-pink-400 hover:text-pink-300 flex items-center gap-1"
                    >
                      <Shuffle className="w-3 h-3" /> Random
                    </button>
                  </div>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#fe2c55] focus:ring-1 focus:ring-[#fe2c55] transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                    <span>Số lượt tim</span>
                    <button
                      onClick={randomizeLikes}
                      className="text-xs normal-case font-medium text-pink-400 hover:text-pink-300 flex items-center gap-1"
                    >
                      <Shuffle className="w-3 h-3" /> Random
                    </button>
                  </div>
                  <input
                    type="text"
                    value={likes}
                    onChange={(e) => setLikes(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#fe2c55] focus:ring-1 focus:ring-[#fe2c55] transition font-medium"
                  />
                </div>
              </div>

              {/* Badges & Options */}
              <div className="space-y-3 pt-2 border-t border-slate-800/80">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                  Huy hiệu & Tùy chọn hiển thị
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <label className="flex items-center space-x-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg p-2.5 cursor-pointer transition select-none">
                    <input
                      type="checkbox"
                      checked={isCreator}
                      onChange={(e) => setIsCreator(e.target.checked)}
                      className="rounded text-[#fe2c55] focus:ring-[#fe2c55] bg-slate-800 border-slate-700 w-4 h-4"
                    />
                    <span className="text-xs font-medium text-slate-300">Tác giả (Creator)</span>
                  </label>

                  <label className="flex items-center space-x-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg p-2.5 cursor-pointer transition select-none">
                    <input
                      type="checkbox"
                      checked={isVerified}
                      onChange={(e) => setIsVerified(e.target.checked)}
                      className="rounded text-[#fe2c55] focus:ring-[#fe2c55] bg-slate-800 border-slate-700 w-4 h-4"
                    />
                    <span className="text-xs font-medium text-slate-300">Tick xanh ✔</span>
                  </label>

                  <label className="flex items-center space-x-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg p-2.5 cursor-pointer transition select-none">
                    <input
                      type="checkbox"
                      checked={isLikedByCreator}
                      onChange={(e) => setIsLikedByCreator(e.target.checked)}
                      className="rounded text-[#fe2c55] focus:ring-[#fe2c55] bg-slate-800 border-slate-700 w-4 h-4"
                    />
                    <span className="text-xs font-medium text-slate-300">Tác giả thích ❤️</span>
                  </label>

                  <label className="flex items-center space-x-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg p-2.5 cursor-pointer transition select-none">
                    <input
                      type="checkbox"
                      checked={isPinned}
                      onChange={(e) => setIsPinned(e.target.checked)}
                      className="rounded text-[#fe2c55] focus:ring-[#fe2c55] bg-slate-800 border-slate-700 w-4 h-4"
                    />
                    <span className="text-xs font-medium text-slate-300">Đã ghim 📌</span>
                  </label>

                  <label className="flex items-center space-x-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg p-2.5 cursor-pointer transition select-none">
                    <input
                      type="checkbox"
                      checked={isLiked}
                      onChange={(e) => setIsLiked(e.target.checked)}
                      className="rounded text-[#fe2c55] focus:ring-[#fe2c55] bg-slate-800 border-slate-700 w-4 h-4"
                    />
                    <span className="text-xs font-medium text-slate-300">Đã thả tim (Đỏ)</span>
                  </label>

                  <label className="flex items-center space-x-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg p-2.5 cursor-pointer transition select-none">
                    <input
                      type="checkbox"
                      checked={isDisliked}
                      onChange={(e) => setIsDisliked(e.target.checked)}
                      className="rounded text-[#fe2c55] focus:ring-[#fe2c55] bg-slate-800 border-slate-700 w-4 h-4"
                    />
                    <span className="text-xs font-medium text-slate-300">Đã dislike 👎</span>
                  </label>

                  <label className="flex items-center space-x-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg p-2.5 cursor-pointer transition select-none col-span-2 sm:col-span-3">
                    <input
                      type="checkbox"
                      checked={showReplyCount}
                      onChange={(e) => setShowReplyCount(e.target.checked)}
                      className="rounded text-[#fe2c55] focus:ring-[#fe2c55] bg-slate-800 border-slate-700 w-4 h-4"
                    />
                    <span className="text-xs font-medium text-slate-300">Hiện &quot;Xem 12 câu trả lời&quot;</span>
                  </label>
                </div>
              </div>

              {/* Theme & Mode */}
              <div className="space-y-3 pt-2 border-t border-slate-800/80">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-1.5 flex gap-1">
                    <button
                      onClick={() => setTheme('dark')}
                      className={`flex-1 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                        theme === 'dark' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5" /> Tối (Dark)
                    </button>
                    <button
                      onClick={() => setTheme('light')}
                      className={`flex-1 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                        theme === 'light' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5" /> Sáng (Light)
                    </button>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-1.5 flex gap-1">
                    <button
                      onClick={() => setMode('solo')}
                      className={`flex-1 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1 transition ${
                        mode === 'solo' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Riêng cmt
                    </button>
                    <button
                      onClick={() => setMode('frame')}
                      className={`flex-1 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1 transition ${
                        mode === 'frame' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Khung viền
                    </button>
                  </div>
                </div>

                {/* Kiểu viền (Border Style) */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Kiểu viền bình luận
                    </label>
                    <span className="text-[11px] text-pink-400 font-medium">✨ Viền đẹp</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setBorderStyle('card')}
                      className={`py-2 px-1 rounded-lg text-xs font-semibold text-center transition border ${
                        borderStyle === 'card'
                          ? 'bg-slate-800 border-[#fe2c55] text-white shadow-sm ring-1 ring-[#fe2c55]/50'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Thẻ bo góc
                    </button>
                    <button
                      type="button"
                      onClick={() => setBorderStyle('gradient')}
                      className={`py-2 px-1 rounded-lg text-xs font-semibold text-center transition border ${
                        borderStyle === 'gradient'
                          ? 'bg-slate-800 border-[#fe2c55] text-white shadow-sm ring-1 ring-[#fe2c55]/50'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      TikTok Neon
                    </button>
                    <button
                      type="button"
                      onClick={() => setBorderStyle('outline')}
                      className={`py-2 px-1 rounded-lg text-xs font-semibold text-center transition border ${
                        borderStyle === 'outline'
                          ? 'bg-slate-800 border-[#fe2c55] text-white shadow-sm ring-1 ring-[#fe2c55]/50'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Viền nét
                    </button>
                    <button
                      type="button"
                      onClick={() => setBorderStyle('none')}
                      className={`py-2 px-1 rounded-lg text-xs font-semibold text-center transition border ${
                        borderStyle === 'none'
                          ? 'bg-slate-800 border-[#fe2c55] text-white shadow-sm ring-1 ring-[#fe2c55]/50'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Không viền
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Panel: Live Preview & Export */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl sticky top-20">
              
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80">
                <div className="flex items-center space-x-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <h2 className="text-base font-bold text-white">Xem trước trực tiếp</h2>
                </div>
                <span className="text-[11px] text-slate-400 font-medium bg-slate-900 px-2.5 py-1 rounded-full border border-slate-800">
                  💡 Bấm trực tiếp vào chữ để sửa nhanh!
                </span>
              </div>

              {/* Preview Outer Wrapper */}
              <div className="w-full flex items-center justify-center p-4 sm:p-6 rounded-xl bg-slate-900/60 border border-slate-800/60 overflow-hidden">
                
                {/* CAPTURE TARGET NODE (Bao trọn viền và bóng khi xuất ảnh) */}
                <div
                  ref={previewRef}
                  className={`w-full max-w-[480px] transition-all duration-200 ${
                    borderStyle === 'gradient' && mode !== 'frame'
                      ? 'p-[2px] rounded-2xl bg-gradient-to-tr from-[#fe2c55] via-[#25f4ee] to-[#fe2c55] shadow-lg shadow-pink-500/15'
                      : ''
                  }`}
                >
                  <div
                    style={{
                      backgroundColor: mode === 'frame' ? undefined : (theme === 'dark' ? '#121212' : '#ffffff'),
                      color: theme === 'dark' ? '#ffffff' : '#161823',
                      borderColor: mode === 'frame' 
                        ? undefined 
                        : (borderStyle === 'card' 
                            ? (theme === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.09)')
                            : (borderStyle === 'outline' 
                                ? (theme === 'dark' ? 'rgba(255, 255, 255, 0.28)' : 'rgba(0, 0, 0, 0.22)')
                                : 'transparent')),
                      boxShadow: mode === 'frame'
                        ? undefined
                        : (borderStyle === 'card'
                            ? (theme === 'dark' 
                                ? '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.3)' 
                                : '0 10px 25px -5px rgba(0, 0, 0, 0.06), 0 8px 10px -6px rgba(0, 0, 0, 0.03)')
                            : 'none'),
                    }}
                    className={`w-full p-4 sm:p-5 transition-all duration-200 select-text ${
                      mode === 'frame'
                        ? 'rounded-2xl p-6 shadow-2xl border border-white/10 bg-gradient-to-br from-neutral-900 to-black'
                        : (borderStyle === 'gradient' 
                            ? 'rounded-[14px]' 
                            : (borderStyle === 'none' ? 'rounded-none border-0' : (borderStyle === 'outline' ? 'rounded-2xl border-2' : 'rounded-2xl border')))
                    }`}
                  >
                  {/* Pinned Tag */}
                  {isPinned && (
                    <div className="flex items-center gap-1.5 text-xs text-[#8a8b91] font-normal mb-2 pl-12">
                      <svg className="w-3 h-3 text-[#fe2c55] fill-current rotate-45" viewBox="0 0 24 24">
                        <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5v6l1 1 1-1v-6h5v-2l-2-2z"/>
                      </svg>
                      <span>Được tác giả ghim</span>
                    </div>
                  )}

                  {/* Comment Row */}
                  <div className="flex items-start gap-3">
                    
                    {/* Avatar */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-shrink-0 cursor-pointer pt-0.5"
                      title="Click để đổi avatar"
                    >
                      <img
                        src={avatar}
                        alt="avatar"
                        className="w-9 h-9 rounded-full object-cover shadow-sm bg-neutral-800"
                      />
                    </div>

                    {/* Middle Content */}
                    <div className="flex-1 min-w-0 pr-1">
                      
                      {/* Name Row: Fixed inline, never wraps to next line */}
                      <div className="flex items-center gap-1.5 leading-snug">
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => setName(e.currentTarget.textContent || '')}
                          style={{ color: theme === 'dark' ? '#8a8b91' : '#73747b' }}
                          className="font-semibold text-[13px] cursor-text outline-none rounded hover:bg-black/5 dark:hover:bg-white/10 px-0.5 transition inline-block whitespace-nowrap"
                          title="Bấm để sửa tên"
                        >
                          {name}
                        </span>

                        {/* Creator Badge */}
                        {isCreator && (
                          <span className="text-[10.5px] px-1.5 py-[1px] rounded font-medium text-[#fe2c55] bg-[#fe2c55]/10 leading-normal flex-shrink-0 whitespace-nowrap">
                            Tác giả
                          </span>
                        )}

                        {/* Verified Badge */}
                        {isVerified && (
                          <span className="text-[#20d5ec] text-[12px] inline-flex items-center flex-shrink-0 whitespace-nowrap">
                            <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                          </span>
                        )}
                      </div>

                      {/* Comment Body */}
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => setComment(e.currentTarget.textContent || '')}
                        style={{ color: theme === 'dark' ? '#ffffff' : '#161823' }}
                        className="text-[14px] leading-[1.38] mt-1 break-words font-normal outline-none rounded hover:bg-white/10 p-0.5 transition"
                        title="Bấm để sửa nội dung"
                      >
                        {comment}
                      </div>

                      {/* Bottom Meta */}
                      <div
                        style={{ color: theme === 'dark' ? '#8a8b91' : '#73747b' }}
                        className="flex items-center gap-3 text-[12px] font-normal mt-1.5 select-none"
                      >
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => setTime(e.currentTarget.textContent || '')}
                          className="cursor-text outline-none rounded hover:bg-white/10 px-0.5 transition"
                        >
                          {time}
                        </span>
                        <span className="hover:underline cursor-pointer font-medium">
                          Trả lời
                        </span>
                      </div>

                      {/* Liked by creator */}
                      {isLikedByCreator && (
                        <div
                          style={{ color: theme === 'dark' ? '#8a8b91' : '#73747b' }}
                          className="flex items-center gap-1 text-[11px] font-normal mt-1.5"
                        >
                          <span className="inline-block w-3.5 h-3.5 rounded-full bg-[#fe2c55]/20 text-[#fe2c55] text-center leading-3.5 text-[8px]">
                            ❤️
                          </span>
                          <span>Được tác giả thích</span>
                        </div>
                      )}

                      {/* Reply row */}
                      {showReplyCount && (
                        <div
                          style={{ color: theme === 'dark' ? '#8a8b91' : '#73747b' }}
                          className="flex items-center gap-2 text-[12px] font-medium mt-2 cursor-pointer select-none"
                        >
                          <span className="w-6 h-[1px] bg-neutral-600 inline-block"></span>
                          <span>Xem 12 câu trả lời</span>
                          <svg className="w-2.5 h-2.5 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      )}

                    </div>

                    {/* Right Action Row: Heart + Likes Count + Strict Outline Dislike */}
                    <div className="flex-shrink-0 flex items-center gap-3 select-none pt-1">
                      
                      {/* Heart and Count */}
                      <div
                        onClick={() => setIsLiked(!isLiked)}
                        className="flex items-center gap-1.5 cursor-pointer"
                        title="Bấm để thả tim"
                      >
                        <div className="w-4 h-4 flex items-center justify-center transition-transform active:scale-125">
                          {isLiked ? (
                            <svg className="w-4 h-4 fill-[#fe2c55] text-[#fe2c55]" viewBox="0 0 24 24">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                          ) : (
                            <svg
                              className="w-4 h-4 fill-none"
                              style={{ stroke: theme === 'dark' ? '#8a8b91' : '#73747b' }}
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              viewBox="0 0 24 24"
                            >
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                          )}
                        </div>
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onClick={(e) => e.stopPropagation()}
                          onBlur={(e) => setLikes(e.currentTarget.textContent || '')}
                          style={{ color: theme === 'dark' ? '#8a8b91' : '#73747b' }}
                          className="text-[12px] font-normal outline-none rounded hover:bg-white/10 px-0.5 transition cursor-text"
                          title="Bấm để sửa số tim"
                        >
                          {likes}
                        </span>
                      </div>

                      {/* Dislike Icon: STRICTLY OUTLINE (STROKE ONLY, TRANSPARENT FILL) */}
                      <div
                        onClick={() => setIsDisliked(!isDisliked)}
                        className="cursor-pointer transition-transform active:scale-125 flex items-center justify-center"
                        title="Bấm để dislike"
                      >
                        <svg
                          className="w-[14px] h-[14px]"
                          style={{
                            fill: 'none',
                            stroke: isDisliked ? (theme === 'dark' ? '#ffffff' : '#161823') : (theme === 'dark' ? '#8a8b91' : '#73747b'),
                          }}
                          viewBox="0 0 24 24"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.33 2.33 0 0 1-2.33 2H17"/>
                        </svg>
                      </div>

                    </div>

                  </div>

                  </div>

                </div>

              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-5 border-t border-slate-800 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={downloadImage}
                    disabled={isExporting}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-[#fe2c55] to-[#ff476d] hover:opacity-95 text-white font-bold text-sm rounded-xl shadow-lg shadow-pink-500/25 flex items-center justify-center gap-2.5 transition active:scale-[0.98] disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isExporting ? 'Đang tạo ảnh...' : 'Tải ảnh PNG'}</span>
                  </button>

                  <button
                    onClick={copyImage}
                    disabled={isExporting}
                    className="w-full py-3.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2.5 transition active:scale-[0.98] disabled:opacity-50"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Sao chép ảnh</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 px-1 pt-1">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Xuất nét cao 3x Retina (PNG)
                  </span>
                  <span className="text-slate-500">
                    Sẵn sàng deploy Vercel
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Direct Image Modal (Fallback for iOS / Mobile) */}
      {modalImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#fe2c55]" /> Ảnh bình luận của bạn
              </h3>
              <button
                onClick={() => setModalImage(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="bg-black/50 rounded-xl p-4 flex items-center justify-center overflow-auto max-h-[60vh]">
              <img src={modalImage} alt="Preview" className="max-w-full rounded-lg shadow-lg" />
            </div>
            <p className="text-xs text-slate-400 text-center">
              💡 Bạn có thể bấm giữ hoặc chuột phải vào ảnh chọn <strong>&quot;Lưu hình ảnh thành...&quot;</strong>
            </p>
            <div className="flex gap-3">
              <a
                href={modalImage}
                download="tiktok-comment.png"
                className="flex-1 py-3 px-4 bg-gradient-to-r from-[#fe2c55] to-[#ff476d] text-white font-bold text-sm rounded-xl text-center shadow-lg transition"
              >
                Tải về máy
              </a>
              <button
                onClick={() => setModalImage(null)}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm rounded-xl transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-5 text-center text-xs text-slate-500">
        <p>TikTok Fake Comment Generator • Công cụ tạo bình luận giải trí, làm video, minh họa content.</p>
      </footer>

      {/* Toast Notification */}
      <div
        className={`fixed bottom-5 right-5 z-50 transition-all duration-300 pointer-events-none bg-slate-800 text-white border border-slate-700 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 ${
          toast.show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <div className="text-lg">
          {toast.type === 'error' ? (
            <AlertTriangle className="w-5 h-5 text-rose-500" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          )}
        </div>
        <div className="text-sm font-medium">{toast.message}</div>
      </div>
    </div>
  );
}
