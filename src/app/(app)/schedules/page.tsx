import React from "react";
import SchedulePageDetail from "./SchedulePageDetail";
import { getSchedules } from "@/app/(terminal)/actions/schedule.actions";

const SchedulePage = async () => {
  const result = await getSchedules();
  return (
    <div>
      <section className="relative -z-10 bg-accent   bg-cover bg-center   sbg-gradient-to-r from-primary to-red-700 py-16 px-6"></section>

      <section className="px-2 md:px-40 -mt-16 z-20">
        <div className="bg-card rounded-lg p-6">
          <SchedulePageDetail schedules={result?.data?.schedules} />
        </div>
      </section>
    </div>
  );
};

export default SchedulePage;
