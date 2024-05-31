import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SkyCast",
  description:
    "Discover the future of weather forecasting with WeatherWave! Our cutting-edge app brings you the most accurate and up-to-date weather information, right at your fingertips. With stunning visuals and a sleek, user-friendly interface, WeatherWave ensures you're always prepared, no matter what Mother Nature has in store.",
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
