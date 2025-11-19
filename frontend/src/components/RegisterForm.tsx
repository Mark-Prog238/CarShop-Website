import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../components/api"; 
import { Translations } from "../components/Data";
import { Eye, EyeOff, UserPlus, User, Mail, Lock, ArrowRight } from "lucide-react";

export const RegisterForm = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // 1. Validacija na klientu (lepši UX kot window.alert)
    if (!email || !password || !fullName) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.REGISTER}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("Registration success:", data);
        // Preusmeri na login, da se lahko prijavijo
        navigate("/login"); 
      } else {
        setError(data.message || "Registration failed. Try a different email.");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[90vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        
        {/* --- CARD CONTAINER --- */}
        <div className="bg-surface border border-white/10 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
          
          {/* Dekoracija */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary via-primary to-secondary"></div>
          
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-black text-white tracking-tight mb-2">
              {Translations.EN.register}
            </h1>
            <p className="text-text-muted text-sm">Join the club. It takes less than a minute.</p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleRegister}>
            
            {/* Error Message Box */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-400 text-sm rounded-lg flex items-center gap-2 animate-pulse">
                ⚠️ {error}
              </div>
            )}

            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Full Name</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-background border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-white/20"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-white/20"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border border-white/10 rounded-xl pl-11 pr-12 py-3.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-white/20"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Confirm Password</label>
              <div className="relative">
                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                  <Lock size={18} />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-background border border-white/10 rounded-xl pl-11 pr-12 py-3.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-white/20"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? "Creating Account..." : <>REGISTER <UserPlus size={20} /></>}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-1">
              <div className="h-px bg-white/10 flex-1"></div>
              <span className="text-xs text-text-muted uppercase">Already a member?</span>
              <div className="h-px bg-white/10 flex-1"></div>
            </div>
          </form>

          {/* Footer Link */}
          <div className="text-center mt-4">
            <Link to="/login" className="text-sm text-text-muted hover:text-secondary transition-colors font-medium group">
              Login to your account <span className="inline-block transition-transform group-hover:translate-x-1"><ArrowRight size={14} className="inline ml-1"/></span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};