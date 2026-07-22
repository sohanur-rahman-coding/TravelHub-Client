import Footer from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export const metadata = {
  title: "TravelHub | Your Ultimate Ticket Booking Platform",
  description:
    "Book bus, train, and flight tickets easily with TravelHub. Fast, secure, and reliable.",
  keywords: "travel, tickets, bus, train, booking, travelhub",
};

export default function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-2 flex-grow w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}
