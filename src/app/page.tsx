import { Accounts } from "@/components/Accounts";
import { Contact } from "@/components/Contact";
import { Couple } from "@/components/Couple";
import { Ending } from "@/components/Ending";
import { Gallery } from "@/components/Gallery";
import { Hero } from "@/components/Hero";
import { Invitation } from "@/components/Invitation";
import { Location } from "@/components/Location";
import { Share } from "@/components/Share";
import { Transportation } from "@/components/Transportation";
import { WeddingCalendar } from "@/components/WeddingCalendar";
import { WeddingInfo } from "@/components/WeddingInfo";

export default function Page() {
  return (
    <main>
      <Hero />
      <Invitation />
      <Couple />
      <WeddingInfo />
      <WeddingCalendar />
      <Gallery />
      <Location />
      <Transportation />
      <Accounts />
      <Contact />
      <Share />
      <Ending />
    </main>
  );
}
