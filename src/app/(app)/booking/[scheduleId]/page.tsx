import React from "react";
import BookingsPage from "./BookingsPage";

import { getScheduleById } from "@/app/(terminal)/actions/schedule.actions";

const page = async ({
  params,
}: {
  params: Promise<{ scheduleId: string }>;
}) => {
  const { scheduleId } = await params;

  const schedule = await getScheduleById(scheduleId);

  if (!schedule.success || !schedule.data.ferry_id || !schedule.data.route_id) {
    return (
      <div>
        <p>Schedule not found</p>
      </div>
    );
  }
  return (
    <div>
      <section className="relative -z-10 bg-accent bg-[url('/banner.png')]d  bg-cover bg-center   sbg-gradient-to-r from-primary to-red-700 py-16 px-6"></section>

      <section className="px-2 md:px-40 -mt-16 z-20">
        <BookingsPage schedule={schedule.data} />
      </section>
    </div>
  );
};

export default page;
