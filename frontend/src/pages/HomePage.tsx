import { NavbarSecond } from "../components/NavbarSecond";
import { Footer } from "../components/Footer";
import { SearchMenu } from "../components/SearchMenu";
export const HomePage = () => {
  return (
    <div>
      <NavbarSecond />
      <SearchMenu />
      {/* Optional: 3-column perks ------------------------------------*/}
      <div className="bg-blue-100/30">
        <section className="mx-auto max-w-6xl px-6 py-16 ">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-xl bg-buttonBg p-6">
              <h3 className="text-xl font-semibold text-white/90">
                Verified sellers
              </h3>
              <p className="mt-2 text-white/80">
                Every dealer is checked and rated.
              </p>
            </div>
            <div className="rounded-xl bg-buttonBg p-6">
              <h3 className="text-xl font-semibold text-white/90">
                Free listings
              </h3>
              <p className="mt-2 text-white/80">
                Sell your car in under 3 minutes.
              </p>
            </div>
            <div className="rounded-xl bg-buttonBg p-6">
              <h3 className="text-xl font-semibold text-white/90">
                Secure financing
              </h3>
              <p className="mt-2 text-white/80">
                Get pre-approved on the spot.
              </p>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
};
