// TikTok Fake Comment Generator Logic

// Helper: Generate high quality cute SVG avatars (100% offline, zero CORS issues)
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

// Preset Base64 Avatars (Fetched and embedded locally to guarantee 100% CORS-free exports)
let BASE64_AVATARS = [];

// Fetch local base64 presets
fetch('avatars_base64.json')
  .then(res => res.json())
  .then(data => {
    BASE64_AVATARS = data;
    initQuickPresets();
  })
  .catch(err => {
    console.warn('Could not load base64 avatars, fallback to SVG', err);
    initQuickPresets();
  });

// Preset Names (TikTok style)
const PRESET_NAMES = [
  'Hoàng Long 🧸',
  'Bé Bắp 🌽',
  'Hà Linh Reviewer ✨',
  'Minh Trí 🎮',
  'Ngọc Ánh 🌸',
  'Thanh Hằng 💅',
  'Duy Thẩm ⚡',
  'Phương Thảo 🥑',
  'Gia Bảo 🧢',
  'Hương Giang 🍉',
  'Tiến Đạt 🔥',
  'Mai Chi 🎀',
  'Lê Tuấn Khang',
  'Cẩm Tú 🍀',
  'Huy Cung 🎬'
];

const PRESET_TIMES = [
  'Vừa xong',
  '1 phút trước',
  '5 phút trước',
  '12 phút trước',
  '45 phút trước',
  '1 giờ trước',
  '2 giờ trước',
  '5 giờ trước',
  '8 giờ trước',
  '1 ngày trước',
  '2 ngày trước',
  '3 ngày trước',
  '1 tuần trước',
  '2 tuần trước',
  '3-15',
  '10-24'
];

