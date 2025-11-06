import { useState, useEffect } from "react";
import { CustomInput } from "../components/CustomInput";
import { NavbarSecond } from "../components/NavbarSecond";
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

type CarMake = {
  id: number;
  name: string;
};
type CarModel = {
  id: number;
  name: string;
};

export const SellPage = () => {
  const [hp, setHp] = useState("");
  const [price, setPrice] = useState("");
  const [milage, setMilage] = useState("");
  const [year, setYear] = useState("");
  const [showBasic, setShowBasic] = useState(true);
  // Options
  const [brands, setBrands] = useState<CarMake[]>([]);
  const [models, setModels] = useState<CarModel[]>([]);
  // selected
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  useEffect(() => {
    const loadBrands = async () => {
      const res = await fetch("http://localhost:8000/api/cars/makes");
      const data = await res.json();
      setBrands(data.data as CarMake[]);
    };
    loadBrands();
  }, []);

  useEffect(() => {
    if (!brand) return;
    const loadModels = async () => {
      const res = await fetch(`http://localhost:8000/api/cars/models/${brand}`);
      const data = await res.json();
      setModels(data.data as CarModel[]);
    };
    loadModels();
  }, [brand]);

  return (
    <div>
      <NavbarSecond />

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
                      e.preventDefault();
                      setBrand(e.target.value);
                      setModel(""); // reset model when brand changes
                    }}
                  >
                    <option value="">Any Make</option>
                    {brands.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name}
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
                      <option key={m.id} value={m.name}>
                        {m.name}
                      </option>
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
                className="bg-white"
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
                    <th className="tableHeadBox">
                      obdobje prodaje v Sloveniji
                    </th>
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
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setShowBasic(true);
                }}
              >
                BACK
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
