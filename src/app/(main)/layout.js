import { Inter } from "next/font/google";
import "./globals.css";

import Footer from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ThemeProvider } from "@/components/ThemeProvider";


const inter = Inter({
  subsets: ["latin"],
});

export const metadata = {
  title: "TravelHub | Your Ultimate Ticket Booking Platform",
  description:
    "Book bus, train, and flight tickets easily with TravelHub. Fast, secure, and reliable.",
  keywords: "travel, tickets, bus, train, booking, travelhub",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.className} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning={true}
        className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Navbar />
          <main className="max-w-7xl mx-auto px-2 min-h-screen">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
