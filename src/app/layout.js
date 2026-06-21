import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Toaster } from "react-hot-toast";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["500"],
});

export const metadata = {
  title: "RentEase - Property Rental & Booking",
  description: "A transparent marketplace connecting tenants and property owners",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${inter.variable} ${plexMono.variable}`} suppressHydrationWarning>
        <AuthProvider>
          <Toaster position="top-center" />
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}