import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";

import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { AppProvider } from "@/context/AppContext";

// Font setup
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

// Metadata
export const metadata: Metadata = {
  title: "River Side Ferry",
  description:
    "Cross The Gambia River With Ease. Safe, reliable, and comfortable ferry services between Banjul and Barra. Book your tickets online and skip the queues!",
};

// Root Layout
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
    // appearance={{
    //   cssLayerName: "clerk",
    // }}
    >
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable}`}
      >
        <body className="antialiased font-poppins">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AppProvider>{children}</AppProvider>
            <Toaster richColors closeButton position="top-right" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
