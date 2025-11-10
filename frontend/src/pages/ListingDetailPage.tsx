import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { NavbarSecond } from "../components/NavbarSecond";
import { fetchListingById } from "../components/api";

export const ListingDetailPage = () => {
  const { id } = useParams();
  const [listing, setListing] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const res = await fetchListingById(id);
        setListing(res.data || null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  return (
    <div>
      <NavbarSecond />
      <section className="mx-auto max-w-5xl px-4 py-8 text-black">
        {loading ? (
          <p className="text-black/70">Loading…</p>
        ) : !listing ? (
          <p>Listing not found.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              {listing.images?.length ? (
                listing.images.map((src: string, i: number) => (
                  <img
                    key={`${src}-${i}`}
                    src={src}
                    className="w-full rounded-lg border border-black/20"
                  />
                ))
              ) : (
                <div className="h-64 rounded-lg bg-black/30 grid place-items-center">
                  No images
                </div>
              )}
            </div>
            <div className="p-2">
              <h1 className="text-3xl font-bold">
                {listing.brand} {listing.model}
              </h1>
              <p className="text-black/80">{listing.year}</p>
              {listing.price != null && (
                <p className="text-2xl font-extrabold pt-2">
                  € {listing.price.toLocaleString()}
                </p>
              )}
              <div className="pt-4 space-y-1 text-black/80">
                <p>Mileage: {listing.milage ?? "—"}</p>
                <p>Horsepower: {listing.hp ?? "—"}</p>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
