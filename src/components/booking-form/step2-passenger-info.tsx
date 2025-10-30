"use client";

import type React from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

import { format } from "date-fns";
type Step2Data = {
  passenger_name: string;
  passenger_email: string;
  passenger_phone: string;
  departure_date: string;
};

type Props = {
  data: Step2Data;
  onNext: (data: Step2Data) => void;
  onBack: () => void;
};

export function Step2PassengerInfo({ data, onNext, onBack }: Props) {
  const { user } = useUser();
  const [departureDate, setDepartureDate] = useState<Date | null>(null);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onNext({
      passenger_name: formData.get("passenger_name") as string,
      passenger_email: formData.get("passenger_email") as string,
      passenger_phone: formData.get("passenger_phone") as string,
      departure_date: departureDate?.toISOString() || "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="passenger_name">Full Name *</Label>
        <Input
          id="passenger_name"
          name="passenger_name"
          type="text"
          placeholder="e.g. LANSANA KABBA"
          defaultValue={data.passenger_name || user?.fullName || ""}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="passenger_email">Email Address *</Label>
        <Input
          id="passenger_email"
          name="passenger_email"
          type="email"
          placeholder="e.g. lanskabamedia@gmail.com"
          defaultValue={
            data.passenger_email || user?.emailAddresses[0].emailAddress || ""
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="passenger_phone">Phone Number *</Label>
        <Input
          id="passenger_phone"
          name="passenger_phone"
          type="tel"
          placeholder="e.g. +220 123 4567"
          defaultValue={data.passenger_phone}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Departure Date *</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !departureDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {departureDate ? format(departureDate!, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={departureDate!}
              onSelect={(date) => setDepartureDate(date!)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
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
        <Button type="submit" className="flex-1">
          Next Step
        </Button>
      </div>
    </form>
  );
}
