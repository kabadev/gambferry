"use client";
import { Suspense, useEffect, useState } from "react";
import SuccessContent from "./SuccessContent";
import { useSearchParams } from "next/navigation";
import { getBookingById } from "@/app/(terminal)/actions/booking.actions";

// Separate component that uses useSearchParams
function BookingLoader() {
  const searchParams = useSearchParams();
  const [booking, setBooking] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      setIsLoading(true);
      let ref = searchParams.get("ref") || "";
      // Decode URL-encoded characters like %3F
      ref = decodeURIComponent(ref);
      // Split at '?' in case it contains extra query info
      if (ref.includes("?")) {
        ref = ref.split("?")[0];
      }
      const bookingData = await getBookingById(ref);
      setBooking(bookingData.data);
      setIsLoading(false);
    };

    fetchBooking();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your ticket...</p>
        </div>
      </div>
    );
  }

  return <SuccessContent booking={booking} />;
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-12">
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">
                  Loading your ticket...
                </p>
              </div>
            </div>
          }
        >
          <BookingLoader />
        </Suspense>
      </main>
    </div>
  );
}
