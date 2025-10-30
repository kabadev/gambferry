// Dummy data simulation (replaces MongoDB)
export type Ferry = {
  _id?: string;
  id?: number;
  ferry_name: string;
  ferry_code: string;
  ferry_type: string;
  passengers_capacity: number;
  cattle_capacity: number;
  rgc_capacity: number; // Rice, Groundnut, Cement bags capacity
  sg_capacity: number; // Sheep/Goat capacity
  ppcp_capacity: number; // Pre-packed Carton/Package capacity
  description: string;
  ferry_image: string | null;
  status: "Active" | "Inactive";
  created_at?: string;
  updated_at?: string;
  // Legacy field for backward compatibility
  capacity?: number;
  registration_number?: string;
  createdAt?: Date;
};

export type Route = {
  id: string;
  _id?: string;
  route_name: string;
  departurePort: string;
  arrivalPort: string;
  base_price: number;
  duration: string;
  distance_km: number;
  active: boolean;
  createdAt?: Date | string;
  created_at?: string;
};

export type Schedule = {
  _id?: string;
  schedule_id: number;
  ferry_id: number | string;
  route_id: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  status: "Scheduled" | "Delayed" | "Cancelled" | "Completed";
};

export type Booking = {
  id: string;
  booking_reference: string;
  user_id: string;
  ferry_id: string;
  route_id: string;
  passenger_name: string;
  passenger_email: string;
  passenger_phone: string;
  travel_date: string;
  departure_time: string;
  num_passengers: number;
  passenger_type: "Economy" | "VIP" | "Bicycle";
  vehicle_type?: string;
  vehicle_plate?: string;
  vehicle_weight_tons?: number;
  vehicle_length_meters?: number;
  commercial_pax?: number;
  livestock?: {
    cattle?: number;
    sheep_goats?: number;
  };
  cargo?: {
    rice_bags?: number;
    groundnut_bags?: number;
    cement_bags?: number;
    cartons?: number;
  };
  amount: number;
  currency: "GMD" | "CFA";
  payment_method: string;
  payment_status: "Pending" | "Paid";
  booking_status: "Pending" | "Confirmed" | "Cancelled";
  createdAt: Date;
};

export const ferries: Ferry[] = [
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
    ferry_image: "1750674954.jpg",
    status: "Active",
    created_at: "2025-06-21T13:35:06Z",
    updated_at: "2025-06-26T13:27:09Z",
    // Legacy fields for backward compatibility
    capacity: 200,
    registration_number: "Ferry-1212",
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
    ferry_image: null,
    status: "Active",
    created_at: "2025-06-21T16:06:25Z",
    updated_at: "2025-06-23T10:19:30Z",
    // Legacy fields for backward compatibility
    capacity: 300,
    registration_number: "Kunta-Kinteh-001",
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
    ferry_image: "1750676514.jpg",
    status: "Active",
    created_at: "2025-06-23T11:01:54Z",
    updated_at: "2025-06-27T16:06:14Z",
    // Legacy fields for backward compatibility
    capacity: 200,
    registration_number: "L-M Ferry -2025",
  },
];

export const routes: Route[] = [
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
    createdAt: "2024-01-01T00:00:00Z",
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
    createdAt: "2024-01-15T00:00:00Z",
  },
];

export const schedules: Schedule[] = [
  {
    schedule_id: 101,
    ferry_id: 5,
    route_id: "r1",
    departureDate: "2025-10-22",
    departureTime: "09:30",
    arrivalTime: "11:00",
    status: "Scheduled",
  },
  {
    schedule_id: 102,
    ferry_id: 5,
    route_id: "r1",
    departureDate: "2025-10-22",
    departureTime: "15:30",
    arrivalTime: "17:00",
    status: "Scheduled",
  },
  {
    schedule_id: 103,
    ferry_id: 9,
    route_id: "r2",
    departureDate: "2025-10-23",
    departureTime: "08:00",
    arrivalTime: "10:00",
    status: "Delayed",
  },
  {
    schedule_id: 104,
    ferry_id: 3,
    route_id: "r3",
    departureDate: "2025-10-25",
    departureTime: "07:00",
    arrivalTime: "10:30",
    status: "Scheduled",
  },
];

export const bookings: Booking[] = [];

export const data = {
  routes: [
    {
      id: "r1",
      route_name: "Banjul Port - Barra Port",
      departurePort: "Banjul Port",
      arrivalPort: "Barra Port",
      base_price: 35,
      duration: "1h",
      distance_km: 12,
      active: true,
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
    },
  ],
  ferries: [
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
        "https://images.unsplash.com/photo-1518623001395-125242310d0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dmFuY291dmVyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
      status: "Active",
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
        "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZG92ZXIlMjBjbGlmZnN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
      status: "Active",
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
        "https://images.unsplash.com/photo-1533105079780-92b9be482077?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2FudG9yaW5pfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
      status: "Active",
    },
  ],
  schedules: [
    {
      schedule_id: 101,
      ferry_id: "68f96d7ae287b5a87096a776",
      route_id: "68f96d7ae287b5a87096a772",
      departureDate: "2025-10-26",
      departureTime: "09:30",
      arrivalTime: "11:00",
      status: "Scheduled",
    },
    {
      schedule_id: 102,
      ferry_id: "68f96d7ae287b5a87096a777",
      route_id: "68f96d7ae287b5a87096a773",
      departureDate: "2025-10-26",
      departureTime: "15:30",
      arrivalTime: "17:00",
      status: "Scheduled",
    },
    {
      schedule_id: 103,
      ferry_id: "68f96d7ae287b5a87096a778",
      route_id: "68f96d7ae287b5a87096a774",
      departureDate: "2025-10-23",
      departureTime: "08:00",
      arrivalTime: "10:00",
      status: "Delayed",
    },
    {
      schedule_id: 104,
      ferry_id: "68f96d7ae287b5a87096a776",
      route_id: "68f96d7ae287b5a87096a773",
      departureDate: "2025-10-25",
      departureTime: "07:00",
      arrivalTime: "10:30",
      status: "Scheduled",
    },
  ],
};
