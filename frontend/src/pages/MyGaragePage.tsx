import { useEffect, useState } from "react";
import { NavbarSecond } from "../components/NavbarSecond";
import { ListingCard } from "../components/ListingCard";
import { ArrowRight, CarFront, Trash2, Edit } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import API from "../components/api";

// Helper za dekodiranje tokena (Varno)
const getUserIdFromToken = (token: string | null) => {
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload).userId; 
    } catch (e) {
        return null;
    }
}

// --- Wrapper komponenta za kartico (Gumbi Edit/Delete) ---
const GarageCardWrapper = ({ listing, onDelete }: { listing: any, onDelete: (id: string) => void }) => {
    // ⚠️ KLJUČNI POPRAVEK: Varno pridobivanje ID-ja
    const listingId = typeof listing._id === "string" 
        ? listing._id 
        : listing._id?.toString() || ""; // Pretvori ObjectId objekt v string
    
    return (
        <div className="relative group">
            {/* Osnovna kartica */}
            <ListingCard listing={listing} /> 
            
            {/* Overlay z gumbi (viden samo ob hoverju) */}
            <div className="absolute inset-0 bg-[#0f111a]/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 rounded-xl border border-white/10">
                
                {/* EDIT Gumb */}
                <Link 
                    to={`/sell?editId=${listingId}`} 
                    className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl shadow-lg hover:scale-110 transition-all border border-white/10"
                    title="Edit Listing"
                >
                    <Edit size={24} />
                </Link>

                {/* DELETE Gumb */}
                <button 
                    onClick={(e) => {
                        e.preventDefault(); // Prepreči navigacijo kartice
                        onDelete(listingId);
                    }}
                    className="bg-red-600 hover:bg-red-500 text-white p-3 rounded-xl shadow-lg hover:scale-110 transition-all border border-white/10"
                    title="Delete Listing"
                >
                    <Trash2 size={24} />
                </button>
            </div>
        </div>
    );
};

// --- GLAVNA STRAN ---
export const MyGaragePage = () => { // Preimenoval sem v GaragePage, da se ujema z importi, če rabiš
    const navigate = useNavigate();
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    
    const token = localStorage.getItem("jwtToken");
    const userName = localStorage.getItem("userName");
    
    // Funkcija za brisanje
    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this listing? This cannot be undone.")) return;

        setStatusMessage("Deleting...");
        try {
            const res = await fetch(`${API.BASE_URL}/api/listings/${id}`, {
                method: 'DELETE',
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!res.ok) throw new Error("Failed to delete.");

            setStatusMessage("Successfully deleted!");
            // Takoj odstrani iz seznama brez ponovnega nalaganja
            setListings(current => current.filter(l => {
                const currentId = typeof l._id === 'string' ? l._id : l._id.toString();
                return currentId !== id;
            }));
            
            // Počisti sporočilo po 3 sekundah
            setTimeout(() => setStatusMessage(""), 3000);
        } catch (e) {
            setStatusMessage("Error: Could not delete listing.");
        }
    };

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        // Naloži oglase
        const loadListings = async () => {
            setLoading(true);
            try {
                // Pridobi ID iz tokena za varnost (čeprav API uporablja token header)
                const userId = getUserIdFromToken(token);
                if (!userId) throw new Error("Invalid Session");

                // Uporabimo API pot za garažo
                const res = await fetch(`${API.BASE_URL}/api/users/${userId}/listings`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (res.status === 403) throw new Error("Access Forbidden");
                if (!res.ok) throw new Error("Failed to fetch");

                const json = await res.json();
                setListings(json.data || []);
            } catch (e) {
                console.error(e);
                setError("Could not load garage.");
            } finally {
                setLoading(false);
            }
        };
        loadListings();
    }, [token, navigate]);

    if (loading) return <div className="min-h-screen bg-[#0f111a] grid place-items-center text-gray-400">Loading your garage...</div>;

    return (
        <div className="min-h-screen bg-[#0f111a] flex flex-col pb-20">
            <NavbarSecond />
            
            <main className="mx-auto max-w-7xl px-4 py-8 w-full">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-white mb-1">
                            {userName ? `${userName}'s Garage` : "My Garage"}
                        </h1>
                        <p className="text-gray-400 text-sm">
                            Manage your active listings and sales.
                        </p>
                    </div>
                    
                    {/* Status Message Toast */}
                    {statusMessage && (
                        <div className={`px-4 py-2 rounded-lg text-sm font-bold animate-in fade-in slide-in-from-top-2 ${statusMessage.includes('Error') ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
                            {statusMessage}
                        </div>
                    )}
                </div>

                {/* Empty State */}
                {listings.length === 0 && !error ? (
                    <div className="text-center py-24 bg-[#181a25] rounded-2xl border border-white/5 flex flex-col items-center justify-center">
                        <div className="bg-white/5 p-4 rounded-full mb-4">
                            <CarFront size={40} className="text-gray-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Your garage is empty</h3>
                        <p className="text-gray-400 mb-6 max-w-xs">You haven't listed any cars for sale yet. Start selling today!</p>
                        <Link to="/sell" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20">
                            Create First Listing <ArrowRight size={18} />
                        </Link>
                    </div>
                ) : (
                    /* Grid Oglasov */
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {listings.map((l) => (
                            <GarageCardWrapper 
                                key={l._id.toString()} 
                                listing={l} 
                                onDelete={handleDelete} 
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};