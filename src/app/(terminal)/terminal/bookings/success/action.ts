"use server";

import { Booking, bookings } from "@/lib/data";
import { generateTicketPDF } from "@/lib/pdf-generator";

export async function downloadTicket(booking: Booking) {
  const bookingRef = booking.booking_reference;

  if (!bookingRef) {
    return { success: false, error: "Booking reference not found" };
  }

  try {
    const result = await generateTicketPDF(booking);

    if (!result.success || !result.buffer) {
      return { success: false, error: result.error };
    }

    // Convert buffer to base64 for client download
    const base64 = result.buffer.toString("base64");

    return {
      success: true,
      pdf: base64,
      filename: result.filename,
    };
  } catch (error) {
    console.error("Download ticket error:", error);
    return { success: false, error: "Failed to generate ticket" };
  }
}

export async function printTicket(booking: Booking) {
  const bookingRef = booking.booking_reference;

  if (!bookingRef) {
    return { success: false, error: "Booking reference not found" };
  }

  try {
    const result = await generateTicketPDF(booking);

    if (!result.success || !result.buffer) {
      return { success: false, error: result.error };
    }

    // Convert buffer to base64 for printing
    const base64 = result.buffer.toString("base64");

    return {
      success: true,
      pdf: base64,
      action: "print", // Indicates this should trigger print dialog
    };
  } catch (error) {
    console.error("Print ticket error:", error);
    return { success: false, error: "Failed to generate ticket" };
  }
}

export async function sendTicketEmail(booking: Booking) {
  const bookingRef = booking.booking_reference;

  if (!bookingRef) {
    return { success: false, error: "Booking reference not found" };
  }

  try {
    // Generate PDF
    const result = await generateTicketPDF(booking);

    if (!result.success || !result.buffer) {
      return { success: false, error: result.error };
    }

    // For now, we'll simulate the email sending
    console.log("Sending email to:", booking.passenger_email);
    console.log("PDF size:", result.buffer.length, "bytes");

    // Example with Resend (uncomment when you have RESEND_API_KEY):
    /*
    const { Resend } = require('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    await resend.emails.send({
      from: 'Gambia Ferry Services <bookings@gambiaferry.gm>',
      to: booking.passenger_email,
      subject: `Ferry Booking Confirmation - ${booking.booking_reference}`,
      html: `
        <h1>Booking Confirmed!</h1>
        <p>Dear ${booking.passenger_name},</p>
        <p>Your ferry booking has been confirmed. Please find your ticket attached.</p>
        <p><strong>Booking Reference:</strong> ${booking.booking_reference}</p>
        <p><strong>Travel Date:</strong> ${new Date(booking.travel_date).toLocaleDateString()}</p>
        <p>Please arrive at least 45 minutes before departure.</p>
        <p>Best regards,<br>Gambia Ferry Services</p>
      `,
      attachments: [
        {
          filename: result.filename,
          content: result.buffer,
        },
      ],
    });
    */

    // Simulate successful email send
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
      success: true,
      message: "Ticket sent successfully",
    };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error: "Failed to send email" };
  }
}
