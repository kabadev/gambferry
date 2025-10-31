"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Ship,
  User,
  Package,
  Truck,
  CreditCard,
  AlertTriangle,
  Download,
  Mail,
  Printer,
} from "lucide-react";

import { QRCodeGenerator } from "@/components/qr-code-generator";
import { downloadTicket, printTicket, sendTicketEmail } from "./action";

export default function SuccessContent({ booking }: { booking: any }) {
  const bookingRef = booking?.booking_reference;
  const [emailSent, setEmailSent] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [printing, setPrinting] = useState(false);

  // Automatically send ticket email on component mount

  // useEffect(() => {
  //   if (booking && !emailSent) {
  //     sendTicketEmail(bookingRef!)
  //       .then((result) => {
  //         if (result.success) {
  //           setEmailSent(true);
  //           console.log("Ticket email sent successfully");
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("Failed to send email:", error);
  //       });
  //   }
  // }, [booking, bookingRef, emailSent]);

  const handleDownload = async () => {
    if (!bookingRef) return;
    setDownloading(true);
    try {
      const result = await downloadTicket(booking);

      if (result.success && result.pdf) {
        const byteCharacters = atob(result.pdf);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = result.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Failed to download ticket:", error);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = async () => {
    if (!bookingRef) return;
    setPrinting(true);
    try {
      const result = await printTicket(booking);

      if (result.success && result.pdf) {
        const byteCharacters = atob(result.pdf);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        // Open PDF in new window and trigger print dialog
        const printWindow = window.open(url, "_blank");
        if (printWindow) {
          printWindow.onload = () => {
            printWindow.print();
            // Optional: close window after printing (user can cancel)
            // printWindow.onafterprint = () => printWindow.close();
          };
        }

        // Clean up the URL after a delay to ensure it loads
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } catch (error) {
      console.error("Failed to print ticket:", error);
    } finally {
      setPrinting(false);
    }
  };

  if (!booking) {
    return (
      <div className="max-w-2xl mx-auto bg-card shadow-xl rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Booking Not Found</h2>
        <p className="text-gray-600 mb-6">
          We couldn't find a booking with that reference.
        </p>
        <Button asChild>
          <Link href="/new-booking">Make a New Booking</Link>
        </Button>
      </div>
    );
  }

  const qrCodeData = JSON.stringify({
    ref: booking.booking_reference,
    name: booking.passenger_name,
    date: booking.schedule?.departureDate,
    route: booking.route?.route_name || "Banjul Port → Barra Port",
    passengers: booking.num_passengers,
  });

  return (
    <>
      {/* Confirmation Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-muted-foreground sm:text-4xl">
          Booking Confirmed!
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          Your ferry booking has been successfully created
        </p>
        <div className="mt-6">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800">
            <CheckCircle2 className="w-5 h-5 mr-2" />
            <span className="font-medium">
              Booking Reference: {booking.booking_reference}
            </span>
          </div>
        </div>
        {emailSent && (
          <div className="mt-4 inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800">
            <Mail className="w-4 h-4 mr-2" />
            <span className="text-sm">
              Ticket sent to {booking.passenger_email}
            </span>
          </div>
        )}
      </div>

      {/* Ticket Card */}
      <div
        className="bg-card shadow-xl rounded-lg overflow-hidden max-w-5xl mx-auto"
        id="ticketCard"
      >
        <div className="p-6 sm:p-8">
          {/* First row: Trip Info, Passenger Info, QR Code */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Trip Information */}
            <div>
              <h3 className="text-lg font-semibold text-muted-foreground mb-4 border-b pb-2 flex items-center">
                <Ship className="w-5 h-5 mr-2" />
                TRIP INFORMATION
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Route</p>
                  <p className="text-sm font-semibold text-muted-foreground">
                    {booking.route?.route_name || "Banjul Port → Barra Port"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Travel Date</p>
                  <p className="text-sm font-semibold text-muted-foreground">
                    {booking.schedule?.departureDate
                      ? new Date(
                          booking.schedule.departureDate
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Departure Time</p>
                  <p className="text-sm font-semibold text-muted-foreground">
                    {booking.schedule?.departureTime || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Arrival Time</p>
                  <p className="text-sm font-semibold text-muted-foreground">
                    {booking.schedule?.arrivalTime || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Ferry Type</p>
                  <p className="text-sm font-semibold text-muted-foreground">
                    {booking.ferry?.ferry_name || "Ferry Cargo"}
                  </p>
                </div>
              </div>
            </div>

            {/* Passenger Information */}
            <div>
              <h3 className="text-lg font-semibold text-muted-foreground mb-4 border-b pb-2 flex items-center">
                <User className="w-5 h-5 mr-2" />
                PASSENGER INFORMATION
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Full Name</p>
                  <p className="text-sm font-semibold text-muted-foreground uppercase">
                    {booking.passenger_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Contact Number</p>
                  <p className="text-sm font-semibold text-muted-foreground">
                    {booking.passenger_phone}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm font-semibold text-muted-foreground">
                    {booking.passenger_email}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Number of Passengers</p>
                  <p className="text-sm font-semibold text-muted-foreground">
                    {booking.num_passengers}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Passenger Type</p>
                  <p className="text-sm font-semibold text-muted-foreground">
                    {booking.passenger_type || "Economy"}
                  </p>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[200px] mb-4">
                <QRCodeGenerator value={qrCodeData} size={200} />
              </div>
              <p className="text-center text-sm">
                Scan this QR code at the ferry terminal
              </p>
            </div>
          </div>

          {/* Second row: Livestock, Cargo, Vehicle */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Livestock Information */}
            <div>
              <h3 className="text-lg font-semibold text-muted-foreground mb-4 border-b pb-2 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                LIVE STOCK INFORMATION
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Number of Cattle</p>
                  <p className="text-sm font-semibold text-muted-foreground">
                    {booking.livestock?.cattle || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Number of Sheep/Goats</p>
                  <p className="text-sm font-semibold text-muted-foreground">
                    {booking.livestock?.sheep_goats || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Cargo Information */}
            <div>
              <h3 className="text-lg font-semibold text-muted-foreground mb-4 border-b pb-2 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                CARGO INFORMATION
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Rice Bags</p>
                  <p className="text-sm font-semibold text-muted-foreground">
                    {booking.cargo?.rice_bags || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Groundnut Bags</p>
                  <p className="text-sm font-semibold text-muted-foreground">
                    {booking.cargo?.groundnut_bags || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Cement Bags</p>
                  <p className="text-sm font-semibold text-muted-foreground">
                    {booking.cargo?.cement_bags || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Cartons/Packages</p>
                  <p className="text-sm font-semibold text-muted-foreground">
                    {booking.cargo?.cartons || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Vehicle Information */}
            <div>
              <h3 className="text-lg font-semibold text-muted-foreground mb-4 border-b pb-2 flex items-center">
                <Truck className="w-5 h-5 mr-2" />
                VEHICLE INFORMATION
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Vehicle Type</p>
                  <p className="text-sm font-semibold text-muted-foreground">
                    {booking.vehicle?.type || "None"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">License Plate</p>
                  <p className="text-sm font-semibold text-muted-foreground">
                    {booking.vehicle?.license_plate || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-muted-foreground mb-4 border-b pb-2 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              PAYMENT INFORMATION
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium">Payment Method</p>
                <p className="text-sm font-semibold text-muted-foreground">
                  {booking.payment_method}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Amount</p>
                <p className="text-sm font-semibold text-muted-foreground">
                  {booking.currency} {booking.amount?.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Payment Status</p>
                <p className="text-sm font-semibold text-muted-foreground">
                  {booking.payment_status}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Booking Status</p>
                <p className="text-sm font-semibold text-muted-foreground">
                  {booking.booking_status}
                </p>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-yellow-50 dark:bg-yellow-500/20 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Important Information
                </h3>
                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Arrive at least 45 minutes before departure time</li>
                    <li>Bring valid ID matching your booking information</li>
                    <li>
                      Vehicle passengers must also have individual tickets
                    </li>
                    <li>Tickets are non-transferable and non-refundable</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 sm:px-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <Button asChild variant="outline">
            <Link href="/terminal/bookings/new-booking">
              Book Another Ferry
            </Link>
          </Button>

          <Button onClick={handleDownload} disabled={downloading}>
            <Download className="w-4 h-4 mr-2" />
            {downloading ? "Downloading..." : "Download Ticket"}
          </Button>
          <Button onClick={handlePrint} disabled={printing}>
            <Printer className="w-4 h-4 mr-2" />
            {printing ? "Printing..." : "Print Ticket"}
          </Button>
        </div>
      </div>
    </>
  );
}
