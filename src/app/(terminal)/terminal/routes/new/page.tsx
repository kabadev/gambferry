"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft } from "lucide-react";
import { createRoute } from "@/app/(terminal)/actions/route.actions";
import { toast } from "sonner";

export default function NewRoutePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    route_name: "",
    departurePort: "",
    arrivalPort: "",
    base_price: "",
    duration: "",
    distance_km: "",
    active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("Creating route:", formData);
    try {
      setLoading(true);
      const result = await createRoute(formData as any);

      if (result.success) {
        toast.success("Route added successfully");
        router.push(`/terminal/routes/${result?.data?.id}`);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Something went wrong in creating a route");
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Add New Route
          </h1>
          <p className="text-muted-foreground">Create a new ferry route</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">
                Route Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="route_name">Route Name *</Label>
                <Input
                  id="route_name"
                  value={formData.route_name}
                  onChange={(e) => handleChange("route_name", e.target.value)}
                  placeholder="e.g., Banjul Port - Barra Port"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="departurePort">Departure Port *</Label>
                <Input
                  id="departurePort"
                  value={formData.departurePort}
                  onChange={(e) =>
                    handleChange("departurePort", e.target.value)
                  }
                  placeholder="e.g., Banjul Port"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="arrivalPort">Arrival Port *</Label>
                <Input
                  id="arrivalPort"
                  value={formData.arrivalPort}
                  onChange={(e) => handleChange("arrivalPort", e.target.value)}
                  placeholder="e.g., Barra Port"
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="active">Active Route</Label>
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(v) => handleChange("active", v)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Route Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="distance_km">Distance (km) *</Label>
                <Input
                  id="distance_km"
                  type="number"
                  value={formData.distance_km}
                  onChange={(e) => handleChange("distance_km", e.target.value)}
                  placeholder="e.g., 12"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration *</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => handleChange("duration", e.target.value)}
                  placeholder="e.g., 1h or 2h 30m"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="base_price">Base Price (GMD) *</Label>
                <Input
                  id="base_price"
                  type="number"
                  value={formData.base_price}
                  onChange={(e) => handleChange("base_price", e.target.value)}
                  placeholder="e.g., 35"
                  required
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button disabled={loading} type="submit">
            {loading ? "Creating" : "Create Route"}
          </Button>
        </div>
      </form>
    </div>
  );
}
