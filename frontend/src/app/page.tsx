export const dynamic = "force-dynamic";

import { getProfiles } from "@/lib/api";
import SiteHeader from "@/components/SiteHeader";
import HomeHero from "@/components/HomeHero";
import TeamSection from "@/components/TeamSection";
import TeamContact from "@/components/TeamContact";

export default async function HomePage() {
  const profiles = await getProfiles();

  return (
    <>
      <SiteHeader variant="home" />
      <main>
        <HomeHero />
        <TeamSection members={profiles} />
        <TeamContact members={profiles} />
      </main>
      <footer className="border-t border-border py-8 text-center text-sm text-muted">
        <p>© {new Date().getFullYear()} bathaee.de . Building digital products together</p>
      </footer>
    </>
  );
}
