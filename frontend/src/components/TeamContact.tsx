import Link from "next/link";
import { ProfileMeta } from "@/types/profile";
import ContactButton from "@/components/ContactButton";

interface Props {
  members: ProfileMeta[];
}

export default function TeamContact({ members }: Props) {
  return (
    <section id="contact" className="section" aria-labelledby="contact-heading">
      <div className="max-w-2xl mx-auto text-center">
        <p className="section-label">Let&apos;s collaborate</p>
        <h2 id="contact-heading" className="section-title">Work with us</h2>
        <p className="text-fg/50 mb-10 leading-relaxed">
          We take on freelance projects, short-term consulting, and long-term
          collaborations. Drop us a message or reach out to a team member directly.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <ContactButton className="px-7 py-3.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors">
            Send us a message
          </ContactButton>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {members.map((member) => (
            <Link
              key={member.id}
              href={`/team/${member.id}#contact`}
              className="card text-left hover:border-accent/30 transition-all group"
              aria-label={`Contact ${member.name}`}
            >
              <p className="text-sm font-semibold text-fg mb-0.5 group-hover:text-accent transition-colors">
                {member.name}
              </p>
              <p className="text-xs text-muted mb-3">{member.title}</p>
              <span className="text-xs text-fg/40 group-hover:text-fg/70 transition-colors flex items-center gap-1.5">
                View profile & contact
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M1 5h8M5 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </Link>
          ))}
        </div>

        <p className="text-fg/25 text-xs mt-10 font-mono">
          bathaee.de · Berlin, Germany · Available remotely worldwide
        </p>
      </div>
    </section>
  );
}
