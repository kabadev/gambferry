"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  Trash2,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { BookingFilters } from "../../components/booking-filters";
import { DeleteBookingModal } from "../../components/delete-booking-modal";
import {
  deleteBooking,
  getBookingAnalytics,
  getBookings,
} from "../../actions/booking.actions";

interface Booking {
  _id: string;
  booking_reference: string;
  passenger_name: string;
  passenger_email: string;
  passenger_phone: string;
  num_passengers: number;
  passenger_type: string;
  vehicle_type?: string;
  vehicle_plate?: string;
  amount: number;
  currency: string;
  payment_status: string;
  booking_status: string;
  payment_method?: string;
  route?: {
    _id: string;
    route_name: string;
    departurePort: string;
    arrivalPort: string;
  };
  schedule?: {
    _id: string;
    departureDate: string;
    departureTime: string;
    arrivalTime: string;
  };
  ferry?: {
    _id: string;
    ferry_name: string;
  };
  livestock?: {
    cattle: number;
    sheep_goats: number;
  };
  cargo?: {
    rice_bags: number;
    groundnut_bags: number;
    cement_bags: number;
    cartons: number;
  };
  departure_date: string;
  createdAt: string;
  updatedAt: string;
}

interface Analytics {
  totalBookings: number;
  totalRevenue: number;
  totalPassengers: number;
  totalVehicles: number;
  totalCattle: number;
  totalSheepGoats: number;
  totalCargo: number;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalBookings: 0,
    totalRevenue: 0,
    totalPassengers: 0,
    totalVehicles: 0,
    totalCattle: 0,
    totalSheepGoats: 0,
    totalCargo: 0,
  });
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [analysisView, setAnalysisView] = useState<"day" | "week" | "month">(
    "day"
  );

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    bookingId: string;
    reference: string;
  }>({
    open: false,
    bookingId: "",
    reference: "",
  });

  // Fetch bookings
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const result = await getBookings({
        status: statusFilter,
        paymentStatus: paymentFilter,
        search: searchTerm,
        dateFilter: dateFilter ? format(dateFilter, "yyyy-MM-dd") : undefined,
        page: currentPage,
        limit: itemsPerPage,
      });

      if (result.success && result.data) {
        setBookings(result.data.bookings);
        setTotalPages(result.data.pagination.totalPages || 1);
      } else {
        // toast({
        //   title: "Error",
        //   description: result.error || "Failed to fetch bookings",
        //   variant: "destructive",
        // });
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      // toast({
      //   title: "Error",
      //   description: "An unexpected error occurred",
      //   variant: "destructive",
      // });
    } finally {
      setLoading(false);
    }
  };

  // Fetch analytics
  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const result = await getBookingAnalytics(analysisView);

      if (result.success && result.data) {
        setAnalytics(result.data);
      } else {
        console.error("Analytics error:", result.error);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchBookings();
  }, [
    searchTerm,
    statusFilter,
    paymentFilter,
    dateFilter,
    currentPage,
    itemsPerPage,
  ]);

  // Fetch analytics when view changes
  useEffect(() => {
    fetchAnalytics();
  }, [analysisView]);

  const handleDelete = (bookingId: string, reference: string) => {
    setDeleteModal({ open: true, bookingId, reference });
  };

  const confirmDelete = async () => {
    try {
      const result = await deleteBooking(deleteModal.bookingId);

      if (result.success) {
        // toast({
        //   title: "Success",
        //   description: "Booking deleted successfully",
        // });
        fetchBookings();
        fetchAnalytics();
      } else {
        // toast({
        //   title: "Error",
        //   description: result.error || "Failed to delete booking",
        //   variant: "destructive",
        // });
      }
    } catch (error) {
      console.error("Error deleting booking:", error);
      // toast({
      //   title: "Error",
      //   description: "An unexpected error occurred",
      //   variant: "destructive",
      // });
    } finally {
      setDeleteModal({ open: false, bookingId: "", reference: "" });
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPaymentFilter("all");
    setDateFilter(undefined);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Bookings
          </h1>
          <p className="text-muted-foreground">
            Manage and track all ferry bookings
          </p>
        </div>
      </div>

      {/* Analytics Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">Booking Analysis</CardTitle>
            <Select
              value={analysisView}
              onValueChange={(v) => setAnalysisView(v as any)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {analyticsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-1/10">
                    <Calendar className="h-6 w-6 text-chart-1" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Bookings</p>
                    <p className="text-2xl font-bold text-foreground">
                      {analytics.totalBookings}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
                    <DollarSign className="h-6 w-6 text-chart-2" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="text-2xl font-bold text-foreground">
                      {analytics.totalRevenue.toLocaleString()} GMD
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-3/10">
                    <Users className="h-6 w-6 text-chart-3" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Passengers</p>
                    <p className="text-2xl font-bold text-foreground">
                      {analytics.totalPassengers}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/10">
                    <TrendingUp className="h-6 w-6 text-chart-4" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Vehicles</p>
                    <p className="text-2xl font-bold text-foreground">
                      {analytics.totalVehicles}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-sm text-muted-foreground">Livestock</p>
                  <p className="text-lg font-semibold text-foreground">
                    {analytics.totalCattle} cattle, {analytics.totalSheepGoats}{" "}
                    sheep/goats
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-sm text-muted-foreground">Cargo Items</p>
                  <p className="text-lg font-semibold text-foreground">
                    {analytics.totalCargo} total items
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-sm text-muted-foreground">
                    Avg. Booking Value
                  </p>
                  <p className="text-lg font-semibold text-foreground">
                    {analytics.totalBookings > 0
                      ? Math.round(
                          analytics.totalRevenue / analytics.totalBookings
                        )
                      : 0}{" "}
                    GMD
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <BookingFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            paymentFilter={paymentFilter}
            setPaymentFilter={setPaymentFilter}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            onReset={resetFilters}
          />
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">
            All Bookings ({bookings.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No bookings found</p>
            </div>
          ) : (
            <>
              <div className="rounded-md border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Passenger</TableHead>
                      <TableHead>Travel Date</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Passengers</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking._id}>
                        <TableCell className="font-medium">
                          {booking.booking_reference}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {booking.passenger_name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {booking.passenger_email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {booking.departure_date
                            ? format(
                                new Date(booking.departure_date),
                                "MMM dd, yyyy"
                              )
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="font-medium">
                              {booking.route?.route_name || "N/A"}
                            </p>
                            <p className="text-muted-foreground">
                              {booking.schedule?.departureTime || "N/A"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{booking.num_passengers}</TableCell>
                        <TableCell className="font-medium">
                          {booking.amount} {booking.currency}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              booking.payment_status === "Paid"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              booking.payment_status === "Paid"
                                ? "bg-green-500 text-white hover:bg-green-600"
                                : "bg-yellow-500 text-white hover:bg-yellow-600"
                            }
                          >
                            {booking.payment_status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              booking.booking_status === "Confirmed"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              booking.booking_status === "Confirmed"
                                ? "bg-blue-500 text-white hover:bg-blue-600"
                                : "bg-gray-500 text-white hover:bg-gray-600"
                            }
                          >
                            {booking.booking_status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`/terminal/bookings/${booking._id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleDelete(
                                  booking._id,
                                  booking.booking_reference
                                )
                              }
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Rows per page:
                  </span>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(v) => {
                      setItemsPerPage(Number(v));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[70px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <DeleteBookingModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ ...deleteModal, open })}
        bookingReference={deleteModal.reference}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
