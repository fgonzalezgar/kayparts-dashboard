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
          window.KAYPARTS_DEBUG = true;
          console.log("KAYPARTS_INIT: Starting root layout...");
          
          // Capturar errores globales para ver qué rompe la hidratación
          window.onerror = function(msg, url, line) {
            console.error("KAYPARTS_CRASH:", msg, "at", url, ":", line);
            return false;
          };

          window.onunhandledrejection = function(event) {
            console.error("KAYPARTS_PROMISE_CRASH:", event.reason);
          };

          // Auto-Recuperación: Si detectamos reset=true, limpiamos TODO
          if (window.location.search.includes('reset=true')) {
            console.warn("KAYPARTS_RESET: Performed manual cleanup");
            localStorage.clear();
            sessionStorage.clear();
            document.cookie.split(";").forEach(c => { 
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
