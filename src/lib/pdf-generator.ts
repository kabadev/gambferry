"use server";

import { renderToBuffer } from "@react-pdf/renderer";
import { TicketPDF } from "@/components/ticket-pdf";
import QRCode from "qrcode";

export async function generateTicketPDF(booking: any) {
  try {
    // Generate QR code as data URL
    const qrCodeData = JSON.stringify({
      ref: booking.booking_reference,
      name: booking.passenger_name,
      date: booking.travel_date,
      route: booking.route_name || "Banjul Port → Barra Port",
      passengers: booking.num_passengers,
    });

    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeData, {
      width: 300,
      margin: 2,
    });

    // Generate PDF
    const pdfBuffer = await renderToBuffer(
      TicketPDF({
        booking,
        qrCodeDataUrl,
      })
    );

    return {
      success: true,
      buffer: pdfBuffer,
      filename: `ferry-ticket-${booking.booking_reference}.pdf`,
    };
  } catch (error) {
    console.error("PDF generation error:", error);
    return {
      success: false,
      error: "Failed to generate PDF",
    };
  }
}
