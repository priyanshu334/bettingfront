import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import NavigationBar from "@/components/NavigationBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SamaratOnlineBooking",
  description: "Predict, play and win rewards!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased  bg-gradient-to-br from-orange-500 via-orange-500 to-orange-500 min-h-screen flex flex-col">
        {/* Top navigation */}
        <Navbar />
        <NavigationBar />

        {/* Main layout with optional sidebar */}
        <div className="flex flex-1 overflow-hidden">
          {/* Optional sidebar - uncomment if you want it visible */}
          {/* <Sidebar /> */}

          {/* Main content area */}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
