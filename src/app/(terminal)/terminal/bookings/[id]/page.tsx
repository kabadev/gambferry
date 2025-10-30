import { getBookingById } from "@/app/(app)/booking/action";
import { Button } from "@/components/ui/button";
import BookingDetails from "./BookingDetail";

export default async function BookingDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const booking = await getBookingById(id);

  if (!booking) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">
            Booking Not Found
          </h2>
          <p className="text-muted-foreground mt-2">
            The booking you're looking for doesn't exist.
          </p>
          <Button
            // onClick={() => router.push("/terminal/bookings")}
            className="mt-4"
          >
            Back to Bookings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <BookingDetails booking={booking.booking} />
    </div>
  );
}
