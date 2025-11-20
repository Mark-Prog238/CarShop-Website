import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom"; // 1. Import useSearchParams
import { NavbarSecond } from "../components/NavbarSecond";
import { ListingCard } from "../components/ListingCard";
import { fetchListings } from "../components/api";
import { Select } from "../ui/Select";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Pagination } from "../ui/Pagination";
import { Search, X, Car, DollarSign } from "lucide-react";

export const ListingsPage = () => {
  const [searchParams] = useSearchParams(); // 2. Get URL params
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize state from URL params if available
  const [make, setMake] = useState(searchParams.get("make") || "");
  const [model, setModel] = useState(searchParams.get("model") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  
  const [sort, setSort] = useState("new");
  const [page, setPage] = useState(1);

  // --- FETCHING LISTINGS ---
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchListings();
        if (res.data && Array.isArray(res.data)) {
          setListings(res.data);
        } else if (Array.isArray(res)) {
          setListings(res);
        } else {
          setListings([]);
        }
      } catch (error) {
        console.error("Failed to load listings", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [make, model, minPrice, maxPrice, sort]);

  // --- FILTERING LOGIC ---
  const filtered = useMemo(() => {
    let arr = [...listings];

    if (make) {
      arr = arr.filter((x) =>
        (x.brand || "").toLowerCase().includes(make.toLowerCase())
      );
    }
    if (model) {
      arr = arr.filter((x) =>
        (x.model || "").toLowerCase().includes(model.toLowerCase())
      );
    }
    if (minPrice) {
      arr = arr.filter((x) => (x.price ?? 0) >= Number(minPrice));
    }
    if (maxPrice) {
      arr = arr.filter((x) => (x.price ?? 0) <= Number(maxPrice));
    }

    // Sorting
    if (sort === "new") {
      arr.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === "price_asc") {
      arr.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    } else if (sort === "price_desc") {
      arr.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    }

    return arr;
  }, [listings, make, model, minPrice, maxPrice, sort]);

  const pageSize = 9;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const uniqueMakes = useMemo(() => {
    return [...new Set(listings.map((x) => x.brand).filter(Boolean))];
  }, [listings]);
  
  const handleResetFilters = () => {
    setMake("");
    setModel("");
    setMinPrice("");
    setMaxPrice("");
    setSort("new");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-10">
      <NavbarSecond />
      
      <section className="mx-auto max-w-7xl px-4 py-8 flex-1">
        <h1 className="text-3xl font-black text-white pb-6 tracking-tight">Browse Inventory</h1>
        
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          
          {/* --- SIDEBAR (FILTERS) --- */}
          <aside className="h-fit rounded-xl bg-surface p-6 shadow-xl border border-white/10 lg:sticky lg:top-20">
            <h2 className="font-bold text-white mb-4 flex items-center gap-2">
                <Search size={18} className="text-primary"/> Refine Search
            </h2>
            <div className="space-y-4">
              
              {/* Make Select */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-muted uppercase ml-1">Make</label>
                <Select
                  value={make}
                  onChange={(e: any) => setMake(e.target.value)}
                  className="input-field" 
                >
                  <option value="">All Makes</option>
                  {uniqueMakes.map((m) => (
                    <option key={m} value={m} className="text-black">{m}</option>
                  ))}
                </Select>
              </div>

              {/* Model Input */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-muted uppercase ml-1">Model</label>
                <Input
                  value={model}
                  onChange={(e: any) => setModel(e.target.value)}
                  className="input-field"
                  placeholder="e.g. Golf, 3 Series"
                />
              </div>
              
              {/* Price Range */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-muted uppercase ml-1 flex items-center gap-1"><DollarSign size={14}/> Price (€)</label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={minPrice}
                    onChange={(e: any) => setMinPrice(e.target.value)}
                    className="input-field"
                    placeholder="Min"
                    type="number"
                  />
                  <Input
                    value={maxPrice}
                    onChange={(e: any) => setMaxPrice(e.target.value)}
                    className="input-field"
                    placeholder="Max"
                    type="number"
                  />
                </div>
              </div>

              {/* Sort By */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-muted uppercase ml-1">Sort By</label>
                <Select
                  value={sort}
                  onChange={(e: any) => setSort(e.target.value)}
                  className="input-field"
                >
                  <option value="new">Newest First</option>
                  <option value="price_asc">Price (Low to High)</option>
                  <option value="price_desc">Price (High to Low)</option>
                </Select>
              </div>

              {/* Reset Button */}
              <Button 
                variant="secondary" 
                onClick={handleResetFilters}
                className="w-full mt-2 border-white/10 hover:bg-white/5 flex items-center justify-center"
              >
                <X size={16} className="mr-2"/>
                <p className="text-white">Reset Filters</p>
              </Button>
            </div>
          </aside>

          {/* --- RESULTS --- */}
          <div>
            {loading ? (
              <div className="grid place-items-center h-64 text-text-muted">
                Loading inventory...
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 bg-surface rounded-xl border border-white/10">
                <Car size={36} className="mx-auto text-text-muted mb-4"/>
                <p className="text-xl text-white">No cars found matching your criteria.</p>
                <p className="text-text-muted">Try resetting the filters or check back later.</p>
              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                  {pageItems.map((l) => (
                    <ListingCard key={l._id} listing={l} />
                  ))}
                </div>
                
                <div className="mt-8 flex justify-center">
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    onChange={setPage}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};