import { Inter } from "next/font/google";
import '../globals.css'

import DashProfile from "@/components/Dashboard/DashProfile";
import { getUserSession } from "@/lib/api/Session";
import DashboardSidebar from "@/components/Dashboard/DashboardSideBar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "react-hot-toast";

export const dynamic = "force-dynamic";


const inter = Inter({
  subsets: ["latin"],
});

export default async function DashboardRootLayout({ children }) {
  const user = await getUserSession();
  // console.log("DashboardRootLayout fetched user session:", user);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} h-full antialiased`} suppressHydrationWarning>
        <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex h-screen overflow-hidden w-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-500 antialiased animate__animated animate__fadeIn animate__faster">
        
        {/* Sidebar */}
        <DashboardSidebar user={user} />
        
        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          
          {/* Premium Glassmorphism Header */}
          <header className="flex items-center justify-end h-20 px-6 sm:px-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border-b border-gray-200 dark:border-gray-800 w-full shrink-0 z-20 shadow-sm animate__animated animate__fadeInDown">
            <div className="animate__animated animate__zoomIn animate__delay-1s">
              <DashProfile />
            </div>
          </header>

          {/* Scrollable Main Content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 relative scroll-smooth">
            <div className="max-w-7xl mx-auto w-full animate__animated animate__fadeInUp animate__faster">
              {children}
            </div>
          </main>
          <Toaster 
          position="top-center" 
          reverseOrder={false} 
        />
        </div>
      </div>
    </ThemeProvider>
      </body>
    </html>
  );
}