import {
  useState,
  useEffect,
  useMemo,
  type MouseEvent,
  type FormEvent,
} from "react";
import { CustomInput } from "../components/CustomInput";
import { CustomButton } from "../components/CustomButton";
import { ImageUploader } from "../components/ImageUploader";
import API from "../components/api";
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
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
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

  const canProceed = useMemo(() => {
    // quick client-side checks to keep the flow fast
    if (!brand || !model) return false;
    if (!year) return false;
    // accept numeric years with at least 3 digits (e.g. "200" -> 200)
    const parsed = parseInt(year, 10);
    if (isNaN(parsed)) return false;
    if (year.length < 3) return false;
    return true;
  }, [brand, model, year]);

  const handleNext = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!canProceed) {
      setErrorMsg("Please fill required fields before continuing.");
      return;
    }
    setErrorMsg("");
    setShowBasic(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append("brand", brand);
      form.append("model", model);
      form.append("year", year);
      form.append("milage", milage);
      form.append("hp", hp);
      form.append("price", price);
      images.forEach((file, idx) => form.append(`images[${idx}]`, file));

      const res = await fetch(
        `${API.BASE_URL}${API.ENDPOINTS.LISTINGS.CREATE}`,
        {
          method: "POST",
          body: form,
        }
      );
      if (!res.ok) throw new Error("Failed to submit listing");
      window.alert("Listing submitted! 🎉");
      setShowBasic(true);
      // basic reset
      setBrand("");
      setModel("");
      setYear("");
      setMilage("");
      setHp("");
      setPrice("");
      setImages([]);
    } catch (err) {
      setErrorMsg("Could not submit listing right now. Please try again.");
    }
  };

  return (
    <div>
      <NavbarSecond />

      <div className="h-screen w-screen flex items-center justify-center bg-surfaceColor">
        <div className="flex items-center justify-center bg-buttonBg rounded-lg w-14/15 h-4/6">
          <form
            action="upload"
            className="w-full h-full"
            onSubmit={handleSubmit}
          >
            {showBasic ? (
              <div className="w-full h-full">
                <div className="pl-3 pt-3">
                  <h1 className="text-white font-bold text-2xl">
                    CREATE A LISTING
                  </h1>
                  <p className="text-gray-400">
                    Enter Your Vehicle Information
                  </p>
                </div>

                {/* step indicator */}
                <div className="px-3 pt-2">
                  <div className="flex items-center gap-2 text-xs text-white/80">
                    <span
                      className={`${showBasic ? "font-bold" : "opacity-60"}`}
                    >
                      1. Basic
                    </span>
                    <span>›</span>
                    <span
                      className={`${!showBasic ? "font-bold" : "opacity-60"}`}
                    >
                      2. Review
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-4 p-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                    <select
                      value={brand}
                      className="select px-3 py-3"
                      onChange={(e) => {
                        e.preventDefault();
                        setBrand(e.target.value);
                        setModel("");
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
                      className="select px-3 py-3"
                    >
                      <option value="">Any Model</option>
                      {models.map((m) => (
                        <option key={m.id} value={m.name}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <CustomInput
                      type="text"
                      label="Vehicle Year"
                      value={year}
                      onChange={setYear}
                      className="input-theme-one"
                    />
                    {/* hint shown when year is present but probably invalid */}
                    {year && isNaN(parseInt(year, 10)) && (
                      <p className="text-yellow-300 text-xs col-span-full">
                        Year must be numeric.
                      </p>
                    )}
                    <CustomInput
                      type="text"
                      label="Milage"
                      value={milage}
                      onChange={setMilage}
                      className="input-theme-one"
                    />
                    <CustomInput
                      type="text"
                      label="Horsepower"
                      value={hp}
                      onChange={setHp}
                      className="input-theme-one"
                    />
                    <CustomInput
                      type="text"
                      label="Price (€)"
                      value={price}
                      onChange={setPrice}
                      className="input-theme-one"
                    />
                  </div>

                  {/* image uploader */}
                  <div className="pt-1">
                    <p className="text-white/80 text-sm pb-2">Images</p>
                    <ImageUploader files={images} onChange={setImages} />
                  </div>

                  {errorMsg && (
                    <p className="text-red-300 text-sm">{errorMsg}</p>
                  )}

                  <div className="flex justify-end gap-2 pt-2">
                    {/* use a native button so clicks always reach handleNext;
                        visual disabled state kept via class, actual guard in handler */}
                    <button
                      type="button"
                      onClick={handleNext}
                      className={`btn ${
                        !canProceed ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-white w-full h-full p-3">
                <div className="flex items-center gap-2 text-xs text-white/80 pb-2">
                  <span className="opacity-60">1. Basic</span>
                  <span>›</span>
                  <span className="font-bold">2. Review</span>
                </div>
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
                <div className="flex justify-between pt-3">
                  <CustomButton
                    type="button"
                    label="Back"
                    className="btn-secondary"
                    onClick={() => setShowBasic(true)}
                  />
                  <CustomButton
                    type="submit"
                    label="Submit Listing"
                    className="btn"
                  />
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
