// components/dashboard/top-routes-table.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

interface Route {
  _id: string;
  routeName: string;
  bookings: number;
  revenue: number;
}

interface TopRoutesTableProps {
  routes: Route[];
}

export function TopRoutesTable({ routes }: TopRoutesTableProps) {
  if (!routes || routes.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No route data available
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">Rank</TableHead>
          <TableHead>Route</TableHead>
          <TableHead className="text-right">Bookings</TableHead>
          <TableHead className="text-right">Revenue</TableHead>
          <TableHead className="text-right">Avg/Booking</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {routes.map((route, index) => (
          <TableRow key={route._id}>
            <TableCell className="font-medium">
              <div className="flex items-center">
                {index === 0 && (
                  <Badge variant="default" className="mr-2">
                    #1
                  </Badge>
                )}
                {index === 1 && (
                  <Badge variant="secondary" className="mr-2">
                    #2
                  </Badge>
                )}
                {index === 2 && (
                  <Badge variant="outline" className="mr-2">
                    #3
                  </Badge>
                )}
                {index > 2 && <span className="ml-2">#{index + 1}</span>}
              </div>
            </TableCell>
            <TableCell className="font-medium">
              {route.routeName || "Unknown Route"}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end">
                <span className="font-semibold">{route.bookings}</span>
                {index === 0 && (
                  <TrendingUp className="h-3 w-3 text-green-500 ml-1" />
                )}
              </div>
            </TableCell>
            <TableCell className="text-right font-semibold">
              {route.revenue.toLocaleString()} GMD
            </TableCell>
            <TableCell className="text-right text-muted-foreground">
              {Math.round(route.revenue / route.bookings).toLocaleString()} GMD
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
