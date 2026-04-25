"use client";

import Link from "next/link";
import { Heart, ArrowLeft, Palette, CheckCircle2, ShieldAlert } from "lucide-react";

export default function SafetyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FFF7EC] text-[#111] selection:bg-[#FF7BA7] selection:text-white">
      {/* Header */}
      <nav className="w-full px-4 py-8 lg:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-[#FF7BA7] p-2 rounded-xl group-hover:-rotate-6 transition-transform">
              <Palette className="w-6 h-6 text-white" strokeWidth={3} />
            </div>
            <span className="text-2xl font-black tracking-tight">Paintify</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 font-bold text-gray-500 hover:text-[#FF7BA7] transition-colors">
            <ArrowLeft className="w-5 h-5" /> Back to Home
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pb-32">
        <div className="bg-white rounded-[40px] p-8 lg:p-16 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="w-20 h-20 bg-[#FF7BA7]/20 rounded-3xl flex items-center justify-center mb-6">
              <Heart className="w-10 h-10 text-[#FF7BA7]" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-black mb-4">Child Safety Policy</h1>
            <p className="text-xl font-semibold text-gray-400">Safety is built into the Paintify experience.</p>
          </div>

          <div className="prose prose-lg max-w-none space-y-12 font-medium text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-2xl font-black mb-6 text-[#111]">Our Safety Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  "No sign-in required for basic use",
                  "No child public profiles",
                  "No direct messaging or chat",
                  "No public social feeds",
                  "Advanced prompt moderation",
                  "Inappropriate prompts blocked",
                  "Family-friendly interface",
                  "Safe-by-default categories"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <CheckCircle2 className="w-5 h-5 text-[#9BE7C2]" />
                    <span className="font-bold text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black mb-4 text-[#111]">Design Principles</h2>
              <p>
                Every button, color, and icon in Paintify is designed with &quot;Child Safety First&quot; in mind. We use big buttons for little hands, gentle visuals, and clear controls to ensure a low-friction, safe creative environment.
              </p>
            </section>

            <section className="bg-yellow-50 p-8 rounded-3xl border border-yellow-100">
              <div className="flex items-start gap-4">
                <ShieldAlert className="w-8 h-8 text-yellow-600 shrink-0" />
                <div>
                  <h2 className="text-2xl font-black mb-2 text-[#111]">Parent Guidance</h2>
                  <p className="text-yellow-800">
                    While we have built strong safety protections, we believe younger children benefit from parent or guardian supervision. We encourage parents to review printed or downloaded content together with their children.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-gray-50 p-8 rounded-3xl border-2 border-dashed border-gray-200">
              <h2 className="text-2xl font-black mb-2 text-[#111]">Reporting & Feedback</h2>
              <p className="mb-4">
                Safety is a continuous journey. If you encounter any output that concerns you, please report it to our team immediately.
              </p>
              <a href="mailto:info@auroze.ca" className="text-[#FF7BA7] font-black text-xl hover:underline">info@auroze.ca</a>
            </section>
          </div>
          
          <div className="mt-16 pt-8 border-t border-gray-100 flex justify-between items-center text-sm font-bold text-gray-400 uppercase tracking-widest">
            <span>Last Updated: 2026</span>
            <span>Developed by AUROZE.CA</span>
          </div>
        </div>
      </main>
    </div>
  );
}
