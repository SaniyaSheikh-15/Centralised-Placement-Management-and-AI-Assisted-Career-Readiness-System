import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050B14]">
      <Sidebar />
      <Navbar />

      <div className="pt-16 lg:pl-64">
        {children}
      </div>
    </div>
  );
}