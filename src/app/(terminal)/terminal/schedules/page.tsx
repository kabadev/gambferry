"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Calendar,
  Ship,
  Clock,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { format, isToday, isThisWeek, isThisMonth } from "date-fns";
import { DeleteScheduleModal } from "../../components/delete-schedule-modal";

import { toast } from "sonner"; // or your toast library
import {
  deleteSchedule,
  getScheduleAnalytics,
  getSchedules,
} from "../../actions/schedule.actions";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

type Schedule = {
  _id: string;
  ferryId: {
    _id: string;
    name: string;
    registrationNumber: string;
  };
  routeId: {
    _id: string;
    name: string;
    departurePort: string;
    arrivalPort: string;
  };
  departureTime: string;
  arrivalTime: string;
  availableSeats: number;
  price: number;
  status: string;
};

type Analytics = {
  totalSchedules: number;
  scheduledTrips: number;
  departedTrips: number;
  arrivedTrips: number;
  cancelledTrips: number;
  delayedTrips: number;
  totalRevenuePotential: number;
};

export default function SchedulesPage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSchedules, setTotalSchedules] = useState(0);

  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    scheduleId: string;
  }>({
    open: false,
    scheduleId: "",
  });

  const [analysisView, setAnalysisView] = useState<"today" | "week" | "month">(
    "today"
  );

  // Fetch schedules
  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const result = await getSchedules({
        status: statusFilter !== "all" ? statusFilter : undefined,
        search: searchTerm || undefined,
        page: currentPage,
        limit: itemsPerPage,
      });

      if (result.success && result.data) {
        setSchedules(result.data.schedules);
        setTotalPages(result.data.pagination.totalPages);
        setTotalSchedules(result.data.pagination.total);
      } else {
        toast.error(result.error || "Failed to fetch schedules");
      }
    } catch (error) {
      toast.error("An error occurred while fetching schedules");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch analytics
  const fetchAnalytics = async () => {
    setAnalyticsLoading(true);
    try {
      const result = await getScheduleAnalytics(analysisView);

      if (result.success && result.data) {
        setAnalytics(result.data);
      } else {
        toast.error(result.error || "Failed to fetch analytics");
      }
    } catch (error) {
      toast.error("An error occurred while fetching analytics");
      console.error(error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Fetch on mount and when filters change
  useEffect(() => {
    fetchSchedules();
  }, [statusFilter, currentPage, itemsPerPage]);

  // Fetch analytics when view changes
  useEffect(() => {
    fetchAnalytics();
  }, [analysisView]);

  // Search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        fetchSchedules();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleDelete = (scheduleId: string) => {
    setDeleteModal({ open: true, scheduleId });
  };

  const confirmDelete = async () => {
    try {
      const result = await deleteSchedule(deleteModal.scheduleId);

      if (result.success) {
        toast.success("Schedule deleted successfully");
        fetchSchedules();
        fetchAnalytics();
      } else {
        toast.error(result.error || "Failed to delete schedule");
      }
    } catch (error) {
      toast.error("An error occurred while deleting schedule");
      console.error(error);
    } finally {
      setDeleteModal({ open: false, scheduleId: "" });
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "scheduled":
        return "bg-chart-1 text-white";
      case "departed":
        return "bg-blue-500 text-white";
      case "delayed":
        return "bg-destructive text-white";
      case "arrived":
        return "bg-chart-3 text-white";
      case "cancelled":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-bold tracking-tight text-foreground">
            Schedule Management
          </h1>
          <p className="text-muted-foreground">
            Manage ferry schedules and trips
          </p>
        </div>
        <Button asChild>
          <Link href="/terminal/schedules/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Schedule
          </Link>
        </Button>
      </div>

      {/* Analytics */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">Schedule Analysis</CardTitle>
            <Select
              value={analysisView}
              onValueChange={(v) => setAnalysisView(v as any)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
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
          ) : analytics ? (
            <div className="grid gap-4 md:grid-cols-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-1/10">
                  <Calendar className="h-6 w-6 text-chart-1" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Schedules
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {analytics.totalSchedules}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
                  <Ship className="h-6 w-6 text-chart-2" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled</p>
                  <p className="text-2xl font-bold text-foreground">
                    {analytics.scheduledTrips}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                  <Clock className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Delayed</p>
                  <p className="text-2xl font-bold text-foreground">
                    {analytics.delayedTrips}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-3/10">
                  <TrendingUp className="h-6 w-6 text-chart-3" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Arrived</p>
                  <p className="text-2xl font-bold text-foreground">
                    {analytics.arrivedTrips}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              No analytics data available
            </p>
          )}
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by ferry, route, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="departed">Departed</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
                <SelectItem value="arrived">Arrived</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Schedules Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">
            All Schedules ({totalSchedules})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : schedules.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No schedules found</p>
            </div>
          ) : (
            <>
              <div className="rounded-md border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ferry</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Departure</TableHead>
                      <TableHead>Arrival</TableHead>
                      <TableHead>Departure Date</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schedules.map((schedule) => (
                      <TableRow key={schedule._id}>
                        <TableCell>
                          <div className="flex gap-2 line-clamp-1">
                            <Image
                              src={schedule.ferry_id?.ferry_image}
                              alt={schedule.ferry_id?.ferry_name}
                              width={40}
                              height={40}
                              className="rounded-sm"
                            />
                            <div>
                              <p className="font-medium">
                                {schedule.ferry_id?.ferry_name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {schedule.ferry_id?.ferry_code}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="font-medium">
                              {schedule.route_id?.route_name}
                            </p>
                            <p className="text-muted-foreground text-xs">
                              {schedule.route_id?.departurePort} →{" "}
                              {schedule.route_id?.arrivalPort}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatDate(schedule.departureDate)}
                        </TableCell>
                        <TableCell>
                          {/* {format(
                            new Date(schedule.departureTime),
                            "MMM dd, yyyy HH:mm"
                          )} */}
                          {schedule.departureTime}
                        </TableCell>
                        <TableCell>
                          {/* {format(
                            new Date(schedule.arrivalTime),
                            "MMM dd, yyyy HH:mm"
                          )} */}
                          {/* {formatDate(schedule.arrivalTime)} */}
                          {schedule.arrivalTime}
                        </TableCell>

                        <TableCell>
                          GMD{schedule?.route_id?.base_price}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={getStatusBadgeClass(schedule.status)}
                          >
                            {schedule.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" asChild>
                              <Link
                                href={`/terminal/schedules/${schedule._id}`}
                              >
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="icon" asChild>
                              <Link
                                href={`/terminal/schedules/${schedule._id}/edit`}
                              >
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(schedule._id)}
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
                    disabled={currentPage === 1 || loading}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages || loading}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <DeleteScheduleModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ ...deleteModal, open })}
        scheduleId={deleteModal.scheduleId}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
