import Image from "next/image";

import HeroSearch from "@/components/HeroSearch";
import AvailableFerry from "@/components/AvailableFerry";
export default function Home() {
  return (
    <div className="font-sans min-h-screen flex flex-col">
      {/* Hero Section with Search */}
      <section className="relative h-[200px] md:h-[250px] bg-[url('/banner.png')] bg-cover bg-center  bg-gradient-to-r from-primary to-red-700 ">
        <div className="bg-black/50 absolute inset-0 py-4  md:py-16 px-4 md:px-6">
          <div className="max-w-5xl mx-auto text-white h-full flex flex-col justify-center items-center">
            <h2 className="text-3xl md:text-6xl font-bold mb-4">
              Cross The Gambia River With Ease
            </h2>
            {/* <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Fast, reliable ferries. Book your next crossing in minutes.
          </h2> */}
            <p className="mb-8 max-md:hidden ">
              Safe, reliable, and comfortable ferry services between Banjul and
              Barra. Book your tickets online and skip the queues!
            </p>
          </div>
        </div>
      </section>

      <section className="px-2 md:px-24 -mt-10 z-10">
        <HeroSearch />
      </section>
      <div className="px-2 md:px-24 ">
        <AvailableFerry />
      </div>

      {/* Book Your Ferry Trip Section */}
      <section className="py-16 px-6 bg-card">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Book Your Ferry Trip</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Safe, reliable, and comfortable ferry services. Book your tickets
              online and skip the queues!
            </p>
          </div>

          {/* Special Schedule Alert */}
          <div className="bg-card border-l-4 border border-primary p-4 mb-12 rounded-md">
            <h3 className="font-semibold  mb-2">
              Special Schedule - Summer 2023
            </h3>
            <p className="">
              Extended ferry hours during summer: First ferry at 5:30 AM, last
              ferry at 11:00 PM. Additional trips may be added based on demand.{" "}
              <a href="#" className="underline font-medium">
                View full schedule →
              </a>
            </p>
          </div>

          {/* Booking Process Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <div className="text-center">
              <div className="bg-blue-100 text-primary w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Create Account</h3>
              <p className="text-muted-foreground">
                Sign up with your email or phone number. It takes less than a
                minute.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 text-primary w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">Select Trip</h3>
              <p className="text-muted-foreground">
                Choose your route, date, time, and number of
                passengers/vehicles.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 text-primary w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Make Payment</h3>
              <p className="text-muted-foreground">
                Pay securely with mobile money, credit card, or other payment
                methods.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 text-primary w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="font-semibold mb-2">Receive Ticket</h3>
              <p className="text-muted-foreground">
                Get your QR code ticket via email and SMS. Show it at boarding.
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card border p-6 rounded-lg">
              <div className="flex items-start mb-4">
                <div className="bg-green-100 p-2 rounded-md mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Safety First</h3>
                  <p className="text-muted-foreground">
                    Our ferries undergo regular safety inspections and our crew
                    is trained in emergency procedures to ensure your peace of
                    mind.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border p-6 rounded-lg">
              <div className="flex items-start mb-4">
                <div className="bg-blue-100 p-2 rounded-md mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Reliable Schedule</h3>
                  <p className="text-muted-foreground">
                    With multiple daily crossings and extended hours during
                    holidays, we ensure you can travel when you need to.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border p-6 rounded-lg">
              <div className="flex items-start mb-4">
                <div className="bg-purple-100 p-2 rounded-md mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Easy Booking</h3>
                  <p className="text-muted-foreground">
                    Book online in minutes and receive your QR code ticket
                    instantly via email and SMS - no need to wait in line.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border p-6 rounded-lg">
              <div className="flex items-start mb-4">
                <div className="bg-yellow-100 p-2 rounded-md mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-yellow-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Comfortable Travel</h3>
                  <p className="text-muted-foreground">
                    Spacious seating areas, clean facilities, and refreshments
                    available onboard for a pleasant journey.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12">
            <button className="bg-primary text-white px-8 py-3 rounded-md font-medium hover:bg-blue-700 transition">
              Book Your Trip Now
            </button>
          </div>
        </div>
      </section>

      {/* Live Ferry Status Section */}

      {/* Available Ferries Section */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold ">Available Ferries</h2>
              <p className="text-muted-foreground">
                Choose a route and fare that fits your plan
              </p>
            </div>
            <button className="text-primary">Filters</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Ferry Card 1 */}
            <div className="bg-card rounded-lg overflow-hidden shadow-sm border border-gray-100">
              <div className="h-40 bg-blue-100 relative">
                <Image
                  src="https://images.unsplash.com/photo-1566438480900-0609be27a4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZmVycnl8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
                  alt="Ferry"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-2">
                  Seattle → Bainbridge Island
                </h3>
                <div className="flex justify-between text-sm text-muted-foreground mb-4">
                  <span>Duration: 35m</span>
                  <span className="font-semibold text-gray-800">$18</span>
                </div>
                <button className="w-full bg-primary text-white py-2 rounded-md hover:bg-blue-700 transition">
                  Book Now
                </button>
              </div>
            </div>

            {/* Ferry Card 2 */}
            <div className="bg-card  rounded-lg overflow-hidden shadow-sm border border-gray-100">
              <div className="h-40 bg-blue-100 relative">
                <Image
                  src="https://images.unsplash.com/photo-1518623001395-125242310d0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dmFuY291dmVyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
                  alt="Ferry"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-2">Vancouver → Victoria</h3>
                <div className="flex justify-between text-sm text-muted-foreground mb-4">
                  <span>Duration: 1h 35m</span>
                  <span className="font-semibold text-gray-800">$42</span>
                </div>
                <button className="w-full bg-primary text-white py-2 rounded-md hover:bg-blue-700 transition">
                  Book Now
                </button>
              </div>
            </div>

            {/* Ferry Card 3 */}
            <div className="bg-card border rounded-lg overflow-hidden shadow-sm border border-gray-100">
              <div className="h-40 bg-blue-100 relative">
                <Image
                  src="https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZG92ZXIlMjBjbGlmZnN8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
                  alt="Ferry"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-2">Dover → Calais</h3>
                <div className="flex justify-between text-sm text-muted-foreground mb-4">
                  <span>Duration: 1h 30m</span>
                  <span className="font-semibold text-gray-800">$35</span>
                </div>
                <button className="w-full bg-primary text-white py-2 rounded-md hover:bg-blue-700 transition">
                  Book Now
                </button>
              </div>
            </div>

            {/* Ferry Card 4 */}
            <div className="bg-card border rounded-lg overflow-hidden shadow-sm border border-gray-100">
              <div className="h-40 bg-blue-100 relative">
                <Image
                  src="https://images.unsplash.com/photo-1533105079780-92b9be482077?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2FudG9yaW5pfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
                  alt="Ferry"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-2">Helsinki → Tallinn</h3>
                <div className="flex justify-between text-sm text-muted-foreground mb-4">
                  <span>Duration: 2h 10m</span>
                  <span className="font-semibold text-gray-800">$58</span>
                </div>
                <button className="w-full bg-primary text-white py-2 rounded-md hover:bg-blue-700 transition">
                  Book Now
                </button>
              </div>
            </div>

            {/* Ferry Card 5 */}
            <div className="bg-card border rounded-lg overflow-hidden shadow-sm border border-gray-100">
              <div className="h-40 bg-blue-100 relative">
                <Image
                  src="https://images.unsplash.com/photo-1533105079780-92b9be482077?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2FudG9yaW5pfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
                  alt="Ferry"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-2">Santorini → Mykonos</h3>
                <div className="flex justify-between text-sm text-muted-foreground mb-4">
                  <span>Duration: 2h 30m</span>
                  <span className="font-semibold text-gray-800">$64</span>
                </div>
                <button className="w-full bg-primary text-white py-2 rounded-md hover:bg-blue-700 transition">
                  Book Now
                </button>
              </div>
            </div>

            {/* Ferry Card 6 */}
            <div className="bg-card border rounded-lg overflow-hidden shadow-sm border border-gray-100">
              <div className="h-40 bg-blue-100 relative">
                <Image
                  src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2Fwcml8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
                  alt="Ferry"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-2">Naples → Capri</h3>
                <div className="flex justify-between text-sm text-muted-foreground mb-4">
                  <span>Duration: 50m</span>
                  <span className="font-semibold text-gray-800">$27</span>
                </div>
                <button className="w-full bg-primary text-white py-2 rounded-md hover:bg-blue-700 transition">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-6 mt-auto">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">FerryWave</h3>
            <p className="text-gray-400">
              Fast, reliable ferry bookings across the world's most beautiful
              waterways.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Press
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Partners
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Contact Support
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto pt-8 mt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>© 2023 FerryWave. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
