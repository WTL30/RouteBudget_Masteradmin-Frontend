import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientSidebar } from "./client-components";
import { SubAdminProvider } from "../context/sub-admin-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ Add favicon to metadata
export const metadata = {
  title: "Cab Expengo",
  description: "Cab management dashboard",
  icons: {
    icon: "/favicon.ico", // 👈 this should match your favicon file in /public
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SubAdminProvider>
          <div className="flex min-h-screen">
            <ClientSidebar />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </SubAdminProvider>
      </body>
    </html>
  );
}
