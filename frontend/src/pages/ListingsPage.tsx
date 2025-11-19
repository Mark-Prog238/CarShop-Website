import { useEffect, useMemo, useState } from "react";
import { NavbarSecond } from "../components/NavbarSecond";
import { ListingCard } from "../components/ListingCard";
import { fetchListings } from "../components/api";
import { Select } from "../ui/Select";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Pagination } from "../ui/Pagination";

export const ListingsPage = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("new");
  const [page, setPage] = useState(1);

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
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [make, model, minPrice, maxPrice, sort]);

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

    if (sort === "new") {
      arr.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
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

  return (
    <div className="min-h-screen bg-[#0f111a] pb-10 text-white">
      <NavbarSecond />
      <section className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-3xl font-bold text-white pb-8">Browse Cars</h1>
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          <aside className="h-fit rounded-xl bg-[#181a25] p-6 border border-white/10 sticky top-4">
            <div className="space-y-4">
              <Select
                label="Make"
                value={make}
                onChange={(e: any) => setMake(e.target.value)}
                className="bg-[#0f111a] border-white/10 text-white"
              >
                <option value="">All Makes</option>
                {uniqueMakes.map((m) => (
                  <option key={m} value={m} className="text-black">
                    {m}
                  </option>
                ))}
              </Select>

              <Input
                label="Model"
                value={model}
                onChange={(e: any) => setModel(e.target.value)}
                className="bg-[#0f111a] border-white/10 text-white"
              />

              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Min €"
                  type="number"
                  value={minPrice}
                  onChange={(e: any) => setMinPrice(e.target.value)}
                  className="bg-[#0f111a] border-white/10 text-white"
                />
                <Input
                  label="Max €"
                  type="number"
                  value={maxPrice}
                  onChange={(e: any) => setMaxPrice(e.target.value)}
                  className="bg-[#0f111a] border-white/10 text-white"
                />
              </div>

              <Select
                label="Sort By"
                value={sort}
                onChange={(e: any) => setSort(e.target.value)}
                className="bg-[#0f111a] border-white/10 text-white"
              >
                <option value="new">Newest First</option>
                <option value="price_asc">Price (Low to High)</option>
                <option value="price_desc">Price (High to Low)</option>
              </Select>

              <Button
                className="w-full mt-2 border-white/10 text-white hover:bg-white/5"
                onClick={() => {
                  setMake("");
                  setModel("");
                  setMinPrice("");
                  setMaxPrice("");
                  setSort("new");
                }}
              >
                Reset Filters
              </Button>
            </div>
          </aside>

          <div>
            {loading ? (
              <div className="grid place-items-center h-64 text-gray-400">
                Loading...
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 bg-[#181a25] rounded-xl border border-white/10">
                <p className="text-xl text-gray-400">
                  No cars found matching your criteria.
                </p>
              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
}