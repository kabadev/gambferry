"use server";

import {
  PASSENGER_TARIFFS,
  PRIVATE_VEHICLE_TARIFFS,
  COMMERCIAL_VEHICLE_TARIFFS,
  LIVESTOCK_TARIFFS,
  CARGO_TARIFFS,
  EXCHANGE_RATE_GMD_TO_CFA,
  calculateForeignVehicleTariff,
} from "@/lib/tariffs";

export type FareData = {
  passenger_type: "Economy" | "VIP" | "Bicycle";
  num_passengers: number;
  vehicle_type?: string;
  vehicle_weight_tons?: number;
  vehicle_length_meters?: number;
  commercial_pax?: number;
  cattle?: number;
  sheep_goats?: number;
  rice_bags?: number;
  groundnut_bags?: number;
  cement_bags?: number;
  cartons?: number;
};

export type FareBreakdown = {
  label: string;
  amount: number;
};

export type FareCalculationResult = {
  totalGMD: number;
  totalCFA: number;
  breakdown: FareBreakdown[];
};

export async function calculateFare(
  formData: FareData
): Promise<FareCalculationResult> {
  let total = 0;
  const breakdown: FareBreakdown[] = [];

  // Passenger fare using official tariffs
  if (formData.passenger_type === "Bicycle") {
    total += PASSENGER_TARIFFS.Bicycle;
    breakdown.push({
      label: "Bicycle (including rider)",
      amount: PASSENGER_TARIFFS.Bicycle,
    });
  } else if (formData.passenger_type === "VIP") {
    const amount = PASSENGER_TARIFFS.VIP * formData.num_passengers;
    total += amount;
    breakdown.push({
      label: `VIP Passengers (${formData.num_passengers})`,
      amount,
    });
  } else {
    const amount = PASSENGER_TARIFFS.Economy * formData.num_passengers;
    total += amount;
    breakdown.push({
      label: `Economy Passengers (${formData.num_passengers})`,
      amount,
    });
  }

  // Vehicle tariffs
  if (formData.vehicle_type && formData.vehicle_type !== "none") {
    let vehicleAmount = 0;

    if (formData.vehicle_type === "Foreign Vehicle") {
      // Weight-based pricing for foreign vehicles
      if (formData.vehicle_weight_tons && formData.vehicle_length_meters) {
        vehicleAmount = calculateForeignVehicleTariff(
          formData.vehicle_weight_tons,
          formData.vehicle_length_meters
        );
        breakdown.push({
          label: `Foreign Vehicle (${formData.vehicle_weight_tons}t × ${formData.vehicle_length_meters}m)`,
          amount: vehicleAmount,
        });
      }
    } else if (formData.vehicle_type.startsWith("Commercial")) {
      // Commercial vehicle tariffs
      const commercialKey = formData.vehicle_type.replace(
        "Commercial ",
        ""
      ) as keyof typeof COMMERCIAL_VEHICLE_TARIFFS;
      vehicleAmount = COMMERCIAL_VEHICLE_TARIFFS[commercialKey] || 0;
      breakdown.push({
        label: `Commercial Vehicle (${commercialKey})`,
        amount: vehicleAmount,
      });
    } else if (formData.vehicle_type === "Taxi Baggage (Empty)") {
      // Taxi Baggage is in commercial vehicle section
      vehicleAmount = COMMERCIAL_VEHICLE_TARIFFS["Taxi Baggage (Empty)"];
      breakdown.push({ label: "Taxi Baggage (Empty)", amount: vehicleAmount });
    } else {
      // Private vehicle tariffs (includes everything from Motorcycle to Dem Dikk)
      vehicleAmount =
        PRIVATE_VEHICLE_TARIFFS[
          formData.vehicle_type as keyof typeof PRIVATE_VEHICLE_TARIFFS
        ] || 0;
      breakdown.push({
        label: `${formData.vehicle_type}`,
        amount: vehicleAmount,
      });
    }

    total += vehicleAmount;
  }

  // Livestock
  if (formData.cattle && formData.cattle > 0) {
    const amount = formData.cattle * LIVESTOCK_TARIFFS["Cattle per Head"];
    total += amount;
    breakdown.push({ label: `Cattle (${formData.cattle} head)`, amount });
  }
  if (formData.sheep_goats && formData.sheep_goats > 0) {
    const amount =
      formData.sheep_goats * LIVESTOCK_TARIFFS["Sheep/Goat per Head"];
    total += amount;
    breakdown.push({
      label: `Sheep/Goats (${formData.sheep_goats} head)`,
      amount,
    });
  }

  // Cargo
  const totalBags =
    (formData.rice_bags || 0) +
    (formData.groundnut_bags || 0) +
    (formData.cement_bags || 0);
  if (totalBags > 0) {
    const amount = totalBags * CARGO_TARIFFS["Rice/Groundnut/Cement (50kg)"];
    total += amount;
    breakdown.push({
      label: `Rice/Groundnut/Cement (${totalBags} bags)`,
      amount,
    });
  }
  if (formData.cartons && formData.cartons > 0) {
    const amount =
      formData.cartons * CARGO_TARIFFS["Pre-packed Carton/Package (Medium)"];
    total += amount;
    breakdown.push({ label: `Cartons (${formData.cartons})`, amount });
  }

  return {
    totalGMD: total,
    totalCFA: total * EXCHANGE_RATE_GMD_TO_CFA,
    breakdown,
  };
}
