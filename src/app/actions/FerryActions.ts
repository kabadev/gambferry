"use server";

import { connectDB } from "@/lib/mongoDB";
import { Ferry } from "@/models/Ferry";
import { Route } from "@/models/Route";
import { Schedule } from "@/models/Schedule";
import { auth } from "@clerk/nextjs/server";

const createFerry = async (data: any) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, message: "User not authenticated" };
    }
    const ferry = await Ferry.create({
      ...data,
      userId: userId,
    });
    return { success: true, ferry };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// get ferrys
export const getFerrys = async () => {
  try {
    await connectDB();
    const ferries = await Schedule.find();

    return { success: true, ferries };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

export const insertManyData = async (data: any) => {
  try {
    const { userId } = await auth();
    if (!userId) {
      return { success: false, message: "User not authenticated" };
    }
    console.log("first");
    // await Route.insertMany(data.routes);
    // await Ferry.insertMany(data.ferries);
    const news = await Schedule.insertMany(data.schedules);
    console.log("first");
    console.log("dhdh:", news);
    return { success: true, message: "Data inserted successfully" };
  } catch (error: any) {
    console.log(error.message);
    return { success: false, message: error.message };
  }
};
