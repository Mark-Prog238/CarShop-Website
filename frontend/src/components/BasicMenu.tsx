import { useState } from "react";
import { CustomInput } from "../components/CustomInput";
import { BRAND_MODELS, fuelType } from "../components/Data";
export const BasicMenu = () => {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [hp, setHp] = useState("");
  const [price, setPrice] = useState("");
  const [milage, setMilage] = useState("");
  const [year, setYear] = useState("");
  const models = brand ? BRAND_MODELS[brand] || [] : [];
  return (
    <div>
      <form action="upload" className="w-full h-full">
        <div className="pl-3 pt-3">
          <h1 className="text-white font-bold text-2xl">CREATE A LISTING</h1>
          <p className="text-gray-400">Enter Your Vehicle Information</p>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row w-full h-full">
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
            <select name="fuelType" id="fuelType" className="select">
              <option value="">Fuel Type</option>
              {fuelType.map((f) => (
                <option value="">{f}</option>
              ))}
            </select>
          </div>

          {/* other info */}
          <div className="flex flex-row">
            <CustomInput
              type="text"
              label="Vehicle HP"
              value={hp}
              onChange={setHp}
            />
            <CustomInput
              type="text"
              label="Price: "
              value={price}
              onChange={setPrice}
            />
            <CustomInput
              type="text"
              label="Vehicle Milage: "
              value={milage}
              onChange={setMilage}
            />
            <CustomInput
              type="text"
              label="Vehicle Year: "
              value={year}
              onChange={setYear}
            />
          </div>
        </div>
      </form>
    </div>
  );
};
