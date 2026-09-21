import Hero from "@/components/Hero";
import InviteCard from "@/components/InviteCard";
import Cake from "@/components/Cake";
import BiryaniRing from "@/components/BiryaniRing";
import Polaroid from "@/components/Polaroid";
import Intro from "@/components/Intro";
import Marquee from "@/components/Marquee";
import Reveal from "@/components/Reveal";
import Confetti from "@/components/Confetti";
import { invite } from "@/lib/invite";

export default function Home() {
  return (
    <main>
      <Intro />
      <Confetti />
      <Reveal />
      <Hero />
      <Marquee />
      <InviteCard />
      <BiryaniRing />
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
