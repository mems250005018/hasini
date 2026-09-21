import Hero from "@/components/Hero";
import InviteCard from "@/components/InviteCard";
import Cake from "@/components/Cake";
import BiryaniRing from "@/components/BiryaniRing";
import Polaroid from "@/components/Polaroid";
import Reveal from "@/components/Reveal";
import Confetti from "@/components/Confetti";
import { invite } from "@/lib/invite";

export default function Home() {
  return (
    <main>
      <Confetti />
      <Reveal />
      <Hero />
      <InviteCard />
      <BiryaniRing />
      <Cake />
      <Polaroid />
      <footer className="foot">
        <p>
          {invite.guest}, this one is for you. Love, {invite.host}.
        </p>
      </footer>
    </main>
  );
}