const PRESET_LIKES = [
  '12',
  '48',
  '156',
  '320',
  '842',
  '1.2K',
  '2.5K',
  '5.8K',
  '9.4K',
  '12.3K',
  '18.7K',
  '25.4K',
  '49.1K',
  '82.6K',
  '120.5K',
  '250K',
  '1.2M'
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

// App State
let currentTheme = 'dark'; // 'dark' | 'light'
let currentMode = 'solo';  // 'solo' | 'frame'
let currentAvatarSrc = '';

// DOM Elements
const inputName = document.getElementById('input-name');
const inputComment = document.getElementById('input-comment');
const inputTime = document.getElementById('input-time');
const inputLikes = document.getElementById('input-likes');

const formAvatarPreview = document.getElementById('form-avatar-preview');
const avatarFileInput = document.getElementById('avatar-file-input');
const avatarPreviewContainer = document.getElementById('avatar-preview-container');
const btnUploadAvatar = document.getElementById('btn-upload-avatar');
const btnPasteAvatar = document.getElementById('btn-paste-avatar');
const avatarQuickPresets = document.getElementById('avatar-quick-presets');

// Checkboxes
const checkCreator = document.getElementById('check-creator');
const checkVerified = document.getElementById('check-verified');
const checkLikedByCreator = document.getElementById('check-liked-by-creator');
const checkPinned = document.getElementById('check-pinned');
const checkIsLiked = document.getElementById('check-is-liked');
const checkIsDisliked = document.getElementById('check-is-disliked');
const checkShowReplyCount = document.getElementById('check-show-reply-count');

// Preview Nodes
const tiktokCommentNode = document.getElementById('tiktok-comment-node');
const previewAvatar = document.getElementById('preview-avatar');
const previewAvatarClick = document.getElementById('preview-avatar-click');
const previewName = document.getElementById('preview-name');
const previewCommentBody = document.getElementById('preview-comment-body');
const previewTime = document.getElementById('preview-time');
const previewLikes = document.getElementById('preview-likes');
const previewHeartIcon = document.getElementById('preview-heart-icon');
const previewHeartContainer = document.getElementById('preview-heart-container');
const previewDislikeContainer = document.getElementById('preview-dislike-container');
const previewCreatorBadge = document.getElementById('preview-creator-badge');
const previewVerifiedBadge = document.getElementById('preview-verified-badge');
const previewLikedByCreator = document.getElementById('preview-liked-by-creator');
const previewPinnedTag = document.getElementById('preview-pinned-tag');
const previewRepliesRow = document.getElementById('preview-replies-row');

// Random buttons
const btnQuickRandomAll = document.getElementById('btn-quick-random-all');
const btnRandomName = document.getElementById('btn-random-name');
const btnRandomAvatar = document.getElementById('btn-random-avatar');
const btnRandomComment = document.getElementById('btn-random-comment');
const btnRandomTime = document.getElementById('btn-random-time');
const btnRandomLikes = document.getElementById('btn-random-likes');
const btnResetDefault = document.getElementById('btn-reset-default');

// Theme & Mode buttons
const themeDarkBtn = document.getElementById('theme-dark');
const themeLightBtn = document.getElementById('theme-light');
const modeSoloBtn = document.getElementById('mode-solo');
const modeFrameBtn = document.getElementById('mode-frame');

// Export buttons
const btnDownloadImage = document.getElementById('btn-download-image');
const downloadBtnText = document.getElementById('download-btn-text');
const btnHeaderDownload = document.getElementById('btn-header-download');
const btnCopyClipboard = document.getElementById('btn-copy-clipboard');
const copyBtnText = document.getElementById('copy-btn-text');

// Modal Elements
const imageModal = document.getElementById('image-modal');
const modalImagePreview = document.getElementById('modal-image-preview');
const modalDownloadLink = document.getElementById('modal-download-link');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnCloseModal2 = document.getElementById('btn-close-modal-2');

// Toast
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const toastIcon = document.getElementById('toast-icon');

// Set avatar image (always base64 or SVG)
function setAvatar(src) {
  currentAvatarSrc = src;
  formAvatarPreview.src = src;
  previewAvatar.src = src;
}

// Initialize Quick Presets row
function initQuickPresets() {
  avatarQuickPresets.innerHTML = '';
  
  // 3 cute SVG avatars
  for (let i = 1; i <= 3; i++) {
    const svgSrc = generateSvgAvatar(i);
    const img = document.createElement('img');
    img.src = svgSrc;
    img.alt = 'preset';
    img.className = 'avatar-preset-item';
    img.onclick = () => setAvatar(svgSrc);
    avatarQuickPresets.appendChild(img);
  }

  // Base64 photos
  if (BASE64_AVATARS && BASE64_AVATARS.length > 0) {
    BASE64_AVATARS.slice(0, 4).forEach((b64) => {
      const img = document.createElement('img');
      img.src = b64;
      img.alt = 'preset';
      img.className = 'avatar-preset-item';
      img.onclick = () => setAvatar(b64);
      avatarQuickPresets.appendChild(img);
    });
  }
}

// Randomizer functions
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomizeName() {
  const chosen = randomItem(PRESET_NAMES);
  inputName.value = chosen;
  updateFromInputs();
}

function randomizeTime() {
  const chosen = randomItem(PRESET_TIMES);
  inputTime.value = chosen;
  updateFromInputs();
}

function randomizeLikes() {
  const chosen = randomItem(PRESET_LIKES);
  inputLikes.value = chosen;
  updateFromInputs();
}

function randomizeComment() {
  const chosen = randomItem(PRESET_COMMENTS);
  inputComment.value = chosen;
  updateFromInputs();
}

function randomizeAvatar() {
  if (BASE64_AVATARS && BASE64_AVATARS.length > 0 && Math.random() < 0.6) {
    setAvatar(randomItem(BASE64_AVATARS));
  } else {
    const seed = Math.floor(Math.random() * 100);
    setAvatar(generateSvgAvatar(seed));
  }
}

function randomizeAll() {
  randomizeName();
  randomizeTime();
  randomizeLikes();
  randomizeAvatar();
  
  checkCreator.checked = Math.random() < 0.2;
  checkVerified.checked = Math.random() < 0.15;
  checkLikedByCreator.checked = Math.random() < 0.3;
  checkPinned.checked = Math.random() < 0.15;
  checkIsLiked.checked = Math.random() < 0.7;
  checkIsDisliked.checked = false;
  checkShowReplyCount.checked = Math.random() < 0.35;

  updateFromInputs();
  showToast('Đã random tất cả thông tin! 🎲');
}

// Sync Form Inputs -> Live Preview
function updateFromInputs() {
  previewName.textContent = inputName.value.trim() || 'Người dùng TikTok';

  // Comment content
  previewCommentBody.textContent = inputComment.value || '';

  // Time & Likes
  previewTime.textContent = inputTime.value.trim() || 'Vừa xong';
  previewLikes.textContent = inputLikes.value.trim() || '0';

  // Badges
  if (checkCreator.checked) {
    previewCreatorBadge.classList.remove('hidden');
  } else {
    previewCreatorBadge.classList.add('hidden');
  }

  if (checkVerified.checked) {
    previewVerifiedBadge.classList.remove('hidden');
  } else {
    previewVerifiedBadge.classList.add('hidden');
  }

  if (checkLikedByCreator.checked) {
    previewLikedByCreator.classList.remove('hidden');
    previewLikedByCreator.classList.add('flex');
  } else {
    previewLikedByCreator.classList.add('hidden');
    previewLikedByCreator.classList.remove('flex');
  }

  if (checkPinned.checked) {
    previewPinnedTag.classList.remove('hidden');
    previewPinnedTag.classList.add('flex');
  } else {
    previewPinnedTag.classList.add('hidden');
    previewPinnedTag.classList.remove('flex');
  }

  if (checkShowReplyCount.checked) {
    previewRepliesRow.classList.remove('hidden');
    previewRepliesRow.classList.add('flex');
  } else {
    previewRepliesRow.classList.add('hidden');
    previewRepliesRow.classList.remove('flex');
  }

  // Heart state: Pure SVG inline to prevent CORS or font loading issues
  if (checkIsLiked.checked) {
    previewHeartIcon.classList.add('is-liked');
    // Filled Red Heart
    previewHeartIcon.innerHTML = `
      <svg class="w-4 h-4 fill-[#fe2c55] text-[#fe2c55]" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>`;
  } else {
    previewHeartIcon.classList.remove('is-liked');
    // Outline Gray Heart
    const strokeColor = currentTheme === 'dark' ? '#8a8b91' : '#73747b';
    previewHeartIcon.innerHTML = `
      <svg class="w-4 h-4 fill-none stroke-[${strokeColor}]" style="stroke: ${strokeColor};" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>`;
  }

  // Dislike state: Pure outline thumbs-down
  if (checkIsDisliked.checked) {
    previewDislikeContainer.classList.add('is-disliked');
  } else {
    previewDislikeContainer.classList.remove('is-disliked');
  }
}

// Sync Live Preview (contenteditable) -> Form Inputs
function syncFromPreview() {
  inputName.value = previewName.textContent.trim();
  inputComment.value = previewCommentBody.textContent;
  inputTime.value = previewTime.textContent.trim();
  inputLikes.value = previewLikes.textContent.trim();
}

// Theme handling
function setTheme(theme) {
  currentTheme = theme;
  if (theme === 'dark') {
    tiktokCommentNode.classList.remove('tiktok-theme-light');
    tiktokCommentNode.classList.add('tiktok-theme-dark');
    themeDarkBtn.className = 'flex-1 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 bg-slate-800 text-white shadow-sm transition';
    themeLightBtn.className = 'flex-1 py-1.5 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 text-slate-400 hover:text-white transition';
  } else {
    tiktokCommentNode.classList.remove('tiktok-theme-dark');
    tiktokCommentNode.classList.add('tiktok-theme-light');
    themeLightBtn.className = 'flex-1 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 bg-slate-800 text-white shadow-sm transition';
    themeDarkBtn.className = 'flex-1 py-1.5 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 text-slate-400 hover:text-white transition';
  }
  updateFromInputs();
}

// Mode handling
function setMode(mode) {
  currentMode = mode;
  if (mode === 'solo') {
    tiktokCommentNode.classList.remove('tiktok-frame-mode');
    modeSoloBtn.className = 'flex-1 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1 bg-slate-800 text-white shadow-sm transition';
    modeFrameBtn.className = 'flex-1 py-1.5 rounded-md text-xs font-medium flex items-center justify-center gap-1 text-slate-400 hover:text-white transition';
  } else {
    tiktokCommentNode.classList.add('tiktok-frame-mode');
    modeFrameBtn.className = 'flex-1 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1 bg-slate-800 text-white shadow-sm transition';
    modeSoloBtn.className = 'flex-1 py-1.5 rounded-md text-xs font-medium flex items-center justify-center gap-1 text-slate-400 hover:text-white transition';
  }
}

// File upload handler
function handleFileUpload(file) {
  if (!file || !file.type.startsWith('image/')) {
    showToast('Vui lòng chọn một file hình ảnh!', 'error');
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    setAvatar(e.target.result);
    showToast('Đã tải ảnh đại diện lên thành công! 📸');
  };
  reader.readAsDataURL(file);
}

// Paste image from clipboard
async function pasteImageFromClipboard() {
  try {
    const clipboardItems = await navigator.clipboard.read();
    for (const item of clipboardItems) {
      for (const type of item.types) {
        if (type.startsWith('image/')) {
          const blob = await item.getType(type);
          handleFileUpload(blob);
          return;
        }
      }
    }
    showToast('Không tìm thấy ảnh trong Clipboard!', 'error');
  } catch (err) {
    showToast('Bạn có thể nhấn Ctrl+V trực tiếp để dán ảnh', 'info');
  }
}

// Toast notification helper
let toastTimeout;
function showToast(msg, type = 'success') {
  clearTimeout(toastTimeout);
  toastMessage.textContent = msg;
  if (type === 'error') {
    toastIcon.innerHTML = '<i class="fa-solid fa-triangle-exclamation text-rose-500"></i>';
  } else if (type === 'info') {
    toastIcon.innerHTML = '<i class="fa-solid fa-circle-info text-blue-400"></i>';
  } else {
    toastIcon.innerHTML = '<i class="fa-solid fa-circle-check text-emerald-400"></i>';
  }
  toast.classList.remove('translate-y-20', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  toastTimeout = setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 2600);
}

// Render capture to canvas using html2canvas safely
async function generateCanvas() {
  // Unfocus any active contenteditable
  if (document.activeElement && document.activeElement.getAttribute('contenteditable')) {
    document.activeElement.blur();
  }

  const bgColor = currentMode === 'frame' ? null : (currentTheme === 'dark' ? '#121212' : '#ffffff');

  return await html2canvas(tiktokCommentNode, {
    scale: 3, // Crisp Retina resolution
    useCORS: true,
    allowTaint: true,
    backgroundColor: bgColor,
    logging: false,
    imageTimeout: 0
  });
}

// Download image action
async function downloadImage() {
  downloadBtnText.textContent = 'Đang tạo ảnh...';
  btnDownloadImage.disabled = true;

  try {
    const canvas = await generateCanvas();
    const dataUrl = canvas.toDataURL('image/png');
    const safeName = (inputName.value.trim() || 'tiktok').replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1E00-\u1EFF]/g, '_');
    const filename = `tiktok-comment-${safeName}-${Date.now()}.png`;

    // Try direct link download
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Đã tải ảnh bình luận thành công! 🎉');
  } catch (error) {
    console.error('Download error:', error);
    // Show fallback modal with image preview to save manually
    try {
      const canvas = await generateCanvas();
      const dataUrl = canvas.toDataURL('image/png');
      modalImagePreview.src = dataUrl;
      modalDownloadLink.href = dataUrl;
      imageModal.classList.remove('hidden');
      imageModal.classList.add('flex');
      showToast('Đã mở ảnh! Bạn có thể lưu ảnh trực tiếp.', 'info');
    } catch (innerErr) {
      showToast('Lỗi khi xuất ảnh: ' + (error.message || 'vui lòng thử lại!'), 'error');
    }
  } finally {
    downloadBtnText.textContent = 'Tải ảnh PNG';
    btnDownloadImage.disabled = false;
  }
}

