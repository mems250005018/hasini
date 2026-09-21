import Hero from "@/components/sections/Hero";
import InviteCard from "@/components/sections/InviteCard";
import Cake from "@/components/sections/Cake";
import Feast from "@/components/sections/Feast";
import PhotoGraph from "@/components/sections/PhotoGraph";
import Polaroid from "@/components/sections/Polaroid";
import Intro from "@/components/fx/Intro";
import Marquee from "@/components/sections/Marquee";
import Reveal from "@/components/fx/Reveal";
import ScrollBar from "@/components/fx/ScrollBar";
import Confetti from "@/components/fx/Confetti";
import { invite } from "@/lib/invite";

export default function Home() {
  return (
    <main>
      <Intro />
      <Confetti />
      <Reveal />
      <ScrollBar />
      <Hero />
      <Marquee />
      <InviteCard />
      <Feast />
      <Cake />
      <Marquee flip />
      <PhotoGraph />
      <Polaroid />
      <footer className="foot rv">
        <p>
          {invite.guest}, this one is for you. Love, {invite.from}.
        </p>
      </footer>
    </main>
  );
}
