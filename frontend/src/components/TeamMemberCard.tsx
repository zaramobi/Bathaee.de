import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { ProfileMeta } from "@/types/profile";

interface Props {
  member: ProfileMeta;
}

export default function TeamMemberCard({ member }: Props) {
  return (
    <Link
      href={`/team/${member.id}`}
      className="group card flex flex-col hover:border-accent/40 transition-all duration-200"
      aria-label={`View ${member.name}'s profile`}
    >
      <div className="flex items-center gap-4 mb-5">
        <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-border group-hover:ring-accent/40 transition-all shrink-0">
          {member.avatarUrl ? (
            <Image
              src={member.avatarUrl}
              alt={`${member.name} profile photo`}
              width={56}
              height={56}
              className="w-full h-full object-cover object-top"
            />
          ) : (
            <div className="w-full h-full bg-accent/10 flex items-center justify-center text-accent font-bold text-lg">
              {member.name.charAt(0)}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <h3 className="text-fg font-semibold text-base leading-tight truncate">{member.name}</h3>
          <p className="text-accent text-xs font-medium mt-0.5 truncate">{member.title}</p>
        </div>
      </div>

      <p className="text-fg/50 text-sm leading-relaxed line-clamp-3 flex-1 mb-5">
        {member.summary}
      </p>

      {member.topSkills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5" role="list" aria-label="Key skills">
          {member.topSkills.slice(0, 6).map((skill) => (
            <span key={skill} className="tag" role="listitem">{skill}</span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
        <span className="flex items-center gap-1.5 text-xs text-muted">
          <MapPin size={11} aria-hidden="true" />
          {member.location}
        </span>
        <span className="flex items-center gap-1 text-xs text-accent font-medium group-hover:gap-2 transition-all">
          View profile
          <ArrowRight size={12} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
