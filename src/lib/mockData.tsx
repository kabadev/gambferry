export interface Route {
  id: string;
  route_name: string;
  departurePort: string;
  arrivalPort: string;
  base_price: number;
  duration: string;
  distance_km: number;
  active: boolean;
  createdAt?: string;
}

export interface Ferry {
  id: number;
  ferry_name: string;
  ferry_code: string;
  ferry_type: string;
  passengers_capacity: number;
  cattle_capacity: number;
  rgc_capacity: number;
  sg_capacity: number;
  ppcp_capacity: number;
  description: string;
  ferry_image: string | null;
  status: string;
  created_at?: string;
  updated_at?: string;
}

export interface Schedule {
  schedule_id: number;
  ferry_id: string | number;
  route_id: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  status: string;
  ferry?: Ferry;
  route?: Route;
}

export interface Booking {
  id: string;
  booking_reference: string;
  user_id: string;
  passenger_name: string;
  passenger_email: string;
  passenger_phone: string;
  travel_date: string;
  departure_time: string;
  num_passengers: number;
  passenger_type: string;
  vehicle_type: string | null;
  vehicle_plate: string | null;
  livestock: {
    cattle: number;
    sheep_goats: number;
  };
  cargo: {
    rice_bags: number;
    groundnut_bags: number;
    cement_bags: number;
    cartons: number;
  };
  amount: number;
  currency: string;
  payment_method: string;
  payment_status: string;
  booking_status: string;
  createdAt: string;
  ferry?: Ferry;
  route?: Route;
  schedule?: Schedule;
}

// Mock data
export const mockRoutes: Route[] = [
  {
    id: "r1",
    route_name: "Banjul Port - Barra Port",
    departurePort: "Banjul Port",
    arrivalPort: "Barra Port",
    base_price: 35,
    duration: "1h",
    distance_km: 12,
    active: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "r2",
    route_name: "Laminkoto - Marchatty Island",
    departurePort: "Laminkoto",
    arrivalPort: "Marchatty Island",
    base_price: 75,
    duration: "2h",
    distance_km: 28,
    active: true,
    createdAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "r3",
    route_name: "Banjul - Farafenni",
    departurePort: "Banjul",
    arrivalPort: "Farafenni",
    base_price: 120,
    duration: "3h 30m",
    distance_km: 45,
    active: true,
    createdAt: "2024-02-01T00:00:00Z",
  },
];

export const mockFerries: Ferry[] = [
  {
    id: 3,
    ferry_name: "Ferry Cargo",
    ferry_code: "Ferry-1212",
    ferry_type: "Cargo Ferry",
    passengers_capacity: 200,
    cattle_capacity: 20,
    rgc_capacity: 20,
    sg_capacity: 20,
    ppcp_capacity: 20,
    description: "Description Ferry",
    ferry_image:
      "https://images.unsplash.com/photo-1518623001395-125242310d0c?w=500&q=80",
    status: "Active",
    created_at: "2024-01-10T00:00:00Z",
    updated_at: "2024-01-10T00:00:00Z",
  },
  {
    id: 5,
    ferry_name: "Kunta Kinteh",
    ferry_code: "Kunta-Kinteh-001",
    ferry_type: "Passenger Ferry",
    passengers_capacity: 300,
    cattle_capacity: 300,
    rgc_capacity: 300,
    sg_capacity: 300,
    ppcp_capacity: 300,
    description:
      "The current position of KUNTA KINTEH is at West Africa reported 0 min ago by AIS.",
    ferry_image:
      "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=500&q=80",
    status: "Active",
    created_at: "2024-02-15T00:00:00Z",
    updated_at: "2024-02-15T00:00:00Z",
  },
  {
    id: 9,
    ferry_name: "Laminkoto - Marchatty Island Ferry",
    ferry_code: "L-M Ferry -2025",
    ferry_type: "Vehicle Ferry",
    passengers_capacity: 200,
    cattle_capacity: 50,
    rgc_capacity: 50,
    sg_capacity: 50,
    ppcp_capacity: 50,
    description: "Ferry Testing Description",
    ferry_image:
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=500&q=80",
    status: "Active",
    created_at: "2024-03-01T00:00:00Z",
    updated_at: "2024-03-01T00:00:00Z",
  },
];

