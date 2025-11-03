import { NavbarSecond } from "../components/NavbarSecond";
import { CustomInput } from "../components/CustumInput";
import { useState } from "react";
import { BRAND_MODELS } from "../components/Data";
import { Footer } from "../components/Footer";
import { PriceRangeMenu } from "../components/PriceRange";
export const HomePage = () => {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [priceMenuOpen, setPriceMenuOpen] = useState(false);
  const models = brand ? BRAND_MODELS[brand] || [] : [];

  const showPriceInput = () => {
    <PriceRangeMenu />;
  };
  return (
    <div className="min-h-screen bg-bgColor text-white">
      <NavbarSecond />

      {/* Hero section ------------------------------------------------*/}
      <section className="relative grid place-items-center px-6 py-20 md:py-32">
        {/* background image with overlay so text pops */}
        <div className="absolute inset-0 -z-10">
          <img
            src="https://images.pexels.com/photos/2127039/pexels-photo-2127039.jpeg"
            alt="Cars"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* headline + search box */}
        <div className="w-full max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Find your next car
          </h1>
          <p className="mt-4 text-lg text-white/80">
            23.456 used and new vehicles • one search
          </p>
          {/* quick-search ------------------------------------------------*/}
          <form className="mt-8 grid gap-3 sm:grid-cols-3 sm:gap-4">
            {/* 1. Brand picker ---------- */}
            <select
              value={brand}
              onChange={(e) => {
                setBrand(e.target.value);
                setModel(""); // reset
              }}
            >
              <option value="">Any make</option>
              {Object.keys(BRAND_MODELS).map((b) => (
                <option className="dropdown-menu" key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
            {/* 2. Model picker ---------- */}
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              disabled={!brand}
              className="text-white"
            >
              <option value="">Any model</option>
              {models.map((m) => (
                <option className="dropdown-menu" key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <CustomInput
              type="text"
              value={price}
              onChange={setPrice}
              name="priceRange"
              label={price}
              className="input-theme-one"
            />
            <button
              type="submit"
              className="btn "
              onClick={(e) => {
                e.preventDefault();
                setPriceMenuOpen(true);
              }}
            >
              {price}
            </button>

            {priceMenuOpen && (
              <div className="h-70 w-70 bg-black absolute justify-center items-center flex flex-col gap-6">
                <CustomInput
                  type="text"
                  value={minPrice}
                  onChange={setMinPrice}
                  name="pricemin"
                  label="Min price: "
                  className="input-theme-one"
                />

                <CustomInput
                  type="text"
                  value={maxPrice}
                  onChange={setMaxPrice}
                  name="pricemax"
                  label="Max price: "
                  className="input-theme-one"
                />
                <div className="w-full flex justify-between p-3 ">
                  <button
                    onClick={() => setPriceMenuOpen(false)}
                    className="btn-secondary"
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setPrice("$")}
                    className="btn"
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
            <button
              type="submit"
              className="rounded-lg bg-thirdColor px-6 py-3 font-semibold hover:bg-opacity-90"
            >
              Search
            </button>
          </form>
          {/* quick links -----------------------------------------------*/}
          <div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-white/70">
            <a href="#" className="underline hover:text-white">
              Electric
            </a>
            <a href="#" className="underline hover:text-white">
              SUV
            </a>
            <a href="#" className="underline hover:text-white">
              First registration 2023
            </a>
            <a href="#" className="underline hover:text-white">
              ≤ 50.000 km
            </a>
          </div>
        </div>
      </section>

      {/* Optional: 3-column perks ------------------------------------*/}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-xl bg-white/10 p-6">
            <h3 className="text-xl font-semibold">Verified sellers</h3>
            <p className="mt-2 text-white/80">
              Every dealer is checked and rated.
            </p>
          </div>
          <div className="rounded-xl bg-white/10 p-6">
            <h3 className="text-xl font-semibold">Free listings</h3>
            <p className="mt-2 text-white/80">
              Sell your car in under 3 minutes.
            </p>
          </div>
          <div className="rounded-xl bg-white/10 p-6">
            <h3 className="text-xl font-semibold">Secure financing</h3>
            <p className="mt-2 text-white/80">Get pre-approved on the spot.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
