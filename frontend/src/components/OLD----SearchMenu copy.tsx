import { CustomInput } from "./CustomInput";
import React, { useState } from "react";
import { BRAND_MODELS } from "../components/Data";

// DEV
const debug = true;

export const SearchMenu = () => {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [price, setPrice] = useState("Enter Your Price Range");
  const [milage, setMilage] = useState("Enter Your Milage Range");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [priceMenuOpen, setPriceMenuOpen] = useState(false);
  const [milageMenuOpen, setMilageMenuOpen] = useState(false);
  const [minMilage, setMinMilage] = useState("");
  const [maxMilage, setMaxMilage] = useState("");
  const models = brand ? BRAND_MODELS[brand] || [] : [];
  const searchVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (debug) {
      console.log({ brand, model, price, minPrice, maxPrice, priceMenuOpen });
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
          <form
            className="mt-8 grid gap-3 sm:grid-cols-3 sm:gap-4"
            onSubmit={searchVehicle}
          >
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
            <button
              type="submit"
              className="btn"
              onClick={(e) => {
                e.preventDefault();
                setPriceMenuOpen(true);
              }}
            >
              {price}
            </button>
            {/* BUTON FOR MILAGE  */}
            <button
              type="submit"
              className="btn"
              onClick={(e) => {
                e.preventDefault();
                setMilageMenuOpen(true);
              }}
            />
            {milageMenuOpen && (
              <div className="transition-all duration-200 mt-15 h-70 w-62 bg-primaryColor-light rounded-2xl absolute justify-center items-center flex flex-col gap-6">
                <CustomInput
                  type="text"
                  value={minMilage}
                  onChange={setMinMilage}
                  name="milageMin"
                  label="Min km: "
                  className="input-theme-one"
                />

                <CustomInput
                  type="text"
                  value={maxMilage}
                  onChange={setMaxMilage}
                  name="milagemax"
                  label="Max milage: "
                  className="input-theme-one"
                />
                <div className="w-full flex justify-between p-3 ">
                  <button
                    onClick={() => setMilageMenuOpen(false)}
                    className="btn-secondary"
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (minPrice >= maxPrice) {
                        window.alert("Min price must be less than max price");
                        console.log("Min price must be less than max price");
                        return;
                      }
                      setPrice(`${minPrice} - ${maxPrice}`);
                    }}
                    className="btn"
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
            {priceMenuOpen && (
              <div className="transition-all duration-200 mt-15 h-70 w-62 bg-primaryColor-light rounded-2xl absolute justify-center items-center flex flex-col gap-6">
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
                    onClick={() => {
                      if (minPrice >= maxPrice) {
                        window.alert("Min price must be less than max price");
                        console.log("Min price must be less than max price");
                        return;
                      }
                      setPrice(`${minPrice} - ${maxPrice}`);
                    }}
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
