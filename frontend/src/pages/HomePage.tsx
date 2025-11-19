import { NavbarSecond } from "../components/NavbarSecond";
import { Footer } from "../components/Footer";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { motion } from "framer-motion";
import { Car, Tags, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import API, { fetchListings } from "../components/api";
import { ListingCard } from "../components/ListingCard";
export const HomePage = () => {
  const [makes, setMakes] = useState<{ id: number; name: string }[]>([]);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [models, setModels] = useState<{ id: number; name: string }[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [featured, setFeatured] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const r = await fetch(`${API.BASE_URL}/api/cars/makes`);
      const j = await r.json();
      setMakes(j.data || []);
    })();
  }, []);

  useEffect(() => {
    if (!make) {
      setModels([]);
      setModel("");
      return;
    }
    (async () => {
      const r = await fetch(`${API.BASE_URL}/api/cars/models/${make}`);
      const j = await r.json();
      setModels(j.data || []);
    })();
  }, [make]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchListings();
        const items = (res.data || []).slice(0, 9);
        setFeatured(items);
      } catch {}
    })();
  }, []);

  return (
    <div>
      <NavbarSecond />
      {/* HERO */}
      <section className="relative grid place-items-center">
        <div className="absolute inset-0 -z-10">
          <img
            src="https://images.pexels.com/photos/305070/pexels-photo-305070.jpeg"
            alt="Car background"
            className="h-[85vh] w-full object-cover blur-[1px]"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white">
              Find your perfect car
            </h1>
            <p className="mt-3 md:mt-4 text-white/90 text-base md:text-lg">
              Thousands of new and used cars at your fingertips
            </p>
          </motion.div>

          {/* Glass search card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-8 md:mt-10 rounded-2xl border border-white/20 bg-white/15 backdrop-blur-xl shadow-2xl"
          >
            <div className="grid gap-3 sm:grid-cols-4 p-4 md:p-6">
              <div>
                <label className="flex items-center gap-2 text-sm text-white/85 pb-1">
                  <Car size={16} /> Make
                </label>
                <Select
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  className="bg-white "
                >
                  <option value="">Any</option>
                  {makes.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-white/85 pb-1">
                  <Tags size={16} /> Model
                </label>
                <Select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  disabled={!make}
                  className="bg-white "
                >
                  <option value="">Any</option>
                  {models.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-white/85 pb-1">
                  <DollarSign size={16} /> Min Price
                </label>
                <Input
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Min €"
                  className="bg-white text-black placeholder:text-black/50"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-white/85 pb-1">
                  <DollarSign size={16} /> Max Price
                </label>
                <Input
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Max €"
                  className="bg-white text-black placeholder:text-black/50"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 p-4 md:px-6 md:pb-6">
              <a
                className="w-full sm:w-auto"
                href={`/listings?make=${encodeURIComponent(
                  make
                )}&model=${encodeURIComponent(
                  model
                )}&minPrice=${minPrice}&maxPrice=${maxPrice}`}
              >
                <Button className="w-full sm:w-auto">Search cars</Button>
              </a>
              <a href="/sell" className="w-full sm:w-auto">
                <Button variant="secondary" className="w-full sm:w-auto">
                  Sell your car
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="bg-surfaceColor">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-2xl md:text-3xl font-bold text-black pb-8 text-center md:text-left">
            Why CarShop
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Verified sellers",
                desc: "Every dealer is checked and rated.",
                icon: <Car className="text-primaryColor" />,
              },
              {
                title: "Free listings",
                desc: "Create a listing in under 3 minutes.",
                icon: <Tags className="text-primaryColor" />,
              },
              {
                title: "Secure payments",
                desc: "We keep your data safe.",
                icon: <DollarSign className="text-primaryColor" />,
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className="rounded-xl bg-white text-black p-6 shadow-md border border-black/10"
              >
                <div className="flex items-center gap-3">
                  {f.icon}
                  <h3 className="text-lg font-semibold">{f.title}</h3>
                </div>
                <p className="mt-2 text-black/70 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED LISTINGS */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between pb-4">
            <h2 className="text-2xl md:text-3xl font-bold text-black">
              Featured listings
            </h2>
            <a href="/listings" className="text-primaryColor font-semibold">
              View all
            </a>
          </div>
          {featured.length === 0 ? (
            <p className="text-black/60">
              No listings yet. Be the first to post.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {featured.map((l) => (
                <ListingCard key={l._id} listing={l} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* BRANDS STRIP */}
      <section className="bg-surfaceColor">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h3 className="text-xl font-bold text-black pb-4">Popular brands</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[
              "Audi",
              "BMW",
              "Mercedes-Benz",
              "Volkswagen",
              "Toyota",
              "Honda",
            ].map((b) => (
              <div
                key={b}
                className="rounded-lg border border-black/10 bg-white px-4 py-3 text-center text-black/80 hover:shadow-md transition-shadow"
              >
                <button onClick={() => {}}>{b}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h3 className="text-xl font-bold text-black pb-6">
            What drivers say
          </h3>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Luka",
                text: "Listed my car in minutes and sold within a week.",
              },
              {
                name: "Ana",
                text: "Search was fast and the details page was super clear.",
              },
              {
                name: "Maja",
                text: "Loved the simple pricing and quick upload process.",
              },
            ].map((t, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -3 }}
                className="rounded-xl bg-surfaceColor p-6 border border-black/10"
              >
                <p className="text-black/80">“{t.text}”</p>
                <p className="pt-3 font-semibold">{t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="bg-primaryColor">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h3 className="text-2xl md:text-3xl font-extrabold text-white">
            Ready to sell?
          </h3>
          <p className="text-white/90 pt-2">
            Create your listing in under 3 minutes.
          </p>
          <a href="/sell" className="inline-block mt-4">
            <Button className="px-6">Sell your car</Button>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};
