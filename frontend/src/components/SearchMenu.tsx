import { CustomInput } from "./CustomInput";
import React, { useState } from "react";
import { BRAND_MODELS } from "../components/Data";

// DEV
const debug = true;

export const SearchMenu = () => {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [hp, setHp] = useState("");
  const [maxMilage, setMaxMilage] = useState("");
  const [minMilage, setMinMilage] = useState("");
  const [maxYear, seMaxYear] = useState("");
  const [minYear, setMinYear] = useState("");
  const models = brand ? BRAND_MODELS[brand] || [] : [];
  const searchVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (debug) {
      console.log({ brand, model, minPrice, maxPrice });
    }
  };
  return (
    <div>
      {/* Hero section ------------------------------------------------*/}
      <section className="relative grid place-items-center px-6 py-20 md:py-32">
        <div className="absolute inset-0 -z-10">
          <img
            src="https://images.pexels.com/photos/2127039/pexels-photo-2127039.jpeg"
            alt="Cars"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="w-full max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Find your next car
          </h1>
          <p className="mt-4 text-lg text-white/80">
            23.456 used and new vehicles • one search
          </p>
          {/* quick-search ------------------------------------------------*/}
          <form onSubmit={searchVehicle}>
            <div className="mt-8 grid gap-3 sm:grid-cols-3 sm:gap-4">
              {/* 1. Brand picker ---------- */}
              <select
                value={brand}
                className="select"
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
                className="select"
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
                label="Minimum Hp"
                value={hp}
                onChange={setHp}
              />
              {/* min price */}
              <CustomInput
                type="text"
                label="Min Price: "
                value={minPrice}
                onChange={setMinPrice}
              />
              <CustomInput
                type="text"
                label="Max Price: "
                value={maxPrice}
                onChange={setMaxPrice}
              />
              <CustomInput
                type="text"
                label="Min Milage: "
                value={minMilage}
                onChange={setMinMilage}
              />
              <CustomInput
                type="text"
                label="Min Milage: "
                value={maxMilage}
                onChange={setMaxMilage}
              />
              <CustomInput
                type="text"
                label="Min Year: "
                value={minYear}
                onChange={setMinYear}
              />
              <CustomInput
                type="text"
                label="Max Year: "
                value={maxYear}
                onChange={seMaxYear}
              />
            </div>

            <button
              type="submit"
              className="rounded-lg bg-primaryColor px-6 py-3 font-semibold hover:bg-opacity-90"
            >
              Search
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
