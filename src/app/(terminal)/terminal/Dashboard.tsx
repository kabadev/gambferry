// app/dashboard/page.tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Ship,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Package,
  Truck,
  Beef,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Activity,
  MapPin,
} from "lucide-react";

// import { TopRoutesTable } from "@/components/dashboard/top-routes-table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  getDashboardAnalytics,
  getRevenueAnalytics,
} from "../actions/dashboard";
import { ChartsSection } from "../components/charts-section";
import { TopRoutesTable } from "../components/top-routes-table";

export default async function AdminDashboard() {
  const [analyticsResult, revenueResult] = await Promise.all([
    getDashboardAnalytics("month"),
    getRevenueAnalytics("month"),
  ]);

  if (!analyticsResult.success) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load dashboard data?. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  const data = analyticsResult.data;
  const revenueData = revenueResult.success ? revenueResult.data : null;

  // Calculate growth rates (mock - in production calculate from previous period)
  const bookingGrowth = 12.5;
  const revenueGrowth = 8.3;

  return (
    <div className="space-y-8 ">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          Ferry Operations Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Real-time analytics and insights for ferry booking operations
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-card">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Primary KPI Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Bookings
                </CardTitle>
                <Calendar className="h-5 w-5 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {data?.overview.totalBookings?.toLocaleString() || 0}
                </div>
                <div className="flex items-center text-xs text-muted-foreground mt-2">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">
                    +{bookingGrowth}%
                  </span>
                  <span className="ml-1">from last period</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {data?.overview.totalRevenue?.toLocaleString() || 0}
                  <span className="text-lg font-normal text-muted-foreground ml-2">
                    GMD
                  </span>
                </div>
                <div className="flex items-center text-xs text-muted-foreground mt-2">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">
                    +{revenueGrowth}%
                  </span>
                  <span className="ml-1">from last period</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Passengers
                </CardTitle>
                <Users className="h-5 w-5 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {data?.overview.totalPassengers?.toLocaleString() || 0}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Avg{" "}
                  {Math.round(
                    (data?.overview.totalPassengers || 0) /
                      (data?.overview.totalBookings || 1)
                  )}{" "}
                  per booking
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Ferries
                </CardTitle>
                <Ship className="h-5 w-5 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {data?.ferryStats?.activeFerries! || 0}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {data?.ferryStats?.totalFerries! || 0} total ferries
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Secondary Metrics */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Vehicles</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data?.overview?.totalVehicles! || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Transported this period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Livestock</CardTitle>
                <Beef className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(data?.overview.totalCattle || 0) +
                    (data?.overview.totalSheepGoats || 0)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {data?.overview.totalCattle || 0} cattle,{" "}
                  {data?.overview.totalSheepGoats || 0} sheep/goats
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Cargo Items
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(data?.overview.totalRice || 0) +
                    (data?.overview.totalGroundnut || 0) +
                    (data?.overview.totalCement || 0) +
                    (data?.overview.totalCartons || 0)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Total bags and cartons
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Scheduled Trips
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data?.scheduleStats.scheduledTrips || 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {data?.scheduleStats.totalSchedules || 0} total schedules
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Booking Status Overview */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {data?.statusBreakdown?.map((status: any) => (
              <Card key={status._id}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {status._id} Bookings
                  </CardTitle>
                  {status._id === "Confirmed" && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                  {status._id === "Pending" && (
                    <Clock className="h-4 w-4 text-yellow-500" />
                  )}
                  {status._id === "Cancelled" && (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  {status._id === "Completed" && (
                    <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{status.count}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(
                      (status.count / data?.overview.totalBookings) *
                      100
                    ).toFixed(1)}
                    % of total
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <ChartsSection
            dailyBookings={data?.dailyBookings || []}
            monthlyBookings={data?.monthlyBookings || []}
          />

          {/* Top Routes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Top Performing Routes
              </CardTitle>
              <CardDescription>
                Most popular routes by booking volume
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TopRoutesTable routes={data?.topRoutes!} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Payment Method</CardTitle>
                <CardDescription>
                  Distribution of payment methods
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueData?.revenueByMethod?.map((method: any) => (
                    <div
                      key={method._id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="font-medium">
                          {method._id || "N/A"}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">
                          {method.revenue.toLocaleString()} GMD
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {method.count} transactions
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue by Passenger Type</CardTitle>
                <CardDescription>Distribution by ticket class</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {revenueData?.revenueByPassengerType?.map((type: any) => (
                    <div
                      key={type._id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="font-medium">{type._id}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">
                          {type.revenue.toLocaleString()} GMD
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {type.count} bookings
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payment Status Overview</CardTitle>
              <CardDescription>
                Current payment status distribution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                {data?.paymentBreakdown?.map((payment: any) => (
                  <div key={payment._id} className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">
                      {payment._id}
                    </div>
                    <div className="text-2xl font-bold">{payment.count}</div>
                    <div className="text-xs text-muted-foreground">
                      {payment.revenue.toLocaleString()} GMD
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Schedule Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Scheduled</span>
                  <span className="text-2xl font-bold text-green-500">
                    {data?.scheduleStats.scheduledTrips || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Delayed</span>
                  <span className="text-2xl font-bold text-yellow-500">
                    {data?.scheduleStats.delayedTrips || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Cancelled</span>
                  <span className="text-2xl font-bold text-red-500">
                    {data?.scheduleStats.cancelledTrips || 0}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fleet Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Capacity</span>
                    <span className="font-bold">
                      {data?.ferryStats.totalCapacity || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Active Ferries</span>
                    <span className="font-bold">
                      {data?.ferryStats.activeFerries || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Utilization Rate</span>
                    <span className="font-bold text-blue-500">
                      {data?.ferryStats.totalCapacity
                        ? (
                            (data?.overview.totalPassengers /
                              data?.ferryStats.totalCapacity) *
                            100
                          ).toFixed(1)
                        : 0}
                      %
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Passenger Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {data?.passengerTypeBreakdown?.map((type: any) => (
                  <div
                    key={type._id}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm">{type._id}</span>
                    <div className="text-right">
                      <div className="font-bold">{type.passengers}</div>
                      <div className="text-xs text-muted-foreground">
                        {type.count} bookings
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
