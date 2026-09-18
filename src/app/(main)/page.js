import { Suspense } from "react";
import { PremiumTravelBanner } from "@/components/Banner";
import Feature from "@/components/Dashboard/Feature";
import LatestTickets from "@/components/LatestTickets";
import { PopularRoutes } from "@/components/PopularRoutes";
import { WhyChooseUs } from "@/components/WhyChooseUs";

// Skeleton for loading states
function CardGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4 py-8">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-[520px] rounded-[2rem] bg-slate-200 dark:bg-slate-800 animate-pulse" />
      ))}
    </div>
  );
}

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div>
      <PremiumTravelBanner />
      <Suspense fallback={<CardGridSkeleton />}>
        <Feature />
      </Suspense>
      <Suspense fallback={<CardGridSkeleton />}>
        <LatestTickets />
      </Suspense>
      <WhyChooseUs />
      <PopularRoutes />
    </div>
  );
}
