# 💬 TikTok Fake Comment Generator (Next.js + Tailwind CSS)

Ứng dụng tạo ảnh chụp bình luận TikTok giả lập cực kỳ chân thực, xuất ảnh siêu nét với công nghệ `html-to-image`, khắc phục 100% lỗi xuất ảnh của thư viện cũ và sẵn sàng deploy lên Vercel chỉ với 1 click.

---

## 🚀 Tính năng nổi bật

- **Typography & Màu sắc chuẩn TikTok:**
  - Tên hiển thị: màu xám thanh thoát (`#8a8b91` ở Dark mode, `#73747b` ở Light mode).
  - Bỏ trường ID/Username theo đúng giao diện app TikTok.
  - Thời gian bình luận: màu xám.
  - Số lượt tim: màu xám, nằm NGANG cạnh icon tim.
  - Icon Dislike: **Dạng OUTLINE rỗng ruột chuẩn TikTok**, màu xám, nằm cạnh số tim.
- **Tải ảnh PNG & Copy Clipboard siêu tốc:**
  - Sử dụng thư viện hiện đại `html-to-image` (chuẩn công nghiệp), render trực tiếp sang PNG 3x Retina chỉ trong vài chục mili-giây.
  - Không bao giờ bị lỗi CORS hay lỗi xung đột CSS Rules của trình duyệt.
  - Có modal xem trực tiếp để chạm giữ lưu ảnh trên điện thoại.
- **Tùy chỉnh & Random thông minh:**
  - Nút **Random tất cả** và nút random riêng từng trường (Tên, Avatar, Thời gian, Số tim, Mẫu bình luận vui).
  - Tải ảnh từ máy, dán ảnh từ clipboard (`Ctrl + V`), hoặc dùng avatar cute.
  - Bật/tắt huy hiệu: Tác giả (Creator), Tick xanh (Verified), Tác giả thích ❤️, Đã ghim 📌, Đã dislike 👎.

---

## 🛠️ Chạy tại Local

```bash
# Cài đặt thư viện (nếu chưa cài)
npm install

# Chạy môi trường phát triển
npm run dev

# Hoặc chạy bản production đã tối ưu
npm run build
npm start
```
Truy cập: [http://localhost:3000](http://localhost:3000)

---

## ☁️ Hướng dẫn Deploy lên Vercel (1 Phút)

### Cách 1: Dùng Vercel CLI (Nhanh nhất)
```bash
npx vercel
```
Làm theo hướng dẫn trên terminal, Vercel sẽ tự động build và cấp link web live cho bạn.

### Cách 2: Deploy qua GitHub
1. Tạo một repository mới trên GitHub.
2. Đẩy toàn bộ mã nguồn lên:
   ```bash
   git init
   git add .
   git commit -m "feat: tiktok fake comment nextjs"
   git branch -M main
   git remote add origin <URL-REPO-CUA-BAN>
   git push -u origin main
   ```
3. Truy cập [vercel.com](https://vercel.com), bấm **"Add New Project"**, chọn repo vừa tạo và bấm **Deploy**. Vercel sẽ tự nhận diện Next.js và hoàn tất trong 30 giây!
