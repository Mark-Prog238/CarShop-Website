import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { NavbarSecond } from "../components/NavbarSecond";
import { ImageUploader } from "../components/ImageUploader";
import API, { fetchListingById } from "../components/api";
import { 
  ChevronRight, ChevronLeft, CheckCircle, Plus, X,
  Loader2
} from "lucide-react";

type CarMake = { id: number; name: string };
type CarModel = { id: number; name: string };
const BODY_TYPES = ["Sedan", "Hatchback", "SUV", "Wagon", "Coupe", "Convertible", "Van", "Pickup", "Minivan", "Cabriolet"];
const EXTENSIVE_FEATURES = ["ABS", "Adaptive Cruise Control", "Lane Assist", "Blind Spot Monitor", "Traffic Sign Recognition", "Webasto / Aux Heating", "Keyless Entry", "Power Tailgate", "Soft Close Doors", "Electric Seats", "Memory Seats", "Massage Seats", "Ventilated Seats", "Heated Seats (Front)", "Heated Seats (Rear)", "Leather Seats", "Panoramic Roof", "Navigation System", "Apple CarPlay", "Android Auto", "Bluetooth", "Head-up Display", "Digital Cockpit", "Sound System", "Touchscreen", "Parking Sensors (Front)", "Parking Sensors (Rear)", "Rear View Camera", "360° Camera", "Self-steering Parking Assist", "Matrix LED Headlights", "Alloy Wheels", "Sport Suspension", "Tow Bar"];

