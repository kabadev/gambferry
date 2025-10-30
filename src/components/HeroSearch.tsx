"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const HeroSearch = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    departurePort: "",
    arrivalPort: "",
    departureDate: "",
    departureTime: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create search params
    const params = new URLSearchParams();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });

    // Navigate to booking page with search params
    router.push(`/booking?${params.toString()}`);
  };

  return (
    <div className="bg-card rounded-lg p-2 py-4 md:p-6">
      <h3 className="font-semibold mb-4">Search Ferries</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full">
          <div>
            <label className="block text-sm  mb-1">Departure port</label>
            <select
              name="departurePort"
              value={formData.departurePort}
              onChange={handleChange}
              className="w-full p-2 border rounded-md  bg-card"
              required
            >
              <option value="">Select port</option>
              <option value="Banjul Port">Banjul Port</option>
              <option value="Barra Port">Barra Port</option>
            </select>
          </div>
          <div>
            <label className="block text-sm  mb-1">Arrival port</label>
            <select
              name="arrivalPort"
              value={formData.arrivalPort}
              onChange={handleChange}
              className="w-full p-2 border rounded-md  bg-card"
              required
            >
              <option value="">Select port</option>
              <option value="Barra Port">Barra Port</option>
              <option value="Banjul Port">Banjul Port</option>
            </select>
          </div>
          <div>
            <label className="block text-sm  mb-1">Departure date</label>
            <input
              type="date"
              name="departureDate"
              value={formData.departureDate}
              onChange={handleChange}
              placeholder="DD / MM / YYYY"
              className="w-full p-2 border rounded-md  bg-card"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="departureTime">Departure Time *</Label>
            <Select
              name="departureTime"
              value={formData.departureTime}
              onValueChange={(value) =>
                handleSelectChange(value, "departureTime")
              }
              required
            >
              <SelectTrigger id="departureTime">
                <SelectValue placeholder="Choose departure time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="06:00">06:00 AM</SelectItem>
                <SelectItem value="09:00">09:00 AM</SelectItem>
                <SelectItem value="12:00">12:00 PM</SelectItem>
                <SelectItem value="15:00">03:00 PM</SelectItem>
                <SelectItem value="18:00">06:00 PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end items-center mt-4">
            <Button
              type="submit"
              className="bg-primary self-end text-white cursor-pointer"
            >
              Search
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default HeroSearch;
