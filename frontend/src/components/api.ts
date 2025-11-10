const API = {
  BASE_URL: "http://localhost:8000", // use http unless you configured https
  ENDPOINTS: {
    LOGIN: "/api/login",
    REGISTER: "/api/register",
    LISTINGS: {
      CREATE: "/api/listings",
      UPLOAD: "/api/uploads", // optional separate upload route if backend supports
    },
  },
};

export const fetchListings = async () => {
  try {
    const res = await fetch(`${API.BASE_URL}${API.ENDPOINTS.LISTINGS.CREATE}`);
    const json = await res.json();
    // Normalize potential shapes
    if (Array.isArray(json)) return { data: json };
    if (json && Array.isArray(json.data)) return json;
    return { data: [] };
  } catch (e) {
    console.error("Failed to fetch listings", e);
    return { data: [] };
  }
};

export const fetchListingById = async (id: string) =>
  fetch(`${API.BASE_URL}/api/listings/${id}`).then((r) => r.json());

export default API;
