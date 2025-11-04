import { CustomInput } from "./CustomInput";
import { useState } from "react";
export const PriceRangeMenu = () => {
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  return (
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
        <button className="btn-secondary" type="button">
          Cancel
        </button>
        <button className="btn" type="submit">
          Submit
        </button>
      </div>
    </div>
  );
};
