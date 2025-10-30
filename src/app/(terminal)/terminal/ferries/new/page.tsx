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
import { Uploader } from "@/components/Uploader";
import { createFerry } from "@/app/(terminal)/actions/ferry.actions";

export default function NewFerryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ferry_name: "",
    ferry_code: "",
    ferry_type: "",
    passengers_capacity: "",
    cattle_capacity: "",
    rgc_capacity: "",
    sg_capacity: "",
    ppcp_capacity: "",
    description: "",
    ferry_image: "",
    status: "Active",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const result = await createFerry(formData);
      if (result.success) {
        router.push("/terminal/ferries");
      }
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
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
            Add New Ferry
          </h1>
          <p className="text-muted-foreground">
            Create a new ferry in the system
          </p>
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
                    <SelectValue placeholder="Select type" />
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

                <Uploader
                  imageClassName="w-full h-full  object-cover "
                  multiple={false}
                  accept={{
                    "image/*": [],
                  }}
                  maxSizeMB={1}
                  uploadTitle={
                    "Upload Ferry photo (JPG, PNG files only up to 1MB)"
                  }
                  className="p-2 w-full h-[200px]  border-2 border-gray-300 border-dashed rounded-lg"
                  onUploadComplete={(url: any) =>
                    handleChange("ferry_image", url)
                  }
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
                placeholder="Enter ferry description..."
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button disabled={loading} type="submit">
            {loading ? "Creating...." : "Create Ferry"}
          </Button>
        </div>
      </form>
    </div>
  );
}
