import Hero from "@/components/Hero";
import InviteCard from "@/components/InviteCard";
import Cake from "@/components/Cake";
import Feast from "@/components/Feast";
import Polaroid from "@/components/Polaroid";
import Intro from "@/components/Intro";
import Marquee from "@/components/Marquee";
import Reveal from "@/components/Reveal";
import ScrollBar from "@/components/ScrollBar";
import Confetti from "@/components/Confetti";
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
      <Polaroid />
      <footer className="foot rv">
        <p>
          {invite.guest}, this one is for you. Love, {invite.from}.
        </p>
      </footer>
    </main>
  );
}
