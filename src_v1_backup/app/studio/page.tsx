"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { Palette, Paintbrush, Eraser, Undo, Redo, Download, Sparkles, PenTool, Plus } from "lucide-react";
import Link from "next/link";
import StartGate from "@/components/StartGate";
import { CATEGORIES } from "@/lib/data/categories";

// Disable SSR for the canvas to prevent Konva from crashing on the server
const CanvasWrapper = dynamic(() => import("@/components/CanvasWrapper"), {
  ssr: false,
  loading: () => <div className="w-[1024px] h-[768px] bg-white kid-border flex items-center justify-center text-xl font-bold">Loading Artist Canvas...</div>
});

const BASIC_COLORS = [
  "#FF0000", "#FFA500", "#FFFF00", "#008000", "#0000FF", "#800080", "#FFC0CB", "#8B4513", "#000000", "#FFFFFF"
];

const EXTRA_COLORS = [
  "#ADD8E6", "#87CEEB", "#000080", "#00FF00", "#98FF98", "#006400",
  "#FFDAB9", "#FFD700", "#808080", "#A9A9A9", "#F5F5DC", "#E6E6FA",
  "#FF00FF", "#00FFFF", "#FF7F50", "#FFDFC4", "#F0D5BE", "#8D5524"
];

const ALL_COLORS = [...BASIC_COLORS, ...EXTRA_COLORS];

