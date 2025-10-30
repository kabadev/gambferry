import { getFerryById } from "@/app/(terminal)/actions/ferry.actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import FerryDetail from "./FerryDetail";

const FerryDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const ferry = await getFerryById(id);
  if (!ferry) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">
            Ferry Not Found
          </h2>
          <p className="text-muted-foreground mt-2">
            The ferry you're looking for doesn't exist.
          </p>
          <Link href="/terminal/ferries">
            <Button className="mt-4">Back to Ferries</Button>
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div>
      <FerryDetail ferry={ferry.data} />
    </div>
  );
};

export default FerryDetailsPage;
