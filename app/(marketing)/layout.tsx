// @ts-nocheck
import React from 'react';
import Navbar from '@/components/marketing/navbar';
import Footer from '@/components/marketing/footer';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col bg-white overflow-hidden selection:bg-brand-100 selection:text-brand-900">
      {/* Decorative background shapes */}
      <div className="absolute top-0 left-1/4 right-0 h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/60 via-slate-50/0 to-transparent -z-10" />
      <div className="absolute top-[20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-brand-50/30 blur-3xl -z-10" />
      <div className="absolute bottom-[30%] right-[-5%] h-[600px] w-[600px] rounded-full bg-blue-50/40 blur-3xl -z-10" />

      {/* Header / Navbar */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
