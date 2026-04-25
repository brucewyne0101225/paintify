"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Database, Sparkles, AlertTriangle, CheckCircle2, ArrowRight, UploadCloud, Lock } from "lucide-react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "Steverogers@1998") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    Array.from(e.target.files).forEach(file => {
      formData.append("files", file);
    });

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });
      
      const data = await res.json();
      if (data.success) {
        // Automatically trigger sync after successful upload!
        handleSync();
      } else {
        setError(data.error || "Upload failed");
        setIsUploading(false);
      }
    } catch (err: any) {
      setError(err.message || "Network error during upload");
      setIsUploading(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    setError("");
    
    try {
      const res = await fetch("/api/admin/sync", {
        method: "POST"
      });
      
      const data = await res.json();
      
      if (data.success) {
        setResult(data.stats);
      } else {
        setError(data.error || "Failed to sync library");
      }
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setIsSyncing(false);
      setIsUploading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-200 text-center">
          <div className="bg-paintify-yellow w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-paintify-dark" />
          </div>
          <h1 className="text-3xl font-black text-paintify-dark mb-2">Admin Login</h1>
          <p className="text-gray-500 mb-8 font-semibold">Enter the master password to access the Paintify Library Engine.</p>
          
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input 
              type="password" 
              placeholder="Password..." 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 bg-gray-100 rounded-xl font-bold text-center outline-none focus:ring-4 ring-paintify-primary/30"
            />
            {error && <p className="text-red-500 font-bold text-sm">{error}</p>}
            <button type="submit" className="kid-btn bg-paintify-primary text-white w-full py-4 text-xl mt-2 shadow-[4px_4px_0_0_#111]">
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8 lg:p-16">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
        
        {/* Header */}
        <div className="bg-paintify-dark text-white p-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black flex items-center gap-3">
              <Database className="w-8 h-8 text-paintify-yellow" />
              Paintify Admin Center
            </h1>
            <p className="opacity-80 mt-2 font-medium">Internal tools for managing the Paintify system.</p>
          </div>
          <Link href="/studio" className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-bold transition-all">
            Back to Studio
          </Link>
        </div>

        {/* Content */}
        <div className="p-8 lg:p-12">
          
          <div className="bg-paintify-bg border-2 border-paintify-border rounded-2xl p-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Sparkles className="w-48 h-48" />
             </div>
             
             <h2 className="text-2xl font-black text-paintify-dark mb-2">Autonomous Library Manager</h2>
             <p className="text-gray-600 font-medium mb-8 max-w-xl">
               Upload new image files directly from your computer. The engine will instantly upload them, delete any duplicates, auto-categorize them, and rebuild the library automatically.
             </p>

             <div className="flex flex-col sm:flex-row gap-4 mb-8 relative z-10">
                <input 
                  type="file" 
                  multiple 
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
                
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading || isSyncing}
                  className="kid-btn bg-white border-2 border-paintify-border text-paintify-dark text-xl py-4 px-8 shadow-[4px_4px_0_0_#111] flex flex-1 items-center justify-center gap-3 hover:-translate-y-1"
                >
                  <UploadCloud className="w-6 h-6 text-paintify-lightBlue" />
                  {isUploading ? "Uploading..." : "Upload New Images"}
                </button>

                <button 
                  onClick={handleSync}
                  disabled={isSyncing || isUploading}
                  className={`kid-btn bg-paintify-primary text-white text-xl py-4 px-8 shadow-[4px_4px_0_0_#111] flex flex-1 items-center justify-center gap-3 ${isSyncing ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1'}`}
                >
                  {isSyncing && !isUploading ? (
                    <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Sparkles className="w-6 h-6 text-paintify-yellow" />
                  )}
                  {isSyncing && !isUploading ? "Running AI Engine..." : "Force Sync Now"}
                </button>
             </div>

             {/* Results Panel */}
             {error && (
               <div className="mt-8 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl flex items-start gap-3">
                 <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
                 <div>
                   <h4 className="font-bold text-red-800">Error</h4>
                   <p className="text-red-600 text-sm">{error}</p>
                 </div>
               </div>
             )}

             {result && (
               <div className="mt-8 bg-green-50 border-2 border-green-200 p-6 rounded-xl animate-in slide-in-from-bottom-4 relative z-10">
                 <h3 className="text-green-800 font-black text-xl flex items-center gap-2 mb-4">
                   <CheckCircle2 className="w-6 h-6 text-green-600" />
                   AI Sync Complete!
                 </h3>
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="bg-white p-4 rounded-lg border border-green-100 shadow-sm text-center">
                     <span className="block text-4xl font-black text-gray-800 mb-1">{result.totalScanned}</span>
                     <span className="text-gray-500 text-sm font-bold uppercase tracking-wide">Files Scanned</span>
                   </div>
                   <div className="bg-white p-4 rounded-lg border border-green-100 shadow-sm text-center">
                     <span className="block text-4xl font-black text-red-500 mb-1">{result.duplicatesDeleted}</span>
                     <span className="text-gray-500 text-sm font-bold uppercase tracking-wide">Duplicates Deleted</span>
                   </div>
                   <div className="bg-white p-4 rounded-lg border border-green-100 shadow-sm text-center">
                     <span className="block text-4xl font-black text-paintify-primary mb-1">{result.finalLibrarySize}</span>
                     <span className="text-gray-500 text-sm font-bold uppercase tracking-wide">Ready in Explore</span>
                   </div>
                 </div>

                 <div className="mt-6 flex justify-end">
                   <Link href="/studio" className="flex items-center gap-2 text-paintify-primary font-bold hover:underline">
                     Go view the updated library <ArrowRight className="w-4 h-4" />
                   </Link>
                 </div>
               </div>
             )}

          </div>

        </div>
      </div>
    </div>
  );
}
