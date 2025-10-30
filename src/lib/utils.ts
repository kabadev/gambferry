import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { data } from "./data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export const searchFerries = (
//   departure: string,
//   arrival: string,
//   date: string
// ) => {
//   // find matching route
//   const route = data.routes.find(
//     (r) =>
//       r.departurePort.toLowerCase() === departure.toLowerCase() &&
//       r.arrivalPort.toLowerCase() === arrival.toLowerCase()
//   );

//   if (!route) return [];

//   // find matching schedules
//   const results = data.schedules
//     .filter((s) => s.route_id === route.id && s.departureDate === date)
//     .map((schedule) => {
//       const ferry = data.ferries.find((f) => f.id === schedule.ferry_id);
//       return {
//         ...schedule,
//         route_name: route.route_name,
//         base_price: route.base_price,
//         ferry_name: ferry?.ferry_name,
//         ferry_type: ferry?.ferry_type,
//       };
//     });

//   return results;
// };

export const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
