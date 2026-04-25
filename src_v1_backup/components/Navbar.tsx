import Link from "next/link";
import { Palette, Code } from "lucide-react";

export default function Navbar() {
  return (
    <header className="w-full border-b-4 border-paintify-border bg-white px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-paintify-primary p-2 kid-border group-hover:-rotate-6 transition-transform">
            <Palette className="w-6 h-6 text-white" strokeWidth={3} />
          </div>
          <span className="text-2xl font-black tracking-tight text-paintify-dark">
            Paintify
          </span>
        </Link>
        
        <div className="flex items-center gap-4 hidden sm:flex">
          <Link href="/studio" className="bg-paintify-yellow kid-btn !py-2 !px-4">
            Start Creating
          </Link>
        </div>
      </div>
    </header>
  );
}
