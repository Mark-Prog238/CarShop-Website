import { useState, useEffect, type FormEvent, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { NavbarSecond } from "../components/NavbarSecond";
import { ImageUploader } from "../components/ImageUploader";
import API from "../components/api";
import { 
  ChevronRight, ChevronLeft, CheckCircle, MapPin, Calendar, Gauge, 
  Settings2, Fuel, Info, Edit2, Car, ShieldCheck, Zap, Plus, X, Lock, 
  Users, DoorClosed, ArrowRight, UserCheck
} from "lucide-react";

// Tipi podatkov in konstante
type CarMake = { id: number; name: string };
type CarModel = { id: number; name: string };

const BODY_TYPES = ["Sedan", "Hatchback", "SUV", "Wagon", "Coupe", "Convertible", "Van", "Pickup", "Minivan", "Cabriolet"];

const EXTENSIVE_FEATURES = [
  "ABS", "Adaptive Cruise Control", "Lane Assist", "Blind Spot Monitor", "Traffic Sign Recognition",
  "Webasto / Aux Heating", "Keyless Entry", "Power Tailgate", "Soft Close Doors",
  "Electric Seats", "Memory Seats", "Massage Seats", "Ventilated Seats", "Heated Seats (Front)", "Heated Seats (Rear)",
  "Leather Seats", "Panoramic Roof", "Navigation System", "Apple CarPlay", "Android Auto", "Bluetooth", 
  "Head-up Display", "Digital Cockpit", "Sound System (Bose/Harman/Burmester)", "Touchscreen", 
  "Parking Sensors (Front)", "Parking Sensors (Rear)", "Rear View Camera", "360° Camera", "Self-steering Parking Assist",
  "Matrix LED Headlights", "Alloy Wheels", "Sport Suspension", "Tow Bar"
];


export const SellPage = () => {
  const navigate = useNavigate();
  
  // --- AUTH STATE (JWT INTEGRACIJA) ---
  const [token, setToken] = useState<string | null>(null); 
  const [checkingAuth, setCheckingAuth] = useState(true);

  // --- FORM STATE ---
  const [step, setStep] = useState(1); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [price, setPrice] = useState("");
  const [bodyType, setBodyType] = useState("Sedan");
  
  const [milage, setMilage] = useState("");
  const [hp, setHp] = useState("");
  const [fuelType, setFuelType] = useState("Diesel");
  const [gearbox, setGearbox] = useState("Manual");
  const [driveType, setDriveType] = useState("FWD");
  const [doors, setDoors] = useState("5");
  const [seats, setSeats] = useState("5");
  const [euroStandard, setEuroStandard] = useState("Euro 6");
  const [vin, setVin] = useState("");
  
  const [description, setDescription] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [customFeatureInput, setCustomFeatureInput] = useState("");
  const [images, setImages] = useState<File[]>([]);

  // API Data
  const [brands, setBrands] = useState<CarMake[]>([]);
  const [models, setModels] = useState<CarModel[]>([]);

  // --- AUTH CHECK (JWT) ---
  useEffect(() => {
    const storedToken = localStorage.getItem("jwtToken");
    if (!storedToken) {
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } else {
      setToken(storedToken);
      setCheckingAuth(false);
    }
  }, [navigate]);

  // --- DATA FETCHING (Makes/Models) ---
  useEffect(() => {
    fetch(`${API.BASE_URL}/api/cars/makes`)
      .then(r => r.json())
      .then(d => setBrands(d.data || []))
      .catch(e => console.error(e));
  }, []);

  useEffect(() => {
    if (!brand) { setModels([]); setModel(""); return; }
    fetch(`${API.BASE_URL}/api/cars/models/${brand}`)
      .then(r => r.json())
      .then(d => setModels(d.data || []))
      .catch(e => console.error(e));
  }, [brand]);

  // --- HANDLERS ---
  const toggleFeature = (feat: string) => {
    if (selectedFeatures.includes(feat)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feat));
    } else {
      setSelectedFeatures([...selectedFeatures, feat]);
    }
  };

  const addCustomFeature = () => {
    const val = customFeatureInput.trim();
    if (val && !selectedFeatures.includes(val)) {
      setSelectedFeatures([...selectedFeatures, val]);
      setCustomFeatureInput("");
    }
  };

  const handleCustomFeatureKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomFeature();
    }
  };

  const handleNext = () => {
    if (step === 1 && (!brand || !model || !year || !price)) { setError("Please fill in all basic fields."); return; }
    if (step === 2 && (!milage || !hp)) { setError("Please provide technical details."); return; }
    if (step === 4 && images.length === 0) { setError("Please upload at least one photo."); return; }
    setError("");
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    if (!token) { setError("Session expired. Please log in again."); return; }
    setIsLoading(true);
    
    try {
      const form = new FormData();
      // Auth is handled by header, no need for form.append("sellerId", userId)
      form.append("brand", brand); form.append("model", model); form.append("year", year); form.append("price", price); form.append("bodyType", bodyType);
      form.append("milage", milage); form.append("hp", hp); form.append("fuelType", fuelType); form.append("gearbox", gearbox);
      form.append("driveType", driveType); form.append("doors", doors); form.append("seats", seats); form.append("euroStandard", euroStandard);
      form.append("vin", vin); form.append("description", description);
      form.append("features", JSON.stringify(selectedFeatures)); // Array to JSON string

      images.forEach((file) => form.append("images", file));

      const res = await fetch(`${API.BASE_URL}${API.ENDPOINTS.LISTINGS.CREATE}`, {
        method: "POST",
        // KLJUČNO: Dodamo token v Authorization Header
        headers: {
            "Authorization": `Bearer ${token}` 
        },
        body: form,
      });

      if (!res.ok) throw new Error("Failed");
      navigate("/listings");
    } catch (err) {
      setError("Failed to publish. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (p: string) => new Intl.NumberFormat('en-DE', { style: 'currency', currency: 'EUR' }).format(Number(p));

  // --- LOADING / AUTH SCREEN ---
  if (checkingAuth) {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center text-white gap-4">
            <Lock size={48} className="text-primary mb-2" />
            <h2 className="text-2xl font-bold">Authentication Required</h2>
            <p className="text-text-muted">Please login to sell your car. Redirecting...</p>
        </div>
    );
  }

  // --- GLAVNI RENDER ---
  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      <NavbarSecond />

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-5xl">
          
          {/* HEADER */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-black text-white mb-2">
              {step === 5 ? "Review Your Listing" : "Sell Your Car"}
            </h1>
            <p className="text-text-muted">Step {step} of 5</p>
          </div>

          {/* PROGRESS BAR */}
          <div className="mb-8 flex items-center justify-between relative max-w-lg mx-auto">
             <div className="absolute top-1/2 left-0 w-full h-1 bg-surface -z-10 rounded-full"></div>
             <div className="absolute top-1/2 left-0 h-1 bg-secondary transition-all duration-500 -z-10 rounded-full" style={{ width: `${((step - 1) / 4) * 100}%` }}></div>
             {[1, 2, 3, 4, 5].map((s) => (
                 <div key={s} className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold border-2 transition-colors duration-300 ${step >= s ? "bg-secondary border-secondary text-white" : "bg-surface border-surface-highlight text-text-muted"}`}>
                    {step > s ? <CheckCircle size={14}/> : s}
                 </div>
             ))}
          </div>

          {/* --- STEP 5: PREVIEW MODE --- */}
          {step === 5 ? (
             <div className="animate-in fade-in zoom-in-95 duration-300">
                <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="relative h-64 md:h-80 bg-black">
                        {images.length > 0 ? <img src={URL.createObjectURL(images[0])} className="w-full h-full object-cover opacity-90" /> : <div className="w-full h-full grid place-items-center text-gray-500">No Image</div>}
                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-surface to-transparent h-32"></div>
                        <div className="absolute bottom-6 left-6">
                            <h2 className="text-3xl font-bold text-white shadow-black drop-shadow-md">{brand} {model}</h2>
                            <p className="text-secondary font-bold text-2xl mt-1">{formatPrice(price)}</p>
                        </div>
                    </div>
                    <div className="p-6 md:p-8">
                        {selectedFeatures.length > 0 && (
                           <div className="mb-8">
                              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2"><Zap size={18} className="text-secondary"/> Equipment</h3>
                              <div className="flex flex-wrap gap-2">
                                 {selectedFeatures.map(f => (
                                    <span key={f} className="text-xs bg-white/5 text-white px-3 py-1 rounded-full border border-white/10 flex items-center gap-1">
                                        <CheckCircle size={10} className="text-secondary"/> {f}
                                    </span>
                                 ))}
                              </div>
                           </div>
                        )}
                        <div className="flex gap-4 pt-4 border-t border-white/10">
                            <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl border border-white/10 text-text-muted hover:bg-white/5 hover:text-white">Edit</button>
                            <button onClick={handleSubmit} disabled={isLoading} className="flex-[2] py-3 bg-secondary hover:bg-secondary-hover text-white font-bold rounded-xl shadow-lg">{isLoading ? "Publishing..." : "Confirm & Publish Listing"}</button>
                        </div>
                    </div>
                </div>
             </div>
          ) : (
            /* --- FORM START --- */
            <form onSubmit={(e) => e.preventDefault()} className="bg-surface border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8">
                {error && <div className="mb-6 p-3 bg-red-500/10 text-red-400 text-sm rounded-lg">⚠️ {error}</div>}
                
                {/* STEP 1: BASIC */}
                {step === 1 && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-text-muted uppercase ml-1">Make</label>
                                <select value={brand} onChange={e => {setBrand(e.target.value); setModel("")}} className="input-field">
                                    <option value="">Select Brand</option>
                                    {brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-text-muted uppercase ml-1">Model</label>
                                <select value={model} onChange={e => setModel(e.target.value)} disabled={!brand} className="input-field disabled:opacity-50">
                                    <option value="">Select Model</option>
                                    {models.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                             <div className="space-y-1">
                                <label className="text-xs font-bold text-text-muted uppercase ml-1">Body Type</label>
                                <select value={bodyType} onChange={e => setBodyType(e.target.value)} className="input-field">
                                    {BODY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-text-muted uppercase ml-1">Year</label>
                                <input type="number" value={year} onChange={e => setYear(e.target.value)} className="input-field" placeholder="2020"/>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-text-muted uppercase ml-1">Price (€)</label>
                            <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="input-field" placeholder="15000"/>
                        </div>
                    </div>
                )}

                {/* STEP 2: TECH SPECS */}
                {step === 2 && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                        <div className="grid md:grid-cols-2 gap-4">
                             <div className="space-y-1">
                                <label className="text-xs font-bold text-text-muted uppercase ml-1">Mileage (km)</label>
                                <input type="number" value={milage} onChange={e => setMilage(e.target.value)} className="input-field"/>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-text-muted uppercase ml-1">Power (HP)</label>
                                <input type="number" value={hp} onChange={e => setHp(e.target.value)} className="input-field"/>
                            </div>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-text-muted uppercase ml-1">Fuel Type</label>
                                <select value={fuelType} onChange={e => setFuelType(e.target.value)} className="input-field">
                                    <option>Diesel</option><option>Petrol</option><option>Electric</option><option>Hybrid</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-text-muted uppercase ml-1">Gearbox</label>
                                <select value={gearbox} onChange={e => setGearbox(e.target.value)} className="input-field">
                                    <option>Manual</option><option>Automatic</option>
                                </select>
                            </div>
                        </div>

                         <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-text-muted uppercase ml-1">Drive Type</label>
                                <select value={driveType} onChange={e => setDriveType(e.target.value)} className="input-field">
                                    <option>FWD</option><option>RWD</option><option>AWD</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-text-muted uppercase ml-1">Emission Class</label>
                                <select value={euroStandard} onChange={e => setEuroStandard(e.target.value)} className="input-field">
                                    <option>Euro 6</option><option>Euro 6d</option><option>Euro 5</option><option>Euro 4</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                             <div className="space-y-1">
                                <label className="text-xs font-bold text-text-muted uppercase ml-1">Doors</label>
                                <input type="number" value={doors} onChange={e => setDoors(e.target.value)} className="input-field"/>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-text-muted uppercase ml-1">Seats</label>
                                <input type="number" value={seats} onChange={e => setSeats(e.target.value)} className="input-field"/>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-text-muted uppercase ml-1">VIN Number (Optional)</label>
                            <input type="text" value={vin} onChange={e => setVin(e.target.value.toUpperCase())} className="input-field font-mono placeholder:text-white/20" placeholder="WVWZZZ..."/>
                        </div>

                         <div className="space-y-1">
                            <label className="text-xs font-bold text-text-muted uppercase ml-1">Description</label>
                            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="input-field resize-none" placeholder="Tell us about the car..."/>
                        </div>
                    </div>
                )}

                {/* STEP 3: FEATURES */}
                {step === 3 && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={customFeatureInput}
                                    onChange={(e) => setCustomFeatureInput(e.target.value)}
                                    onKeyDown={handleCustomFeatureKeyDown}
                                    placeholder="Type custom equipment and press Enter..."
                                    className="input-field flex-1"
                                />
                                <button type="button" onClick={addCustomFeature} className="bg-secondary hover:bg-secondary-hover text-white px-4 rounded-xl transition-colors font-bold">
                                    <Plus size={20}/>
                                </button>
                            </div>
                            {selectedFeatures.length > 0 && (
                                <div className="flex flex-wrap gap-2 p-4 bg-background rounded-xl border border-white/10">
                                    {selectedFeatures.map(f => (
                                        <button key={f} type="button" onClick={() => toggleFeature(f)} className="flex items-center gap-1 bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-xs font-bold hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 transition-all group">
                                            {f} <X size={12} className="group-hover:scale-110"/>
                                        </button>
                                    ))}
                                </div>
                            )}
                            <p className="text-xs text-text-muted uppercase font-bold mt-2">Popular Options</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                {EXTENSIVE_FEATURES.map((feat) => (
                                    <div key={feat} onClick={() => toggleFeature(feat)} className={`cursor-pointer p-3 rounded-xl border transition-all flex items-center gap-3 ${selectedFeatures.includes(feat) ? "bg-primary/20 border-primary text-white" : "bg-background border-white/10 text-text-muted hover:bg-white/5"}`}>
                                        <div className={`w-5 h-5 rounded flex items-center justify-center border flex-shrink-0 ${selectedFeatures.includes(feat) ? "bg-primary border-primary" : "border-white/30"}`}>
                                            {selectedFeatures.includes(feat) && <CheckCircle size={14} className="text-white"/>}
                                        </div>
                                        <span className="text-sm font-medium">{feat}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 4: IMAGES */}
                {step === 4 && (
                    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                        <div className="p-4 bg-background rounded-xl border border-dashed border-white/20 text-center">
                            <ImageUploader files={images} onChange={setImages} />
                        </div>
                    </div>
                )}

                {/* NAVIGATION */}
                <div className="mt-8 flex justify-between pt-4 border-t border-white/10">
                    {step > 1 ? (
                        <button type="button" onClick={() => setStep(s => s - 1)} className="px-6 py-3 rounded-xl font-bold text-text-muted hover:text-white hover:bg-white/5 flex items-center gap-2"><ChevronLeft size={18} /> Back</button>
                    ) : <div></div>}
                    <button type="button" onClick={handleNext} className="px-8 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2">
                        {step === 4 ? "Preview Listing" : "Next"} {step !== 4 && <ChevronRight size={18} />}
                    </button>
                </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};