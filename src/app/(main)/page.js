import { PremiumTravelBanner } from "@/components/Banner";
import Advertisement from "@/components/Dashboard/Advertisement";
import { PopularRoutes } from "@/components/PopularRoutes";
import { WhyChooseUs } from "@/components/WhyChooseUs";


export default function Home() {
  return (
    <div>
      <PremiumTravelBanner/>
      <Advertisement></Advertisement>
      <WhyChooseUs></WhyChooseUs>
      <PopularRoutes></PopularRoutes>
    </div>
  );
}
