import { useState } from "react";
import { Button } from "../ui/Button";
import { Link, useLocation } from "react-router"; 
import { Menu, X, User } from "lucide-react";
import { Logo } from "./Logo"; // <--- UVOZI NOVI LOGO

export const NavbarSecond = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation(); 
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0f111a]/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        
        {/* --- BRAND LOGO (APEX MOTORS) --- */}
        <Link to="/">
           <Logo /> 
        </Link>

        {/* --- DESKTOP LINKS --- */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <li>
            <Link 
              to="/listings" 
              className={`transition-all duration-200 hover:text-blue-400 ${isActive('/listings') ? 'text-white font-bold' : ''}`}
            >
              Inventory
            </Link>
          </li>
           <li>
            <Link 
              to="/garage" 
              className={`transition-all duration-200 hover:text-blue-400 ${isActive('/garage') ? 'text-white font-bold' : ''}`}
            >
              Garage
            </Link>
          </li>
        </ul>

        {/* --- DESKTOP ACTIONS --- */}
        <div className="hidden md:flex items-center gap-4">
          <Link 
            to="/login" 
            className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            <User size={18} /> Login
          </Link>
          <Link to="/sell">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-500 hover:scale-105 text-white border-none shadow-lg shadow-blue-900/20 transition-all font-bold">
              Sell Your Car
            </Button>
          </Link>
        </div>

        {/* --- MOBILE TOGGLE --- */}
        <button 
          className="md:hidden text-gray-300 hover:text-white" 
          onClick={() => setOpen((v) => !v)} 
          aria-label="Open menu"
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* --- MOBILE MENU --- */}
      {open && (
        <div className="absolute top-full left-0 w-full border-b border-white/10 bg-[#0f111a] px-4 pb-6 shadow-2xl md:hidden animate-in slide-in-from-top-5 duration-200">
          <ul className="flex flex-col gap-2 pt-4">
            <li>
              <Link 
                to="/listings" 
                className="block rounded-lg px-4 py-3 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white"
                onClick={() => setOpen(false)}
              >
                Inventory
              </Link>
            </li>
            <div className="my-2 h-px bg-white/10" />
            <li>
              <Link 
                to="/sell" 
                className="block rounded-lg px-4 py-3 text-base font-bold text-blue-400 hover:bg-blue-500/10"
                onClick={() => setOpen(false)}
              >
                + Sell your car
              </Link>
            </li>
             <li>
              <Link 
                to="/login" 
                className="block rounded-lg px-4 py-3 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};