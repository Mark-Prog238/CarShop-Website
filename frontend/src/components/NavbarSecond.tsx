import { useState } from "react";
import { Button } from "../ui/Button";

export const NavbarSecond = () => {
  const [open, setOpen] = useState(false);
  return (
    <header className="bg-white sticky top-0 z-40 backdrop-blur border-b border-black/10">
      <nav className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
        {/* brand */}
        <a href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primaryColor" />
          <span className="text-black font-extrabold tracking-wide">CarShop</span>
        </a>

        {/* desktop links */}
        <ul className="hidden md:flex items-center gap-6 text-black/80">
          <li><a className="hover:text-primaryColor" href="/listings">Browse</a></li>
          <li><a className="hover:text-primaryColor" href="/garage">Garage</a></li>
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <a href="/login" className="text-black/80 hover:text-primaryColor text-sm font-semibold">Login</a>
          <a href="/sell"><Button size="sm">Sell your car</Button></a>
        </div>

        {/* mobile */}
        <button className="md:hidden text-black" onClick={() => setOpen((v) => !v)} aria-label="Open menu">
          ☰
        </button>
      </nav>

      {/* mobile menu panel */}
      {open && (
        <div className="md:hidden border-t border-black/10 px-4 pb-4 bg-white">
          <ul className="flex flex-col gap-2 text-black/90 pt-2">
            <li><a className="block rounded-lg px-2 py-2 hover:bg-black/5" href="/listings" onClick={() => setOpen(false)}>Browse</a></li>
            <li><a className="block rounded-lg px-2 py-2 hover:bg-black/5" href="/garage" onClick={() => setOpen(false)}>Garage</a></li>
            <li><a className="block rounded-lg px-2 py-2 hover:bg-black/5" href="/sell" onClick={() => setOpen(false)}>Sell your car</a></li>
            <li><a className="block rounded-lg px-2 py-2 hover:bg-black/5" href="/login" onClick={() => setOpen(false)}>Login</a></li>
          </ul>
        </div>
      )}
    </header>
  );
};
