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
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Ship,
  Users,
  Package,
} from "lucide-react";

import Image from "next/image";
import { DeleteFerryModal } from "../../components/delete-ferry-modal";
import { getFerries } from "../../actions/ferry.actions";
import { Ferry } from "@/lib/data";

// interface Ferry {
//   _id: string;
//   name: string;
//   registrationNumber: string;
//   type: string;
//   status: string;
//   image?: string;
//   passengersCapacity: number;
//   cattleCapacity: number;
//   rgcCapacity: number;
//   sgCapacity: number;
//   description?: string;
// }

export default function FerriesPage() {
  const [ferries, setFerries] = useState<Ferry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    ferryId: string;
    name: string;
  }>({
    open: false,
    ferryId: "",
    name: "",
  });

  // Fetch ferries from server
  useEffect(() => {
    const fetchFerries = async () => {
      setLoading(true);
      const result = await getFerries({
        status: statusFilter !== "all" ? statusFilter : undefined,
        search: searchTerm || undefined,
        page: currentPage,
        limit: itemsPerPage,
      });

      if (result.success && result.data) {
        setFerries(result.data.ferries);
        setTotalPages(result.data.pagination.totalPages);
      }
      setLoading(false);
    };

    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchFerries();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter, currentPage, itemsPerPage]);

  // Client-side type filtering (since server doesn't support it yet)
  const filteredFerries = useMemo(() => {
    if (typeFilter === "all") return ferries;
    return ferries.filter((ferry) => ferry.ferry_type === typeFilter);
  }, [ferries, typeFilter]);

  // Calculate analytics
  const analytics = useMemo(() => {
    return {
      totalFerries: filteredFerries.length,
      activeFerries: filteredFerries.filter((f) => f.status === "Active")
        .length,
      totalPassengerCapacity: filteredFerries.reduce(
        (sum, f) => sum + (f.passengers_capacity || 0),
        0
      ),
      totalCattleCapacity: filteredFerries.reduce(
        (sum, f) => sum + (f.cattle_capacity || 0),
        0
      ),
    };
  }, [filteredFerries]);

  const handleDelete = (ferryId: string, name: string) => {
    setDeleteModal({ open: true, ferryId, name });
  };

  const confirmDelete = () => {
    console.log("Deleting ferry:", deleteModal.ferryId);
    setDeleteModal({ open: false, ferryId: "", name: "" });
    // Refresh ferries after deletion
    setCurrentPage(1);
  };

  // Reset to page 1 when filters change
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value);
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
            Ferry Management
          </h1>
          <p className="text-muted-foreground">Manage your ferry fleet</p>
        </div>
        <Button asChild>
          <Link href="/terminal/ferries/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Ferry
          </Link>
        </Button>
      </div>

      {/* Analytics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Ferries
            </CardTitle>
            <Ship className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {analytics.totalFerries}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Ferries
            </CardTitle>
            <Ship className="h-4 w-4 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {analytics.activeFerries}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Passenger Capacity
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {analytics.totalPassengerCapacity}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cattle Capacity
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {analytics.totalCattleCapacity}
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
                placeholder="Search by name or registration number..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={typeFilter} onValueChange={handleTypeFilterChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ferry Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Passenger Ferry">Passenger Ferry</SelectItem>
                <SelectItem value="Cargo Ferry">Cargo Ferry</SelectItem>
                <SelectItem value="Vehicle Ferry">Vehicle Ferry</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={handleStatusFilterChange}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="text-muted-foreground">Loading ferries...</div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredFerries.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Ship className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No ferries found
            </h3>
            <p className="text-muted-foreground text-center">
              Try adjusting your filters or add a new ferry
            </p>
          </CardContent>
        </Card>
      )}

      {/* Ferry Grid */}
      {!loading && filteredFerries.length > 0 && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredFerries.map((ferry) => (
            <Card key={ferry._id} className="overflow-hidden">
              <div className="relative h-48 w-full bg-muted">
                {ferry.ferry_image ? (
                  <Image
                    src={ferry.ferry_image || "/placeholder.svg"}
                    alt={ferry.ferry_name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Ship className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
                <Badge
                  className={`absolute top-2 right-2 ${
                    ferry.status === "Active" ? "bg-chart-3" : "bg-muted"
                  }`}
                  variant={ferry.status === "Active" ? "default" : "secondary"}
                >
                  {ferry.status}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-foreground">
                  {ferry.ferry_name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {ferry.ferry_code}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Badge variant="outline">{ferry.ferry_type}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Passengers</p>
                    <p className="font-semibold text-foreground">
                      {ferry.passengers_capacity}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Cattle</p>
                    <p className="font-semibold text-foreground">
                      {ferry.cattle_capacity}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">RGC</p>
                    <p className="font-semibold text-foreground">
                      {ferry.rgc_capacity}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">S/G</p>
                    <p className="font-semibold text-foreground">
                      {ferry.sg_capacity}
                    </p>
                  </div>
                </div>
                {ferry.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {ferry.description}
                  </p>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    asChild
                  >
                    <Link href={`/terminal/ferries/${ferry._id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    asChild
                  >
                    <Link href={`/terminal/ferries/${ferry._id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(ferry._id!, ferry.ferry_name)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && filteredFerries.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Items per page:
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
                    <SelectItem value="6">6</SelectItem>
                    <SelectItem value="9">9</SelectItem>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="24">24</SelectItem>
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
          </CardContent>
        </Card>
      )}

      <DeleteFerryModal
        open={deleteModal.open}
        onOpenChange={(open) => setDeleteModal({ ...deleteModal, open })}
        ferryName={deleteModal.name}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
