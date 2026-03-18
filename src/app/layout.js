import "./globals.css";

export const metadata = {
  title: "DrowsyGuard - Hệ Thống Cảnh Báo Buồn Ngủ IoT",
  description: "Hệ thống giám sát và cảnh báo buồn ngủ cho tài xế sử dụng Face ID và cảm biến nhịp tim. Bảo vệ an toàn giao thông với công nghệ IoT tiên tiến.",
  keywords: "IoT, drowsy detection, face recognition, heart rate, driver safety, cảnh báo buồn ngủ",
  authors: [{ name: "Tran Van Thuan" }],
  openGraph: {
    title: "DrowsyGuard - IoT Driver Safety System",
    description: "Smart IoT-based drowsy driving detection system with Face ID and heart rate monitoring",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
