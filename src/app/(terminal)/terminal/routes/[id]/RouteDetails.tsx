"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  Trash2,
  MapPin,
  Clock,
  DollarSign,
  RouteIcon,
} from "lucide-react";

import { useState } from "react";

import Link from "next/link";

import { DeleteRouteModal } from "@/app/(terminal)/components/delete-route-modal";
import { Route } from "@/lib/data";

export default function RouteDetails({ route }: { route: Route }) {
  const router = useRouter();
  const [deleteModal, setDeleteModal] = useState(false);

  const handleDelete = () => {
    console.log("Deleting route:", route.id);
    setDeleteModal(false);
    router.push("/terminal/routes");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Route Details
            </h1>
            <p className="text-muted-foreground">{route.route_name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/terminal/routes/${route._id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive" onClick={() => setDeleteModal(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <RouteIcon className="h-5 w-5" />
              Route Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Route Name</p>
              <p className="text-lg font-semibold text-foreground">
                {route.route_name}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge
                variant={route.active ? "default" : "secondary"}
                className={
                  route.active
                    ? "bg-chart-3 text-white"
                    : "bg-muted text-muted-foreground"
                }
              >
                {route.active ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="pt-4 space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-chart-1 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Departure Port
                  </p>
                  <p className="text-lg font-medium text-foreground">
                    {route.departurePort}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="h-8 w-0.5 bg-border" />
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-chart-2 mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Arrival Port</p>
                  <p className="text-lg font-medium text-foreground">
                    {route.arrivalPort}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Route Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/10">
                  <RouteIcon className="h-5 w-5 text-chart-1" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Distance</p>
                  <p className="text-xl font-bold text-foreground">
                    {route.distance_km} km
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10">
                  <Clock className="h-5 w-5 text-chart-2" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="text-xl font-bold text-foreground">
                    {route.duration}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10">
                  <DollarSign className="h-5 w-5 text-chart-3" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Base Price</p>
                  <p className="text-xl font-bold text-foreground">
                    {route.base_price} GMD
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DeleteRouteModal
        open={deleteModal}
        onOpenChange={setDeleteModal}
        routeName={route.route_name}
        onConfirm={handleDelete}
      />
    </div>
  );
}
