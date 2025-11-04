import { useState } from "react";
import { CustomInput } from "../components/CustomInput";

import { BRAND_MODELS } from "../components/Data";
export const SellPage = () => {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const models = brand ? BRAND_MODELS[brand] || [] : [];
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-surfaceColor">
      <div className="flex items-center justify-center bg-buttonBg rounded-lg w-1/3 h-2/5">
        <form
          action="upload"
          className="w-1/2 h-1/3   flex flex-col  items-center justify-center"
        >
          <h1>CREAE A LISTING</h1>
          <div>
            <select
              value={brand}
              className="select"
              onChange={(e) => {
                setBrand(e.target.value);
                setModel("");
              }}
            >
              <option value="">Any Make</option>
              {Object.keys(BRAND_MODELS).map((b) => (
                <option className="dropdown-menu" value={b} key={b}>
                  {b}
                </option>
              ))}
            </select>

            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              disabled={!brand}
              className="select"
            >
              <option value="">Any Model</option>
              {models.map((m) => (
                <option className="dropdown-menu" value={m} key={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </form>
      </div>
    </div>
  );
};
