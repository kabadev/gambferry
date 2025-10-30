"use client";

import type React from "react";
import { toast } from "sonner";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FareSummary } from "./fare-summary";

type Step3Data = {
  passenger_type: "Economy" | "VIP" | "Bicycle";
  num_passengers: number;
  vehicle_type?: string;
  vehicle_plate?: string;
  vehicle_weight_tons?: number;
  vehicle_length_meters?: number;
  commercial_pax?: number;
  cattle?: number;
  sheep_goats?: number;
  rice_bags?: number;
  groundnut_bags?: number;
  cement_bags?: number;
  cartons?: number;
  payment_method: string;
  currency: "GMD" | "CFA";
  terms_accepted: boolean;
};

type Props = {
  data: Step3Data;
  schedule: any;
  onSubmit: (data: Step3Data) => void;
  onBack: () => void;
  loading: boolean;
};

export function Step3Payment({
  data,
  schedule,
  onSubmit,
  onBack,
  loading,
}: Props) {
  const [formData, setFormData] = useState<Step3Data>(data);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.terms_accepted) {
      toast.error("Please accept the terms and conditions");
      return;
    }
    onSubmit(formData);
  };

  const updateField = (field: keyof Step3Data, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const requiresWeightLength = formData.vehicle_type === "Foreign Vehicle";
  const requiresCommercialPax = formData.vehicle_type?.includes("Commercial");

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="passenger_type">Passenger Type *</Label>
            <Select
              value={formData.passenger_type}
              onValueChange={(value) => updateField("passenger_type", value)}
              required
            >
              <SelectTrigger id="passenger_type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Economy">Economy (D65)</SelectItem>
                <SelectItem value="VIP">VIP - Kunta Kinteh (D625)</SelectItem>
                <SelectItem value="Bicycle">
                  Bicycle with Rider (D125)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(formData.passenger_type === "Economy" ||
            formData.passenger_type === "VIP") && (
            <div className="space-y-2">
              <Label htmlFor="num_passengers">Number of Passengers *</Label>
              <Input
                id="num_passengers"
                type="number"
                min="1"
                max="10"
                value={formData.num_passengers}
                onChange={(e) =>
                  updateField(
                    "num_passengers",
                    Number.parseInt(e.target.value) || 1
                  )
                }
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="vehicle_type">Vehicle Type (Optional)</Label>
            <Select
              value={formData.vehicle_type}
              onValueChange={(value) => updateField("vehicle_type", value)}
            >
              <SelectTrigger id="vehicle_type">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectGroup>
                  <SelectLabel>PRIVATE VEHICLE</SelectLabel>
                  <SelectItem value="Motorcycle">Motorcycle (D250)</SelectItem>
                  <SelectItem value="Saloon Car">
                    Saloon Car & Double Cabin (D1,250)
                  </SelectItem>
                  <SelectItem value="Car and Trailer">
                    Car and Trailer (D2,500)
                  </SelectItem>
                  <SelectItem value="Tractor (Head)">
                    Tractor Head (D1,250)
                  </SelectItem>
                  <SelectItem value="Tractor & Trailer">
                    Tractor & Trailer (D2,500)
                  </SelectItem>
                  <SelectItem value="Premium/Priority Pass (VIP)">
                    Premium/Priority Pass VIP (D3,000)
                  </SelectItem>
                  <SelectItem value="Priority Pass for Perishable">
                    Priority Pass for Perishable (D3,000)
                  </SelectItem>
                  <SelectItem value="Dem Dikk (All Inclusive)">
                    Dem Dikk All Inclusive (D8,600)
                  </SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>COMMERCIAL VEHICLE</SelectLabel>
                  <SelectItem value="Commercial 1 to 14 PAX">
                    1 to 14 PAX (D1,250)
                  </SelectItem>
                  <SelectItem value="Commercial 15 to 20 PAX">
                    15 to 20 PAX (D1,900)
                  </SelectItem>
                  <SelectItem value="Commercial 21 to 35 PAX">
                    21 to 35 PAX (D2,500)
                  </SelectItem>
                  <SelectItem value="Commercial 36 to 44 PAX Mini Van">
                    36 to 44 PAX Mini Van (D4,350)
                  </SelectItem>
                  <SelectItem value="Commercial 45 to Above">
                    45 to Above (D5,000)
                  </SelectItem>
                  <SelectItem value="Taxi Baggage (Empty)">
                    Taxi Baggage Empty (D2,500)
                  </SelectItem>
                </SelectGroup>
                <SelectItem value="Foreign Vehicle">
                  Foreign Vehicle (Weight-based)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.vehicle_type && formData.vehicle_type !== "none" && (
            <div className="space-y-2">
              <Label htmlFor="vehicle_plate">License Plate</Label>
              <Input
                id="vehicle_plate"
                type="text"
                placeholder="e.g. GMB-1234"
                value={formData.vehicle_plate}
                onChange={(e) => updateField("vehicle_plate", e.target.value)}
              />
            </div>
          )}

          {requiresWeightLength && (
            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Foreign Vehicle Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicle_weight_tons">Weight (tons) *</Label>
                  <Input
                    id="vehicle_weight_tons"
                    type="number"
                    min="5"
                    max="65"
                    step="0.1"
                    value={formData.vehicle_weight_tons || ""}
                    onChange={(e) =>
                      updateField(
                        "vehicle_weight_tons",
                        Number.parseFloat(e.target.value) || 0
                      )
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicle_length_meters">
                    Length (meters) *
                  </Label>
                  <Input
                    id="vehicle_length_meters"
                    type="number"
                    min="10"
                    max="18"
                    step="0.1"
                    value={formData.vehicle_length_meters || ""}
                    onChange={(e) =>
                      updateField(
                        "vehicle_length_meters",
                        Number.parseFloat(e.target.value) || 0
                      )
                    }
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {requiresCommercialPax && (
            <div className="space-y-2">
              <Label htmlFor="commercial_pax">
                Number of Passengers in Commercial Vehicle
              </Label>
              <Input
                id="commercial_pax"
                type="number"
                min="0"
                value={formData.commercial_pax || 0}
                onChange={(e) =>
                  updateField(
                    "commercial_pax",
                    Number.parseInt(e.target.value) || 0
                  )
                }
              />
            </div>
          )}

          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Livestock (Optional)</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cattle">Cattle (D250/head)</Label>
                <Input
                  id="cattle"
                  type="number"
                  min="0"
                  value={formData.cattle || 0}
                  onChange={(e) =>
                    updateField("cattle", Number.parseInt(e.target.value) || 0)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sheep_goats">Sheep/Goats (D200/head)</Label>
                <Input
                  id="sheep_goats"
                  type="number"
                  min="0"
                  value={formData.sheep_goats || 0}
                  onChange={(e) =>
                    updateField(
                      "sheep_goats",
                      Number.parseInt(e.target.value) || 0
                    )
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 mt-6">
            <h3 className="font-semibold text-sm">Cargo (Optional)</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rice_bags">Rice Bags (50kg, D65)</Label>
                <Input
                  id="rice_bags"
                  type="number"
                  min="0"
                  value={formData.rice_bags || 0}
                  onChange={(e) =>
                    updateField(
                      "rice_bags",
                      Number.parseInt(e.target.value) || 0
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="groundnut_bags">
                  Groundnut Bags (50kg, D65)
                </Label>
                <Input
                  id="groundnut_bags"
                  type="number"
                  min="0"
                  value={formData.groundnut_bags || 0}
                  onChange={(e) =>
                    updateField(
                      "groundnut_bags",
                      Number.parseInt(e.target.value) || 0
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cement_bags">Cement Bags (50kg, D65)</Label>
                <Input
                  id="cement_bags"
                  type="number"
                  min="0"
                  value={formData.cement_bags || 0}
                  onChange={(e) =>
                    updateField(
                      "cement_bags",
                      Number.parseInt(e.target.value) || 0
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cartons">Cartons (Medium, D125)</Label>
                <Input
                  id="cartons"
                  type="number"
                  min="0"
                  value={formData.cartons || 0}
                  onChange={(e) =>
                    updateField("cartons", Number.parseInt(e.target.value) || 0)
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <FareSummary
            schedule={schedule}
            formData={formData}
            currency={formData.currency}
            onCurrencyChange={(currency) => updateField("currency", currency)}
          />

          <div className="space-y-2">
            <Label htmlFor="payment_method">Payment Method *</Label>
            <Select
              value={formData.payment_method}
              onValueChange={(value) => updateField("payment_method", value)}
              required
            >
              <SelectTrigger id="payment_method">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Wave">Wave</SelectItem>
                <SelectItem value="AfriMoney">Afri Money</SelectItem>
                <SelectItem value="QMoney">Q Money</SelectItem>
                {/* <SelectItem value="CreditCard">Credit Card</SelectItem> */}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-start gap-2">
            <Checkbox
              id="terms"
              checked={formData.terms_accepted}
              onCheckedChange={(checked) =>
                updateField("terms_accepted", checked)
              }
            />
            <Label
              htmlFor="terms"
              className="text-sm leading-relaxed cursor-pointer"
            >
              I accept the terms and conditions and understand the ferry booking
              policies
            </Label>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1 bg-transparent"
        >
          Back
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={!formData.terms_accepted || loading}
        >
          {loading ? "Booking..." : "Book Now"}
        </Button>
      </div>
    </form>
  );
}