// Copy image to clipboard action
async function copyImageToClipboard() {
  const originalText = copyBtnText.textContent;
  copyBtnText.textContent = 'Đang copy...';

  try {
    const canvas = await generateCanvas();
    canvas.toBlob(async (blob) => {
      if (!blob) {
        showToast('Không thể tạo file ảnh!', 'error');
        copyBtnText.textContent = originalText;
        return;
      }
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        showToast('Đã copy ảnh vào Clipboard! Bạn có thể dán (Ctrl+V) ngay 📋');
      } catch (err) {
        console.error('Clipboard write error:', err);
        showToast('Trình duyệt chặn sao chép, hãy dùng nút Tải ảnh!', 'error');
      } finally {
        copyBtnText.textContent = originalText;
      }
    }, 'image/png');
  } catch (err) {
    console.error('Canvas error:', err);
    showToast('Lỗi khi copy ảnh!', 'error');
    copyBtnText.textContent = originalText;
  }
}

// Reset to default sample
function resetToDefault() {
  inputName.value = 'Hoàng Long 🧸';
  inputComment.value = 'Xem clip mà cười xỉu luôn á trời ơi 😂 Đúng tâm trạng của tui mỗi sáng đi làm luôn á hahaha!';
  inputTime.value = '2 giờ trước';
  inputLikes.value = '15.4K';
  checkCreator.checked = false;
  checkVerified.checked = false;
  checkLikedByCreator.checked = false;
  checkPinned.checked = false;
  checkIsLiked.checked = true;
  checkIsDisliked.checked = false;
  checkShowReplyCount.checked = false;

  setAvatar(generateSvgAvatar(8));
  setTheme('dark');
  setMode('solo');
  updateFromInputs();
}

