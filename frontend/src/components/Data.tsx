export const Translations = {
  EN: {
    login: "LOGIN",
    signOut: "Sign Out",
    register: "REGISTER",
  },
};

export const Logo = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      className="h-10 w-auto"
    >
      <circle
        cx="100"
        cy="100"
        r="90"
        fill="none"
        stroke="#0ea5e9"
        strokeWidth="10"
      />
      <circle cx="100" cy="100" r="25" fill="#0ea5e9" />
      <path d="M85 140V75L100 55l15 20v65h-10V85l-5-7-5 7v55z" fill="#fff" />
    </svg>
  );
};

// brand-engineModels.ts
export const BRAND_MODELS: Record<string, string[]> = {
  /* ------- BMW ------- */
  BMW: [
    // 1er
    "116i",
    "116d",
    "118i",
    "118d",
    "120i",
    "120d",
    "125i",
    "125d",
    "128ti",
    "M135i",
    // 2er
    "218i",
    "218d",
    "220i",
    "220d",
    "225i",
    "225d",
    "228i",
    "230i",
    "M235i",
    "M240i",
    // 3er (F/G)
    "316i",
    "318i",
    "320i",
    "320d",
    "320e",
    "320xDrive",
    "330i",
    "330d",
    "330e",
    "330xDrive",
    "340i",
    "340d",
    "M340i",
    "M340d",
    // 4er
    "420i",
    "420d",
    "420e",
    "430i",
    "430d",
    "430e",
    "440i",
    "440d",
    "M440i",
    "M440d",
    // 5er
    "518i",
    "520i",
    "520d",
    "520e",
    "530i",
    "530d",
    "530e",
    "530xDrive",
    "540i",
    "540d",
    "M550i",
    "M550d",
    // 6er
    "620i",
    "630i",
    "630d",
    "640i",
    "640d",
    "650i",
    "M650i",
    // 7er
    "730i",
    "730d",
    "740i",
    "740d",
    "750i",
    "750d",
    "760i",
    "M760i",
    // X
    "X1 18i",
    "X1 18d",
    "X1 20i",
    "X1 20d",
    "X1 23i",
    "X1 25i",
    "X1 25d",
    "X1 M35i",
    "X2 18i",
    "X2 18d",
    "X2 20i",
    "X2 20d",
    "X2 M35i",
    "X3 20i",
    "X3 20d",
    "X3 30i",
    "X3 30d",
    "X3 M40i",
    "X3 M40d",
    "X3M",
    "X4 20i",
    "X4 20d",
    "X4 30i",
    "X4 30d",
    "X4 M40i",
    "X4 M40d",
    "X4M",
    "X5 30i",
    "X5 30d",
    "X5 40i",
    "X5 40d",
    "X5 45e",
    "X5 M50i",
    "X5 M50d",
    "X5M",
    "X6 30i",
    "X6 30d",
    "X6 40i",
    "X6 40d",
    "X6 M50i",
    "X6 M50d",
    "X6M",
    "X7 30d",
    "X7 40i",
    "X7 40d",
    "X7 50i",
    "X7 M50i",
    "X7M",
    // Z & M
    "Z4 20i",
    "Z4 30i",
    "Z4 M40i",
    "M2",
    "M3",
    "M4",
    "M5",
    "M8",
    "XM",
  ],

  /* ------- Mercedes-Benz ------- */
  "Mercedes-Benz": [
    // A
    "A160",
    "A180",
    "A200",
    "A220",
    "A250",
    "A35 AMG",
    "A45 AMG",
    // C
    "C160",
    "C180",
    "C200",
    "C220d",
    "C250",
    "C300",
    "C350e",
    "C350d",
    "C400",
    "C43 AMG",
    "C63 AMG",
    // E
    "E200",
    "E220d",
    "E250",
    "E300",
    "E300e",
    "E300de",
    "E350",
    "E350d",
    "E350e",
    "E400",
    "E450",
    "E43 AMG",
    "E53 AMG",
    "E63 AMG",
    // S
    "S350d",
    "S400",
    "S450",
    "S500",
    "S560",
    "S580",
    "S63 AMG",
    "S65 AMG",
    // CLA
    "CLA180",
    "CLA200",
    "CLA220",
    "CLA250",
    "CLA35 AMG",
    "CLA45 AMG",
    // CLS
    "CLS300",
    "CLS350",
    "CLS350d",
    "CLS400",
    "CLS450",
    "CLS53 AMG",
    "CLS63 AMG",
    // GLA
    "GLA180",
    "GLA200",
    "GLA220",
    "GLA250",
    "GLA35 AMG",
    "GLA45 AMG",
    // GLC
    "GLC200",
    "GLC220d",
    "GLC250",
    "GLC300",
    "GLC300e",
    "GLC350e",
    "GLC43 AMG",
    "GLC63 AMG",
    // GLE
    "GLE300d",
    "GLE350",
    "GLE350d",
    "GLE400",
    "GLE450",
    "GLE500",
    "GLE53 AMG",
    "GLE63 AMG",
    // GLS
    "GLS350d",
    "GLS400",
    "GLS450",
    "GLS500",
    "GLS580",
    "GLS63 AMG",
    // G
    "G350d",
    "G400",
    "G500",
    "G63 AMG",
    "G65 AMG",
    // EQ
    "EQA",
    "EQB",
    "EQC",
    "EQE",
    "EQE SUV",
    "EQS",
    "EQS SUV",
    "EQG",
    // AMG GT
    "GT 43",
    "GT 53",
    "GT 63",
    "GT 63 S",
  ],

  /* ------- Audi ------- */
  Audi: [
    // A1
    "A1 25 TFSI",
    "A1 30 TFSI",
    "A1 35 TFSI",
    "A1 40 TFSI",
    // A3
    "A3 30 TFSI",
    "A3 30 TDI",
    "A3 35 TFSI",
    "A3 35 TDI",
    "A3 40 TFSI",
    "A3 40 TDI",
    "S3",
    "RS3",
    // A4
    "A4 30 TFSI",
    "A4 30 TDI",
    "A4 35 TFSI",
    "A4 35 TDI",
    "A4 40 TFSI",
    "A4 40 TDI",
    "A4 45 TFSI",
    "S4",
    "RS4",
    // A5
    "A5 35 TFSI",
    "A5 35 TDI",
    "A5 40 TFSI",
    "A5 40 TDI",
    "A5 45 TFSI",
    "S5",
    "RS5",
    // A6
    "A6 35 TDI",
    "A6 40 TDI",
    "A6 45 TFSI",
    "A6 50 TDI",
    "A6 55 TFSI",
    "S6",
    "RS6",
    // A7
    "A7 45 TFSI",
    "A7 50 TDI",
    "A7 55 TFSI",
    "S7",
    "RS7",
    // A8
    "A8 50 TDI",
    "A8 55 TFSI",
    "A8 60 TFSI",
    "S8",
    // Q2
    "Q2 30 TFSI",
    "Q2 30 TDI",
    "Q2 35 TFSI",
    "Q2 35 TDI",
    // Q3
    "Q3 30 TFSI",
    "Q3 30 TDI",
    "Q3 35 TFSI",
    "Q3 35 TDI",
    "Q3 40 TFSI",
    "Q3 40 TDI",
    "SQ3",
    "RSQ3",
    // Q5
    "Q5 35 TDI",
    "Q5 40 TDI",
    "Q5 45 TFSI",
    "Q5 50 TDI",
    "Q5 55 TFSI",
    "SQ5",
    "RSQ5",
    // Q7
    "Q7 45 TDI",
    "Q7 50 TDI",
    "Q7 55 TFSI",
    "Q7 60 TFSI",
    "SQ7",
    "RSQ7",
    // Q8
    "Q8 45 TDI",
    "Q8 50 TDI",
    "Q8 55 TFSI",
    "SQ8",
    "RSQ8",
    // e-tron
    "e-tron 50",
    "e-tron 55",
    "e-tron GT",
    "RS e-tron GT",
  ],

  /* ------- VW ------- */
  Volkswagen: [
    // Polo
    "Polo 1.0 MPI",
    "Polo 1.0 TSI",
    "Polo 1.5 TSI",
    "Polo GTI",
    // Golf
    "Golf 1.0 TSI",
    "Golf 1.5 TSI",
    "Golf 2.0 TDI",
    "Golf GTE",
    "Golf GTI",
    "Golf R",
    // T-Roc
    "T-Roc 1.0 TSI",
    "T-Roc 1.5 TSI",
    "T-Roc 2.0 TDI",
    "T-Roc R",
    // Tiguan
    "Tiguan 1.4 TSI",
    "Tiguan 1.5 TSI",
    "Tiguan 2.0 TDI",
    "Tiguan 2.0 TSI",
    "Tiguan R",
    // Passat
    "Passat 1.5 TSI",
    "Passat 2.0 TDI",
    "Passat 2.0 TSI",
    "Passat GTE",
    "Passat R36",
    // Arteon
    "Arteon 1.5 TSI",
    "Arteon 2.0 TDI",
    "Arteon 2.0 TSI",
    "Arteon R",
    // Touareg
    "Touareg 3.0 TDI",
    "Touareg 3.0 TSI",
    "Touareg R",
    // ID
    "ID.3",
    "ID.4",
    "ID.5",
    "ID.Buzz",
  ],

  /* ------- Mercedes-AMG ------- */
  "Mercedes-AMG": [
    "A 35",
    "A 45 S",
    "CLA 35",
    "CLA 45 S",
    "C 43",
    "C 63",
    "C 63 S",
    "E 53",
    "E 63",
    "E 63 S",
    "S 63",
    "S 65",
    "GLE 53",
    "GLE 63",
    "GLE 63 S",
    "GLC 43",
    "GLC 63",
    "GLC 63 S",
    "GT 43",
    "GT 53",
    "GT 63",
    "GT 63 S",
    "GT R",
    "GT R Pro",
    "GT Black Series",
  ],

  /* ------- Mini ------- */
  Mini: [
    "One",
    "Cooper",
    "Cooper S",
    "John Cooper Works",
    "Clubman One",
    "Clubman Cooper",
    "Clubman Cooper S",
    "Clubman JCW",
    "Countryman One",
    "Countryman Cooper",
    "Countryman Cooper S",
    "Countryman JCW",
    "Paceman Cooper",
    "Paceman Cooper S",
    "Paceman JCW",
    "Convertible Cooper",
    "Convertible Cooper S",
    "Convertible JCW",
  ],

  /* ------- Toyota ------- */
  Toyota: [
    // Yaris
    "Yaris 1.0",
    "Yaris 1.5 Hybrid",
    "Yaris GR",
    // Corolla
    "Corolla 1.8 Hybrid",
    "Corolla 2.0 Hybrid",
    "Corolla GR",
    // Camry
    "Camry 2.5 Hybrid",
    "Camry 3.5",
    // C-HR
    "C-HR 1.8 Hybrid",
    "C-HR 2.0 Hybrid",
    "C-HR GR Sport",
    // RAV4
    "RAV4 2.0",
    "RAV4 2.5 Hybrid",
    "RAV4 Plug-in",
    "RAV4 GR Sport",
    // Highlander
    "Highlander 2.5 Hybrid",
    // Hilux
    "Hilux 2.4 D",
    "Hilux 2.8 D",
    "Hilux GR Sport",
    // Land Cruiser
    "Land Cruiser 2.8 D",
    "Land Cruiser 3.0 D",
    "Land Cruiser GR Sport",
    // Prius
    "Prius 1.8 Hybrid",
    "Prius Plug-in",
    // Supra
    "Supra 2.0",
    "Supra 3.0",
    "Supra GR",
    // GR86
    "GR86 2.4",
  ],

  /* ------- Honda ------- */
  Honda: [
    // Jazz
    "Jazz 1.3",
    "Jazz 1.5 Hybrid",
    "Jazz Crosstar",
    // Civic
    "Civic 1.0 Turbo",
    "Civic 1.5 Turbo",
    "Civic 2.0 e:HEV",
    "Civic Type R",
    // Accord
    "Accord 1.5 Turbo",
    "Accord 2.0 e:HEV",
    // HR-V
    "HR-V 1.5",
    "HR-V 1.5 e:HEV",
    // CR-V
    "CR-V 1.5 Turbo",
    "CR-V 2.0 e:HEV",
    "CR-V Plug-in",
    // e
    "e Advance",
  ],

  /* ------- Nissan ------- */
  Nissan: [
    // Micra
    "Micra 1.0",
    "Micra 1.0 IG-T",
    // Juke
    "Juke 1.0 DIG-T",
    "Juke 1.6 Hybrid",
    // Qashqai
    "Qashqai 1.3 DIG-T",
    "Qashqai 1.5 e-Power",
    "Qashqai 1.6 dCi",
    // X-Trail
    "X-Trail 1.5 e-Power",
    "X-Trail 1.6 dCi",
    "X-Trail 2.0 dCi",
    // Leaf
    "Leaf 40 kWh",
    "Leaf 62 kWh",
    // Ariya
    "Ariya 63 kWh",
    "Ariya 87 kWh",
    // Z
    "Z 3.0 Twin-Turbo",
    // GT-R
    "GT-R 3.8 Twin-Turbo",
  ],

  /* ------- Ford ------- */
  Ford: [
    // Fiesta
    "Fiesta 1.0 EcoBoost",
    "Fiesta 1.5 EcoBoost ST",
    // Focus
    "Focus 1.0 EcoBoost",
    "Focus 1.5 EcoBoost",
    "Focus 2.0 EcoBlue",
    "Focus ST",
    "Focus RS",
    // Puma
    "Puma 1.0 EcoBoost",
    "Puma 1.5 EcoBoost ST",
    // Kuga
    "Kuga 1.5 EcoBoost",
    "Kuga 2.0 EcoBlue",
    "Kuga 2.5 PHEV",
    // Mondeo
    "Mondeo 1.5 EcoBoost",
    "Mondeo 2.0 EcoBlue",
    // Mustang
    "Mustang 2.3 EcoBoost",
    "Mustang 5.0 V8",
    "Mustang Mach 1",
    "Mustang GT500",
    // Ranger
    "Ranger 2.0 EcoBlue",
    "Ranger 3.0 V6",
    "Ranger Raptor",
  ],

  /* ------- Opel / Vauxhall ------- */
  Opel: [
    // Corsa
    "Corsa 1.2",
    "Corsa 1.2 Turbo",
    "Corsa-e",
    // Astra
    "Astra 1.2 Turbo",
    "Astra 1.5 Diesel",
    "Astra GSe PHEV",
    "Astra OPC",
    // Insignia
    "Insignia 1.5 Turbo",
    "Insignia 2.0 Diesel",
    "Insignia OPC",
    // Mokka
    "Mokka 1.2 Turbo",
    "Mokka-e",
    // Grandland
    "Grandland 1.2 Turbo",
    "Grandland 1.6 PHEV",
    "Grandland OPC",
  ],

  /* ------- Peugeot ------- */
  Peugeot: [
    // 208
    "208 1.2 PureTech",
    "208 1.5 BlueHDi",
    "208-e",
    // 308
    "308 1.2 PureTech",
    "308 1.5 BlueHDi",
    "308 PHEV",
    "308 GTI",
    // 508
    "508 1.6 PureTech",
    "508 2.0 BlueHDi",
    "508 PHEV",
    "508 PSE",
    // 2008
    "2008 1.2 PureTech",
    "2008 1.5 BlueHDi",
    "2008-e",
    // 3008
    "3008 1.6 PureTech",
    "3008 2.0 BlueHDi",
    "3008 PHEV",
    // 5008
    "5008 1.6 PureTech",
    "5008 2.0 BlueHDi",
  ],

  /* ------- Citroën ------- */
  Citroën: [
    // C3
    "C3 1.2 PureTech",
    "C3 1.5 BlueHDi",
    // C4
    "C4 1.2 PureTech",
    "C4 1.5 BlueHDi",
    "C4-e",
    // C5
    "C5 1.6 PureTech",
    "C5 2.0 BlueHDi",
    "C5 PHEV",
    // Berlingo
    "Berlingo 1.2 PureTech",
    "Berlingo 1.5 BlueHDi",
    // ë-C4
    "ë-C4",
  ],

  /* ------- Renault ------- */
  Renault: [
    // Clio
    "Clio 1.0 SCe",
    "Clio 1.3 TCe",
    "Clio 1.5 Blue dCi",
    // Captur
    "Captur 1.3 TCe",
    "Captur 1.5 Blue dCi",
    "Captur E-Tech PHEV",
    // Megane
    "Megane 1.3 TCe",
    "Megane 1.5 Blue dCi",
    "Megane E-Tech PHEV",
    "Megane RS",
    // Arkana
    "Arkana 1.3 TCe",
    "Arkana E-Tech",
    // Austral
    "Austral 1.2 TCe",
    "Austral E-Tech",
    // Scenic
    "Scenic 1.3 TCe",
    "Scenic E-Tech",
  ],

  /* ------- Fiat ------- */
  Fiat: [
    // 500
    "500 1.0 Hybrid",
    "500e",
    // Panda
    "Panda 1.0 Hybrid",
    "Panda Cross",
    // Tipo
    "Tipo 1.4",
    "Tipo 1.6 Diesel",
    // 500X
    "500X 1.0 Turbo",
    "500X 1.3 Turbo",
    // Ducato
    "Ducato 2.2 Multijet",
  ],

  /* ------- Škoda ------- */
  Škoda: [
    // Fabia
    "Fabia 1.0 MPI",
    "Fabia 1.0 TSI",
    // Scala
    "Scala 1.0 TSI",
    "Scala 1.5 TSI",
    // Octavia
    "Octavia 1.5 TSI",
    "Octavia 2.0 TDI",
    "Octavia 1.4 PHEV",
    "Octavia RS",
    // Superb
    "Superb 1.5 TSI",
    "Superb 2.0 TDI",
    "Superb 2.0 TSI",
    "Superb 2.0 PHEV",
    // Kamiq
    "Kamiq 1.0 TSI",
    // Karoq
    "Karoq 1.5 TSI",
    "Karoq 2.0 TDI",
    // Kodiaq
    "Kodiaq 1.5 TSI",
    "Kodiaq 2.0 TDI",
    "Kodiaq 2.0 TSI",
    "Kodiaq RS",
    // Enyaq
    "Enyaq 60",
    "Enyaq 80",
    "Enyaq RS",
  ],

  /* ------- Seat / Cupra ------- */
  Seat: [
    // Ibiza
    "Ibiza 1.0 MPI",
    "Ibiza 1.0 TSI",
    // Arona
    "Arona 1.0 TSI",
    "Arona 1.5 TSI",
    // Leon
    "Leon 1.5 TSI",
    "Leon 2.0 TDI",
    "Leon 1.4 PHEV",
    "Leon Cupra",
    // Ateca
    "Ateca 1.5 TSI",
    "Ateca 2.0 TDI",
    "Ateca Cupra",
    // Tarraco
    "Tarraco 1.5 TSI",
    "Tarraco 2.0 TDI",
    "Tarraco 2.0 TSI",
  ],

  /* ------- Hyundai ------- */
  Hyundai: [
    // i10
    "i10 1.0",
    "i10 1.2",
    // i20
    "i20 1.2",
    "i20 1.0 T-GDi",
    "i20 N",
    // i30
    "i30 1.0 T-GDi",
    "i30 1.5 T-GDi",
    "i30 1.6 CRDi",
    "i30 N",
    // Kona
    "Kona 1.0 T-GDi",
    "Kona 1.6 CRDi",
    "Kona 1.6 T-GDi",
    "Kona Electric",
    "Kona N",
    // Tucson
    "Tucson 1.6 GDi",
    "Tucson 1.6 CRDi",
    "Tucson 1.6 T-GDi",
    "Tucson 2.0 CRDi",
    "Tucson PHEV",
    "Tucson N Line",
    // Santa Fe
    "Santa Fe 2.2 CRDi",
    "Santa Fe 2.5 GDi",
    "Santa Fe PHEV",
    // Ioniq
    "Ioniq Hybrid",
    "Ioniq Plug-in",
    "Ioniq 5",
    "Ioniq 6",
  ],

  /* ------- Kia ------- */
  Kia: [
    // Picanto
    "Picanto 1.0",
    "Picanto 1.2",
    "Picanto GT-Line",
    // Rio
    "Rio 1.2",
    "Rio 1.0 T-GDi",
    // Stonic
    "Stonic 1.0 T-GDi",
    "Stonic 1.6 CRDi",
    // Ceed
    "Ceed 1.0 T-GDi",
    "Ceed 1.5 T-GDi",
    "Ceed 1.6 CRDi",
    "Ceed GT",
    // XCeed
    "XCeed 1.0 T-GDi",
    "XCeed 1.5 T-GDi",
    "XCeed 1.6 CRDi",
    "XCeed PHEV",
    // Sportage
    "Sportage 1.6 GDi",
    "Sportage 1.6 CRDi",
    "Sportage 1.6 T-GDi",
    "Sportage 2.0 CRDi",
    "Sportage PHEV",
    "Sportage GT-Line",
    // Sorento
    "Sorento 2.2 CRDi",
    "Sorento 2.5 GDi",
    "Sorento PHEV",
    // EV
    "EV6",
    "EV9",
  ],

  /* ------- Mazda ------- */
  Mazda: [
    // 2
    "2 1.5",
    "2 Hybrid",
    // 3
    "3 2.0 e-Skyactiv",
    "3 2.5 e-Skyactiv",
    "3 1.8 d",
    "3 Turbo",
    // 6
    "6 2.0",
    "6 2.5",
    "6 2.2 d",
    // CX-3
    "CX-3 2.0",
    // CX-30
    "CX-30 2.0 e-Skyactiv",
    "CX-30 2.5 e-Skyactiv",
    "CX-30 1.8 d",
    "CX-30 Turbo",
    // CX-5
    "CX-5 2.0",
    "CX-5 2.5",
    "CX-5 2.2 d",
    "CX-5 Turbo",
    // CX-60
    "CX-60 2.5 PHEV",
    "CX-60 3.3 d",
    // MX-30
    "MX-30 EV",
    "MX-30 R-EV",
    // MX-5
    "MX-5 1.5",
    "MX-5 2.0",
    "MX-5 RF",
  ],

  /* ------- Subaru ------- */
  Subaru: [
    // Impreza
    "Impreza 1.6",
    "Impreza 2.0 e-Boxer",
    // XV / Crosstrek
    "XV 1.6",
    "XV 2.0 e-Boxer",
    // Forester
    "Forester 2.0 e-Boxer",
    "Forester 2.5",
    // Outback
    "Outback 2.5",
    "Outback 2.4 Turbo",
    // WRX
    "WRX 2.4 Turbo",
    "WRX STI",
    // BRZ
    "BRZ 2.4",
  ],

  /* ------- Mitsubishi ------- */
  Mitsubishi: [
    // Mirage
    "Mirage 1.2",
    // ASX
    "ASX 1.6",
    "ASX 2.0",
    "ASX 2.2 DiD",
    // Eclipse Cross
    "Eclipse Cross 1.5 Turbo",
    "Eclipse Cross 2.2 DiD",
    "Eclipse Cross PHEV",
    // Outlander
    "Outlander 2.0",
    "Outlander 2.4 PHEV",
    "Outlander 2.2 DiD",
    // L200 / Triton
    "L200 2.4 DiD",
  ],

  /* ------- Suzuki ------- */
  Suzuki: [
    // Swift
    "Swift 1.2",
    "Swift 1.0 BoosterJet",
    "Swift Sport",
    // Ignis
    "Ignis 1.2",
    "Ignis 1.2 Hybrid",
    // Baleno
    "Baleno 1.0 BoosterJet",
    // Vitara
    "Vitara 1.4 BoosterJet",
    "Vitara 1.6 DDiS",
    // S-Cross
    "S-Cross 1.4 BoosterJet",
    "S-Cross 1.6 DDiS",
    // Jimny
    "Jimny 1.5",
  ],

  /* ------- Lexus ------- */
  Lexus: [
    // UX
    "UX 250h",
    "UX 300e",
    // NX
    "NX 350h",
    "NX 450h+",
    // RX
    "RX 350h",
    "RX 500h",
    "RX 450h+",
    // ES
    "ES 300h",
    // IS
    "IS 300h",
    // LS
    "LS 500h",
    // RC
    "RC 300h",
    "RC F",
    // LC
    "LC 500h",
    "LC 500",
    // LX
    "LX 600",
  ],

  /* ------- Infiniti // Tipo
    "Tipo 1.4","Tipo 1.6 Diesel",
    // 500X
    "500X 1.0 Turbo","500X 1.3 Turbo",
    // 500L
    "500L 1.4","500L 1.6 Diesel",
    // Ducato
    "Ducato 2.2 Diesel","Ducato 2.3 Diesel"
  ],

  /* ------- Volvo ------- */
  Volvo: [
    // XC40
    "XC40 B4",
    "XC40 T4",
    "XC40 T5",
    "XC40 Recharge",
    // XC60
    "XC60 B5",
    "XC60 T6",
    "XC60 T8 Recharge",
    // XC90
    "XC90 B5",
    "XC90 T6",
    "XC90 T8 Recharge",
    // S60
    "S60 B4",
    "S60 T6",
    "S60 T8 Recharge",
    // S90
    "S90 B5",
    "S90 T6",
    "S90 T8 Recharge",
    // V60
    "V60 B4",
    "V60 T6",
    "V60 T8 Recharge",
    // V90
    "V90 B5",
    "V90 T6",
    "V90 T8 Recharge",
    // C40
    "C40 Recharge",
    // EX30
    "EX30",
    // EX90
    "EX90",
  ],
};
