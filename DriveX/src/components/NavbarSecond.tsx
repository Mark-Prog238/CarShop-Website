import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Pravilni uvozi za Vite/React Router
import { Menu, X, User, LogOut } from "lucide-react"; // Ikone
import { Logo } from "./Logo"; // Tvoj novi DRIVEX logo

export const NavbarSecond = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [open, setOpen] = useState(false); // Mobile menu state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  // --- AUTH STATUS CHECK ---
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const name = localStorage.getItem("userName");
    
    setIsLoggedIn(!!token);
    setUserName(name || '');
    setOpen(false); // Zapri meni ob navigaciji
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userName");
    setIsLoggedIn(false);
    navigate("/login");
  };
  
  // Helper funkcija za aktivne linke (če želimo vizualno označiti stran)
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0f111a]/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        
        {/* --- BRAND LOGO (DRIVEX) --- */}
        <Link to="/">
           <Logo /> 
        </Link>

        {/* --- DESKTOP LINKS --- */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <li>
            <Link 
              to="/listings" 
              className={`transition-all duration-200 hover:text-primary ${isActive('/listings') ? 'text-white font-bold' : ''}`}
            >
              Inventory
            </Link>
          </li>
           <li>
            <Link 
              to="/garage" 
              className={`transition-all duration-200 hover:text-primary ${isActive('/garage') ? 'text-white font-bold' : ''}`}
            >
              Garage
            </Link>
          </li>
          <li>
              <Link to="/saved" className="block rounded-lg px-4 py-3 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white" onClick={() => setOpen(false)}>
                Saved
              </Link>
          </li>
        </ul>

        {/* --- DESKTOP ACTIONS (LOGIN/LOGOUT/SELL) --- */}
        <div className="hidden md:flex items-center gap-4">
          
          {isLoggedIn ? (
            <>
                <span className="text-sm text-gray-400">Welcome, <strong className="text-white">{userName.split(' ')[0]}</strong></span>
                <button 
                    onClick={handleLogout} 
                    className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-red-400 transition-colors"
                >
                    <LogOut size={18} /> Logout
                </button>
            </>
          ) : (
            <Link 
                to="/login" 
                className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
                <User size={18} /> Login
            </Link>
          )}

          <Link to="/sell">
            <Button size="sm" className="bg-secondary hover:bg-secondary-hover hover:scale-[1.03] text-white border-none shadow-lg shadow-secondary/20 transition-all font-bold">
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

      {/* --- MOBILE MENU PANEL --- */}
      {open && (
        <div className="absolute top-full left-0 w-full border-b border-white/10 bg-[#0f111a] px-4 pb-6 shadow-2xl md:hidden animate-in slide-in-from-top-5 duration-200">
          <ul className="flex flex-col gap-2 pt-4">
            <li>
              <Link to="/listings" className="block rounded-lg px-4 py-3 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white" onClick={() => setOpen(false)}>
                Inventory
              </Link>
              <Link to="/saved" className="block rounded-lg px-4 py-3 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white" onClick={() => setOpen(false)}>
                Saved
              </Link>
            </li>
            <li>
              <Link to="/sell" className="block rounded-lg px-4 py-3 text-base font-bold text-secondary hover:bg-secondary/10" onClick={() => setOpen(false)}>
                + Sell your car
              </Link>
            </li>
            <div className="my-2 h-px bg-white/10" />
            
            {isLoggedIn ? (
                <li>
                    <button onClick={handleLogout} className="w-full text-left rounded-lg px-4 py-3 text-base font-medium text-red-400 hover:bg-white/5">
                        <LogOut size={18} className="inline mr-2"/> Logout
                    </button>
                </li>
            ) : (
                <li>
                    <Link to="/login" className="block rounded-lg px-4 py-3 text-base font-medium text-gray-300 hover:bg-white/5 hover:text-white" onClick={() => setOpen(false)}>
                        Login / Register
                    </Link>
                </li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
};