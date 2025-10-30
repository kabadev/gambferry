"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";

export default function EditFerryPage() {
  // const { id } = params;
  // const router = useRouter();

  // const [formData, setFormData] = useState({
  //   ferry_name: ferry?.ferry_name || "",
  //   ferry_code: ferry?.ferry_code || "",
  //   ferry_type: ferry?.ferry_type || "",
  //   passengers_capacity: ferry?.passengers_capacity.toString() || "",
  //   cattle_capacity: ferry?.cattle_capacity.toString() || "",
  //   rgc_capacity: ferry?.rgc_capacity.toString() || "",
  //   sg_capacity: ferry?.sg_capacity.toString() || "",
  //   ppcp_capacity: ferry?.ppcp_capacity.toString() || "",
  //   description: ferry?.description || "",
  //   ferry_image: ferry?.ferry_image || "",
  //   status: ferry?.status || "Active",
  // });

  // if (!ferry) {
  //   return (
  //     <div className="flex h-full items-center justify-center">
  //       <div className="text-center">
  //         <h2 className="text-2xl font-bold text-foreground">
  //           Ferry Not Found
  //         </h2>
  //         <Button
  //           onClick={() => router.push("/terminal/ferries")}
  //           className="mt-4"
  //         >
  //           Back to Ferries
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // }

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log("Updating ferry:", formData);
  //   router.push(`/terminal/ferries/${id}`);
  // };

  // const handleChange = (field: string, value: string) => {
  //   setFormData((prev) => ({ ...prev, [field]: value }));
  // };

  return (
    <div className="space-y-6">
      <h2>Loading</h2>
      {/* <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Edit Ferry
          </h1>
          <p className="text-muted-foreground">{ferry.ferry_code}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ferry_name">Ferry Name *</Label>
                <Input
                  id="ferry_name"
                  value={formData.ferry_name}
                  onChange={(e) => handleChange("ferry_name", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ferry_code">Ferry Code *</Label>
                <Input
                  id="ferry_code"
                  value={formData.ferry_code}
                  onChange={(e) => handleChange("ferry_code", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ferry_type">Ferry Type *</Label>
                <Select
                  value={formData.ferry_type}
                  onValueChange={(v) => handleChange("ferry_type", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Passenger Ferry">
                      Passenger Ferry
                    </SelectItem>
                    <SelectItem value="Cargo Ferry">Cargo Ferry</SelectItem>
                    <SelectItem value="Vehicle Ferry">Vehicle Ferry</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => handleChange("status", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ferry_image">Ferry Image URL</Label>
                <Input
                  id="ferry_image"
                  type="url"
                  value={formData.ferry_image}
                  onChange={(e) => handleChange("ferry_image", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">
                Capacity Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="passengers_capacity">
                  Passenger Capacity *
                </Label>
                <Input
                  id="passengers_capacity"
                  type="number"
                  value={formData.passengers_capacity}
                  onChange={(e) =>
                    handleChange("passengers_capacity", e.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cattle_capacity">Cattle Capacity *</Label>
                <Input
                  id="cattle_capacity"
                  type="number"
                  value={formData.cattle_capacity}
                  onChange={(e) =>
                    handleChange("cattle_capacity", e.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rgc_capacity">RGC Capacity *</Label>
                <Input
                  id="rgc_capacity"
                  type="number"
                  value={formData.rgc_capacity}
                  onChange={(e) => handleChange("rgc_capacity", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sg_capacity">Sheep/Goats Capacity *</Label>
                <Input
                  id="sg_capacity"
                  type="number"
                  value={formData.sg_capacity}
                  onChange={(e) => handleChange("sg_capacity", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ppcp_capacity">PPCP Capacity *</Label>
                <Input
                  id="ppcp_capacity"
                  type="number"
                  value={formData.ppcp_capacity}
                  onChange={(e) =>
                    handleChange("ppcp_capacity", e.target.value)
                  }
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-foreground">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form> */}
    </div>
  );
}
