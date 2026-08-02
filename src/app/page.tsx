import { Accounts } from "@/components/Accounts";
import { Couple } from "@/components/Couple";
import { DdayBanner } from "@/components/DdayBanner";
import { Ending } from "@/components/Ending";
import { Gallery } from "@/components/Gallery";
import { Guestbook } from "@/components/Guestbook";
import { GuestSnap } from "@/components/GuestSnap";
import { Hero } from "@/components/Hero";
import { InfoTabs } from "@/components/InfoTabs";
import { Interview } from "@/components/Interview";
import { Invitation } from "@/components/Invitation";
import { Location } from "@/components/Location";
import { QuoteBlock } from "@/components/QuoteBlock";
import { Rsvp } from "@/components/Rsvp";
import { Timeline } from "@/components/Timeline";
import { TogetherTime } from "@/components/TogetherTime";
import { WeddingInfo } from "@/components/WeddingInfo";

export default function Page() {
  return (
    <main>
      <Hero />
      <Invitation />
      <QuoteBlock />
      <Couple />
      <Interview />
      <WeddingInfo />
      <DdayBanner />
      <Gallery />
      <Timeline />
      <GuestSnap />
      <InfoTabs />
      <Location />
      <Rsvp />
      <Accounts />
      <Guestbook />
      <TogetherTime />
      <Ending />
    </main>
  );
}
