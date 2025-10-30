"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Trash2, Ship, Users, Package } from "lucide-react";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { Ferry } from "@/lib/data";
import { DeleteFerryModal } from "@/app/(terminal)/components/delete-ferry-modal";

export default function FerryDetail({ ferry }: { ferry: Ferry }) {
  const router = useRouter();
  const [deleteModal, setDeleteModal] = useState(false);

  if (!ferry) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">
            Ferry Not Found
          </h2>
          <p className="text-muted-foreground mt-2">
            The ferry you're looking for doesn't exist.
          </p>
          <Button
            onClick={() => router.push("/terminal/ferries")}
            className="mt-4"
          >
            Back to Ferries
          </Button>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    console.log("Deleting ferry:", ferry.id);
    setDeleteModal(false);
    router.push("/terminal/ferries");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Ferry Details
            </h1>
            <p className="text-muted-foreground">{ferry.ferry_code}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/terminal/ferries/${ferry.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive" onClick={() => setDeleteModal(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-foreground">Ferry Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative h-64 w-full rounded-lg overflow-hidden bg-muted">
              {ferry.ferry_image ? (
                <Image
                  src={ferry.ferry_image || "/placeholder.svg"}
                  alt={ferry.ferry_name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Ship className="h-24 w-24 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Ferry Name</p>
                <p className="text-lg font-semibold text-foreground">
                  {ferry.ferry_name}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ferry Code</p>
                <p className="text-lg font-semibold text-foreground">
                  {ferry.ferry_code}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ferry Type</p>
                <Badge variant="outline">{ferry.ferry_type}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge
                  variant={ferry.status === "Active" ? "default" : "secondary"}
                  className={ferry.status === "Active" ? "bg-chart-3" : ""}
                >
                  {ferry.status}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="text-foreground mt-1">{ferry.description}</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Users className="h-5 w-5" />
                Passenger Capacity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">
                {ferry.passengers_capacity}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Package className="h-5 w-5" />
                Cargo Capacities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cattle</span>
                <span className="font-semibold text-foreground">
                  {ferry.cattle_capacity}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">RGC</span>
                <span className="font-semibold text-foreground">
                  {ferry.rgc_capacity}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sheep/Goats</span>
                <span className="font-semibold text-foreground">
                  {ferry.sg_capacity}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">PPCP</span>
                <span className="font-semibold text-foreground">
                  {ferry.ppcp_capacity}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <DeleteFerryModal
        open={deleteModal}
        onOpenChange={setDeleteModal}
        ferryName={ferry.ferry_name}
        onConfirm={handleDelete}
      />
    </div>
  );
}
