import { connectDB } from "../db/connect.js";

const demoListings = [
  {
    sellerId: "demo",
    brand: "Audi",
    model: "A3",
    trim: "Sportback",
    year: 2018,
    milage: 78000,
    price: 14500,
    currency: "EUR",
    fuelType: "Petrol",
    gearbox: "Manual",
    doors: 5,
    hp: 150,
    kW: 110,
    engineDisplacement: 1395,
    images: [
      "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg",
    ],
    description: "Well kept A3 with full history.",
    location: { country: "SI", region: "Osrednjeslovenska", city: "Ljubljana" },
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    sellerId: "demo",
    brand: "BMW",
    model: "3 Series",
    trim: "320d",
    year: 2019,
    milage: 62000,
    price: 19500,
    currency: "EUR",
    fuelType: "Diesel",
    gearbox: "Automatic",
    doors: 4,
    hp: 190,
    kW: 140,
    engineDisplacement: 1995,
    images: [
      "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg",
    ],
    description: "Comfort package, great condition.",
    location: { country: "SI", region: "Podravska", city: "Maribor" },
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    sellerId: "demo",
    brand: "Volkswagen",
    model: "Golf",
    trim: "VII 1.6 TDI",
    year: 2017,
    milage: 98000,
    price: 9500,
    currency: "EUR",
    fuelType: "Diesel",
    gearbox: "Manual",
    doors: 5,
    hp: 115,
    kW: 85,
    engineDisplacement: 1598,
    images: [
      "https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg",
    ],
    description: "Reliable daily with low consumption.",
    location: { country: "SI", region: "Gorenjska", city: "Kranj" },
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    sellerId: "demo",
    brand: "Toyota",
    model: "Corolla",
    trim: "1.8 Hybrid",
    year: 2020,
    milage: 34000,
    price: 18990,
    currency: "EUR",
    fuelType: "Hybrid",
    gearbox: "Automatic",
    doors: 5,
    hp: 122,
    kW: 90,
    engineDisplacement: 1798,
    images: [
      "https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg",
    ],
    description: "Efficient hybrid with ADAS.",
    location: { country: "SI", region: "Primorska", city: "Koper" },
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    sellerId: "demo",
    brand: "Mercedes-Benz",
    model: "C-Class",
    trim: "C200",
    year: 2018,
    milage: 71000,
    price: 20900,
    currency: "EUR",
    fuelType: "Petrol",
    gearbox: "Automatic",
    doors: 4,
    hp: 184,
    kW: 135,
    engineDisplacement: 1497,
    images: [
      "https://images.pexels.com/photos/193991/pexels-photo-193991.jpeg",
    ],
    description: "Luxury interior, great service history.",
    location: { country: "SI", region: "Savinjska", city: "Celje" },
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    sellerId: "demo",
    brand: "Honda",
    model: "Civic",
    trim: "1.5 VTEC Turbo",
    year: 2017,
    milage: 88000,
    price: 12800,
    currency: "EUR",
    fuelType: "Petrol",
    gearbox: "Manual",
    doors: 5,
    hp: 182,
    kW: 134,
    engineDisplacement: 1498,
    images: [
      "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg",
    ],
    description: "Sporty hatch with turbo engine.",
    location: { country: "SI", region: "Goriška", city: "Nova Gorica" },
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function run() {
  const db = await connectDB();
  const col = db.collection("listings");

  // Avoid duplicates when re-running: upsert by brand+model+year+price
  let inserted = 0;
  for (const l of demoListings) {
    const exists = await col.findOne({ brand: l.brand, model: l.model, year: l.year, price: l.price });
    if (!exists) {
      await col.insertOne(l);
      inserted++;
    }
  }
  console.log(`✅ Seed complete. Inserted ${inserted} listings.`);
  process.exit(0);
}

run().catch((e) => {
  console.error("❌ Seed failed", e);
  process.exit(1);
});


