"use client";
import Image from "next/image";
import React from "react";
import { SignOutButton, UserButton, useUser } from "@clerk/nextjs";

import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ui/ThemeToggler";
import { Calendar, Home, Route, Sparkle, Ticket, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { startsWith } from "zod";

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: <Home />,
  },
  {
    label: "Bookings",
    href: "/booking",
    icon: <Ticket />,
  },
  {
    label: "Schedules",
    href: "/schedules",
    icon: <Calendar />,
  },

  {
    label: "Profile",
    href: "/account",
    icon: <User />,
  },
];
const Navbar = () => {
  const { user } = useUser();
  const pathname = usePathname();
  return (
    <nav className="fixed top-0 left-0 right-0 z-30 flex h-16 justify-between items-center px-6 py-4 bg-card">
      <div className="flex items-center">
        <Image
          src="/logo1.png"
          alt="FerryWave Logo"
          width={500}
          height={500}
          className="object-full w-[100px] h-full"
        />
        {/* <h1 className="text-xl font-bold text-primary">FerryWave</h1> */}
      </div>
      <div className="max-md:fixed bottom-0 left-0 right-0 flex md:gap-6 justify-between max-md:z-30 max-md:bg-card p-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center flex-col gap-2 hover:text-primary md:hover:text-primary ${
              item.href !== "/" &&
              pathname.slice(1).startsWith(item.href.slice(1))
                ? "text-primary"
                : ""
            }`}
          >
            <span className="md:hidden">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-6">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <UserButton />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-background">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href={`/terminal`}>Admin</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={"/account"}>Account</Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="mt-4 ">
                <SignOutButton>
                  <Button className=" text-xs">Logout</Button>
                </SignOutButton>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 max-md:hidden">
              <Link href="/sign-in">
                <Button>Sign In</Button>
              </Link>

              <Link href="/sign-up" className="">
                <Button variant={"outline"} className="">
                  Sign Up
                </Button>
              </Link>
            </div>

            <Link href="/sign-in" className="md:hidden">
              <Button className="bg-primary text-white">
                <User />
              </Button>
            </Link>
          </div>
        )}

        <div className="w-0s h-0s opacity-0s overflow-hiddens ">
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
