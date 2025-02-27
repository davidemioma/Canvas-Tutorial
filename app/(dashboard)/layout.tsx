import Navbar from "./_components/Navbar";
import Sidebar from "./_components/sidebar";
import OrgSidebar from "@/components/OrgSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-full">
      <Sidebar />

      <div className="pl-[60px] h-full">
        <div className="h-full flex gap-3">
          <OrgSidebar />

          <div className="h-full flex-1 border-l">
            <Navbar />

            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
