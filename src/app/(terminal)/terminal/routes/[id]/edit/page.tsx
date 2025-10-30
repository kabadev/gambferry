import { getRouteById } from "@/app/(terminal)/actions/route.actions";
import React from "react";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import EditRoutePage from "./EditForm";

const RouteEditPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const paramsResolved = await params;
  const route = await getRouteById(paramsResolved.id);

  if (!route) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">
            Route Not Found
          </h2>
          <p className="text-muted-foreground mt-2">
            The route you're looking for doesn't exist.
          </p>
          <Link href="/terminal/routes">
            <Button className="mt-4">Back to Routes</Button>
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div>
      <EditRoutePage route={route.data} />
    </div>
  );
};

export default RouteEditPage;
