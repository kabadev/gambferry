"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, CalendarIcon, Copy } from "lucide-react";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { Ferry } from "@/lib/data";
import { createSchedule } from "@/app/(terminal)/actions/schedule.actions";
import { toast } from "sonner";

export default function NewScheduleForm({
  ferries,
  routes,
}: {
  ferries: any;
  routes: any;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ferry_id: "",
    route_id: "",
    departureDate: undefined as Date | undefined,
    departureTime: "",
    arrivalTime: "",
    status: "Scheduled",
  });
  const [duplicateDays, setDuplicateDays] = useState<number[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const result = await createSchedule(formData as any);

      if (result.success) {
        toast.success("Schedule added successfully");
        router.push("/terminal/schedules");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Failed to add Schedule");
    }
  };

  const handleChange = (field: string, value: string | Date | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleDuplicateDay = (day: number) => {
    setDuplicateDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Add New Schedule
          </h1>
          <p className="text-muted-foreground">Create a new ferry schedule</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">
                Schedule Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ferry_id">Ferry *</Label>
                <Select
                  value={formData.ferry_id}
                  onValueChange={(v) => handleChange("ferry_id", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select ferry" />
                  </SelectTrigger>
                  <SelectContent>
                    {ferries?.map((ferry: any) => (
                      <SelectItem key={ferry._id} value={ferry._id.toString()}>
                        {ferry.ferry_name} ({ferry.ferry_code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="route_id">Route *</Label>
                <Select
                  value={formData.route_id}
                  onValueChange={(v) => handleChange("route_id", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select route" />
                  </SelectTrigger>
                  <SelectContent>
                    {routes.map((route: any) => (
                      <SelectItem key={route.id} value={route._id}>
                        {route.route_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* <div className="space-y-2">
                <Label>Departure Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.departureDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.departureDate
                        ? format(formData.departureDate, "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.departureDate}
                      onSelect={(date) => handleChange("departureDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div> */}

              {/* <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => handleChange("status", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Delayed">Delayed</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-foreground">Time Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="departureTime">Departure Time *</Label>
                <Input
                  id="departureTime"
                  type="time"
                  value={formData.departureTime}
                  onChange={(e) =>
                    handleChange("departureTime", e.target.value)
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="arrivalTime">Arrival Time *</Label>
                <Input
                  id="arrivalTime"
                  type="time"
                  value={formData.arrivalTime}
                  onChange={(e) => handleChange("arrivalTime", e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Copy className="h-5 w-5" />
                Duplicate Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Select additional days to duplicate this schedule (2-7 days from
                the departure date)
              </p>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {[2, 3, 4, 5, 6, 7].map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={`day-${day}`}
                      checked={duplicateDays.includes(day)}
                      onCheckedChange={() => toggleDuplicateDay(day)}
                    />
                    <Label
                      htmlFor={`day-${day}`}
                      className="text-sm cursor-pointer"
                    >
                      {formData.departureDate
                        ? format(
                            addDays(formData.departureDate, day - 1),
                            "MMM dd"
                          )
                        : `Day ${day}`}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card> */}
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? " Creating..." : " Create Schedule"}
          </Button>
        </div>
      </form>
    </div>
  );
}
