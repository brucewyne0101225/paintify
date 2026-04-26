"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { Palette, Paintbrush, Eraser, Undo, Redo, Download, Sparkles, PenTool, Plus, Maximize, Move, RotateCcw } from "lucide-react";
import Link from "next/link";
import StartGate from "@/components/StartGate";
import { CATEGORIES } from "@/lib/data/categories";
import { EXPLORE_LIBRARY } from "@/lib/data/library";

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
  const [mainViewMode, setMainViewMode] = useState<"welcome" | "explore" | "canvas">("welcome");
  const [exploreFilter, setExploreFilter] = useState("All");

  // Generation & Tools State
  const [prompt, setPrompt] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [tool, setTool] = useState<"brush" | "eraser" | "fill" | "crayon" | "marker" | "transform">("brush");
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
    setMainViewMode("canvas");

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

  const loadExploreImage = (url: string) => {
    setImageUrl(url);
    setMainViewMode("canvas");
    setSidebarMode("paint");
  };

  if (!isOnboardingDone) {
    return <StartGate onComplete={handleOnboardingComplete} />;
  }

  const activeColors = ALL_COLORS;
  const exploreCategories = ["All", ...Array.from(new Set(EXPLORE_LIBRARY.map(item => item.category)))];
  const filteredLibrary = exploreFilter === "All" ? EXPLORE_LIBRARY : EXPLORE_LIBRARY.filter(item => item.category === exploreFilter);

  const renderMainContent = () => {
    if (isGenerating) {
      return (
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
                onClick={() => { loadExploreImage(EXPLORE_LIBRARY[0].image); setIsGenerating(false); }}
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
      );
    }

    if (isBlocked) {
      return (
        <div className="w-full max-w-2xl bg-white kid-border kid-shadow flex flex-col items-center justify-center text-center p-12 gap-8 border-dashed">
          <span className="text-8xl">🛑</span>
          <h3 className="text-4xl font-black text-red-500">The Magic Artist is Busy!</h3>
          <p className="text-2xl font-semibold opacity-80">
            Our artist has drawn so many pictures today that they need a quick 5-minute break!
          </p>

          <div className="flex flex-col gap-4 items-center w-full">
            <button
              onClick={() => setMainViewMode("explore")}
              className="kid-btn bg-paintify-primary text-white text-2xl py-5 px-10 shadow-[4px_4px_0_0_#111] hover:-translate-y-1 w-full max-w-md"
            >
              ✨ Go to Explore Library
            </button>
            <p className="font-bold opacity-60">Pick any of our 40+ instant drawings while you wait!</p>

            <button onClick={() => setIsBlocked(false)} className="text-gray-400 font-bold hover:underline mt-4">
              Try typing something else
            </button>
          </div>
        </div>
      );
    }

    if (mainViewMode === "explore") {
      return (
        <div className="w-full h-full flex flex-col p-8 lg:p-12 overflow-y-auto custom-scrollbar bg-paintify-bg">
          <div className="flex flex-col gap-2 mb-6">
            <h2 className="text-4xl font-black text-paintify-dark">Explore Magic Library</h2>
            <p className="text-xl font-semibold opacity-70">Pick any drawing to start painting instantly!</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {exploreCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setExploreFilter(cat)}
                className={`px-4 py-2 rounded-full font-bold transition-all border-2 ${exploreFilter === cat
                    ? "bg-paintify-primary text-white border-paintify-primary shadow-[2px_2px_0_0_#111]"
                    : "bg-white text-paintify-dark border-transparent hover:border-paintify-primary/30"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredLibrary.map((item) => (
              <button
                key={item.id}
                onClick={() => loadExploreImage(item.image)}
                className="flex flex-col bg-white kid-border shadow-[4px_4px_0_0_#111] hover:scale-[1.03] hover:shadow-[6px_6px_0_0_#111] active:scale-95 transition-all overflow-hidden group"
              >
                <div className="aspect-square w-full bg-paintify-bg p-4 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity z-10"></div>
                  <img src={item.image} alt={item.title} className="w-full h-full object-contain mix-blend-multiply transition-transform group-hover:scale-105" />
                </div>
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (!imageUrl) {
      return (
        <div className="w-full max-w-2xl bg-white kid-border kid-shadow flex flex-col items-center justify-center text-center p-12 gap-6 border-dashed">
          <span className="text-7xl">🎨</span>
          <h3 className="text-4xl font-black">Ready to Paint?</h3>
          <p className="text-2xl font-semibold opacity-70 whitespace-pre-line">
            Click "Explore Library" to pick a drawing, or type a magic idea to generate one!
          </p>
        </div>
      );
    }

    return (
      <div className="w-full h-full flex items-center justify-center relative overflow-hidden bg-white shadow-[0_0_15px_-3px_rgba(0,0,0,0.1)] z-10">
        <CanvasWrapper
          canvasRef={canvasRef}
          imageUrl={imageUrl}
          tool={tool}
          color={color}
          brushSize={brushSize}
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden bg-paintify-bg">

      {/* Unified Custom Studio Navbar */}
      <header className="w-full border-b-4 border-paintify-border bg-white px-6 py-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-paintify-primary p-2 kid-border">
             <Palette className="w-6 h-6 text-white" strokeWidth={3} />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight text-paintify-dark leading-none">
               Paintify
            </span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              Developed by AUROZE
            </span>
          </div>
        </div>
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
        {/* Left Content: Canvas / Explore Grid */}
        <main className="flex-1 flex flex-col items-center justify-center relative min-w-0 h-full overflow-hidden">
          {renderMainContent()}
        </main>

        {/* Right Sidebar: Unified Generator & Tools */}
        <aside className="w-full lg:w-[420px] flex-shrink-0 flex flex-col border-t-4 lg:border-t-0 lg:border-l-4 border-paintify-border bg-white shadow-[-8px_0_15px_-3px_rgba(0,0,0,0.05)] h-full overflow-hidden">

          {/* TAB BAR */}
          <div className="flex border-b-4 border-paintify-border shrink-0">
            <button
              onClick={() => { setSidebarMode("generate"); setMainViewMode(imageUrl ? "canvas" : "welcome"); }}
              className={`flex-1 py-4 font-black text-lg transition-colors ${sidebarMode === "generate" ? "bg-paintify-yellow" : "bg-paintify-bg opacity-70 hover:opacity-100"}`}
            >
              1. Create
            </button>
            <button
              onClick={() => imageUrl && setSidebarMode("paint")}
              disabled={!imageUrl}
              className={`flex-1 py-4 font-black text-lg transition-colors border-l-4 border-paintify-border ${sidebarMode === "paint" ? "bg-paintify-lightBlue" : "bg-paintify-bg opacity-70"} ${!imageUrl && "cursor-not-allowed opacity-30"}`}
            >
              2. Paint
            </button>
          </div>

          <div className="p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar flex-1">

            {/* ------------------------------------------- */}
            {/* STATE 1: GENERATE MODE */}
            {/* ------------------------------------------- */}
            {sidebarMode === "generate" && (
              <div className="flex flex-col gap-3 animate-in slide-in-from-left-4 duration-300 pb-2 h-full">

                <div className="flex flex-col gap-1 shrink-0">
                  <label className="font-black text-[10px] text-paintify-dark opacity-80 uppercase tracking-wider">Theme Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="kid-input py-2 px-3 text-sm font-bold appearance-none bg-white bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23111%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-no-repeat bg-[position:right_12px_center]"
                  >
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-1 shrink-0">
                  <label className="font-black text-[10px] text-paintify-dark opacity-80 uppercase tracking-wider">Magic Ideas</label>
                  <div className="grid grid-cols-2 gap-2">
                    {currentCategoryData?.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => setPrompt(suggestion)}
                        className={`text-left p-2 kid-border font-bold transition-transform active:scale-95 text-[10px] leading-tight rounded-xl flex items-center min-h-[48px]
                          ${prompt === suggestion ? 'bg-paintify-yellow shadow-[2px_2px_0_0_#111] scale-105 z-10' : 'bg-white hover:bg-paintify-yellow hover:scale-105 shadow-[2px_2px_0_0_#111]'}`}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col flex-1 min-h-[60px] mt-1">
                  <textarea
                    rows={2}
                    placeholder="Or type your own magical idea here (e.g. A cute dragon eating pizza...)"
                    className="kid-input w-full h-full p-3 resize-none text-sm placeholder:opacity-50"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2 mt-2 shrink-0">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt}
                    className="kid-btn bg-paintify-green disabled:opacity-50 disabled:active:translate-y-0 disabled:active:shadow-[2px_2px_0_0_#111] flex justify-center items-center gap-2 py-3 text-lg shadow-[2px_2px_0_0_#111]"
                  >
                    {isGenerating ? "Drawing..." : "Generate Lines!"}
                  </button>

                  <button
                    onClick={() => setMainViewMode("explore")}
                    className="kid-btn bg-[#8FD3FF] kid-border text-paintify-dark shadow-[2px_2px_0_0_#111] flex justify-center items-center gap-2 py-2 text-sm hover:bg-[#7bc8fc]"
                  >
                    <Sparkles className="w-4 h-4 text-white" /> Explore Magic Library
                  </button>
                </div>
              </div>
            )}

            {/* ------------------------------------------- */}
            {/* STATE 2: PAINT MODE - OPTIMIZED FOR IPAD */}
            {/* ------------------------------------------- */}
            {sidebarMode === "paint" && (
              <div className="flex flex-col gap-4 animate-in slide-in-from-right-4 duration-300 pb-2 h-full">

                {/* Top Action Row - COMPACT HORIZONTAL */}
                <div className="grid grid-cols-3 gap-2 shrink-0">
                  <button
                    onClick={() => canvasRef.current?.download()}
                    className="flex flex-col items-center justify-center gap-1 p-2 bg-paintify-yellow rounded-xl kid-border shadow-[2px_2px_0_0_#111] hover:-translate-y-1 transition-transform"
                  >
                    <Download className="w-5 h-5" />
                    <span className="text-[9px] font-black uppercase">Save</span>
                  </button>

                  <button
                    onClick={() => { setSidebarMode("generate"); setMainViewMode("canvas"); setImageUrl(""); }}
                    className="flex flex-col items-center justify-center gap-1 p-2 bg-white rounded-xl kid-border shadow-[2px_2px_0_0_#111] hover:-translate-y-1 transition-transform"
                  >
                    <Sparkles className="w-5 h-5 text-paintify-primary" />
                    <span className="text-[9px] font-black uppercase">New</span>
                  </button>

                  <button
                    onClick={() => setMainViewMode("explore")}
                    className="flex flex-col items-center justify-center gap-1 p-2 bg-[#8FD3FF] rounded-xl kid-border shadow-[2px_2px_0_0_#111] hover:-translate-y-1 transition-transform"
                  >
                    <Palette className="w-5 h-5" />
                    <span className="text-[9px] font-black uppercase">Library</span>
                  </button>
                </div>

                {/* TOOL GRID - COMPACT 5-COLUMN */}
                <div className="grid grid-cols-5 gap-2 shrink-0 mt-1">
                  <button
                    onClick={() => setTool("brush")}
                    className={`p-2 rounded-xl kid-border shadow-[2px_2px_0_0_#111] flex flex-col justify-center items-center gap-1 transition-transform ${tool === "brush" ? "bg-paintify-lightBlue scale-105" : "bg-paintify-bg hover:bg-white"}`}
                  >
                    <Paintbrush className="w-6 h-6" /> <span className="text-[10px] font-bold">Brush</span>
                  </button>
                  <button
                    onClick={() => setTool("marker")}
                    className={`p-2 rounded-xl kid-border shadow-[2px_2px_0_0_#111] flex flex-col justify-center items-center gap-1 transition-transform ${tool === "marker" ? "bg-paintify-lightBlue scale-105" : "bg-paintify-bg hover:bg-white"}`}
                  >
                    <PenTool className="w-6 h-6" /> <span className="text-[10px] font-bold">Marker</span>
                  </button>
                  <button
                    onClick={() => setTool("crayon")}
                    className={`p-2 rounded-xl kid-border shadow-[2px_2px_0_0_#111] flex flex-col justify-center items-center gap-1 transition-transform ${tool === "crayon" ? "bg-paintify-lightBlue scale-105" : "bg-paintify-bg hover:bg-white"}`}
                  >
                    <Palette className="w-6 h-6" /> <span className="text-[10px] font-bold">Crayon</span>
                  </button>
                  <button
                    onClick={() => setTool("eraser")}
                    className={`p-2 rounded-xl kid-border shadow-[2px_2px_0_0_#111] flex flex-col justify-center items-center gap-1 transition-transform ${tool === "eraser" ? "bg-paintify-primary text-white scale-105" : "bg-paintify-bg hover:bg-white"}`}
                  >
                    <Eraser className="w-6 h-6" /> <span className="text-[10px] font-bold">Eraser</span>
                  </button>
                  <button
                    onClick={() => setTool("transform")}
                    className={`p-2 rounded-xl kid-border shadow-[2px_2px_0_0_#111] flex flex-col justify-center items-center gap-1 transition-transform ${tool === "transform" ? "bg-paintify-yellow scale-105" : "bg-paintify-bg hover:bg-white"}`}
                  >
                    <Move className="w-6 h-6" /> <span className="text-[10px] font-bold">Move</span>
                  </button>
                </div>

                {tool === "transform" && (
                   <div className="flex flex-col gap-2 p-3 bg-paintify-bg kid-border rounded-xl animate-in fade-in slide-in-from-top-2 shrink-0">
                      <p className="text-[10px] font-black text-center opacity-70">Use 1 finger to move, 2 to zoom!</p>
                      <div className="grid grid-cols-2 gap-2">
                         <button 
                           onClick={() => canvasRef.current?.fitImage()}
                           className="flex items-center justify-center gap-2 bg-white p-2 kid-border shadow-[2px_2px_0_0_#111] font-black text-[10px]"
                         >
                           <Maximize className="w-3 h-3" /> Fit Screen
                         </button>
                         <button 
                           onClick={() => canvasRef.current?.resetImage()}
                           className="flex items-center justify-center gap-2 bg-white p-2 kid-border shadow-[2px_2px_0_0_#111] font-black text-[10px]"
                         >
                           <RotateCcw className="w-3 h-3" /> Reset
                         </button>
                      </div>
                   </div>
                )}

                {/* BRUSH SIZE PANEL - ULTRA SLIM ONE-LINER */}
                <div className="flex items-center justify-between gap-2 p-2 bg-paintify-bg kid-border rounded-xl shrink-0">
                  <div className="w-8 h-8 flex items-center justify-center bg-white rounded-lg kid-border shadow-[1px_1px_0_0_#111] shrink-0">
                    <div
                      className="rounded-full"
                      style={{
                        width: `${Math.min(brushSize / 2, 24)}px`,
                        height: `${Math.min(brushSize / 2, 24)}px`,
                        backgroundColor: tool === 'eraser' ? '#ffffff' : color,
                        border: tool === 'eraser' ? '1px dashed #000' : 'none',
                        opacity: tool === 'marker' ? 0.7 : 1,
                      }}
                    />
                  </div>
                  <button
                    onClick={() => setBrushSize(Math.max(2, brushSize - 5))}
                    className="w-8 h-8 flex items-center justify-center kid-border bg-white rounded-full font-black shadow-[1px_1px_0_0_#111] shrink-0 leading-none pb-1"
                  >
                    -
                  </button>
                  <input
                    type="range"
                    min="2"
                    max="80"
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className="flex-1 h-2 bg-white kid-border rounded-full appearance-none min-w-[50px]"
                  />
                  <button
                    onClick={() => setBrushSize(Math.min(80, brushSize + 5))}
                    className="w-8 h-8 flex items-center justify-center kid-border bg-white rounded-full font-black shadow-[1px_1px_0_0_#111] shrink-0 leading-none pb-1"
                  >
                    +
                  </button>
                </div>

                {/* COLORS & ACTIONS - FLEXIBLE GRID */}
                <div className="flex flex-col gap-2 overflow-hidden flex-1 mt-1">
                  <div className="flex justify-between items-center shrink-0">
                    <label className="font-black text-xs opacity-80 uppercase tracking-widest">Colors</label>
                    <div className="flex gap-2">
                      <button onClick={() => canvasRef.current?.undo()} className="px-3 py-1.5 kid-border shadow-[2px_2px_0_0_#111] bg-white active:bg-gray-200 flex items-center gap-1 font-bold text-[10px] rounded-lg">
                        <Undo className="w-3 h-3" /> Undo
                      </button>
                      <button onClick={() => canvasRef.current?.redo()} className="px-3 py-1.5 kid-border shadow-[2px_2px_0_0_#111] bg-white active:bg-gray-200 flex items-center gap-1 font-bold text-[10px] rounded-lg">
                        <Redo className="w-3 h-3" /> Redo
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-6 gap-2 overflow-y-auto custom-scrollbar p-2 pb-4">
                    {activeColors.map(c => (
                      <button
                        key={c}
                        onClick={() => {
                          setColor(c);
                          if (tool === "transform" || tool === "eraser") {
                            setTool("brush");
                          }
                        }}
                        className={`aspect-square w-full rounded-full kid-border transition-all ${color === c ? 'scale-110 z-10 shadow-[3px_3px_0_0_#111] ring-2 ring-paintify-dark' : 'shadow-[1px_1px_0_0_#111] hover:scale-105'}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </aside>

      </div>
    </div>
  );
}
