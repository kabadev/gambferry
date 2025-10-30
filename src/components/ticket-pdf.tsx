import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
    position: "relative",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: 200,
    opacity: 0.5, // adjust opacity for watermark effect
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  bookingRef: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    padding: 10,
    borderRadius: 5,
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: 20,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    marginBottom: 20,
  },
  column: {
    flex: 1,
    paddingRight: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
    paddingBottom: 5,
    borderBottom: "1px solid #e5e7eb",
  },
  field: {
    marginBottom: 8,
  },
  label: {
    fontSize: 9,
    color: "#6b7280",
    marginBottom: 2,
  },
  value: {
    fontSize: 10,
    fontWeight: "bold",
  },
  qrSection: {
    alignItems: "center",
    justifyContent: "center",
  },
  qrCode: {
    width: 150,
    height: 150,
    marginBottom: 10,
  },
  qrText: {
    fontSize: 9,
    color: "#6b7280",
    textAlign: "center",
  },
  warningBox: {
    backgroundColor: "#fef3c7",
    borderLeft: "4px solid #f59e0b",
    padding: 15,
    marginTop: 20,
  },
  warningTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#92400e",
    marginBottom: 8,
  },
  warningList: {
    fontSize: 9,
    color: "#92400e",
    lineHeight: 1.5,
  },
  warningItem: {
    marginBottom: 4,
  },
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTop: "1px solid #e5e7eb",
    textAlign: "center",
    fontSize: 9,
    color: "#6b7280",
  },
});

interface TicketPDFProps {
  booking: {
    booking_reference: string;
    passenger_name: string;
    passenger_phone: string;
    passenger_email: string;
    travel_date: string;
    departure_time?: string;
    ferry_name?: string;
    route_name?: string;
    num_passengers: number;
    vehicle_type?: string;
    license_plate?: string;
    cattle_count?: number;
    sheep_goat_count?: number;
    rgc_bags?: number;
    carton_count?: number;
    payment_method: string;
    amount?: number;
    currency: string;
  };
  qrCodeDataUrl: string;
}

export function TicketPDF({ booking, qrCodeDataUrl }: TicketPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image
          // src={`${process.env.NEXT_PUBLIC_BASE_URL}/banner.png`}
          src="https://images.pexels.com/photos/1315655/pexels-photo-1315655.jpeg"
          style={styles.backgroundImage}
        />
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Booking Confirmed!</Text>
          {/* <Text style={styles.subtitle}>
            Your ferry booking has been successfully created
          </Text> */}
          <Text style={styles.bookingRef}>
            Booking Reference: {booking.booking_reference}
          </Text>
        </View>

        {/* Main Card */}
        <View style={styles.card}>
          {/* First Row: Trip, Passenger, QR */}
          <View style={styles.row}>
            {/* Trip Information */}
            <View style={styles.column}>
              <Text style={styles.sectionTitle}>TRIP INFORMATION</Text>
              <View style={styles.field}>
                <Text style={styles.label}>Route</Text>
                <Text style={styles.value}>
                  {booking.route_name || "Banjul Port → Barra Port"}
                </Text>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Travel Date</Text>
                <Text style={styles.value}>
                  {new Date(booking.travel_date).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Departure Time</Text>
                <Text style={styles.value}>
                  {booking.departure_time || "6:00 AM"}
                </Text>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Ferry Type</Text>
                <Text style={styles.value}>
                  {booking.ferry_name || "Ferry Cargo"}
                </Text>
              </View>
            </View>

            {/* Passenger Information */}
            <View style={styles.column}>
              <Text style={styles.sectionTitle}>PASSENGER INFORMATION</Text>
              <View style={styles.field}>
                <Text style={styles.label}>Full Name</Text>
                <Text style={styles.value}>
                  {booking.passenger_name.toUpperCase()}
                </Text>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Contact Number</Text>
                <Text style={styles.value}>{booking.passenger_phone}</Text>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.value}>{booking.passenger_email}</Text>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Number of Passengers</Text>
                <Text style={styles.value}>{booking.num_passengers}</Text>
              </View>
            </View>

            {/* QR Code */}
            <View style={[styles.column, styles.qrSection]}>
              <Image
                src={qrCodeDataUrl || "/placeholder.svg"}
                style={styles.qrCode}
              />
              <Text style={styles.qrText}>
                Scan this QR code at the ferry terminal
              </Text>
            </View>
          </View>

          {/* Second Row: Livestock, Cargo, Vehicle */}
          <View style={styles.row}>
            {/* Livestock */}
            <View style={styles.column}>
              <Text style={styles.sectionTitle}>LIVE STOCK INFORMATION</Text>
              <View style={styles.field}>
                <Text style={styles.label}>Number of Cattle</Text>
                <Text style={styles.value}>{booking.cattle_count || 0}</Text>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Number of Sheep/Goats</Text>
                <Text style={styles.value}>
                  {booking.sheep_goat_count || 0}
                </Text>
              </View>
            </View>

            {/* Cargo */}
            <View style={styles.column}>
              <Text style={styles.sectionTitle}>CARGO INFORMATION</Text>
              <View style={styles.field}>
                <Text style={styles.label}>
                  Number of Rice/Groundnut/Cement
                </Text>
                <Text style={styles.value}>{booking.rgc_bags || 0}</Text>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Pre-packed Carton/Package</Text>
                <Text style={styles.value}>{booking.carton_count || 0}</Text>
              </View>
            </View>

            {/* Vehicle */}
            <View style={styles.column}>
              <Text style={styles.sectionTitle}>VEHICLE INFORMATION</Text>
              <View style={styles.field}>
                <Text style={styles.label}>Vehicle Type</Text>
                <Text style={styles.value}>
                  {booking.vehicle_type || "None"}
                </Text>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>License Plate</Text>
                <Text style={styles.value}>
                  {booking.license_plate || "N/A"}
                </Text>
              </View>
            </View>
          </View>

          {/* Payment Information */}
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.sectionTitle}>PAYMENT INFORMATION</Text>
            <View style={{ flexDirection: "row" }}>
              <View style={[styles.column, { flex: 1 }]}>
                <View style={styles.field}>
                  <Text style={styles.label}>Payment Method</Text>
                  <Text style={styles.value}>{booking.payment_method}</Text>
                </View>
              </View>
              <View style={[styles.column, { flex: 1 }]}>
                <View style={styles.field}>
                  <Text style={styles.label}>Amount</Text>
                  <Text style={styles.value}>
                    {booking.currency} {booking.amount?.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Warning Box */}
          <View style={styles.warningBox}>
            <Text style={styles.warningTitle}>Important Information</Text>
            <View style={styles.warningList}>
              <Text style={styles.warningItem}>
                • Arrive at least 45 minutes before departure time
              </Text>
              <Text style={styles.warningItem}>
                • Bring valid ID matching your booking information
              </Text>
              <Text style={styles.warningItem}>
                • Vehicle passengers must also have individual tickets
              </Text>
              <Text style={styles.warningItem}>
                • Tickets are non-transferable and non-refundable
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Gambia Ferry Services Company Ltd</Text>
          <Text>Banjul Ferry Terminal, Banjul, The Gambia</Text>
          <Text>+220 123 4567 | info@gambiaferry.gm</Text>
        </View>
      </Page>
    </Document>
  );
}
