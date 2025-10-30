import React from "react";
import ScheduleDetailsPage from "./ScheduleDetailsPage";
import { getScheduleById } from "@/app/(terminal)/actions/schedule.actions";
import { Button } from "@/components/ui/button";

import Link from "next/link";

const ScheduleDetails = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const paramsResolved = await params;
  const schedule = await getScheduleById(paramsResolved.id);

  if (!schedule) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">
            Schedule Not Found
          </h2>
          <p className="text-muted-foreground mt-2">
            The schedule you're looking for doesn't exist.
          </p>
          <Link href="/terminal/schedules">
            <Button className="mt-4">Back to Schedules</Button>
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div>
      <ScheduleDetailsPage schedule={schedule.data} />
    </div>
  );
};

export default ScheduleDetails;
