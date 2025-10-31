"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const SchedulePageDetail = ({ schedules }: { schedules: any[] }) => {
  const router = useRouter();

  function formatTripDuration(
    departureTime: string,
    arrivalTime: string
  ): React.ReactNode {
    const [depH, depM] = departureTime?.split(":").map(Number) || [0, 0];
    const [arrH, arrM] = arrivalTime?.split(":").map(Number) || [0, 0];
    const depMinutes = depH * 60 + depM;
    const arrMinutes = arrH * 60 + arrM;
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
            {schedules.map((schedule: any) => (
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
      </div>
    </div>
  );
};

export default SchedulePageDetail;
