import { useState } from "react";
import { CustomInput } from "../components/CustomInput";
import { BRAND_MODELS, fuelType } from "../components/Data";

export const Test = () => {
  return (
    <tr>
      <td className="tableRowBox">A1 25 TFSI advanced</td>
      <td className="tableRowBox">5</td>
      <td className="tableRowBox">999 ccm</td>
      <td className="tableRowBox">70 kW / 95 KM</td>
      <td className="tableRowBox">12/2018 - do danes</td>
    </tr>
  );
};

export const SellPage = () => {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [hp, setHp] = useState("");
  const [price, setPrice] = useState("");
  const [milage, setMilage] = useState("");
  const [year, setYear] = useState("");
  const [showBasic, setShowBasic] = useState(false);
  const models = brand ? BRAND_MODELS[brand] || [] : [];
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-surfaceColor">
      <div className="flex items-center justify-center bg-buttonBg rounded-lg w-14/15 h-4/6">
        {showBasic ? (
          <form action="upload" className="w-full h-full">
            <div className="pl-3 pt-3">
              <h1 className="text-white font-bold text-2xl">
                CREATE A LISTING
              </h1>
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
                {/* <CustomInput
                  type="text"
                  label="Vehicle HP"
                  value={hp}
                  onChange={setHp}
                /> */}
                {/* <CustomInput
                  type="text"
                  label="Price: "
                  value={price}
                  onChange={setPrice}
                /> */}
                {/* <CustomInput
                  type="text"
                  label="Vehicle Milage: "
                  value={milage}
                  onChange={setMilage}
                /> */}
                <CustomInput
                  type="text"
                  label="Vehicle Year: "
                  value={year}
                  onChange={setYear}
                />
              </div>
            </div>
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                setShowBasic(false);
              }}
            >
              Next
            </button>
          </form>
        ) : (
          <div className="text-white">
            <table className="table-fixed w-full border border-gray-700 border-collapse">
              <thead className="bg-gray-800">
                <tr>
                  <th className="tableHeadBox">Tip vozila</th>
                  <th className="tableHeadBox">število vrat</th>
                  <th className="tableHeadBox">motor</th>
                  <th className="tableHeadBox">moč motorja</th>
                  <th className="tableHeadBox">obdobje prodaje v Sloveniji</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white text-black">
                  <td className="tableRowBox">
                    <button
                      onClick={() => {
                        window.alert("hey");
                      }}
                    >
                      A1 25 TFSI advanced
                    </button>
                  </td>
                  <td className="tableRowBox">5</td>
                  <td className="tableRowBox">999 ccm</td>
                  <td className="tableRowBox">70 kW / 95 KM</td>
                  <td className="tableRowBox">12/2018 - do danes</td>
                </tr>
                <Test />
                <Test />
                <Test></Test>
                <Test></Test>
                <Test></Test>
                <Test></Test>
                <Test></Test>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
