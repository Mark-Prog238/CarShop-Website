import { NavbarSecond } from "../components/NavbarSecond";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../components/api"; 
import { Translations } from "../components/Data";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

export const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.LOGIN}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // KLJUČNO: SHRANI TOKEN IN IME V LOCALSTORAGE
        localStorage.setItem("jwtToken", data.token); 
        localStorage.setItem("userName", data.fullName || "User");
        navigate("/"); 
      } else {
          setError(data.message || "Login failed");
      }


    } catch (error) {
      console.error("Error:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md">
        
        {/* --- CARD CONTAINER --- */}
        <div className="bg-surface border border-white/10 rounded-2xl shadow-2xl p-8 md:p-10 relative overflow-hidden">
          
          {/* Dekorativni sijaj zgoraj */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary"></div>
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>

          {/* Header */}
          <div className="mb-8 text-center relative z-10">
            <h1 className="text-3xl font-black text-white tracking-tight mb-2">
              {Translations.EN.login}
            </h1>
            <p className="text-text-muted text-sm">Welcome back to DriveX</p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-5 relative z-10" onSubmit={handleLogin}>
            
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-400 text-sm rounded-lg flex items-center gap-2 animate-pulse">
                ⚠️ {error}
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-white/20"
                placeholder="name@example.com"
                required
              />
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-white/20 pr-12"
                  placeholder="••••••••"
                  required
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

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                "Logging in..."
              ) : (
                <>
                  LOGIN <ArrowRight size={20} />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-2">
              <div className="h-px bg-white/10 flex-1"></div>
              <span className="text-xs text-text-muted uppercase">OR</span>
              <div className="h-px bg-white/10 flex-1"></div>
            </div>
          </form>

          {/* Footer Link */}
          <div className="text-center mt-4">
            <Link to="/register" className="text-sm text-text-muted hover:text-secondary transition-colors font-medium">
              Don't have an account? <span className="text-secondary underline decoration-secondary/50 underline-offset-4">Register here</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

















export const LoginPage = () => {
  return (
    <div className="w-screen h-screen bg-bgSecond">
      <NavbarSecond />
      <div className="w-screen h-screen flex items-center justify-center bg-bgSecond">
        <LoginForm />
      </div>
    </div>
  );
};
