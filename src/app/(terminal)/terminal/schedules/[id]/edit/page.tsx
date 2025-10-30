import { getScheduleById } from "@/app/(terminal)/actions/schedule.actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import EditSchedule from "./EditSchedule";
import { getFerries } from "@/app/(terminal)/actions/ferry.actions";
import { getRoutes } from "@/app/(terminal)/actions/route.actions";

const EditSchedulePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const paramsResolved = await params;
  const schedule = await getScheduleById(paramsResolved.id);
  const ferries = await getFerries();
  const routes = await getRoutes();
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
      <EditSchedule
        schedule={schedule.data}
        ferries={ferries?.data?.ferries}
        routes={routes?.data?.routes!}
      />
    </div>
  );
};

export default EditSchedulePage;
