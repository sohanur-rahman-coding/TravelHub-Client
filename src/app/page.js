import { PremiumTravelBanner } from "@/components/Banner";
import { PopularRoutes } from "@/components/PopularRoutes";
import { WhyChooseUs } from "@/components/WhyChooseUs";


export default function Home() {
  return (
    <div>
      <PremiumTravelBanner/>
      <WhyChooseUs></WhyChooseUs>
      <PopularRoutes></PopularRoutes>
    </div>
  );
}