export default function StudioPage() {
  const canvasRef = useRef<any>(null);
  
  // Onboarding States
  const [isOnboardingDone, setIsOnboardingDone] = useState(false);
  const [ageRange, setAgeRange] = useState("");

  // UX Sidebar Wizard States
  const [sidebarMode, setSidebarMode] = useState<"generate" | "paint">("generate");
  const [showExtraColors, setShowExtraColors] = useState(false);

  // Generation & Tools State
  const [prompt, setPrompt] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [tool, setTool] = useState<"brush" | "eraser" | "fill" | "crayon" | "marker">("brush");
  const [color, setColor] = useState(BASIC_COLORS[0]);
  const [brushSize, setBrushSize] = useState(20);
  const [loadingTime, setLoadingTime] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isGenerating) {
      setLoadingTime(0);
      timer = setInterval(() => {
        setLoadingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isGenerating]);

  const getSmartLoadingMessage = (time: number) => {
    if (time <= 2) return "Checking if we already have this drawing...";
    if (time <= 5) return "Sketching your magical idea...";
    if (time <= 8) return "Making clean coloring lines...";
    if (time <= 15) return "This is taking longer, trying a faster artist...";
    if (time <= 25) return "Simplifying the idea so it finishes faster...";
    return "Almost done, adding final touches...";
  };
  
  const currentMessage = getSmartLoadingMessage(loadingTime);

  useEffect(() => {
    // Load saved preferences
    const savedAge = localStorage.getItem("paintify_age_range");
    if (savedAge) {
      setAgeRange(savedAge);
      setIsOnboardingDone(true);
    }
  }, []);

  const handleOnboardingComplete = (data: any) => {
    localStorage.setItem("paintify_age_range", data.ageRange);
    setAgeRange(data.ageRange);
    setIsOnboardingDone(true);
  };

  const currentCategoryData = CATEGORIES.find(c => c.id === category);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    
    try {
      setIsBlocked(false);
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: prompt, 
          age: ageRange, 
          category: currentCategoryData?.name || "General" 
        })
      });
      
      const data = await res.json();
      
      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
        setSidebarMode("paint"); // Auto switch to paint mode
        setShowExtraColors(false); // Reset colors to simple
      } else {
        if (data.error && data.error.includes("can't be created in Paintify")) {
          setIsBlocked(true);
        } else {
          alert(data.error || "Failed to generate! Please try again.");
        }
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error connecting to AI.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOnboardingDone) {
    return <StartGate onComplete={handleOnboardingComplete} />;
  }

  const activeColors = showExtraColors ? ALL_COLORS : BASIC_COLORS;

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden bg-paintify-bg">
      
      {/* Unified Custom Studio Navbar */}
      <header className="w-full border-b-4 border-paintify-border bg-white px-6 py-4 flex items-center justify-between z-10 shrink-0">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-paintify-primary p-2 kid-border group-hover:-rotate-6 transition-transform">
             <Palette className="w-6 h-6 text-white" strokeWidth={3} />
          </div>
          <span className="text-2xl font-black tracking-tight text-paintify-dark">
             Paintify
          </span>
        </Link>
        <div className="flex items-center gap-4">
            <span className="bg-paintify-yellow px-4 py-2 font-black rounded-full shadow-[2px_2px_0_0_#111]">
               🧒 Age: {ageRange} 
            </span>
            <button 
              onClick={() => setIsOnboardingDone(false)}
              className="kid-btn bg-white py-2 px-4 shadow-[2px_2px_0_0_#111] text-sm"
            >
              🔄 Change Age
            </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Left Content: Canvas */}
        <main className="flex-1 flex flex-col items-center justify-center p-4 lg:p-8 relative min-w-0 h-full overflow-hidden">
          {isGenerating ? (
            <div className="w-full max-w-2xl bg-white kid-border kid-shadow flex flex-col items-center justify-center text-center p-12 gap-8 border-dashed">
              <span className="text-8xl animate-bounce">🤖</span>
              <h3 className="text-4xl font-black">{loadingTime > 8 ? "This is taking a little longer..." : currentMessage}</h3>
              <p className="text-2xl font-semibold opacity-70">
                {loadingTime > 8 
                  ? "Want to keep waiting or try a simpler drawing?" 
                  : "Drawing your magical idea right now."}
              </p>
              
              <div className="flex gap-2 mb-4">
                 <div className="w-4 h-4 bg-paintify-primary rounded-full animate-ping"></div>
                 <div className="w-4 h-4 bg-paintify-yellow rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
                 <div className="w-4 h-4 bg-paintify-lightBlue rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
              </div>

              {loadingTime > 15 && (
                <div className="flex gap-4">
                  <button 
                    onClick={() => { setPrompt("A cute friendly T-Rex dinosaur"); setIsGenerating(false); }}
                    className="kid-btn bg-paintify-yellow shadow-[2px_2px_0_0_#111]"
                  >
                    Pick Instant Drawing
                  </button>
                  <button 
                    onClick={() => setIsGenerating(false)}
                    className="kid-btn bg-white text-paintify-primary shadow-[2px_2px_0_0_#111]"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ) : isBlocked ? (
            <div className="w-full max-w-2xl bg-white kid-border kid-shadow flex flex-col items-center justify-center text-center p-12 gap-8 border-dashed">
              <span className="text-8xl">🛑</span>
              <h3 className="text-4xl font-black text-red-500">Oops!</h3>
              <p className="text-2xl font-semibold opacity-80">
                That idea can't be created in Paintify.<br/>
                Try fun ideas like dinosaurs, animals, rockets, robots, or castles!
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                 <button onClick={() => { setPrompt("A cute friendly T-Rex dinosaur"); setIsBlocked(false); }} className="kid-btn bg-paintify-green text-xl py-3 px-6 shadow-[2px_2px_0_0_#111] hover:-translate-y-1">🦖 Dinosaur</button>
                 <button onClick={() => { setPrompt("A super fast space rocket"); setIsBlocked(false); }} className="kid-btn bg-paintify-yellow text-xl py-3 px-6 shadow-[2px_2px_0_0_#111] hover:-translate-y-1">🚀 Rocket</button>
                 <button onClick={() => { setPrompt("A happy little puppy playing"); setIsBlocked(false); }} className="kid-btn bg-paintify-lightBlue text-xl py-3 px-6 shadow-[2px_2px_0_0_#111] hover:-translate-y-1">🐶 Puppy</button>
                 <button onClick={() => { setPrompt("A friendly robot waving"); setIsBlocked(false); }} className="kid-btn bg-gray-200 text-xl py-3 px-6 shadow-[2px_2px_0_0_#111] hover:-translate-y-1">🤖 Robot</button>
                 <button onClick={() => { setPrompt("A magical unicorn with a rainbow"); setIsBlocked(false); }} className="kid-btn bg-pink-300 text-xl py-3 px-6 shadow-[2px_2px_0_0_#111] hover:-translate-y-1">🦄 Unicorn</button>
              </div>
            </div>
          ) : !imageUrl ? (
            <div className="w-full max-w-2xl bg-white kid-border kid-shadow flex flex-col items-center justify-center text-center p-12 gap-6 border-dashed">
              <span className="text-7xl">🎨</span>
              <h3 className="text-4xl font-black">Ready to Paint?</h3>
              <p className="text-2xl font-semibold opacity-70 whitespace-pre-line">
                 Type a fun idea on the right to start coloring!
              </p>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center relative overflow-hidden bg-white shadow-[0_0_15px_-3px_rgba(0,0,0,0.1)] z-10">
                 <CanvasWrapper 
                    canvasRef={canvasRef}
                    imageUrl={imageUrl} 
                    tool={tool} 
                    color={color} 
                    brushSize={brushSize} 
                  />
            </div>
          )}
        </main>

        {/* Right Sidebar: Unified Generator & Tools */}
        <aside className="w-full lg:w-[420px] flex-shrink-0 flex flex-col border-t-4 lg:border-t-0 lg:border-l-4 border-paintify-border bg-white shadow-[-8px_0_15px_-3px_rgba(0,0,0,0.05)] h-full overflow-hidden">
          
          {/* TAB BAR */}
          <div className="flex border-b-4 border-paintify-border shrink-0">
            <button 
              onClick={() => setSidebarMode("generate")}
              className={`flex-1 py-4 font-black text-lg transition-colors ${sidebarMode === "generate" ? "bg-paintify-yellow" : "bg-paintify-bg opacity-70 hover:opacity-100"}`}
            >
              1. Create
            </button>
            <button 
              onClick={() => imageUrl && setSidebarMode("paint")}
              disabled={!imageUrl}
              className={`flex-1 py-4 font-black text-lg transition-colors ${sidebarMode === "paint" ? "bg-paintify-lightBlue" : "bg-paintify-bg opacity-70"} ${!imageUrl && "cursor-not-allowed opacity-30"}`}
            >
              2. Paint
            </button>
          </div>

          <div className="p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar flex-1">
            
            {/* ------------------------------------------- */}
            {/* STATE 1: GENERATE MODE */}
            {/* ------------------------------------------- */}
            {sidebarMode === "generate" && (
              <div className="flex flex-col gap-4 animate-in slide-in-from-left-4 duration-300">
                <h2 className="text-2xl font-black flex items-center gap-2 mb-2">
                  <Sparkles className="text-paintify-yellow w-6 h-6" /> 
                  Create Art
                </h2>
                
                <div className="flex flex-col gap-2">
                  <label className="font-bold opacity-80 text-sm">Theme Category</label>
                  <select 
                    className="px-4 py-3 bg-paintify-bg kid-border outline-none cursor-pointer font-semibold"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-bold opacity-80 text-sm">Magic Ideas</label>
                  <div className="flex flex-col gap-2">
                    {currentCategoryData?.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => setPrompt(suggestion)}
                        className={`text-left p-3 kid-border font-bold transition-transform active:scale-95 text-sm
                          ${prompt === suggestion ? 'bg-paintify-yellow shadow-[4px_4px_0_0_#111]' : 'bg-paintify-bg hover:bg-[#ffeccf]'}`}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-2">
                   <label className="font-bold opacity-80 text-sm">Or type your own magical idea:</label>
                   <textarea 
                     rows={2}
                     placeholder="A cute dragon eating pizza..."
                     className="mt-1 px-4 py-3 bg-paintify-bg kid-border outline-none focus:border-paintify-primary w-full font-semibold resize-none"
                     value={prompt}
                     onChange={(e) => setPrompt(e.target.value)}
                   />
                </div>

                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt}
                  className="kid-btn bg-paintify-green disabled:opacity-50 disabled:active:translate-y-0 disabled:active:shadow-[4px_4px_0_0_#111] flex justify-center items-center gap-2 py-4 text-xl mt-4"
                >
                  {isGenerating ? "Drawing..." : "Generate Lines!"}
                </button>
              </div>
            )}

            {/* ------------------------------------------- */}
            {/* STATE 2: PAINT MODE */}
            {/* ------------------------------------------- */}
            {sidebarMode === "paint" && (
              <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 duration-300 pb-8">
                
                {/* Top Action Buttons */}
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => canvasRef.current?.download()}
                    className="kid-btn bg-paintify-yellow w-full flex justify-center items-center gap-2 py-3 shadow-[2px_2px_0_0_#111]"
                  >
                    <Download className="w-5 h-5" /> Save Artwork
                  </button>
                  <button 
                    onClick={() => setSidebarMode("generate")} 
                    className="kid-btn bg-white py-3 w-full shadow-[2px_2px_0_0_#111] text-sm"
                  >
                    🔄 Generate Another Image
                  </button>
                </div>

                <div className="h-1 bg-paintify-bg rounded-full shrink-0 my-2"></div>

                <h2 className="text-2xl font-black flex items-center gap-2">🎨 Paintbox</h2>
                
                {/* TOOL GRID */}
                <div className="grid grid-cols-4 gap-3">
                  <button 
                    onClick={() => setTool("brush")} 
                    className={`p-3 min-h-[64px] kid-border shadow-[2px_2px_0_0_#111] flex flex-col justify-center items-center gap-1 transition-transform ${tool === "brush" ? "bg-paintify-lightBlue scale-105" : "bg-paintify-bg hover:bg-white"}`}
                  >
                    <Paintbrush className="w-7 h-7" /> <span className="text-xs font-bold mt-1">Brush</span>
                  </button>
                  <button 
                    onClick={() => setTool("marker")} 
                    className={`p-3 min-h-[64px] kid-border shadow-[2px_2px_0_0_#111] flex flex-col justify-center items-center gap-1 transition-transform ${tool === "marker" ? "bg-paintify-lightBlue scale-105" : "bg-paintify-bg hover:bg-white"}`}
                  >
                    <PenTool className="w-7 h-7" /> <span className="text-xs font-bold mt-1">Marker</span>
                  </button>
                  <button 
                    onClick={() => setTool("crayon")} 
                    className={`p-3 min-h-[64px] kid-border shadow-[2px_2px_0_0_#111] flex flex-col justify-center items-center gap-1 transition-transform ${tool === "crayon" ? "bg-paintify-lightBlue scale-105" : "bg-paintify-bg hover:bg-white"}`}
                  >
                    <Palette className="w-7 h-7" /> <span className="text-xs font-bold mt-1">Crayon</span>
                  </button>
                  <button 
                    onClick={() => setTool("eraser")} 
                    className={`p-3 min-h-[64px] kid-border shadow-[2px_2px_0_0_#111] flex flex-col justify-center items-center gap-1 transition-transform ${tool === "eraser" ? "bg-paintify-primary text-white scale-105" : "bg-paintify-bg hover:bg-white"}`}
                  >
                    <Eraser className="w-7 h-7" /> <span className="text-xs font-bold mt-1">Eraser</span>
                  </button>
                </div>

                {/* BRUSH SIZE PANEL */}
                <div className="flex flex-col gap-4 p-5 bg-paintify-bg kid-border rounded-2xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)]">
                  <div className="flex justify-between items-center">
                     <label className="font-black text-lg text-paintify-dark">Size: {brushSize}px</label>
                     {/* Circular Live Preview */}
                     <div className="w-14 h-14 flex items-center justify-center bg-white rounded-xl kid-border shadow-sm overflow-hidden">
                        <div 
                          className="rounded-full transition-all duration-100" 
                          style={{ 
                            width: `${Math.min(brushSize, 48)}px`, 
                            height: `${Math.min(brushSize, 48)}px`, 
                            backgroundColor: tool === 'eraser' ? '#ffffff' : color,
                            border: tool === 'eraser' ? '2px dashed #000' : 'none',
                            opacity: tool === 'marker' ? 0.7 : 1,
                            boxShadow: tool === 'eraser' ? 'none' : 'inset -2px -2px 6px rgba(0,0,0,0.2)'
                          }} 
                        />
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setBrushSize(Math.max(2, brushSize - 5))} 
                      className="w-12 h-12 flex items-center justify-center kid-border bg-white rounded-full font-black text-xl shadow-[2px_2px_0_0_#111] active:scale-95"
                    >
                      -
                    </button>
                    <input 
                      type="range" 
                      min="2" 
                      max="80" 
                      value={brushSize} 
                      onChange={(e) => setBrushSize(Number(e.target.value))}
                      className="flex-1 h-4 bg-white kid-border rounded-full appearance-none cursor-pointer"
                    />
                    <button 
                      onClick={() => setBrushSize(Math.min(80, brushSize + 5))} 
                      className="w-12 h-12 flex items-center justify-center kid-border bg-white rounded-full font-black text-xl shadow-[2px_2px_0_0_#111] active:scale-95"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => canvasRef.current?.undo()} 
                    className="p-3 kid-border shadow-[2px_2px_0_0_#111] bg-white active:bg-gray-200 flex justify-center transition-transform active:scale-95" 
                  >
                    <Undo className="w-6 h-6" /> Undo
                  </button>
                  <button 
                    onClick={() => canvasRef.current?.redo()} 
                    className="p-3 kid-border shadow-[2px_2px_0_0_#111] bg-white active:bg-gray-200 flex justify-center transition-transform active:scale-95" 
                  >
                    <Redo className="w-6 h-6" /> Redo
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <label className="font-black opacity-80">Colors</label>
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    {activeColors.map(c => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={`aspect-square w-full rounded-full kid-border transition-all active:scale-90 ${color === c ? 'scale-[1.20] z-10 shadow-[4px_4px_0_0_#111] ring-4 ring-offset-2 ring-paintify-dark' : 'shadow-[2px_2px_0_0_#111] hover:scale-110'}`}
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>

                  {!showExtraColors && (
                    <button 
                      onClick={() => setShowExtraColors(true)}
                      className="mt-2 kid-btn bg-white py-2 flex justify-center items-center gap-2 shadow-[2px_2px_0_0_#111] text-sm opacity-80 hover:opacity-100"
                    >
                      <Plus className="w-4 h-4" /> Show More Colors
                    </button>
                  )}
                </div>
              </div>
            )}

          </div>
        </aside>

      </div>
    </div>
  );
}
