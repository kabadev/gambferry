"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowRight, SearchIcon } from "lucide-react";
import Image from "next/image";
import { searchFerries } from "./action";

interface BookingDetails {
  departurePort: string;
  arrivalPort: string;
  departureDate: string;
  departureTime: string;
}

// Separate component that uses useSearchParams
function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(
    null
  );
  const [available, setAvailable] = useState<any[]>([]);
  const [formData, setFormData] = useState<BookingDetails>({
    departurePort: "",
    arrivalPort: "",
    departureDate: "",
    departureTime: "",
  });

  const fetchSchedule = async () => {
    const departurePort = searchParams.get("departurePort") || "";
    const arrivalPort = searchParams.get("arrivalPort") || "";
    const departureDate = searchParams.get("departureDate") || "";

    const availableSchedules = await searchFerries({
      departurePort: departurePort,
      arrivalPort: arrivalPort,
      departureDate: departureDate,
    });

    setAvailable(availableSchedules.data);
  };

  useEffect(() => {
    // Extract search parameters
    const departurePort = searchParams.get("departurePort") || "";
    const arrivalPort = searchParams.get("arrivalPort") || "";
    const departureDate = searchParams.get("departureDate") || "";
    const departureTime = searchParams.get("departureTime") || "";

    fetchSchedule();

    // Set booking details
    setBookingDetails({
      departurePort,
      arrivalPort,
      departureDate,
      departureTime,
    });

    setFormData({
      departurePort,
      arrivalPort,
      departureDate,
      departureTime,
    });
  }, [searchParams]);

  if (!bookingDetails) {
    return (
      <div className="container mx-auto p-6">Loading booking details...</div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const availableSchedules = await searchFerries({
        departurePort: formData.departurePort,
        arrivalPort: formData.arrivalPort,
        departureDate: formData.departureDate,
      });

      setAvailable(availableSchedules.data);
      setBookingDetails({
        ...bookingDetails,
        ...formData,
      });
    } catch (error) {}
  };

  function formatTripDuration(
    departureTime: string,
    arrivalTime: string
  ): React.ReactNode {
    const [depH, depM] = departureTime.split(":").map(Number);
    const [arrH, arrM] = arrivalTime.split(":").map(Number);
    const depMinutes = depH * 60 + depM;
    const arrMinutes = arrH * 60 + arrM;
    const diff = arrMinutes - depMinutes;
    const hrs = Math.floor(diff / 60);
    const mins = diff % 60;
    return `${departureTime} → ${arrivalTime} • ${hrs}h ${mins}m`;
  }

  return (
    <div className="">
      {/* Hero Section with Search */}
      <section className="relative -z-10 bg-accent bg-[url('/banner.png')]d  bg-cover bg-center   sbg-gradient-to-r from-primary to-red-700 py-16 px-6"></section>

      <section className="px-2 md:px-40 -mt-16 z-20">
        <div className="bg-card rounded-lg p-6">
          <h3 className="text-muted-foreground mb-4">Search Result</h3>

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
                  <SearchIcon className="w-5 h-5 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </form>
        </div>
        {/* Popular Routes */}
        <div className="mt-6">
          <h3 className="text-3xl font-bold  flex gap-6 items-center">
            {bookingDetails.departurePort} <ArrowRight />
            {bookingDetails.arrivalPort}
          </h3>
          <p className="text-muted-foreground">
            {formatDate(bookingDetails.departureDate)}{" "}
          </p>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-bold  flex gap-6 items-center">
            Available Schedules
          </h3>

          <div className="grid grid-cols-2 gap-4 mt-4">
            {available?.map((schedule) => (
              <div
                key={schedule._id}
                className="bg-card p-4  h-[200px] flex gap-4 "
              >
                <div className="w-[30%] h-full flex items-center justify-center ">
                  <Image
                    className="w-full h-[80%] object-cover rounded-md"
                    src={schedule.ferry_image || ""}
                    alt="Ferry"
                    width={200}
                    height={200}
                  />
                </div>

                <div>
                  <p className="text-xl line-clamp-1">
                    {schedule?.ferry_name || "N/A"} -{" "}
                    {schedule?.ferry_type || "N/A"}
                  </p>
                  <p className="text-lg font-bold text-primary my-2">
                    {formatTripDuration(
                      schedule.departureTime,
                      schedule.arrivalTime
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {schedule?.route_name || "N/A"}
                  </p>
                  <p className="text-lg font-bold">
                    GMD. {schedule?.base_price || "N/A"}
                  </p>
                  <div className="flex justify-end w-full">
                    <Button
                      className="mt-2 bg-primary text-white self-end"
                      onClick={() => router.push(`/booking/${schedule._id}`)}
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Main page component with Suspense boundary
const BookingPage = () => {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">
                Loading booking details...
              </p>
            </div>
          </div>
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
};

export default BookingPage;
