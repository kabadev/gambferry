// Official Gambia Ferry Services Company Ltd Tariffs
// Effective 10th July 2025 - Banjul/Barra Route

export const PASSENGER_TARIFFS = {
  VIP: 625, // VIP onboard Kunta Kinteh
  Economy: 65,
  Bicycle: 125, // Including rider
} as const;

// PRIVATE VEHICLE section includes everything from Motorcycle to Dem Dikk
export const PRIVATE_VEHICLE_TARIFFS = {
  Motorcycle: 250, // Including rider
  "Saloon Car": 1250, // Saloon Cars & Double Cabin Only
  "Car and Trailer": 2500,
  "Tractor (Head)": 1250,
  "Tractor & Trailer": 2500,
  "Premium/Priority Pass (VIP)": 3000,
  "Priority Pass for Perishable": 3000,
  "Dem Dikk (All Inclusive)": 8600,
} as const;

export const COMMERCIAL_VEHICLE_TARIFFS = {
  "1 to 14 PAX": 1250,
  "15 to 20 PAX": 1900,
  "21 to 35 PAX": 2500,
  "36 to 44 PAX Mini Van": 4350,
  "45 to Above": 5000,
  "Taxi Baggage (Empty)": 2500,
} as const;

export const CARGO_TARIFFS = {
  "Rice/Groundnut/Cement (50kg)": 65,
  "Pre-packed Carton/Package (Medium)": 125,
} as const;

export const LIVESTOCK_TARIFFS = {
  "Cattle per Head": 250,
  "Sheep/Goat per Head": 200,
} as const;

