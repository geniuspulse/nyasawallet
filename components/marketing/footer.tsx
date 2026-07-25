// @ts-nocheck
import Link from 'next/link';
import { Wallet, Facebook, Twitter, Instagram, Github, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const productLinks = [
    { name: 'Buy USDT', href: '/buy-usdt' },
    { name: 'Sell USDT', href: '/sell-usdt' },
    { name: 'Send Money', href: '/send-money' },
    { name: 'Virtual Card', href: '/virtual-card' },
    { name: 'Mobile Money Conversion', href: '/mobile-money' },
  ];

  const companyLinks = [
    { name: 'About Us', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Press Kit', href: '#' },
    { name: 'Referral Program', href: '#' },
  ];

  const supportLinks = [
    { name: 'Help Center', href: '#' },
    { name: 'Fees', href: '#' },
    { name: 'Security', href: '#' },
    { name: 'Contact Support', href: '#' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'AML & KYC Policy', href: '#' },
    { name: 'Cookie Policy', href: '#' },
  ];

  return (
    <footer className="relative border-t border-slate-100 bg-slate-900 text-slate-300 overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/4 h-64 w-64 rounded-full bg-brand-600/5 blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 h-64 w-64 rounded-full bg-gold-400/5 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-md shadow-brand-500/20 group-hover:shadow-lg group-hover:shadow-brand-500/30 transition-shadow duration-200">
                <Wallet className="h-5 w-5" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-white">
                Nyasawallet<span className="text-brand-400">.</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-slate-400 leading-relaxed">
              Your pan-African digital wallet. Store, send, and spend USDT with local mobile money and card services. Safe, fast, and secure.
            </p>
            <div className="mt-6 flex space-x-3">
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-200 hover:scale-110">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-200 hover:scale-110">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-200 hover:scale-110">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all duration-200 hover:scale-110">
                <span className="sr-only">GitHub</span>
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h3 className="font-display text-sm font-semibold text-white tracking-wider uppercase">
              Product
            </h3>
            <ul role="list" className="mt-4 space-y-2.5">
              {productLinks.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-slate-400 hover:text-brand-400 transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="font-display text-sm font-semibold text-white tracking-wider uppercase">
              Company
            </h3>
            <ul role="list" className="mt-4 space-y-2.5">
              {companyLinks.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-sm text-slate-400 hover:text-brand-400 transition-colors">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support / Legal column */}
          <div>
            <h3 className="font-display text-sm font-semibold text-white tracking-wider uppercase">
              Support &amp; Legal
            </h3>
            <ul role="list" className="mt-4 space-y-2.5">
              {supportLinks.concat(legalLinks).slice(0, 5).map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-sm text-slate-400 hover:text-brand-400 transition-colors">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="my-10 border-slate-800" />

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {currentYear} Nyasawallet. All rights reserved. Built for Malawi &amp; the wider African continent.
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-slate-500">
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            <span className="text-slate-700">&middot;</span>
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <span className="text-slate-700">&middot;</span>
            <a href="#" className="hover:text-slate-400 transition-colors">AML/KYC Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
