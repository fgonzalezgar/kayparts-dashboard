'use client';

import Sidebar from "@/components/Sidebar";
import AuthGuard from "@/components/AuthGuard";

export default function DashboardLayout({ children }) {
  return (
    <AuthGuard>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />
        <main
          style={{
            flex: 1,
            marginLeft: "var(--sidebar-width)",
            padding: "40px",
            backgroundColor: "var(--bg-main)",
            minHeight: "100vh",
          }}
        >
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
