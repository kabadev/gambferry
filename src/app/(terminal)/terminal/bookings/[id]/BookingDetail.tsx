"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Trash2,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  Ship,
  RouteIcon,
  Package,
  Truck,
  Beef,
} from "lucide-react";

import { format } from "date-fns";
import { useState } from "react";
import { DeleteBookingModal } from "@/app/(terminal)/components/delete-booking-modal";
import { Booking } from "@/lib/data";

export default function BookingDetails({ booking }: { booking: any }) {
  const router = useRouter();
  const [deleteModal, setDeleteModal] = useState(false);

  // if (!booking) {
  //   return (
  //     <div className="flex h-full items-center justify-center">
  //       <div className="text-center">
  //         <h2 className="text-2xl font-bold text-foreground">
  //           Booking Not Found
  //         </h2>
  //         <p className="text-muted-foreground mt-2">
  //           The booking you're looking for doesn't exist.
  //         </p>
  //         <Button
  //           onClick={() => router.push("/terminal/bookings")}
  //           className="mt-4"
  //         >
  //           Back to Bookings
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // }

  const handleDelete = () => {
    // Handle delete logic
    console.log("Deleting booking:", booking.id);
    setDeleteModal(false);
    router.push("/terminal/bookings");
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
              Booking Details
            </h1>
            <p className="text-muted-foreground">{booking.booking_reference}</p>
          </div>
        </div>
        <Button variant="destructive" onClick={() => setDeleteModal(true)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Booking
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Passenger Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <User className="h-5 w-5" />
              Passenger Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="text-lg font-medium text-foreground">
                {booking.passenger_name}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="text-foreground">{booking.passenger_email}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p className="text-foreground">{booking.passenger_phone}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Number of Passengers
              </p>
              <p className="text-lg font-medium text-foreground">
                {booking.num_passengers}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Passenger Type</p>
              <p className="text-foreground">{booking.passenger_type}</p>
            </div>
          </CardContent>
        </Card>

        {/* Booking Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Calendar className="h-5 w-5" />
              Booking Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Booking Status</p>
              <Badge variant="default" className="mt-1 bg-chart-1 text-white">
                {booking.booking_status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment Status</p>
              <Badge
                variant="default"
                className={`mt-1 ${
                  booking.payment_status === "Paid"
                    ? "bg-chart-3"
                    : "bg-muted text-muted-foreground"
                } text-white`}
              >
                {booking.payment_status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment Method</p>
              <p className="text-foreground">{booking.payment_method}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="text-2xl font-bold text-foreground">
                {booking.amount} {booking.currency}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Booked On</p>
              <p className="text-foreground">
                {format(new Date(booking.createdAt), "PPP 'at' p")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Travel Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Ship className="h-5 w-5" />
              Travel Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Travel Date</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-lg font-medium text-foreground">
                  {/* {format(new Date(booking.travel_date), "PPP")} */}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Departure Time</p>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <p className="text-foreground">{booking.departure_time}</p>
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Ferry</p>
              <p className="text-lg font-medium text-foreground">
                {booking.ferry?.ferry_name}
              </p>
              <p className="text-sm text-muted-foreground">
                {booking.ferry?.ferry_code}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Route</p>
              <div className="flex items-center gap-2">
                <RouteIcon className="h-4 w-4 text-muted-foreground" />
                <p className="text-foreground">{booking.route?.route_name}</p>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {booking.route?.departurePort} → {booking.route?.arrivalPort}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Package className="h-5 w-5" />
              Additional Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {booking.vehicle_type && (
              <div>
                <p className="text-sm text-muted-foreground">Vehicle</p>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">
                      {booking.vehicle_type}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {booking.vehicle_plate}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Livestock</p>
              <div className="flex items-center gap-2">
                <Beef className="h-4 w-4 text-muted-foreground" />
                <p className="text-foreground">
                  {booking.livestock?.cattle} cattle,{" "}
                  {booking.livestock?.sheep_goats} sheep/goats
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cargo</p>
              <div className="space-y-1 mt-1">
                <p className="text-sm text-foreground">
                  Rice: {booking.cargo?.rice_bags} bags
                </p>
                <p className="text-sm text-foreground">
                  Groundnut: {booking.cargo?.groundnut_bags} bags
                </p>
                <p className="text-sm text-foreground">
                  Cement: {booking.cargo?.cement_bags} bags
                </p>
                <p className="text-sm text-foreground">
                  Cartons: {booking.cargo?.cartons}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <DeleteBookingModal
        open={deleteModal}
        onOpenChange={setDeleteModal}
        bookingReference={booking.booking_reference}
        onConfirm={handleDelete}
      />
    </div>
  );
}
