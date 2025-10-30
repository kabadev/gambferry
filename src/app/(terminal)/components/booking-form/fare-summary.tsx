"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Route } from "@/lib/data";
import {
  PASSENGER_TARIFFS,
  PRIVATE_VEHICLE_TARIFFS,
  COMMERCIAL_VEHICLE_TARIFFS,
  LIVESTOCK_TARIFFS,
  CARGO_TARIFFS,
  EXCHANGE_RATE_GMD_TO_CFA,
  calculateForeignVehicleTariff,
} from "@/lib/tariffs";

type FareData = {
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

type Props = {
  formData: any;
  currency: "GMD" | "CFA";
  onCurrencyChange: (currency: "GMD" | "CFA") => void;
};

export function FareSummary({ formData, currency, onCurrencyChange }: Props) {
  const calculateFare = () => {
    let total = 0;
    const breakdown: Array<{ label: string; amount: number }> = [];

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
      } else {
        // Private vehicle tariffs
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

    return { total, breakdown };
  };

  const { total: fareGMD, breakdown } = calculateFare();
  const fareCFA = fareGMD * EXCHANGE_RATE_GMD_TO_CFA;
  const displayFare = currency === "GMD" ? fareGMD : fareCFA;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Fare Summary</CardTitle>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant={currency === "GMD" ? "default" : "outline"}
              onClick={() => onCurrencyChange("GMD")}
            >
              GMD
            </Button>
            <Button
              type="button"
              size="sm"
              variant={currency === "CFA" ? "default" : "outline"}
              onClick={() => onCurrencyChange("CFA")}
            >
              CFA
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Route:</span>
            <span className="font-medium">{formData.route?.route_name}</span>
          </div>
          {breakdown.map((item, index) => (
            <div key={index} className="flex justify-between">
              <span className="text-muted-foreground">{item.label}:</span>
              <span className="font-medium">
                {currency === "GMD" ? "D" : "CFA"}{" "}
                {(currency === "GMD"
                  ? item.amount
                  : item.amount * EXCHANGE_RATE_GMD_TO_CFA
                ).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t pt-3">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total Fare:</span>
            <span className="text-2xl font-bold text-primary">
              {currency === "GMD" ? "D" : "CFA"} {displayFare.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
