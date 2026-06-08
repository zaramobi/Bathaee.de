import { ProfileMeta } from "@/types/profile";
import TeamMemberCard from "@/components/TeamMemberCard";

interface Props {
  members: ProfileMeta[];
}

export default function TeamSection({ members }: Props) {
  return (
    <section id="team" className="section" aria-labelledby="team-heading">
      <p className="section-label">The team</p>
      <h2 id="team-heading" className="section-title">People behind the work</h2>
      <p className="text-fg/50 mb-10 max-w-xl">
        We are a small group of senior engineers who collaborate on projects
        ranging from embedded firmware to full-stack web applications.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>
    </section>
  );
}
