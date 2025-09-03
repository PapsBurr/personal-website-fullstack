import { Geist, Geist_Mono } from "next/font/google";
import Header from "./components/Header";
import ClientLayout from "./components/ClientLayout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Nathan's Clubhouse",
  description: "A static website showcasing my projects and qualifications.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
