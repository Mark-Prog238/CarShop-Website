export const Footer = () => {
  return (
    <footer className="w-full bg-buttonBg text-white/90 mt-10">
      <div className="mx-auto max-w-6xl px-6 py-12 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primaryColor" />
            <span className="text-white font-extrabold tracking-wide">CarShop</span>
          </div>
          <p className="mt-3 text-white/70 text-sm">Your trusted marketplace for new and used cars.</p>
        </div>
        <div>
          <p className="font-semibold mb-3">Marketplace</p>
          <ul className="space-y-2 text-sm">
            <li><a href="/listings" className="hover:underline">Browse</a></li>
            <li><a href="/sell" className="hover:underline">Sell your car</a></li>
            <li><a href="/garage" className="hover:underline">Garage</a></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold mb-3">Company</p>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">About</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
            <li><a href="#" className="hover:underline">Careers</a></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold mb-3">Legal</p>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline">Terms of Service</a></li>
            <li><a href="#" className="hover:underline">Cookies</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-4 text-sm text-white/60 flex items-center justify-between">
          <p>© {new Date().getFullYear()} CarShop. All rights reserved.</p>
          <p>Built for demo purposes.</p>
        </div>
      </div>
    </footer>
  );
};
