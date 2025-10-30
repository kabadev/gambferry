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
  RouteIcon,
  MapPin,
  DollarSign,
  Clock,
} from "lucide-react";
import { DeleteRouteModal } from "../../components/delete-route-modal";
import { getRoutes } from "../../actions/route.actions";

interface Route {
  _id: string;
  route_name: string;
  departurePort: string;
  arrivalPort: string;
  distance_km: number;
  duration: string;
  base_price: number;
  status: string;
  active?: boolean;
}

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    routeId: string;
    name: string;
  }>({
    open: false,
    routeId: "",
    name: "",
  });

  // Fetch routes from server
  useEffect(() => {
    const fetchRoutes = async () => {
      setLoading(true);
      const result = await getRoutes({
        status: statusFilter !== "all" ? statusFilter : undefined,
        search: searchTerm || undefined,
        page: currentPage,
        limit: itemsPerPage,
      });

      if (result.success && result.data) {
        setRoutes(result.data.routes);
        setTotalPages(result.data.pagination.totalPages);
      }
      setLoading(false);
    };

    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchRoutes();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter, currentPage, itemsPerPage]);

  // Calculate analytics
  const analytics = useMemo(() => {
    return {
      totalRoutes: routes.length,
      activeRoutes: routes.filter((r) => r.status === "active" || r.active)
        .length,
      avgDistance:
        routes.length > 0
          ? Math.round(
              routes.reduce((sum, r) => sum + (r.distance_km || 0), 0) /
                routes.length
            )
          : 0,
      totalRevenue: routes.reduce((sum, r) => sum + (r.base_price || 0), 0),
    };
  }, [routes]);

  const handleDelete = (routeId: string, name: string) => {
    setDeleteModal({ open: true, routeId, name });
  };

  const confirmDelete = () => {
    console.log("Deleting route:", deleteModal.routeId);
    setDeleteModal({ open: false, routeId: "", name: "" });
    // Refresh routes after deletion
    setCurrentPage(1);
  };

  // Reset to page 1 when filters change
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Route Management
          </h1>
          <p className="text-muted-foreground">
            Manage ferry routes and connections
          </p>
        </div>
        <Button asChild>
          <Link href="/terminal/routes/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Route
          </Link>
        </Button>
      </div>

      {/* Analytics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Routes
            </CardTitle>
            <RouteIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {analytics.totalRoutes}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Routes
            </CardTitle>
            <RouteIcon className="h-4 w-4 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {analytics.activeRoutes}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Distance
            </CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {analytics.avgDistance} km
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Base Price Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {analytics.totalRevenue} GMD
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search routes, ports..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={handleStatusFilterChange}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Routes Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">
            All Routes ({routes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="text-muted-foreground">Loading routes...</div>
            </div>
          ) : routes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <RouteIcon className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No routes found
              </h3>
              <p className="text-muted-foreground text-center">
                Try adjusting your filters or add a new route
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-md border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Route Name</TableHead>
                      <TableHead>Departure Port</TableHead>
                      <TableHead>Arrival Port</TableHead>
                      <TableHead>Distance</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Base Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {routes.map((route) => {
                      const isActive =
                        route.status === "active" || route.active;
                      return (
                        <TableRow key={route._id}>
                          <TableCell className="font-medium">
                            {route.route_name}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              {route.departurePort}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              {route.arrivalPort}
                            </div>
                          </TableCell>
                          <TableCell>{route.distance_km} km</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              {route.duration}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {route.base_price} GMD
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={isActive ? "default" : "secondary"}
                              className={
                                isActive
                                  ? "bg-chart-3 text-white"
                                  : "bg-muted text-muted-foreground"
                              }
                            >
                              {isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={`/terminal/routes/${route._id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button variant="ghost" size="icon" asChild>
                                <Link
                                  href={`/terminal/routes/${route._id}/edit`}
                                >
                                  <Edit className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  handleDelete(route._id, route.route_name)
                                }
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
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

      <DeleteRouteModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ ...deleteModal, open })}
        routeName={deleteModal.name}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
