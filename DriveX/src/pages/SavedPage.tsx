import { useEffect, useState } from "react";
import { NavbarSecond } from "../components/NavbarSecond";
import { ListingCard } from "../components/ListingCard";
import { Heart, ArrowRight, Loader2, CarFront } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import API from "../components/api";

// Helper za pridobitev ID-ja iz tokena
const getUserId = () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload).userId;
    } catch { return null; }
};

export const SavedPage = () => {
    const navigate = useNavigate();
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("jwtToken");

    useEffect(() => {
        // 1. Preverimo prijavo
        if (!token) { 
            navigate("/login"); 
            return; 
        }
        
        const userId = getUserId();
        if (!userId) {
             navigate("/login");
             return;
        }

        // 2. Naložimo shranjene oglase
        const fetchSaved = async () => {
            try {
                // Klic na backend ruto, ki smo jo dodali prej
                const res = await fetch(`${API.BASE_URL}/api/users/${userId}/likes`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                
                if (res.status === 403) {
                    // Token potekel ali napačen user
                    navigate("/login");
                    return;
                }

                const json = await res.json();
                setListings(json.data || []);
            } catch (err) {
                console.error("Failed to load saved listings", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSaved();
    }, [token, navigate]);

    // --- LOADING STATE ---
    if (loading) return (
        <div className="min-h-screen bg-background grid place-items-center text-text-muted">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="animate-spin text-primary" size={40} />
                <p>Loading your favorites...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background flex flex-col pb-20">
            <NavbarSecond />
            
            <main className="mx-auto max-w-7xl px-4 py-8 w-full flex-1">
                
                {/* HEADER */}
                <div className="flex items-center gap-4 mb-10 border-b border-white/10 pb-6">
                    <div className="p-3 bg-secondary/20 rounded-2xl text-secondary shadow-lg shadow-secondary/10">
                        <Heart size={32} className="fill-secondary"/>
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight">Saved Listings</h1>
                        <p className="text-text-muted mt-1">Cars you are watching.</p>
                    </div>
                </div>

                {/* CONTENT */}
                {listings.length === 0 ? (
                    // --- EMPTY STATE ---
                    <div className="text-center py-24 bg-surface rounded-3xl border border-white/5 flex flex-col items-center justify-center shadow-xl">
                        <div className="bg-white/5 p-6 rounded-full mb-6">
                            <CarFront size={48} className="text-gray-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Your favorites list is empty</h3>
                        <p className="text-gray-400 mb-8 max-w-md">
                            Save cars you like to track their price or compare them later.
                        </p>
                        <Link to="/listings" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 transform hover:scale-105">
                            Browse Inventory <ArrowRight size={20} />
                        </Link>
                    </div>
                ) : (
                    // --- GRID OGLASOV ---
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {listings.map((l) => (
                            <ListingCard key={l._id} listing={l} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};