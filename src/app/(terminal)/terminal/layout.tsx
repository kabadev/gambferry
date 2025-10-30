import type React from "react";
import { AdminSidebar } from "../components/admin-sidebar";
import { AdminHeader } from "../components/admin-header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden ">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden md:w-[calc(100%-250px)] md:ml-[250px] ">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto bg-[url('/bg.png')] bg-cover bg-no-repeat p-2 md:p-6 ">
          {children}
        </main>
      </div>
    </div>
  );
}
