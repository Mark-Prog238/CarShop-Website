
const API = {
  BASE_URL: "https://drivex-backend-iiyg.onrender.com",
  
  ENDPOINTS: {
    LOGIN: "/api/login",
    REGISTER: "/api/register",
    LISTINGS: {
      CREATE: "/api/listings",
    },
    USERS: {
        LIKES: (userId: string) => `/api/users/${userId}/likes`,
        PROFILE: (userId: string) => `/api/users/${userId}`,
    }
  },
};

export const fetchListings = async () => {
  try {
    const res = await fetch(`${API.BASE_URL}${API.ENDPOINTS.LISTINGS.CREATE}`);
    const json = await res.json();
    if (Array.isArray(json)) return { data: json };
    if (json && Array.isArray(json.data)) return json;
    return { data: [] };
  } catch (e) {
    console.error(e);
    return { data: [] };
  }
};

export const fetchListingById = async (id: string) => {
  const res = await fetch(`${API.BASE_URL}/api/listings/${id}`);
  return res.json();
};

export default API;