// Event Listeners Setup
function setupEventListeners() {
  // Input sync
  [inputName, inputComment, inputTime, inputLikes].forEach((el) => {
    el.addEventListener('input', updateFromInputs);
  });

  // Checkbox sync
  [checkCreator, checkVerified, checkLikedByCreator, checkPinned, checkIsLiked, checkIsDisliked, checkShowReplyCount].forEach((el) => {
    el.addEventListener('change', updateFromInputs);
  });

  // Preview contenteditable sync back to inputs
  [previewName, previewCommentBody, previewTime, previewLikes].forEach((el) => {
    el.addEventListener('input', syncFromPreview);
  });

  // Heart toggle on preview click
  previewHeartContainer.addEventListener('click', (e) => {
    if (e.target === previewLikes) return;
    checkIsLiked.checked = !checkIsLiked.checked;
    updateFromInputs();
  });

  // Dislike toggle on preview click
  previewDislikeContainer.addEventListener('click', () => {
    checkIsDisliked.checked = !checkIsDisliked.checked;
    updateFromInputs();
  });

  // Avatar click triggers upload
  previewAvatarClick.addEventListener('click', () => avatarFileInput.click());
  avatarPreviewContainer.addEventListener('click', () => avatarFileInput.click());
  btnUploadAvatar.addEventListener('click', () => avatarFileInput.click());

  avatarFileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  });

  btnPasteAvatar.addEventListener('click', pasteImageFromClipboard);

  // Global paste for images anywhere
  window.addEventListener('paste', (e) => {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (const item of items) {
      if (item.type.indexOf('image') === 0) {
        const blob = item.getAsFile();
        handleFileUpload(blob);
        break;
      }
    }
  });

  // Quick Emojis
  document.querySelectorAll('.emoji-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const emoji = btn.textContent;
      const start = inputComment.selectionStart;
      const end = inputComment.selectionEnd;
      const text = inputComment.value;
      inputComment.value = text.substring(0, start) + emoji + text.substring(end);
      inputComment.focus();
      inputComment.selectionStart = inputComment.selectionEnd = start + emoji.length;
      updateFromInputs();
    });
  });

  // Random buttons
  btnQuickRandomAll.addEventListener('click', randomizeAll);
  btnRandomName.addEventListener('click', randomizeName);
  btnRandomAvatar.addEventListener('click', randomizeAvatar);
  btnRandomComment.addEventListener('click', randomizeComment);
  btnRandomTime.addEventListener('click', randomizeTime);
  btnRandomLikes.addEventListener('click', randomizeLikes);
  btnResetDefault.addEventListener('click', resetToDefault);

  // Theme & Mode buttons
  themeDarkBtn.addEventListener('click', () => setTheme('dark'));
  themeLightBtn.addEventListener('click', () => setTheme('light'));
  modeSoloBtn.addEventListener('click', () => setMode('solo'));
  modeFrameBtn.addEventListener('click', () => setMode('frame'));

  // Export buttons
  btnDownloadImage.addEventListener('click', downloadImage);
  btnHeaderDownload.addEventListener('click', downloadImage);
  btnCopyClipboard.addEventListener('click', copyImageToClipboard);

  // Modal close buttons
  btnCloseModal.addEventListener('click', () => {
    imageModal.classList.add('hidden');
    imageModal.classList.remove('flex');
  });
  btnCloseModal2.addEventListener('click', () => {
    imageModal.classList.add('hidden');
    imageModal.classList.remove('flex');
  });
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  resetToDefault();
  setupEventListeners();
});
