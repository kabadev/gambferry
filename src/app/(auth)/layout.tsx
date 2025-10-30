import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="">
      <Navbar />
      {/* Image Column */}
      <div className="flex mt-16 w-full items-center justify-center ">
        {children}
      </div>
    </div>
  );
}
