import Navbar from "@/components/Navbar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-[url('/bg.png')] bg-cover bg-no-repeat">
      <Navbar />
      <div className="mt-16 max-md:mb-16 ">{children}</div>
    </div>
  );
}
