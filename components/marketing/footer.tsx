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
    <footer className="border-t border-slate-100 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-md shadow-brand-500/20">
                <Wallet className="h-5 w-5" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-white">
                Nyasawallet<span className="text-brand-500">.</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-slate-400 leading-relaxed">
              Your pan-African digital wallet. Store, send, and spend USDT with local mobile money and card services. Safe, fast, and secure.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h3 className="font-display text-sm font-semibold text-white tracking-wider uppercase">
              Product
            </h3>
            <ul role="list" className="mt-4 space-y-2">
              {productLinks.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-slate-400 hover:text-white transition-colors">
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
            <ul role="list" className="mt-4 space-y-2">
              {companyLinks.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support / Legal column */}
          <div>
            <h3 className="font-display text-sm font-semibold text-white tracking-wider uppercase">
              Support & Legal
            </h3>
            <ul role="list" className="mt-4 space-y-2">
              {supportLinks.concat(legalLinks).slice(0, 5).map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-sm text-slate-400 hover:text-white transition-colors">
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
            &copy; {currentYear} Nyasawallet. All rights reserved. Built for Nyasaland & the wider African continent.
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-slate-500">
            <a href="#" className="hover:text-slate-400">Terms of Service</a>
            <span>&middot;</span>
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <span>&middot;</span>
            <a href="#" className="hover:text-slate-400">AML/KYC Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