// Foreign Vehicles Weight-Based Tariff Matrix
// Weight in tons (rows) × Length in meters (columns)
export const FOREIGN_VEHICLE_WEIGHT_TARIFF = {
  // Weight ranges and their base prices by length
  "5-8": {
    10: 2500,
    11: 2675,
    12: 2850,
    13: 3025,
    14: 3200,
    15: 3375,
    16: 3550,
    17: 3725,
    18: 3900,
  },
  "9": {
    10: 2680,
    11: 2855,
    12: 3040,
    13: 3215,
    14: 3390,
    15: 3565,
    16: 3740,
    17: 3915,
    18: 4090,
  },
  "10": {
    10: 2880,
    11: 3055,
    12: 3230,
    13: 3405,
    14: 3580,
    15: 3755,
    16: 3930,
    17: 4105,
    18: 4280,
  },
  "11": {
    10: 3070,
    11: 3245,
    12: 3420,
    13: 3595,
    14: 3770,
    15: 3945,
    16: 4120,
    17: 4295,
    18: 4470,
  },
  "12": {
    10: 3260,
    11: 3435,
    12: 3610,
    13: 3785,
    14: 3960,
    15: 4135,
    16: 4310,
    17: 4485,
    18: 4660,
  },
  "13-20": {
    10: 3750,
    11: 3925,
    12: 4100,
    13: 4275,
    14: 4450,
    15: 4625,
    16: 4800,
    17: 4975,
    18: 5150,
  },
  "21": {
    10: 3925,
    11: 4100,
    12: 4275,
    13: 4450,
    14: 4625,
    15: 4800,
    16: 4975,
    17: 5150,
    18: 5325,
  },
  "22": {
    10: 4100,
    11: 4275,
    12: 4450,
    13: 4625,
    14: 4800,
    15: 4975,
    16: 5150,
    17: 5325,
    18: 5500,
  },
  "23": {
    10: 4275,
    11: 4450,
    12: 4625,
    13: 4800,
    14: 4975,
    15: 5150,
    16: 5325,
    17: 5500,
    18: 5675,
  },
  "24": {
    10: 4450,
    11: 4625,
    12: 4800,
    13: 4975,
    14: 5150,
    15: 5325,
    16: 5500,
    17: 5675,
    18: 5850,
  },
  "25": {
    10: 4625,
    11: 4800,
    12: 4975,
    13: 5150,
    14: 5325,
    15: 5500,
    16: 5675,
    17: 5850,
    18: 6025,
  },
  "26": {
    10: 4800,
    11: 4975,
    12: 5150,
    13: 5325,
    14: 5500,
    15: 5675,
    16: 5850,
    17: 6025,
    18: 6200,
  },
  "27": {
    10: 4975,
    11: 5150,
    12: 5325,
    13: 5500,
    14: 5675,
    15: 5850,
    16: 6025,
    17: 6200,
    18: 6375,
  },
  "28": {
    10: 5150,
    11: 5325,
    12: 5500,
    13: 5675,
    14: 5850,
    15: 6025,
    16: 6200,
    17: 6375,
    18: 6550,
  },
  "29": {
    10: 5325,
    11: 5500,
    12: 5675,
    13: 5850,
    14: 6025,
    15: 6200,
    16: 6375,
    17: 6550,
    18: 6725,
  },
  "30": {
    10: 5500,
    11: 5675,
    12: 5850,
    13: 6025,
    14: 6200,
    15: 6375,
    16: 6550,
    17: 6725,
    18: 6900,
  },
  "31": {
    10: 5675,
    11: 5850,
    12: 6025,
    13: 6200,
    14: 6375,
    15: 6550,
    16: 6725,
    17: 6900,
    18: 7075,
  },
  "32": {
    10: 5850,
    11: 6025,
    12: 6200,
    13: 6375,
    14: 6550,
    15: 6725,
    16: 6900,
    17: 7075,
    18: 7250,
  },
  "33": {
    10: 6025,
    11: 6200,
    12: 6375,
    13: 6550,
    14: 6725,
    15: 6900,
    16: 7075,
    17: 7250,
    18: 7425,
  },
  "34": {
    10: 6200,
    11: 6375,
    12: 6550,
    13: 6725,
    14: 6900,
    15: 7075,
    16: 7250,
    17: 7425,
    18: 7600,
  },
  "35": {
    10: 6375,
    11: 6550,
    12: 6725,
    13: 6900,
    14: 7075,
    15: 7250,
    16: 7425,
    17: 7600,
    18: 7775,
  },
  "36": {
    10: 6550,
    11: 6725,
    12: 6900,
    13: 7075,
    14: 7250,
    15: 7425,
    16: 7600,
    17: 7775,
    18: 7950,
  },
  "37": {
    10: 6725,
    11: 6900,
    12: 7075,
    13: 7250,
    14: 7425,
    15: 7600,
    16: 7775,
    17: 7950,
    18: 8125,
  },
  "38": {
    10: 6900,
    11: 7075,
    12: 7250,
    13: 7425,
    14: 7600,
    15: 7775,
    16: 7950,
    17: 8125,
    18: 8300,
  },
  "39": {
    10: 7075,
    11: 7250,
    12: 7425,
    13: 7600,
    14: 7775,
    15: 7950,
    16: 8125,
    17: 8300,
    18: 8475,
  },
  "40": {
    10: 7250,
    11: 7425,
    12: 7600,
    13: 7775,
    14: 7950,
    15: 8125,
    16: 8300,
    17: 8475,
    18: 8650,
  },
  "41": {
    10: 7425,
    11: 7600,
    12: 7775,
    13: 7950,
    14: 8125,
    15: 8300,
    16: 8475,
    17: 8650,
    18: 8825,
  },
  "42": {
    10: 7600,
    11: 7775,
    12: 7950,
    13: 8125,
    14: 8300,
    15: 8475,
    16: 8650,
    17: 8825,
    18: 9000,
  },
  "43": {
    10: 7775,
    11: 7950,
    12: 8125,
    13: 8300,
    14: 8475,
    15: 8650,
    16: 8825,
    17: 9000,
    18: 9175,
  },
  "44": {
    10: 7950,
    11: 8125,
    12: 8300,
    13: 8475,
    14: 8650,
    15: 8825,
    16: 9000,
    17: 9175,
    18: 9350,
  },
  "45": {
    10: 8125,
    11: 8300,
    12: 8475,
    13: 8650,
    14: 8825,
    15: 9000,
    16: 9175,
    17: 9350,
    18: 9525,
  },
  "46": {
    10: 8300,
    11: 8475,
    12: 8650,
    13: 8825,
    14: 9000,
    15: 9175,
    16: 9350,
    17: 9525,
    18: 9700,
  },
  "47": {
    10: 8475,
    11: 8650,
    12: 8825,
    13: 9000,
    14: 9175,
    15: 9350,
    16: 9525,
    17: 9700,
    18: 9875,
  },
  "48": {
    10: 8650,
    11: 8825,
    12: 9000,
    13: 9175,
    14: 9350,
    15: 9525,
    16: 9700,
    17: 9875,
    18: 10050,
  },
  "49": {
    10: 8825,
    11: 9000,
    12: 9175,
    13: 9350,
    14: 9525,
    15: 9700,
    16: 9875,
    17: 10050,
    18: 10225,
  },
  "50": {
    10: 9000,
    11: 9175,
    12: 9350,
    13: 9525,
    14: 9700,
    15: 9875,
    16: 10050,
    17: 10225,
    18: 10400,
  },
  "51": {
    10: 9175,
    11: 9350,
    12: 9525,
    13: 9700,
    14: 9875,
    15: 10050,
    16: 10225,
    17: 10400,
    18: 10575,
  },
  "52": {
    10: 9350,
    11: 9525,
    12: 9700,
    13: 9875,
    14: 10050,
    15: 10225,
    16: 10400,
    17: 10575,
    18: 10750,
  },
  "53": {
    10: 9525,
    11: 9700,
    12: 9875,
    13: 10050,
    14: 10225,
    15: 10400,
    16: 10575,
    17: 10750,
    18: 10925,
  },
  "54": {
    10: 9700,
    11: 9875,
    12: 10050,
    13: 10225,
    14: 10400,
    15: 10575,
    16: 10750,
    17: 10925,
    18: 11100,
  },
  "55": {
    10: 9875,
    11: 10050,
    12: 10225,
    13: 10400,
    14: 10575,
    15: 10750,
    16: 10925,
    17: 11100,
    18: 11275,
  },
  "56": {
    10: 10050,
    11: 10225,
    12: 10400,
    13: 10575,
    14: 10750,
    15: 10925,
    16: 11100,
    17: 11275,
    18: 11450,
  },
  "57": {
    10: 10225,
    11: 10400,
    12: 10575,
    13: 10750,
    14: 10925,
    15: 11100,
    16: 11275,
    17: 11450,
    18: 11625,
  },
  "58": {
    10: 10400,
    11: 10575,
    12: 10750,
    13: 10925,
    14: 11100,
    15: 11275,
    16: 11450,
    17: 11625,
    18: 11800,
  },
  "59": {
    10: 10575,
    11: 10750,
    12: 10925,
    13: 11100,
    14: 11275,
    15: 11450,
    16: 11625,
    17: 11800,
    18: 11975,
  },
  "60": {
    10: 10750,
    11: 10925,
    12: 11100,
    13: 11275,
    14: 11450,
    15: 11625,
    16: 11800,
    17: 11975,
    18: 12150,
  },
  "61": {
    10: 10925,
    11: 11100,
    12: 11275,
    13: 11450,
    14: 11625,
    15: 11800,
    16: 11975,
    17: 12150,
    18: 12325,
  },
  "62": {
    10: 11100,
    11: 11275,
    12: 11450,
    13: 11625,
    14: 11800,
    15: 11975,
    16: 12150,
    17: 12325,
    18: 12500,
  },
  "63": {
    10: 11275,
    11: 11450,
    12: 11625,
    13: 11800,
    14: 11975,
    15: 12150,
    16: 12325,
    17: 12500,
    18: 12675,
  },
  "64": {
    10: 11450,
    11: 11625,
    12: 11800,
    13: 11975,
    14: 12150,
    15: 12325,
    16: 12500,
    17: 12675,
    18: 12850,
  },
  "65+": {
    10: 11625,
    11: 11800,
    12: 11975,
    13: 12150,
    14: 12325,
    15: 12500,
    16: 12675,
    17: 12850,
    18: 13025,
  },
} as const;

