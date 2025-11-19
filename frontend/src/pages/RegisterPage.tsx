import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { NavbarSecond } from "../components/NavbarSecond";
import API from "../components/api";
import { Translations } from "../components/Data"; // Predvidevamo, da je ta uvoz pravilen
import { Eye, EyeOff, User, Mail, Lock, Phone, MapPin, Building, ArrowRight, UserCheck } from "lucide-react";

// --- TAILWIND RAZREDI IZ GLOBAL.CSS ---
const BASE_INPUT_CLASSES = "w-full bg-background border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-white/20";
const ICON_CLASS = "absolute left-4 top-1/2 -translate-y-1/2 text-text-muted";
const STEP_HEADER_CLASS = "text-xl font-bold text-white mb-4 border-b border-white/10 pb-3";

// --------------------------------------------------------
// --- STEP 1: OSNOVNA REGISTRACIJA (Ime, Email, Geslo) ---
// --------------------------------------------------------
const RegisterForm = ({ onNext, setError }: { onNext: (userId: string) => void, setError: (msg: string) => void }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        if (!email || !password || !fullName) { setError("Please fill in all fields."); setIsLoading(false); return; }
        if (password !== confirmPassword) { setError("Passwords do not match."); setIsLoading(false); return; }

        try {
            const response = await fetch(`${API.BASE_URL}${API.ENDPOINTS.REGISTER}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullName, email, password }),
            });
            const data = await response.json();

            if (data.success && data.userId) {
                // Preusmeri na drugi korak in pošlji ID
                onNext(data.userId); 
            } else {
                setError(data.message || "Registration failed. Try a different email.");
            }
        } catch (error) {
            setError("Server error. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="flex flex-col gap-5" onSubmit={handleRegister}>
            <h2 className={STEP_HEADER_CLASS}>1. User Credentials</h2>
            
            <div className="space-y-1 relative">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative">
                    <User size={18} className={ICON_CLASS} /><input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className={BASE_INPUT_CLASSES} placeholder="John Doe" />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative">
                    <Mail size={18} className={ICON_CLASS} /><input type="email" value={email} onChange={e => setEmail(e.target.value)} className={BASE_INPUT_CLASSES} placeholder="name@drivex.com" />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Password</label>
                <div className="relative">
                    <Lock size={18} className={ICON_CLASS} />
                    <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} className={BASE_INPUT_CLASSES} placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors">
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
            </div>
            
            <div className="space-y-1">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Confirm Password</label>
                <div className="relative">
                    <Lock size={18} className={ICON_CLASS} />
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={BASE_INPUT_CLASSES} placeholder="••••••••" />
                </div>
            </div>
            
            <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
                {isLoading ? "LOADING..." : <>NEXT STEP <ArrowRight size={20} /></>}
            </button>
        </form>
    );
};

// --------------------------------------------------------
// --- STEP 2: DOKONČANJE PROFILA (Telefon, Lokacija, Tip) ---
// --------------------------------------------------------
const ProfileSetupForm = ({ userId, setError }: { userId: string, setError: (msg: string) => void }) => {
    const navigate = useNavigate();
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [profileType, setProfileType] = useState("Private"); // Private, Company
    const [companyName, setCompanyName] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSetup = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        if (!phone || !address || (profileType === 'Company' && !companyName)) {
            setError("Please fill in all required fields.");
            setIsLoading(false);
            return;
        }

        const updates = {
            phone,
            address,
            profileType,
            companyName: profileType === 'Company' ? companyName : undefined,
            // Brez JWT-ja, server vzame ID direktno iz URL-ja
        };

        try {
            const response = await fetch(`${API.BASE_URL}/api/users/${userId}`, {
                method: "PUT", // <--- UPORABIMO PUT ZA POSODOBITEV RUTE
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });
            const data = await response.json();

            if (data.success) {
                // USPEŠNO DOKONČANJE: Preusmeri na login, da se lahko prijavi
                navigate("/login"); 
            } else {
                setError(data.message || "Failed to finalize profile.");
            }
        } catch (error) {
            setError("Server error during profile setup.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className="flex flex-col gap-5" onSubmit={handleSetup}>
            <h2 className={STEP_HEADER_CLASS}>2. Seller Contact Info</h2>
            
            {/* TYPE SELECTION */}
            <div className="flex gap-4">
                <button 
                    type="button" 
                    onClick={() => setProfileType('Private')}
                    className={`flex-1 py-3 rounded-xl border font-bold transition-all ${profileType === 'Private' ? 'bg-secondary border-secondary text-white shadow-md shadow-secondary/20' : 'bg-background border-white/10 text-text-muted hover:bg-white/5'}`}
                >
                    Private Seller
                </button>
                <button 
                    type="button" 
                    onClick={() => setProfileType('Company')}
                    className={`flex-1 py-3 rounded-xl border font-bold transition-all ${profileType === 'Company' ? 'bg-secondary border-secondary text-white shadow-md shadow-secondary/20' : 'bg-background border-white/10 text-text-muted hover:bg-white/5'}`}
                >
                    Company / Dealer
                </button>
            </div>

            {/* COMPANY NAME (Conditional) */}
            {profileType === 'Company' && (
                 <div className="space-y-1 animate-in fade-in duration-300">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Company Name</label>
                    <div className="relative">
                        <Building size={18} className={ICON_CLASS} />
                        <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className={BASE_INPUT_CLASSES} placeholder="Apex Motors d.o.o." required={profileType === 'Company'} />
                    </div>
                </div>
            )}
            
            {/* PHONE */}
            <div className="space-y-1">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Phone Number</label>
                <div className="relative">
                    <Phone size={18} className={ICON_CLASS} />
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={BASE_INPUT_CLASSES} placeholder="+386 40 123 456" required />
                </div>
            </div>

            {/* ADDRESS */}
            <div className="space-y-1">
                <label className="text-xs font-bold text-text-muted uppercase tracking-wider ml-1">Full Address (Street, City, Zip)</label>
                <div className="relative">
                    <MapPin size={18} className={ICON_CLASS} />
                    <input type="text" value={address} onChange={e => setAddress(e.target.value)} className={BASE_INPUT_CLASSES} placeholder="Ljubljanska 1, 1000 Ljubljana" required />
                </div>
            </div>
            
            <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 bg-secondary hover:bg-secondary-hover text-white font-bold py-4 rounded-xl shadow-lg shadow-secondary/25 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
                {isLoading ? "FINALIZING..." : <>ACTIVATE ACCOUNT <UserCheck size={20} /></>}
            </button>
        </form>
    );
};

// --------------------------------------------------------
// --- GLAVNA STRAN (Vsebuje oba koraka) ---
// --------------------------------------------------------
export const RegisterPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [tempUserId, setTempUserId] = useState("");
    const [formError, setFormError] = useState("");
    
    const handleStep1Completion = (userId: string) => {
        setTempUserId(userId);
        setFormError(""); // Resetiraj error po uspešni registraciji
        setCurrentStep(2);
    };

    return (
        <div className="min-h-screen bg-background">
            <NavbarSecond />
            <div className="flex items-center justify-center px-4 py-10">
                <div className="w-full max-w-lg">
                    <div className="bg-surface border border-white/10 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
                         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary"></div>
                         
                         <div className="mb-8 text-center">
                            <h1 className="text-3xl font-black text-white tracking-tight mb-2">
                                Register & Setup
                            </h1>
                            {formError && (
                                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 text-red-400 text-sm rounded-lg animate-pulse">
                                    ⚠️ {formError}
                                </div>
                            )}
                        </div>

                        {currentStep === 1 ? (
                            <RegisterForm onNext={handleStep1Completion} setError={setFormError} />
                        ) : (
                            <ProfileSetupForm userId={tempUserId} setError={setFormError} />
                        )}

                        <div className="text-center mt-6">
                            {currentStep === 1 ? (
                                <Link to="/login" className="text-sm text-text-muted hover:text-secondary transition-colors font-medium">
                                    Have an account? Login Here
                                </Link>
                            ) : (
                                <Link to="/register" onClick={() => setCurrentStep(1)} className="text-sm text-text-muted hover:text-secondary transition-colors font-medium">
                                    ← Go Back (Edit Credentials)
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};