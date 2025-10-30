"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Ship,
  RouteIcon,
  Calendar,
  Clock,
  Loader2,
  Users,
  TrendingUp,
} from "lucide-react";

import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { DeleteScheduleModal } from "@/app/(terminal)/components/delete-schedule-modal";
import { toast } from "sonner";
import { getScheduleById } from "@/app/(terminal)/actions/schedule.actions";

type Ferry = {
  _id: string;
  id: number;
  ferry_name: string;
  ferry_code: string;
  ferry_type: string;
  passengers_capacity: number;
  cattle_capacity: number;
  rgc_capacity: number;
  sg_capacity: number;
  ppcp_capacity: number;
  description: string;
  ferry_image: string;
  status: string;
};

type Route = {
  _id: string;
  id: string;
  route_name: string;
  departurePort: string;
  arrivalPort: string;
  base_price: number;
  duration: string;
  distance_km: number;
  active: boolean;
};

type Schedule = {
  _id: string;
  schedule_id: number;
  ferry_id: Ferry;
  route_id: Route;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export default function ScheduleDetailsPage({
  schedule,
}: {
  schedule: Schedule;
}) {
  const router = useRouter();
  const [deleteModal, setDeleteModal] = useState(false);
  //   const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/schedules/`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Schedule deleted successfully");
        router.push("/terminal/schedules");
      } else {
        toast.error(result.error || "Failed to delete schedule");
      }
    } catch (error) {
      toast.error("An error occurred while deleting schedule");
      console.error(error);
    } finally {
      setDeleteModal(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return "bg-chart-1 text-white";
      case "departed":
        return "bg-blue-500 text-white";
      case "delayed":
        return "bg-destructive text-white";
      case "arrived":
      case "completed":
        return "bg-chart-3 text-white";
      case "cancelled":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const ferry = schedule.ferry_id;
  const route = schedule.route_id;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Schedule Details
            </h1>
            <p className="text-muted-foreground">
              Schedule #{schedule.schedule_id}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/terminal/schedules/${schedule._id}/edit`}>
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
        {/* Ferry Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Ship className="h-5 w-5" />
              Ferry Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {ferry?.ferry_image && (
              <div className="relative h-48 w-full rounded-lg overflow-hidden bg-muted">
                <Image
                  src={ferry.ferry_image || "/placeholder.svg"}
                  alt={ferry.ferry_name || "Ferry"}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Ferry Name</p>
              <p className="text-lg font-semibold text-foreground">
                {ferry?.ferry_name || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ferry Code</p>
              <p className="text-foreground">{ferry?.ferry_code || "N/A"}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Ferry Type</p>
                <Badge variant="outline">{ferry?.ferry_type || "N/A"}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge
                  variant="outline"
                  className={
                    ferry?.status?.toLowerCase() === "active"
                      ? "border-green-500 text-green-500"
                      : "border-muted-foreground text-muted-foreground"
                  }
                >
                  {ferry?.status || "N/A"}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Capacities</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-chart-1" />
                  <span className="text-muted-foreground">Passengers:</span>
                  <span className="font-medium">
                    {ferry?.passengers_capacity || 0}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-chart-2" />
                  <span className="text-muted-foreground">Cattle:</span>
                  <span className="font-medium">
                    {ferry?.cattle_capacity || 0}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-chart-3" />
                  <span className="text-muted-foreground">RGC:</span>
                  <span className="font-medium">
                    {ferry?.rgc_capacity || 0}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-chart-4" />
                  <span className="text-muted-foreground">SG:</span>
                  <span className="font-medium">{ferry?.sg_capacity || 0}</span>
                </div>
              </div>
            </div>
            {ferry?.description && (
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="text-sm text-foreground mt-1">
                  {ferry.description}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Route Information */}
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
                {route?.route_name || "N/A"}
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">From</p>
                  <p className="text-lg font-semibold text-foreground">
                    {route?.departurePort || "N/A"}
                  </p>
                </div>
                <div className="text-muted-foreground">→</div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">To</p>
                  <p className="text-lg font-semibold text-foreground">
                    {route?.arrivalPort || "N/A"}
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Distance</p>
                <p className="text-lg font-medium text-foreground">
                  {route?.distance_km || 0} km
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="text-lg font-medium text-foreground">
                  {route?.duration || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Base Price</p>
                <p className="text-lg font-medium text-foreground">
                  GMD{route?.base_price || 0}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Route Status</p>
              <Badge
                variant="outline"
                className={
                  route?.active
                    ? "border-green-500 text-green-500 mt-2"
                    : "border-muted-foreground text-muted-foreground mt-2"
                }
              >
                {route?.active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Calendar className="h-5 w-5" />
              Schedule Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-1/10">
                  <Calendar className="h-6 w-6 text-chart-1" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Departure Date
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {schedule.departureDate
                      ? format(parseISO(schedule.departureDate), "PPP")
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
                  <Clock className="h-6 w-6 text-chart-2" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Departure Time
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {schedule.departureTime || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-3/10">
                  <Clock className="h-6 w-6 text-chart-3" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Arrival Time</p>
                  <p className="text-lg font-semibold text-foreground">
                    {schedule.arrivalTime || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge
                  variant="secondary"
                  className={`mt-2 ${getStatusBadgeClass(schedule.status)}`}
                >
                  {schedule.status || "Unknown"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="text-sm text-foreground mt-2">
                  {schedule.updatedAt
                    ? format(parseISO(schedule.updatedAt), "PPp")
                    : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* <DeleteScheduleModal
        open={deleteModal}
        onOpenChange={setDeleteModal}
        scheduleId={schedule._id}
        onConfirm={handleDelete}
      /> */}
    </div>
  );
}
