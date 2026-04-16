import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata = {
  title: "Kayparts Industrial Dashboard",
  description: "Portal de gestión de inventario Kayparts",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      {/* 
          SECURITY_PATCH_2026_04_16: 
          - IMPLEMENTED PANIC RESET (?reset=true)
          - HARDENED AUTH INITIALIZATION
          - FIXED INFINITE LOADING SPINNER
      */}
      <body className={`${inter.variable} ${outfit.variable}`}>
        <script dangerouslySetInnerHTML={{ __html: `
          // Panic Reset Logic: Si el usuario entra con ?reset=true, limpiamos todo
          if (window.location.search.includes('reset=true')) {
            localStorage.clear();
            sessionStorage.clear();
            document.cookie.split(";").forEach((c) => { 
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
            });
            window.location.href = window.location.pathname;
          }
        `}} />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
