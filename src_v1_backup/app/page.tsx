import Link from "next/link";
import { Sparkles, Palette, ShieldCheck, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center w-full max-w-6xl mx-auto px-6 py-12 md:py-24 gap-24">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center gap-8 max-w-3xl border-8 border-transparent">
        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 kid-border shadow-[2px_2px_0_0_#111]">
          <span className="text-xl">🚀</span>
          <span className="font-bold">Free & Open Source forever!</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black leading-tight">
          AI coloring pages for <span className="text-paintify-primary">kids</span>
        </h1>
        
        <p className="text-xl md:text-2xl font-semibold opacity-80 max-w-2xl">
          Generate safe black-and-white coloring pages, paint them in the browser, save, and print.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
          <Link 
            href="/studio" 
            className="bg-paintify-primary text-white kid-btn text-xl !py-4 !px-8 w-full sm:w-auto flex justify-center items-center gap-2"
          >
            <Palette className="w-6 h-6" />
            Start Painting
          </Link>
          <a 
            href="https://github.com/brucewyne0101225/paintify" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white kid-btn text-xl !py-4 !px-8 w-full sm:w-auto flex justify-center text-paintify-dark"
          >
            View on GitHub
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
        <FeatureCard 
          icon={<Sparkles className="w-10 h-10 text-white" />}
          color="bg-paintify-yellow"
          title="Generate with AI"
          desc="Turn safe prompts like 'A dinosaur eating ice cream' into clean line-art."
        />
        <FeatureCard 
          icon={<Palette className="w-10 h-10 text-white" />}
          color="bg-paintify-lightBlue"
          title="Paint in Browser"
          desc="Fun, touch-friendly drawing tools built specifically for little fingers."
        />
        <FeatureCard 
          icon={<ShieldCheck className="w-10 h-10 text-white" />}
          color="bg-paintify-green"
          title="100% Child Safe"
          desc="Strict prompt filtering ensuring no scary or inappropriate content."
        />
      </section>

      {/* Footer Note */}
      <footer className="text-center font-bold opacity-60 flex items-center gap-2 mt-12 pb-12">
        Built with <Heart className="w-5 h-5 text-red-500 fill-current" /> for children and parents
      </footer>
    </div>
    </div>
  );
}

function FeatureCard({ icon, color, title, desc }: { icon: React.ReactNode, color: string, title: string, desc: string }) {
  return (
    <div className="bg-white p-8 kid-border kid-shadow flex flex-col gap-4 text-center items-center">
      <div className={`p-4 rounded-2xl kid-border ${color} shadow-[2px_2px_0_0_#111] mb-2`}>
        {icon}
      </div>
      <h3 className="text-2xl font-black">{title}</h3>
      <p className="font-semibold text-lg opacity-80 leading-snug">{desc}</p>
    </div>
  );
}
