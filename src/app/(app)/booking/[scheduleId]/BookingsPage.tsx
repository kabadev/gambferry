"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MultiStepProgress } from "@/components/booking-form/multi-step-progress";
import { Step1TripDetails } from "@/components/booking-form/step1-trip-details";
import { Step2PassengerInfo } from "@/components/booking-form/step2-passenger-info";
import { Step3Payment } from "@/components/booking-form/step3-payment";
import { Schedule } from "@/lib/data";
import { createBooking } from "../action";
import { toast } from "sonner";

type BookingFormData = {
  route_id: string;
  travel_date: string;
  departure_time: string;
  departure_date: string;
  ferry_id: string;
  passenger_name: string;
  passenger_email: string;
  passenger_phone: string;
  passenger_type: "Economy" | "VIP" | "Bicycle";
  num_passengers: number;
  vehicle_type?: string;
  vehicle_plate?: string;
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

export default function BookingsPage({ schedule }: { schedule: Schedule }) {
  const router = useRouter();

  // const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    route_id: "",
    travel_date: "",
    departure_time: "",
    departure_date: "",
    ferry_id: "",
    passenger_name: "",
    passenger_email: "",
    passenger_phone: "",
    passenger_type: "Economy",
    num_passengers: 1,
    payment_method: "",
    currency: "GMD",
    terms_accepted: false,
  });

  const handleStep1Next = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep(2);
  };

  const handleStep2Next = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setCurrentStep(3);
  };

  const handleStep3Submit = async (data: any) => {
    const finalData = {
      ...formData,
      ...data,
    };
    setFormData(finalData);

    try {
      setLoading(true);
      const booking = await createBooking(finalData);
      toast.success(
        `Your booking reference is ${booking.data.booking_reference}`
      );
      router.push(`${booking.data.payment.payment_link}`);
    } catch (error) {
      toast.error("Booking Failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cards">
      <main className="">
        <Card className="">
          <CardHeader>
            <CardTitle className="text-2xl">Book Your Ferry Journey</CardTitle>
            <CardDescription>
              Complete the form below to reserve your spot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MultiStepProgress currentStep={currentStep} />
            <div className="mt-4">
              {currentStep === 1 && (
                <Step1TripDetails data={schedule} onNext={handleStep1Next} />
              )}
              {currentStep === 2 && (
                <Step2PassengerInfo
                  data={formData}
                  onNext={handleStep2Next}
                  onBack={() => setCurrentStep(1)}
                />
              )}
              {currentStep === 3 && schedule.route_id && (
                <Step3Payment
                  loading={loading}
                  data={formData}
                  schedule={schedule}
                  onSubmit={handleStep3Submit}
                  onBack={() => setCurrentStep(2)}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
