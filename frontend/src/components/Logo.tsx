import { ArrowRightLeft } from "lucide-react";

export const Logo = () => {
  return (
    <div className="flex items-center gap-2 group cursor-pointer select-none">
      
      {/* ICON: Symbol of Exchange (Marketplace) */}
      <div className="relative flex items-center justify-center h-10 w-10 rounded-xl bg-blue-600/10 border border-blue-500/20 group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-300">
        
        {/* Two arrows representing buying & selling */}
        <ArrowRightLeft 
          size={22} 
          className="text-blue-500 group-hover:text-white transition-colors duration-300"
          strokeWidth={2.5}
        />
        
        {/* Small dot to make it look techy */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]"></div>
      </div>
      
      {/* TEXT */}
      <div className="flex flex-col justify-center -space-y-1">
        <div className="flex items-center">
          <span className="text-2xl font-black tracking-tighter text-white italic">
            DRIVE
          </span>
          <span className="text-2xl font-black tracking-tighter text-blue-500 italic">
            X
          </span>
        </div>
        <span className="text-[9px] font-bold text-gray-500 tracking-[0.25em] uppercase group-hover:text-gray-300 transition-colors text-right">
          MARKET
        </span>
      </div>
    </div>
  );
};