import Link from "next/link";
import { Sparkles, Palette, ShieldCheck, Heart, Download, Tablet, Brush, Share, PlusSquare, ArrowRight, CheckCircle2 } from "lucide-react";
import { EXPLORE_LIBRARY } from "@/lib/data/library";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-[#FFF7EC] text-[#111111] overflow-x-hidden selection:bg-[#FF7BA7] selection:text-white">
      
      {/* 2. NAVBAR REDESIGN */}
      <nav className="w-full sticky top-0 z-50 px-4 py-4 lg:px-8">
        <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-md rounded-full px-6 py-4 flex items-center justify-between shadow-[0_4px_20px_-5px_rgba(0,0,0,0.1)] border border-gray-100">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-[#FF7BA7] p-2 rounded-xl group-hover:-rotate-6 transition-transform">
              <Palette className="w-6 h-6 text-white" strokeWidth={3} />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight leading-none">Paintify</span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mt-1">By Auroze.ca</span>
            </div>
          </Link>
          
          <div className="hidden lg:flex items-center gap-8 font-bold text-gray-600">
            <a href="#how-it-works" className="hover:text-[#FF7BA7] transition-colors">How It Works</a>
            <a href="#library" className="hover:text-[#8FD3FF] transition-colors">Library</a>
            <a href="#safety" className="hover:text-[#9BE7C2] transition-colors">Safety</a>
            <a href="#install" className="hover:text-[#F4C84A] transition-colors">Install App</a>
          </div>

          <Link href="/studio" className="bg-[#FF7BA7] text-white font-black px-6 py-3 rounded-full shadow-[4px_4px_0_0_#111] hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all">
            Start Creating
          </Link>
        </div>
      </nav>

      <main className="flex-col items-center w-full">
        
        {/* 3 & 4. HERO SECTION */}
        <section className="relative w-full max-w-7xl mx-auto px-6 py-16 lg:py-32 flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
          
          <div className="flex-1 flex flex-col gap-8 z-10 text-center lg:text-left items-center lg:items-start">
            <div className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full font-bold text-sm shadow-[3px_3px_0_0_#111] animate-in fade-in slide-in-from-bottom-4 duration-700">
              <Sparkles className="w-4 h-4 text-[#F4C84A]" /> Premium iPad Coloring Studio
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              AI coloring pages for kids that feel <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7BA7] to-[#8FD3FF] animate-pulse">magical.</span>
            </h1>
            
            <p className="text-xl lg:text-2xl font-semibold opacity-75 max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              Generate safe black-and-white coloring pages instantly, paint with your fingers, save, print, and enjoy natively on iPad.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <Link href="/studio" className="bg-[#8FD3FF] text-[#111] text-xl font-black py-4 px-8 rounded-2xl shadow-[4px_4px_0_0_#111] hover:-translate-y-1 transition-transform flex items-center justify-center gap-3">
                <Brush className="w-6 h-6" /> Start Painting
              </Link>
              <a href="#library" className="bg-white text-[#111] border-2 border-gray-200 text-xl font-black py-4 px-8 rounded-2xl hover:bg-gray-50 hover:-translate-y-1 transition-transform flex items-center justify-center gap-3">
                Explore Library
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-4 font-bold text-sm opacity-80 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-[#9BE7C2]"/> 100% Child Safe</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-[#9BE7C2]"/> Works on iPad</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-[#9BE7C2]"/> Free Application</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-[#9BE7C2]"/> No Ads</span>
            </div>
          </div>

          {/* Right side: Mockup */}
          <div className="flex-1 relative w-full max-w-[600px] flex justify-center animate-in fade-in zoom-in-95 duration-1000">
            {/* Soft decorative blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-[#9BE7C2]/40 to-[#8FD3FF]/40 rounded-full blur-3xl -z-10 animate-pulse"></div>
            
            {/* iPad Frame Mockup */}
            <div className="relative bg-[#111] p-4 rounded-[40px] shadow-2xl border-4 border-gray-800 w-full aspect-[4/3] transform rotate-2 hover:rotate-0 transition-transform duration-500 flex flex-col overflow-hidden">
               {/* Inner Screen */}
               <div className="bg-white w-full h-full rounded-[24px] overflow-hidden flex shadow-inner">
                  {/* Fake UI */}
                  <div className="w-full flex">
                    <div className="flex-1 bg-white p-4 flex flex-col">
                       <div className="w-full flex-1 border-4 border-dashed border-gray-200 rounded-xl flex items-center justify-center relative overflow-hidden">
                         <img src="/hand-drawn-kawaii-coloring-book-with-dinosaurs_23-2149842646.jpg.jpeg" alt="Preview" className="h-full object-contain opacity-80 scale-110" />
                         {/* Paint splatters */}
                         <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-[#FF7BA7] rounded-full mix-blend-multiply opacity-50 blur-sm"></div>
                         <div className="absolute bottom-1/3 right-1/4 w-16 h-16 bg-[#8FD3FF] rounded-full mix-blend-multiply opacity-50 blur-sm"></div>
                       </div>
                    </div>
                    <div className="w-24 bg-gray-50 border-l-2 border-gray-100 flex flex-col items-center py-4 gap-4">
                       <div className="w-12 h-12 rounded-full bg-[#FF7BA7] border-4 border-white shadow-md"></div>
                       <div className="w-12 h-12 rounded-full bg-[#F4C84A] border-4 border-white shadow-md"></div>
                       <div className="w-12 h-12 rounded-full bg-[#8FD3FF] border-4 border-white shadow-md"></div>
                       <div className="w-12 h-12 rounded-full bg-[#9BE7C2] border-4 border-white shadow-md"></div>
                    </div>
                  </div>
               </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-6 -left-6 bg-white px-4 py-2 rounded-xl shadow-[4px_4px_0_0_#111] font-black text-lg border-2 border-gray-100 animate-bounce" style={{animationDuration: '3s'}}>🦖 Dinosaurs</div>
            <div className="absolute top-12 -right-8 bg-white px-4 py-2 rounded-xl shadow-[4px_4px_0_0_#111] font-black text-lg border-2 border-gray-100 animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}}>🚀 Space</div>
            <div className="absolute -bottom-8 left-12 bg-white px-4 py-2 rounded-xl shadow-[4px_4px_0_0_#111] font-black text-lg border-2 border-gray-100 animate-bounce" style={{animationDuration: '3.5s', animationDelay: '0.5s'}}>🦄 Fantasy</div>
          </div>
        </section>

        {/* 5. HOW IT WORKS */}
        <section id="how-it-works" className="w-full py-24 bg-white border-y-4 border-gray-100 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-black mb-4">How Paintify Works</h2>
              <p className="text-xl font-semibold opacity-70">Three simple steps to endless creativity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#FFF7EC] p-8 rounded-[32px] border-4 border-[#F4C84A] flex flex-col items-center text-center shadow-[8px_8px_0_0_#F4C84A] hover:-translate-y-2 transition-transform">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-sm mb-6">✨</div>
                <h3 className="text-2xl font-black mb-2">1. Imagine It</h3>
                <p className="font-semibold opacity-80">Type a magical idea like <br/><i>"A T-Rex eating ice cream"</i>.</p>
              </div>
              <div className="bg-[#FFF7EC] p-8 rounded-[32px] border-4 border-[#8FD3FF] flex flex-col items-center text-center shadow-[8px_8px_0_0_#8FD3FF] hover:-translate-y-2 transition-transform">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-sm mb-6">🤖</div>
                <h3 className="text-2xl font-black mb-2">2. AI Draws It</h3>
                <p className="font-semibold opacity-80">Our safe AI instantly generates a beautiful black-and-white coloring page.</p>
              </div>
              <div className="bg-[#FFF7EC] p-8 rounded-[32px] border-4 border-[#FF7BA7] flex flex-col items-center text-center shadow-[8px_8px_0_0_#FF7BA7] hover:-translate-y-2 transition-transform">
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-sm mb-6">🖍️</div>
                <h3 className="text-2xl font-black mb-2">3. Paint It</h3>
                <p className="font-semibold opacity-80">Use your fingers or Apple Pencil to color it in our full-screen studio.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. PRELOADED LIBRARY SHOWCASE */}
        <section id="library" className="w-full py-24 bg-[#FFF7EC] overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-4xl lg:text-5xl font-black mb-4">Popular Coloring Library</h2>
              <p className="text-xl font-semibold opacity-70">Don't want to wait for AI? Pick an instant masterpiece.</p>
            </div>
            <Link href="/studio" className="bg-white text-[#111] border-2 border-gray-200 font-black py-3 px-6 rounded-xl hover:bg-gray-50 flex items-center gap-2 whitespace-nowrap">
              View All <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="w-full overflow-x-auto pb-8 custom-scrollbar px-6 lg:px-12 flex gap-6 snap-x">
            {EXPLORE_LIBRARY.slice(0, 8).map((item) => (
              <div key={item.id} className="min-w-[280px] bg-white rounded-3xl border-4 border-gray-100 shadow-[6px_6px_0_0_rgba(0,0,0,0.05)] overflow-hidden flex flex-col snap-center group">
                <div className="h-48 bg-gray-50 p-4 border-b-2 border-gray-100 relative">
                  <img src={item.image} alt={item.title} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform" />
                </div>
                <div className="p-6 flex flex-col gap-4">
                  <div>
                    <h4 className="font-black text-xl line-clamp-1">{item.title}</h4>
                    <span className="text-sm font-bold text-gray-400">{item.category}</span>
                  </div>
                  <Link href="/studio" className="w-full bg-[#9BE7C2] text-white text-center font-black py-3 rounded-xl shadow-[2px_2px_0_0_#111] hover:-translate-y-1 transition-transform">
                    Start with This
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 7. INSTALL ON IPAD */}
        <section id="install" className="w-full py-24 bg-[#111] text-white">
          <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 flex justify-center">
              {/* Abstract iPad graphic */}
              <div className="relative w-72 h-96 bg-gray-800 rounded-[3rem] border-8 border-gray-700 flex flex-col items-center p-6 shadow-2xl">
                 <div className="w-full h-full bg-white rounded-2xl flex flex-col p-4 items-center justify-center text-center gap-4 text-[#111]">
                   <img src="/globe.svg" className="w-16 h-16 mx-auto mb-2 opacity-20" />
                   <h3 className="font-black text-xl">Paintify App</h3>
                   <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full font-bold">
                     <Share className="w-4 h-4 text-blue-500" /> Share
                   </div>
                   <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full font-bold">
                     <PlusSquare className="w-4 h-4 text-gray-500" /> Add to Home Screen
                   </div>
                 </div>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col gap-8 text-center lg:text-left">
              <h2 className="text-4xl lg:text-5xl font-black leading-tight">Use Paintify on iPad like a real app.</h2>
              <p className="text-xl text-gray-400 mb-8 max-w-lg font-medium leading-relaxed">
              Paintify works as a web app, so you can add it to your iPad Home Screen directly from Safari — no App Store download required.
            </p>
              
              <ul className="flex flex-col gap-4 text-lg font-bold">
                <li className="flex items-center gap-4 bg-gray-800 p-4 rounded-2xl border border-gray-700">
                  <span className="w-8 h-8 rounded-full bg-[#8FD3FF] text-[#111] flex items-center justify-center shrink-0">1</span>
                  Click "Start Painting" to open the Studio in Safari
                </li>
                <li className="flex items-center gap-4 bg-gray-800 p-4 rounded-2xl border border-gray-700">
                  <span className="w-8 h-8 rounded-full bg-[#F4C84A] text-[#111] flex items-center justify-center shrink-0">2</span>
                  Tap the Share button <Share className="w-5 h-5 opacity-70 inline ml-2" />
                </li>
                <li className="flex items-center gap-4 bg-gray-800 p-4 rounded-2xl border border-gray-700">
                  <span className="w-8 h-8 rounded-full bg-[#FF7BA7] text-[#111] flex items-center justify-center shrink-0">3</span>
                  Tap "Add to Home Screen" <PlusSquare className="w-5 h-5 opacity-70 inline ml-2" />
                </li>
              </ul>
              
              <div className="mt-4">
                <button className="bg-white text-[#111] text-xl font-black py-4 px-8 rounded-2xl hover:bg-gray-200 transition-colors inline-flex items-center gap-3">
                  <Tablet className="w-6 h-6" /> Install Instructions
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 9. CHILD SAFETY SECTION */}
        <section id="safety" className="w-full py-24 bg-white border-b-4 border-gray-100">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <ShieldCheck className="w-20 h-20 text-[#9BE7C2] mx-auto mb-8" />
            <h2 className="text-4xl lg:text-5xl font-black mb-6">Built for children.<br/>Trusted by parents.</h2>
            <p className="text-xl font-semibold opacity-70 mb-12 max-w-2xl mx-auto">
              We engineered a bulletproof safety system so you can hand the iPad to your child with total peace of mind.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {[
                { title: "Ultra Strict Prompts", desc: "Our AI completely blocks scary, mature, or inappropriate words before generation." },
                { title: "Zero Advertisements", desc: "No flashing banners, no tracking cookies, and absolutely no sneaky in-app purchases." },
                { title: "Private Gallery", desc: "Artwork is stored locally on your device. Nothing is uploaded to public servers." },
                { title: "No Public Chat", desc: "A closed environment where children can create safely without social media features." },
                { title: "Kid-Friendly UI", desc: "Big buttons, clear icons, and forgiving touch targets built for little fingers." },
                { title: "Privacy First", desc: "We don't collect personal data or store creations on our servers. Your child's art stays safe on your device." }
              ].map((feature, i) => (
                <div key={i} className="bg-[#FFF7EC] p-6 rounded-3xl border-2 border-gray-100">
                   <h4 className="font-black text-xl mb-2 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-[#9BE7C2]"/> {feature.title}</h4>
                   <p className="font-medium text-gray-600 leading-snug">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 10. WHY IPAD */}
        <section className="w-full py-24 bg-[#8FD3FF]/20">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center text-center md:text-left gap-12">
            <div className="flex-1">
               <h2 className="text-4xl lg:text-5xl font-black mb-6">Made for little hands.</h2>
               <p className="text-xl font-semibold opacity-80 mb-8 max-w-lg">
                 Paintify features a gorgeous edge-to-edge drawing canvas specifically optimized for the iPad display. Support for multi-touch finger painting and Apple Pencil integration makes it the ultimate digital coloring book.
               </p>
               <Link href="/studio" className="bg-[#111] text-white text-xl font-black py-4 px-8 rounded-2xl hover:bg-gray-800 transition-colors inline-block shadow-[4px_4px_0_0_rgba(0,0,0,0.3)]">
                 Launch Studio Now
               </Link>
            </div>
            <div className="flex-1 flex justify-center w-full">
               <div className="w-full max-w-md aspect-square bg-white rounded-full border-8 border-[#8FD3FF] shadow-xl flex items-center justify-center p-12">
                  <img src="/hand-drawn-astronaut-coloring-book-illustration_23-2150107814.jpg.jpeg" alt="iPad Demo" className="w-full h-full object-contain rounded-full opacity-80" />
               </div>
            </div>
          </div>
        </section>

        {/* 11. DEVELOPED BY AUROZE SECTION */}
        <section className="w-full py-24 bg-white">
           <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
             <div className="bg-[#111] p-12 lg:p-16 rounded-[40px] border-4 border-gray-800 flex flex-col items-center w-full shadow-2xl relative overflow-hidden">
                {/* Decorative glow */}
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#8FD3FF]/10 rounded-full blur-3xl"></div>
                
                <img src="/auroze-logo.png" alt="Auroze Logo" className="w-64 h-auto mb-10 relative z-10" />
                <h2 className="text-3xl lg:text-4xl font-black mb-6 text-white relative z-10">Built with care by AUROZE.CA</h2>
                <p className="text-xl font-semibold text-gray-400 mb-10 max-w-2xl mx-auto relative z-10 leading-relaxed">
                  Auroze merges premium design craftsmanship with next-generation AI to build experiences that inspire. Paintify is our gift to creative children everywhere.
                </p>
                <div className="flex gap-4 relative z-10">
                  <a href="https://auroze.ca" target="_blank" rel="noopener noreferrer" className="bg-white text-[#111] font-black py-4 px-10 rounded-2xl shadow-[4px_4px_0_0_#333] hover:-translate-y-1 transition-transform text-lg">
                    Visit Auroze.ca
                  </a>
                </div>
             </div>
           </div>
        </section>

      </main>

      {/* 12. FOOTER */}
      <footer className="w-full bg-[#111] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-12 border-b border-gray-800 pb-12 mb-8">
           
           <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
             <div className="flex items-center gap-2 opacity-50 mb-2">
                <img src="/auroze-logo.png" alt="Auroze Logo" className="w-24 h-auto brightness-0 invert" />
             </div>
             <Link href="/" className="flex items-center gap-2">
                <Palette className="w-8 h-8 text-[#FF7BA7]" strokeWidth={3} />
                <span className="text-3xl font-black tracking-tight">Paintify</span>
             </Link>
             <p className="font-semibold text-gray-400 max-w-xs mt-2">
               The magical AI coloring studio for kids. Free, open-source, and strictly safe.
             </p>
           </div>

           <div className="flex gap-16 text-center md:text-left">
             <div className="flex flex-col gap-4">
               <h4 className="font-black text-gray-500 uppercase tracking-wider text-sm">Product</h4>
               <Link href="/studio" className="font-bold hover:text-[#FF7BA7]">Start Painting</Link>
               <a href="#library" className="font-bold hover:text-[#8FD3FF]">Library</a>
               <a href="#how-it-works" className="font-bold hover:text-[#F4C84A]">How it Works</a>
             </div>
             <div className="flex flex-col gap-4">
                <h4 className="font-black text-gray-500 uppercase tracking-wider text-sm">Company</h4>
                <a href="#safety" className="font-bold hover:text-[#9BE7C2]">Child Safety</a>
                <span className="font-bold text-gray-400">By Auroze.ca</span>
                <span className="font-bold text-gray-600 cursor-not-allowed text-xs opacity-50">Privacy Policy Coming Soon</span>
              </div>
           </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-gray-500 font-bold gap-4 text-center">
          <p>© {new Date().getFullYear()} Auroze.ca. All rights reserved.</p>
          <p className="flex items-center justify-center gap-2">Built with <Heart className="w-4 h-4 text-red-500 fill-current" /> for children and parents.</p>
        </div>
      </footer>
    </div>
  );
}
