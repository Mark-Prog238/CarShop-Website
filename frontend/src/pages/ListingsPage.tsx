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

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchListings();
        setListings(res.data || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // filters (client-side for demo)
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("new");

  const filtered = useMemo(() => {
    let arr = [...listings];
    if (make)
      arr = arr.filter(
        (x) => (x.brand || "").toLowerCase() === make.toLowerCase()
      );
    if (model)
      arr = arr.filter(
        (x) => (x.model || "").toLowerCase() === model.toLowerCase()
      );
    if (minPrice) arr = arr.filter((x) => (x.price ?? 0) >= Number(minPrice));
    if (maxPrice) arr = arr.filter((x) => (x.price ?? 0) <= Number(maxPrice));
    if (sort === "new")
      arr.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    if (sort === "price_asc")
      arr.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    if (sort === "price_desc")
      arr.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    return arr;
  }, [listings, make, model, minPrice, maxPrice, sort]);

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 9;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      <NavbarSecond />
      <section className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-bold text-white/90 pb-6">Browse cars</h1>
        <div className="grid gap-6 md:grid-cols-[280px_1fr]">
          {/* sidebar */}
          <aside className="rounded-xl bg-buttonBg border border-black/10 p-4 h-max">
            <div className="space-y-3">
              <Select
                label="Make"
                value={make}
                onChange={(e) => setMake(e.target.value)}
              >
                <option value="">Any</option>
                {[...new Set(listings.map((x) => x.brand).filter(Boolean))].map(
                  (m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  )
                )}
              </Select>
              <Input
                label="Model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Min €"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
                <Input
                  label="Max €"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </div>
              <Select
                label="Sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="new">Newest</option>
                <option value="price_asc">Price ↑</option>
                <option value="price_desc">Price ↓</option>
              </Select>
              <Button variant="secondary" onClick={() => setPage(1)}>
                Apply
              </Button>
            </div>
          </aside>

          {/* results */}
          <div>
            {loading ? (
              <p className="text-white/70">Loading…</p>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {pageItems.map((l) => (
                    <ListingCard key={l._id} listing={l} />
                  ))}
                </div>
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onChange={setPage}
                />
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
