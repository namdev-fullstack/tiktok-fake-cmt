import './globals.css';

export const metadata = {
  title: 'TikTok Fake Comment Generator - Tạo Bình Luận TikTok Chuẩn Đẹp',
  description: 'Công cụ tạo ảnh chụp màn hình bình luận TikTok chân thực, sắc nét và tải về ngay lập tức.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className="min-h-screen flex flex-col antialiased selection:bg-[#fe2c55] selection:text-white">
        {children}
      </body>
    </html>
  );
}
