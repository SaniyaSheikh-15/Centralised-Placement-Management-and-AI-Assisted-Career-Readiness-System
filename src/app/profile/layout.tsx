import Sidebar from '@/components/shared/Sidebar';
import TopNavbar from '@/components/shared/TopNavbar';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <TopNavbar />
      <main className="ml-[260px] mt-[60px] min-h-[calc(100vh-60px)] p-8 max-md:ml-0 max-md:p-4">
        {children}
      </main>
    </>
  );
}
