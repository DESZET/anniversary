import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Happy 8th Month Anniversary ❤️",
  description: "Eight beautiful months. One incredible journey. A lifetime still ahead.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#0a0a1a] text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