export const SellPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("editId");
  const isEditMode = !!editId;

  // --- AUTH & UI STATE ---
  const [token, setToken] = useState<string | null>(null); 
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [step, setStep] = useState(1); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // --- DATA STATE ---
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
  
  // --- API DATA ---
  const [brands, setBrands] = useState<CarMake[]>([]);
  const [models, setModels] = useState<CarModel[]>([]);

  // --- INITIAL LOAD (AUTH & DATA) ---
  useEffect(() => {
    const storedToken = localStorage.getItem("jwtToken");
    if (!storedToken) {
      setTimeout(() => navigate("/login"), 1000);
    } else {
      setToken(storedToken);
      setCheckingAuth(false);
      
      // Load Brands
      fetch(`${API.BASE_URL}/api/cars/makes`)
        .then(r => r.json()).then(d => setBrands(d.data || []));
    }
  }, [navigate]);

  // --- EDIT MODE: Load Data ---
  useEffect(() => {
    if (isEditMode && editId) {
        setIsLoading(true);
        fetchListingById(editId).then(res => {
            const data = res.data;
            if (data) {
                setBrand(data.brand); setModel(data.model); setYear(data.year); setPrice(data.price);
                setBodyType(data.bodyType); setMilage(data.milage); setHp(data.hp);
                setFuelType(data.fuelType); setGearbox(data.gearbox); setDriveType(data.driveType);
                setDoors(data.doors); setSeats(data.seats); setEuroStandard(data.euroStandard);
                setVin(data.vin); setDescription(data.description); setSelectedFeatures(data.features || []);
                // Note: Images are not preloaded as Files for security/complexity reasons in this demo
            }
            setIsLoading(false);
        }).catch(() => setError("Failed to load listing data."));
    }
  }, [isEditMode, editId]);

  // Load Models on Brand Change
  useEffect(() => {
    if (!brand) { setModels([]); if(!isEditMode) setModel(""); return; }
    fetch(`${API.BASE_URL}/api/cars/models/${brand}`)
      .then(r => r.json()).then(d => setModels(d.data || []));
  }, [brand]);

  // --- HANDLERS ---
  const toggleFeature = (feat: string) => {
    if (selectedFeatures.includes(feat)) setSelectedFeatures(selectedFeatures.filter(f => f !== feat));
    else setSelectedFeatures([...selectedFeatures, feat]);
  };

  const addCustomFeature = () => {
    const val = customFeatureInput.trim();
    if (val && !selectedFeatures.includes(val)) {
      setSelectedFeatures([...selectedFeatures, val]);
      setCustomFeatureInput("");
    }
  };

  const handleNext = () => {
    setError("");
    if (step === 1 && (!brand || !model || !year || !price)) { setError("Please fill in all basic fields."); return; }
    if (step === 2 && (!milage || !hp)) { setError("Please provide technical details."); return; }
    if (!isEditMode && step === 4 && images.length === 0) { setError("Please upload at least one photo."); return; }
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      if (isEditMode) {
          // PUT REQUEST (JSON)
          const payload = {
             brand, model, price: Number(price), year: Number(year), milage: Number(milage), hp: Number(hp),
             bodyType, fuelType, gearbox, driveType, doors: Number(doors), seats: Number(seats), euroStandard, vin, description,
             features: selectedFeatures
          };
          const res = await fetch(`${API.BASE_URL}/api/listings/${editId}`, {
             method: "PUT",
             headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
             body: JSON.stringify(payload)
          });
          if (!res.ok) throw new Error("Update failed");
          navigate("/garage");
      } else {
          // POST REQUEST (FormData)
          const form = new FormData();
          form.append("brand", brand); form.append("model", model); form.append("year", year.toString()); form.append("price", price.toString());
          form.append("milage", milage.toString()); form.append("hp", hp.toString()); form.append("bodyType", bodyType); form.append("fuelType", fuelType);
          form.append("gearbox", gearbox); form.append("driveType", driveType); form.append("doors", doors.toString()); form.append("seats", seats.toString());
          form.append("euroStandard", euroStandard); form.append("vin", vin); form.append("description", description);
          form.append("features", JSON.stringify(selectedFeatures));
          images.forEach((file) => form.append("images", file));

          const res = await fetch(`${API.BASE_URL}${API.ENDPOINTS.LISTINGS.CREATE}`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` },
            body: form,
          });
          if (!res.ok) throw new Error("Failed");
          navigate("/listings");
      }
    } catch (err) {
      setError("Failed to process. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (p: string) => new Intl.NumberFormat('en-DE', { style: 'currency', currency: 'EUR' }).format(Number(p));

  if (checkingAuth) return <div className="min-h-screen bg-background flex items-center justify-center text-white"><Loader2 className="animate-spin mr-2"/> Verifying access...</div>;

  return (
    <div className="min-h-screen bg-background flex flex-col pb-20">
      <NavbarSecond />

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-5xl">
          
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-black text-white mb-2">{isEditMode ? "Edit Listing" : (step === 5 ? "Review" : "Sell Your Car")}</h1>
            <p className="text-text-muted">{isEditMode ? "Update vehicle details below." : `Step ${step} of 5`}</p>
          </div>

          {/* STEP PROGRESS (Hide in Edit Mode or show as completed) */}
          {!isEditMode && (
            <div className="mb-8 flex items-center justify-between relative max-w-lg mx-auto">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-surface -z-10 rounded-full"></div>
                <div className="absolute top-1/2 left-0 h-1 bg-secondary transition-all duration-500 -z-10 rounded-full" style={{ width: `${((step - 1) / 4) * 100}%` }}></div>
                {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold border-2 transition-colors duration-300 ${step >= s ? "bg-secondary border-secondary text-white" : "bg-surface border-surface-highlight text-text-muted"}`}>
                        {step > s ? <CheckCircle size={14}/> : s}
                    </div>
                ))}
            </div>
          )}

          {/* --- PREVIEW CARD (STEP 5) --- */}
          {step === 5 ? (
             <div className="animate-in fade-in zoom-in-95 duration-300">
                <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                    {/* Preview Header - if editing, we might not show new images yet */}
                    <div className="relative h-64 bg-black">
                         {images.length > 0 ? <img src={URL.createObjectURL(images[0])} className="w-full h-full object-cover opacity-80" /> : <div className="w-full h-full grid place-items-center text-gray-500 bg-white/5">Image Preview Unavailable in Edit Mode</div>}
                         <div className="absolute bottom-6 left-6">
                            <h2 className="text-3xl font-bold text-white shadow-black drop-shadow-md">{brand} {model}</h2>
                            <p className="text-secondary font-bold text-2xl mt-1">{formatPrice(price)}</p>
                        </div>
                    </div>
                    
                    <div className="p-6">
                        {/* Summary Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-background p-3 rounded-xl border border-white/5"><p className="text-xs text-text-muted">Year</p><p className="font-bold text-white">{year}</p></div>
                            <div className="bg-background p-3 rounded-xl border border-white/5"><p className="text-xs text-text-muted">Mileage</p><p className="font-bold text-white">{milage} km</p></div>
                            <div className="bg-background p-3 rounded-xl border border-white/5"><p className="text-xs text-text-muted">Fuel</p><p className="font-bold text-white">{fuelType}</p></div>
                            <div className="bg-background p-3 rounded-xl border border-white/5"><p className="text-xs text-text-muted">Gearbox</p><p className="font-bold text-white">{gearbox}</p></div>
                        </div>
                        <div className="bg-background p-4 rounded-xl border border-white/5 mb-6">
                            <p className="text-text-muted text-xs uppercase font-bold mb-2">Description</p>
                            <p className="text-white text-sm">{description || "No description."}</p>
                        </div>
                        
                        <div className="flex gap-4 pt-4 border-t border-white/10">
                            <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl border border-white/10 text-text-muted hover:bg-white/5 hover:text-white">Edit Details</button>
                            <button onClick={handleSubmit} disabled={isLoading} className="flex-[2] py-3 bg-secondary hover:bg-secondary-hover text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2">
                                {isLoading && <Loader2 className="animate-spin"/>} {isEditMode ? "Update Listing" : "Publish Listing"}
                            </button>
                        </div>
                    </div>
                </div>
             </div>
          ) : (
            /* --- FORM STEPS --- */
            <form onSubmit={(e) => e.preventDefault()} className="bg-surface border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8">
                {error && <div className="mb-6 p-3 bg-red-500/10 text-red-400 text-sm rounded-lg border border-red-500/20">⚠️ {error}</div>}
                
                {/* STEP 1: BASIC */}
                <div className={step === 1 ? "block space-y-4 animate-in fade-in" : "hidden"}>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div><label className="text-xs font-bold text-text-muted ml-1">Make</label><select value={brand} onChange={e => {setBrand(e.target.value); setModel("")}} className="input-field"><option value="">Select</option>{brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}</select></div>
                        <div><label className="text-xs font-bold text-text-muted ml-1">Model</label><select value={model} onChange={e => setModel(e.target.value)} disabled={!brand} className="input-field disabled:opacity-50"><option value="">Select</option>{models.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}</select></div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div><label className="text-xs font-bold text-text-muted ml-1">Year</label><input type="number" value={year} onChange={e => setYear(e.target.value)} className="input-field"/></div>
                        <div><label className="text-xs font-bold text-text-muted ml-1">Price (€)</label><input type="number" value={price} onChange={e => setPrice(e.target.value)} className="input-field"/></div>
                    </div>
                    <div><label className="text-xs font-bold text-text-muted ml-1">Body Type</label><select value={bodyType} onChange={e => setBodyType(e.target.value)} className="input-field">{BODY_TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
                </div>

                {/* STEP 2: TECH */}
                <div className={step === 2 ? "block space-y-4 animate-in fade-in" : "hidden"}>
                     <div className="grid md:grid-cols-2 gap-4">
                         <div><label className="text-xs font-bold text-text-muted ml-1">Mileage</label><input type="number" value={milage} onChange={e => setMilage(e.target.value)} className="input-field"/></div>
                         <div><label className="text-xs font-bold text-text-muted ml-1">Power (HP)</label><input type="number" value={hp} onChange={e => setHp(e.target.value)} className="input-field"/></div>
                     </div>
                     <div className="grid md:grid-cols-2 gap-4">
                         <div><label className="text-xs font-bold text-text-muted ml-1">Fuel</label><select value={fuelType} onChange={e => setFuelType(e.target.value)} className="input-field"><option>Diesel</option><option>Petrol</option><option>Electric</option><option>Hybrid</option></select></div>
                         <div><label className="text-xs font-bold text-text-muted ml-1">Gearbox</label><select value={gearbox} onChange={e => setGearbox(e.target.value)} className="input-field"><option>Manual</option><option>Automatic</option></select></div>
                     </div>
                     <div className="grid md:grid-cols-2 gap-4">
                         <div><label className="text-xs font-bold text-text-muted ml-1">Drive</label><select value={driveType} onChange={e => setDriveType(e.target.value)} className="input-field"><option>FWD</option><option>RWD</option><option>AWD</option></select></div>
                         <div><label className="text-xs font-bold text-text-muted ml-1">Emission</label><select value={euroStandard} onChange={e => setEuroStandard(e.target.value)} className="input-field"><option>Euro 6</option><option>Euro 6d</option><option>Euro 5</option><option>Euro 4</option></select></div>
                     </div>
                     <div className="grid md:grid-cols-2 gap-4">
                         <div><label className="text-xs font-bold text-text-muted ml-1">Doors</label><input type="number" value={doors} onChange={e => setDoors(e.target.value)} className="input-field"/></div>
                         <div><label className="text-xs font-bold text-text-muted ml-1">Seats</label><input type="number" value={seats} onChange={e => setSeats(e.target.value)} className="input-field"/></div>
                     </div>
                     <div><label className="text-xs font-bold text-text-muted ml-1">VIN</label><input type="text" value={vin} onChange={e => setVin(e.target.value)} className="input-field font-mono"/></div>
                     <div><label className="text-xs font-bold text-text-muted ml-1">Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="input-field resize-none"/></div>
                </div>

                {/* STEP 3: FEATURES */}
                <div className={step === 3 ? "block space-y-4 animate-in fade-in" : "hidden"}>
                    <div className="flex gap-2">
                        <input type="text" value={customFeatureInput} onChange={e => setCustomFeatureInput(e.target.value)} placeholder="Add custom feature..." className="input-field flex-1" onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomFeature())} />
                        <button onClick={addCustomFeature} className="bg-secondary text-white px-4 rounded-xl font-bold"><Plus/></button>
                    </div>
                    <div className="flex flex-wrap gap-2">{selectedFeatures.map(f => <span key={f} onClick={() => toggleFeature(f)} className="text-xs bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full cursor-pointer hover:bg-red-500/20 hover:text-red-400">{f} <X size={10} className="inline"/></span>)}</div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 h-64 overflow-y-auto pr-2 custom-scrollbar">
                        {EXTENSIVE_FEATURES.map(f => (
                            <div key={f} onClick={() => toggleFeature(f)} className={`p-3 rounded-xl border cursor-pointer text-sm flex items-center gap-2 ${selectedFeatures.includes(f) ? "bg-primary/20 border-primary text-white" : "border-white/10 text-text-muted hover:bg-white/5"}`}>
                                {selectedFeatures.includes(f) && <CheckCircle size={14} className="text-white"/>} {f}
                            </div>
                        ))}
                    </div>
                </div>

                {/* STEP 4: IMAGES (Hide in Edit Mode) */}
                <div className={step === 4 ? "block space-y-4 animate-in fade-in" : "hidden"}>
                    {isEditMode ? (
                         <div className="text-center p-12 border border-white/10 rounded-xl bg-white/5">
                            <p className="text-text-muted font-medium">Image updates are disabled in Edit Mode.</p>
                            <p className="text-xs text-gray-500 mt-1">To change images, delete this listing and create a new one.</p>
                         </div>
                    ) : (
                         <div className="p-4 bg-background rounded-xl border border-dashed border-white/20 text-center">
                            <ImageUploader files={images} onChange={setImages} />
                        </div>
                    )}
                </div>

                {/* NAV */}
                <div className="mt-8 flex justify-between pt-4 border-t border-white/10">
                    {step > 1 ? <button type="button" onClick={() => setStep(s => s - 1)} className="px-6 py-3 rounded-xl font-bold text-text-muted hover:text-white hover:bg-white/5 flex items-center gap-2"><ChevronLeft size={18}/> Back</button> : <div></div>}
                    <button type="button" onClick={handleNext} className="px-8 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg flex items-center gap-2">{step === 4 ? "Preview" : "Next"} <ChevronRight size={18}/></button>
                </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};