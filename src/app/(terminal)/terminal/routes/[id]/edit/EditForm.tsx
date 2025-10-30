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
import { Route } from "@/lib/data";
import { updateRoute } from "@/app/(terminal)/actions/route.actions";
import { toast } from "sonner";
import { id } from "date-fns/locale";

export default function EditRoutePage({ route }: { route: Route }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    route_name: route?.route_name || "",
    departurePort: route?.departurePort || "",
    arrivalPort: route?.arrivalPort || "",
    base_price: route?.base_price.toString() || "",
    duration: route?.duration || "",
    distance_km: route?.distance_km.toString() || "",
    active: route?.active ?? true,
    id: route._id,
  });

  if (!route) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">
            Route Not Found
          </h2>
          <Button
            onClick={() => router.push("/terminal/routes")}
            className="mt-4"
          >
            Back to Routes
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const result = await updateRoute(formData as any);
      if (result.success) {
        setLoading(false);
        toast.success("Your route Updated successfully");
        router.push(`/terminal/routes/${result?.data?._id}`);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Failed to Update routes");
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
            Edit Route
          </h1>
          <p className="text-muted-foreground">{route.route_name}</p>
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
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="arrivalPort">Arrival Port *</Label>
                <Input
                  id="arrivalPort"
                  value={formData.arrivalPort}
                  onChange={(e) => handleChange("arrivalPort", e.target.value)}
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
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration *</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => handleChange("duration", e.target.value)}
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
          <Button type="submit">
            {loading ? "Updating..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
