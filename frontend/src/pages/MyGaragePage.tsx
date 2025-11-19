// src/pages/GaragePage.tsx
import { useEffect, useState } from "react";
import { NavbarSecond } from "../components/NavbarSecond";
import { ListingCard } from "../components/ListingCard";
import { ArrowRight, CarFront, Power, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import API from "../components/api";

// Helper funkcija (dobi UserId iz JWT, ki je shranjen v localStorage)
const getUserIdFromToken = (token: string) => {
    // To je zelo osnovno dekodiranje PAYLOAD dela JWT (NI VARNO ZA PRODUKCIJO, samo za MVP)
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        return JSON.parse(jsonPayload).userId; 
    } catch (e) {
        console.error("JWT decoding failed", e);
        return null;
    }
}

export const MyGaragePage = () => {
    const navigate = useNavigate();
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const token = localStorage.getItem("jwtToken");
    const userName = localStorage.getItem("userName");
    
    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        
        const userId = getUserIdFromToken(token);
        if (!userId) {
            navigate("/login");
            return;
        }

        const loadListings = async () => {
            try {
                // Klic na zaščiteno ruto
                const res = await fetch(`${API.BASE_URL}/api/users/${userId}/listings`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (res.status === 403) throw new Error("Access Forbidden");
                if (!res.ok) throw new Error("Failed to fetch listings");

                const json = await res.json();
                setListings(json.data || []);
            } catch (e) {
                setError("Could not load your listings.");
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        loadListings();
    }, [token, navigate]);

    if (loading) return <div className="min-h-screen bg-background grid place-items-center text-white">Loading your garage...</div>;

    return (
        <div className="min-h-screen bg-background flex flex-col pb-20">
            <NavbarSecond />
            <main className="mx-auto max-w-7xl px-4 py-8">
                <h1 className="text-4xl font-black text-white mb-2">
                    {userName}'s Garage
                </h1>
                <p className="text-text-muted mb-8">
                    {listings.length} active listings managed by you.
                </p>

                {listings.length === 0 && !error ? (
                    <div className="text-center py-20 bg-surface rounded-xl border border-white/10">
                        <CarFront size={48} className="mx-auto text-gray-500 mb-4" />
                        <p className="text-white text-xl">You have no active listings.</p>
                        <Link to="/sell" className="mt-4 inline-flex items-center gap-2 text-primary hover:underline">
                            Start selling now <ArrowRight size={16} />
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {listings.map((l) => (
                            <ListingCard key={l._id} listing={l} /> // Uporabite obstoječo ListingCard
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};