export const mockSchedules: Schedule[] = [
  {
    schedule_id: 101,
    ferry_id: 5,
    route_id: "r1",
    departureDate: "2025-10-26",
    departureTime: "09:30",
    arrivalTime: "11:00",
    status: "Scheduled",
  },
  {
    schedule_id: 102,
    ferry_id: 3,
    route_id: "r2",
    departureDate: "2025-10-26",
    departureTime: "15:30",
    arrivalTime: "17:00",
    status: "Scheduled",
  },
  {
    schedule_id: 103,
    ferry_id: 9,
    route_id: "r3",
    departureDate: "2025-10-23",
    departureTime: "08:00",
    arrivalTime: "10:00",
    status: "Delayed",
  },
  {
    schedule_id: 104,
    ferry_id: 5,
    route_id: "r2",
    departureDate: "2025-10-25",
    departureTime: "07:00",
    arrivalTime: "10:30",
    status: "Scheduled",
  },
];

export const mockBookings: Booking[] = [
  {
    id: "b20251022001",
    booking_reference: "BF-20251022-001",
    user_id: "user_001",
    passenger_name: "Lamin Jallow",
    passenger_email: "lamin.jallow@example.com",
    passenger_phone: "+2203456789",
    travel_date: "2025-10-22",
    departure_time: "09:30",
    num_passengers: 2,
    passenger_type: "Adult",
    vehicle_type: "Private Car",
    vehicle_plate: "BJL-1234",
    livestock: { cattle: 0, sheep_goats: 0 },
    cargo: { rice_bags: 0, groundnut_bags: 0, cement_bags: 0, cartons: 0 },
    amount: 350,
    currency: "GMD",
    payment_method: "Mobile Money",
    payment_status: "Pending",
    booking_status: "Confirmed",
    createdAt: "2025-10-22T08:00:00Z",
    ferry: mockFerries[1],
    route: mockRoutes[0],
    schedule: mockSchedules[0],
  },
  {
    id: "b20251023001",
    booking_reference: "BF-20251023-001",
    user_id: "user_002",
    passenger_name: "Fatou Ceesay",
    passenger_email: "fatou.ceesay@example.com",
    passenger_phone: "+2207654321",
    travel_date: "2025-10-23",
    departure_time: "08:00",
    num_passengers: 1,
    passenger_type: "Adult",
    vehicle_type: null,
    vehicle_plate: null,
    livestock: { cattle: 2, sheep_goats: 5 },
    cargo: { rice_bags: 10, groundnut_bags: 5, cement_bags: 0, cartons: 3 },
    amount: 850,
    currency: "GMD",
    payment_method: "Cash",
    payment_status: "Paid",
    booking_status: "Confirmed",
    createdAt: "2025-10-23T06:00:00Z",
    ferry: mockFerries[2],
    route: mockRoutes[2],
    schedule: mockSchedules[2],
  },
  {
    id: "b20251024001",
    booking_reference: "BF-20251024-001",
    user_id: "user_003",
    passenger_name: "Ousman Bah",
    passenger_email: "ousman.bah@example.com",
    passenger_phone: "+2209876543",
    travel_date: "2025-10-25",
    departure_time: "07:00",
    num_passengers: 4,
    passenger_type: "Mixed",
    vehicle_type: "Truck",
    vehicle_plate: "BJL-5678",
    livestock: { cattle: 0, sheep_goats: 0 },
    cargo: { rice_bags: 50, groundnut_bags: 30, cement_bags: 20, cartons: 15 },
    amount: 1250,
    currency: "GMD",
    payment_method: "Bank Transfer",
    payment_status: "Paid",
    booking_status: "Confirmed",
    createdAt: "2025-10-24T10:00:00Z",
    ferry: mockFerries[1],
    route: mockRoutes[1],
    schedule: mockSchedules[3],
  },
];
