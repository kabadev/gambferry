import { getFerries } from "@/app/(terminal)/actions/ferry.actions";
import { getRoutes } from "@/app/(terminal)/actions/route.actions";
import React from "react";
import NewScheduleForm from "./NewScheduleForm";

const NewSchedulePage = async () => {
  const ferries = await getFerries();
  const routes = await getRoutes();

  return (
    <div>
      <NewScheduleForm
        ferries={ferries?.data?.ferries}
        routes={routes?.data?.routes!}
      />
    </div>
  );
};

export default NewSchedulePage;
