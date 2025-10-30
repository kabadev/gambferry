// components/dashboard/charts-section.tsx
"use client";

import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface ChartsSectionProps {
  dailyBookings: any[];
  monthlyBookings: any[];
}

export function ChartsSection({
  dailyBookings,
  monthlyBookings,
}: ChartsSectionProps) {
  // Transform data for charts
  const dailyData =
    dailyBookings?.map((item) => ({
      date: new Date(item._id).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      bookings: item.bookings,
      revenue: item.revenue,
      passengers: item.passengers,
    })) || [];

  const monthlyData =
    monthlyBookings?.map((item) => ({
      month: new Date(item._id + "-01").toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      }),
      bookings: item.bookings,
      revenue: item.revenue,
    })) || [];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Daily Bookings Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Bookings Trend</CardTitle>
          <CardDescription>Last 7 days booking activity</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyData}>
              <defs>
                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                className="stroke-gray-200"
              />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                fontSize={12}
                className="text-gray-500"
              />
              <YAxis stroke="#6b7280" fontSize={12} className="text-gray-500" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                }}
                labelClassName="text-gray-900"
              />
              <Area
                type="monotone"
                dataKey="bookings"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorBookings)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Daily Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Revenue Trend</CardTitle>
          <CardDescription>
            Revenue performance over last 7 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                className="stroke-gray-200"
              />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                fontSize={12}
                className="text-gray-500"
              />
              <YAxis stroke="#6b7280" fontSize={12} className="text-gray-500" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                }}
                formatter={(value: number) => [
                  `${value.toLocaleString()} GMD`,
                  "Revenue",
                ]}
              />
              <Bar dataKey="revenue" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Daily Passengers Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Passengers</CardTitle>
          <CardDescription>Passenger volume by day</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                className="stroke-gray-200"
              />
              <XAxis
                dataKey="date"
                stroke="#6b7280"
                fontSize={12}
                className="text-gray-500"
              />
              <YAxis stroke="#6b7280" fontSize={12} className="text-gray-500" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                }}
              />
              <Line
                type="monotone"
                dataKey="passengers"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Monthly Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Performance</CardTitle>
          <CardDescription>Bookings and revenue trends</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                className="stroke-gray-200"
              />
              <XAxis
                dataKey="month"
                stroke="#6b7280"
                fontSize={12}
                className="text-gray-500"
              />
              <YAxis
                yAxisId="left"
                stroke="#6b7280"
                fontSize={12}
                className="text-gray-500"
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#6b7280"
                fontSize={12}
                className="text-gray-500"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "0.5rem",
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="bookings"
                stroke="#f59e0b"
                strokeWidth={2}
                name="Bookings"
                dot={{ r: 4 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke="#ec4899"
                strokeWidth={2}
                name="Revenue (GMD)"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
