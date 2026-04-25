"use client";

import Link from "next/link";
import { FileText, ArrowLeft, Palette } from "lucide-react";

export default function TermsPage() {
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
            <div className="w-20 h-20 bg-[#8FD3FF]/20 rounded-3xl flex items-center justify-center mb-6">
              <FileText className="w-10 h-10 text-[#8FD3FF]" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-black mb-4">Terms of Use</h1>
            <p className="text-xl font-semibold text-gray-400">Simple fair rules for using Paintify.</p>
          </div>

          <div className="prose prose-lg max-w-none space-y-12 font-medium text-gray-600 leading-relaxed">
            <section>
              <h2 className="text-2xl font-black mb-4 text-[#111]">Use of Service</h2>
              <p>
                Paintify may be used for personal, family, classroom, and educational creative purposes. Our goal is to provide a safe space for artistic expression.
              </p>
              <div className="mt-4 p-6 bg-blue-50 rounded-2xl border border-blue-100 italic">
                <strong>Parent Guidance:</strong> A parent, guardian, or educator should supervise younger children where appropriate to ensure a safe and positive experience.
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-black mb-4 text-[#111]">Prohibited Use</h2>
              <p>To keep Paintify safe for everyone, the following activities are strictly prohibited:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Any illegal activity or promotion of harm.</li>
                <li>Attempts to bypass safety filters to generate harmful or inappropriate content.</li>
                <li>Automated scraping of content without explicit permission.</li>
                <li>Abuse of system infrastructure or security attacks.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black mb-4 text-[#111]">Generated Content</h2>
              <p>
                AI-generated coloring pages are provided as creative outputs. While we strive for high-quality, safe results, users are responsible for how exported or printed content is utilized.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black mb-4 text-[#111]">Ownership & Printing</h2>
              <p>
                Artwork you create and save locally remains under your control. Paintify grants you permission for unlimited personal and educational printing and sharing of your creations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black mb-4 text-[#111]">Disclaimer & Limitation</h2>
              <p>
                Paintify is provided &quot;as is&quot; without guarantees of uninterrupted service. Features may improve, change, or be updated over time. AUROZE.CA is not liable for indirect damages arising from the use of the service where permitted by law.
              </p>
            </section>

            <section className="bg-gray-50 p-8 rounded-3xl border-2 border-dashed border-gray-200">
              <h2 className="text-2xl font-black mb-2 text-[#111]">Questions?</h2>
              <p className="mb-4">We are here to help and value your feedback.</p>
              <a href="mailto:hello@auroze.ca" className="text-[#FF7BA7] font-black text-xl hover:underline">hello@auroze.ca</a>
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
