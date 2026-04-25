"use client";

import Link from "next/link";
import { ShieldCheck, ArrowLeft, Palette } from "lucide-react";

export default function PrivacyPage() {
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
            <div className="w-20 h-20 bg-[#9BE7C2]/20 rounded-3xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-10 h-10 text-[#9BE7C2]" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-black mb-4">Privacy Policy</h1>
            <p className="text-xl font-semibold text-gray-400">Your privacy matters to us.</p>
          </div>

          <div className="prose prose-lg max-w-none space-y-12">
            <section>
              <h2 className="text-2xl font-black mb-4">What We Collect</h2>
              <ul className="list-disc pl-6 space-y-3 font-medium text-gray-600">
                <li>Paintify does not require accounts to start using the app.</li>
                <li>We do not request child names, emails, or child profiles.</li>
                <li>We may collect limited anonymous usage information such as browser type, device type, general performance metrics, and feature usage to improve the app experience.</li>
              </ul>
              <p className="mt-4 font-black text-[#FF7BA7]">Important: We do not sell personal information.</p>
            </section>

            <section>
              <h2 className="text-2xl font-black mb-4">Prompt Processing</h2>
              <p className="font-medium text-gray-600 leading-relaxed">
                Text prompts entered into Paintify may be securely processed by trusted AI infrastructure providers solely to generate requested coloring pages. These prompts are handled according to strict safety and privacy standards.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black mb-4">Local Storage</h2>
              <p className="font-medium text-gray-600 leading-relaxed">
                Saved drawings are stored directly on your device using browser storage. If browser data is cleared, saved local drawings may be removed. Paintify does not store your creative output on our central servers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black mb-4">Children&apos;s Privacy</h2>
              <p className="font-medium text-gray-600 leading-relaxed">
                Paintify is designed to minimize data collection and support child privacy principles. We do not knowingly collect personal information from children. Our interface is designed to be a safe, closed environment.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black mb-4">Your Choices</h2>
              <p className="font-medium text-gray-600 leading-relaxed">
                You may clear local drawing data anytime through your browser settings. You may stop using Paintify at any time without needing to delete an account, as no accounts are required.
              </p>
            </section>

            <section className="bg-gray-50 p-8 rounded-3xl border-2 border-dashed border-gray-200">
              <h2 className="text-2xl font-black mb-2">Contact Us</h2>
              <p className="font-medium text-gray-600 mb-4">If you have any questions about our privacy practices, please reach out to us.</p>
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
