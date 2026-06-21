import { Inter } from "next/font/google";
import "../(main)/globals.css";

import DashProfile from "@/components/Dashboard/DashProfile";
import { getUserSession } from "@/lib/api/Session";
import DashboardSidebar from "@/components/Dashboard/DashboardSideBar";


const inter = Inter({
  subsets: ["latin"],
});

export default async function DashboardRootLayout({ children }) {
  const user = await getUserSession();

  return (
    <html lang="en">
      <body className={`${inter.className} h-full antialiased`}>
        <div className="flex h-screen bg-background">
          <DashboardSidebar user={user} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <header className="flex items-center justify-end h-20 px-6 border-b border-zinc-300 dark:border-zinc-800 w-full shrink-0">
              <DashProfile />
            </header>
            <main className="flex-1 overflow-y-auto p-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}