"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import { useEffect, useState } from "react";
import { getSchedules } from "../../actions/schedule.actions";

import { Schedule } from "@/lib/data";

type Step1Data = {
  route: any;
  schedule_id: string;
  travel_date: string;
  departure_time: string;
  ferry: any;
};

type Props = {
  onNext: (data: Step1Data) => void;
};

export function Step1TripDetails({ onNext }: Props) {
  const [Schedules, setSchedules] = useState<any[]>([]);

  const fetchSchedule = async () => {
    const res = await getSchedules();
    const data = res?.data?.schedules! || [];

    if (res.success) {
      setSchedules(data);
    }
  };
  useEffect(() => {
    fetchSchedule();
  }, []);
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
        <div className="mt-8">
          <h3 className="text-xl font-bold  flex gap-6 items-center">
            Available Schedules
          </h3>

          <div className="grid grid-cols-2 gap-4 my-4">
            {Schedules.map((schedule: any) => (
              <div
                key={schedule._id}
                className="bg-card p-4  h-[200px] flex gap-4 "
              >
                <div className="w-[30%] h-full flex items-center justify-center ">
                  <Image
                    className="w-full h-[80%] object-cover rounded-md"
                    src={schedule.ferry_id?.ferry_image || ""}
                    alt="Ferry"
                    width={200}
                    height={200}
                  />
                </div>

                <div>
                  <p className="text-xl line-clamp-1">
                    {schedule.ferry_id?.ferry_name || "N/A"} -{" "}
                    {schedule.ferry_id?.ferry_type || "N/A"}
                  </p>
                  <p className="text-lg font-bold text-primary my-2">
                    {formatTripDuration(
                      schedule.departureTime,
                      schedule.arrivalTime
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {schedule?.route_id?.route_name || "N/A"}
                  </p>
                  <p className="text-lg font-bold">
                    GMD. {schedule?.route_id?.base_price || "N/A"}
                  </p>
                  <div className="flex justify-end w-full">
                    <Button
                      className="mt-2 bg-primary text-white self-end"
                      onClick={() =>
                        onNext({
                          route: schedule.route_id,
                          travel_date: schedule?.departureDate,
                          departure_time: schedule?.departureTime,
                          ferry: schedule?.ferry_id!,
                          schedule_id: schedule?._id!,
                        })
                      }
                    >
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
