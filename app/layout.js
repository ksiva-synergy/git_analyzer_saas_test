import Image from "next/image";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ship Management Dashboard",
  description: "Global Ship Management Platform - Modern Maritime Solutions",
};

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Dashboards", href: "/dashboards" },
  { name: "Fleet", href: "/fleet" },
  { name: "Crew", href: "/crew" },
  { name: "Sustainability", href: "/sustainability" },
  { name: "Wellbeing", href: "/wellbeing" },
  { name: "Contact", href: "/contact" },
];

const Header = () => (
  <header className="bg-[#002147] text-white w-full shadow-md">
    <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
      <Link href="/" className="flex items-center gap-2" tabIndex={0} aria-label="Home">
        <span className="font-bold text-lg tracking-wide text-white">Ship Management Group</span>
      </Link>
      <ul className="flex gap-6">
        {NAV_LINKS.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className="font-medium focus:outline-none focus:ring-2 focus:ring-synergyBlue px-2 py-1 rounded transition-colors hover:text-synergyBlue text-white hover:bg-synergyBlue/10"
              tabIndex={0}
              aria-label={link.name}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  </header>
);

const Footer = () => (
  <footer className="bg-[#002147] text-white w-full mt-12 py-6">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 gap-2 text-sm text-white">
      <div>
        © {new Date().getFullYear()} Ship Management Group. All rights reserved.
      </div>
      <div>
        123 Maritime Avenue, Global City, Oceanland 00000
      </div>
      <div>
        <a href="mailto:info@shipmanagement.com" className="underline hover:text-synergyBlue">info@shipmanagement.com</a>
      </div>
    </div>
  </footer>
);

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-synergyLight text-synergyNavy font-sans`}>
        <Header />
        <main className="min-h-[80vh]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