// Exchange rate (approximate)
export const EXCHANGE_RATE_GMD_TO_CFA = 100;

// Helper function to calculate foreign vehicle tariff based on weight and length
export function calculateForeignVehicleTariff(
  weightTons: number,
  lengthMeters: number
): number {
  // Find the appropriate weight bracket
  let weightKey = "5-8";

  if (weightTons >= 65) weightKey = "65+";
  else if (weightTons >= 64) weightKey = "64";
  else if (weightTons >= 63) weightKey = "63";
  else if (weightTons >= 62) weightKey = "62";
  else if (weightTons >= 61) weightKey = "61";
  else if (weightTons >= 60) weightKey = "60";
  else if (weightTons >= 59) weightKey = "59";
  else if (weightTons >= 58) weightKey = "58";
  else if (weightTons >= 57) weightKey = "57";
  else if (weightTons >= 56) weightKey = "56";
  else if (weightTons >= 55) weightKey = "55";
  else if (weightTons >= 54) weightKey = "54";
  else if (weightTons >= 53) weightKey = "53";
  else if (weightTons >= 52) weightKey = "52";
  else if (weightTons >= 51) weightKey = "51";
  else if (weightTons >= 50) weightKey = "50";
  else if (weightTons >= 49) weightKey = "49";
  else if (weightTons >= 48) weightKey = "48";
  else if (weightTons >= 47) weightKey = "47";
  else if (weightTons >= 46) weightKey = "46";
  else if (weightTons >= 45) weightKey = "45";
  else if (weightTons >= 44) weightKey = "44";
  else if (weightTons >= 43) weightKey = "43";
  else if (weightTons >= 42) weightKey = "42";
  else if (weightTons >= 41) weightKey = "41";
  else if (weightTons >= 40) weightKey = "40";
  else if (weightTons >= 39) weightKey = "39";
  else if (weightTons >= 38) weightKey = "38";
  else if (weightTons >= 37) weightKey = "37";
  else if (weightTons >= 36) weightKey = "36";
  else if (weightTons >= 35) weightKey = "35";
  else if (weightTons >= 34) weightKey = "34";
  else if (weightTons >= 33) weightKey = "33";
  else if (weightTons >= 32) weightKey = "32";
  else if (weightTons >= 31) weightKey = "31";
  else if (weightTons >= 30) weightKey = "30";
  else if (weightTons >= 29) weightKey = "29";
  else if (weightTons >= 28) weightKey = "28";
  else if (weightTons >= 27) weightKey = "27";
  else if (weightTons >= 26) weightKey = "26";
  else if (weightTons >= 25) weightKey = "25";
  else if (weightTons >= 24) weightKey = "24";
  else if (weightTons >= 23) weightKey = "23";
  else if (weightTons >= 22) weightKey = "22";
  else if (weightTons >= 21) weightKey = "21";
  else if (weightTons >= 13) weightKey = "13-20";
  else if (weightTons >= 12) weightKey = "12";
  else if (weightTons >= 11) weightKey = "11";
  else if (weightTons >= 10) weightKey = "10";
  else if (weightTons >= 9) weightKey = "9";

  // Find the appropriate length (round to nearest meter)
  const lengthKey = Math.min(18, Math.max(10, Math.round(lengthMeters)));

  const tariffRow =
    FOREIGN_VEHICLE_WEIGHT_TARIFF[
      weightKey as keyof typeof FOREIGN_VEHICLE_WEIGHT_TARIFF
    ];
  return tariffRow[lengthKey as keyof typeof tariffRow] || 2500;
}
