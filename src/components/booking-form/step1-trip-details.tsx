"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { LoginModal } from "@/app/(auth)/sign-in/[[...sign-in]]/LoginModal";

type Step1Data = {
  route: string;
  schedule_id: string;
  travel_date: string;
  departure_time: string;
  ferry: string;
};

type Props = {
  data: any;
  // routes: Route[];
  // ferries: Ferry[];
  onNext: (data: Step1Data) => void;
};

export function Step1TripDetails({ data, onNext }: Props) {
  const { user } = useUser();

  // const activeRoutes = routes.filter((r) => r.active);
  // const activeFerries = ferries.filter((f) => f.status === "Active");
  function formatTripDuration(
    departureTime: string,
    arrivalTime: string
  ): React.ReactNode {
    const [depH, depM] = departureTime?.split(":").map(Number);
    const [arrH, arrM] = arrivalTime?.split(":").map(Number);
    const depMinutes = depH * 60 + depM;
    const arrMinutes = arrH * 60 + arrM;
    if (!depMinutes || !arrMinutes) {
      return null;
    }
    const diff = arrMinutes - depMinutes;
    const hrs = Math.floor(diff / 60);
    const mins = diff % 60;
    return `${departureTime} → ${arrivalTime} • ${hrs}h ${mins}m`;
  }
  return (
    <div>
      <div className="space-y-4">
        <div
          key={data._id}
          className="bg-card p-2 md:p-4  h-[350px] md:h-[200px] flex gap-4 max-md:flex-col "
        >
          <div className="md:w-[30%] h-full max-md:h-[40%] flex items-center justify-center  ">
            <Image
              className="w-full h-[80%] max-md:h-full object-cover rounded-md"
              src={data.ferry_id?.ferry_image || ""}
              alt="Ferry"
              width={200}
              height={200}
            />
          </div>

          <div>
            <p className="text-xl line-clamp-1">
              {data.ferry_id?.ferry_name || "N/A"} -{" "}
              {data.ferry_id?.ferry_type || "N/A"}
            </p>
            <p className="text-lg font-bold text-primary my-2">
              {formatTripDuration(data.departureTime, data.arrivalTime)}
            </p>
            <p className="text-sm text-muted-foreground">
              {data?.route_id?.route_name || "N/A"}
            </p>
            <p className="text-lg font-bold">
              GMD. {data?.route_id?.base_price || "N/A"}
            </p>
          </div>
        </div>

        {user ? (
          <Button
            onClick={() =>
              onNext({
                route: data.route_id,
                travel_date: data?.departureDate,
                departure_time: data?.departureTime,
                ferry: data?.ferry_id,
                schedule_id: data?._id,
              })
            }
          >
            Confirm & Continue
          </Button>
        ) : (
          <LoginModal>
            <Button type="button">Confirm & Continue</Button>
          </LoginModal>
        )}
      </div>
    </div>
  );
}
