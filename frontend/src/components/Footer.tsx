import { Link } from "react-router";
import { Logo } from "./Logo";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"; // Opcijsko: ikone za socialna omrežja

export const Footer = () => {
  return (
    <footer className="w-full bg-[#0f111a] border-t border-white/10 mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-12 grid gap-10 md:grid-cols-4 text-sm">
        
        {/* BRAND COLUMN */}
        <div className="space-y-4">
          <Link to="/">
            <Logo />
          </Link>
          <p className="text-gray-400 leading-relaxed max-w-xs">
            The most reliable marketplace for buying and selling premium vehicles. 
            Verified listings, transparent prices.
          </p>
          <div className="flex gap-4 pt-2">
            <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors"><Facebook size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors"><Instagram size={20} /></a>
            <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors"><Twitter size={20} /></a>
          </div>
        </div>

        {/* MARKETPLACE LINKS */}
        <div>
          <h3 className="font-bold text-white mb-4 tracking-wide uppercase text-xs">Marketplace</h3>
          <ul className="space-y-3 text-gray-400">
            <li><Link to="/listings" className="hover:text-blue-400 transition-colors">Browse Cars</Link></li>
            <li><Link to="/sell" className="hover:text-blue-400 transition-colors">Sell Your Car</Link></li>
            <li><Link to="/garage" className="hover:text-blue-400 transition-colors">My Garage</Link></li>
            <li><Link to="/login" className="hover:text-blue-400 transition-colors">Dealer Login</Link></li>
          </ul>
        </div>

        {/* COMPANY LINKS */}
        <div>
          <h3 className="font-bold text-white mb-4 tracking-wide uppercase text-xs">Company</h3>
          <ul className="space-y-3 text-gray-400">
            <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Contact Support</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
          </ul>
        </div>

        {/* LEGAL LINKS */}
        <div>
          <h3 className="font-bold text-white mb-4 tracking-wide uppercase text-xs">Legal</h3>
          <ul className="space-y-3 text-gray-400">
            <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
            <li><a href="#" className="hover:text-blue-400 transition-colors">Cookie Settings</a></li>
          </ul>
        </div>
      </div>

      {/* COPYRIGHT BAR */}
      <div className="border-t border-white/5 bg-[#0a0b11]">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} DriveX Market. All rights reserved.</p>
          <div className="flex gap-6">
            <span>Designed for car enthusiasts.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};