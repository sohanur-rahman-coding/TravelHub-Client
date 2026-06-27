import { PremiumTravelBanner } from "@/components/Banner";
import Advertisement from "@/components/Dashboard/Advertisement";
import LatestTickets from "@/components/LatestTickets";
import { PopularRoutes } from "@/components/PopularRoutes";
import { WhyChooseUs } from "@/components/WhyChooseUs";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <div>
      <PremiumTravelBanner/>
      <Advertisement></Advertisement>
      <LatestTickets></LatestTickets>
      <WhyChooseUs></WhyChooseUs>
      <PopularRoutes></PopularRoutes>
    </div>
  );
}

