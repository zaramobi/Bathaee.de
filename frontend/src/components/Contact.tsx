import { Personal } from "@/types/profile";
import { Mail, Linkedin, MapPin, Phone } from "lucide-react";
import Link from "next/link";

interface Props {
  personal: Personal;
}

export default function Contact({ personal }: Props) {
  const linkedinHandle = personal.linkedin
    .replace(/https?:\/\/(www\.)?linkedin\.com\/in\//, "")
    .replace(/\/$/, "");

  return (
    <section id="contact" className="section" aria-labelledby="contact-heading">
      <div className="max-w-2xl mx-auto text-center">
        <p className="section-label">Get in touch</p>
        <h2 id="contact-heading" className="section-title">Let&apos;s work together</h2>
        <p className="text-fg/50 mb-10 leading-relaxed">
          Open to freelance projects, consulting engagements, and collaborations.
          Available remotely worldwide.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <a
            href={`mailto:${personal.email}`}
            className="card flex items-center gap-4 hover:border-accent/30 hover:bg-accent/5 transition-all group"
            aria-label={`Send email to ${personal.email}`}
          >
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors" aria-hidden="true">
              <Mail size={18} className="text-accent" />
            </div>
            <div className="text-left min-w-0">
              <p className="text-xs text-muted mb-0.5">Email</p>
              <p className="text-sm text-fg truncate">{personal.email}</p>
            </div>
          </a>

          {personal.phone && personal.phone !== "Not available" && (
            <a
              href={`tel:${personal.phone.replace(/\s/g, "")}`}
              className="card flex items-center gap-4 hover:border-fg/20 transition-all group"
              aria-label={`Call ${personal.phone}`}
            >
              <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center shrink-0" aria-hidden="true">
                <Phone size={18} className="text-muted" />
              </div>
              <div className="text-left">
                <p className="text-xs text-muted mb-0.5">Phone</p>
                <p className="text-sm text-fg">{personal.phone}</p>
              </div>
            </a>
          )}

          {personal.linkedin && (
            <a
              href={personal.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="card flex items-center gap-4 hover:border-[#0077b5]/40 hover:bg-[#0077b5]/5 transition-all group"
              aria-label="LinkedIn profile"
            >
              <div className="w-10 h-10 rounded-lg bg-[#0077b5]/10 flex items-center justify-center shrink-0" aria-hidden="true">
                <Linkedin size={18} className="text-[#0077b5]" />
              </div>
              <div className="text-left">
                <p className="text-xs text-muted mb-0.5">LinkedIn</p>
                <p className="text-sm text-fg">linkedin.com/in/{linkedinHandle}</p>
              </div>
            </a>
          )}

          <div className="card flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-surface-2 flex items-center justify-center shrink-0" aria-hidden="true">
              <MapPin size={18} className="text-muted" />
            </div>
            <div className="text-left">
              <p className="text-xs text-muted mb-0.5">Location</p>
              <p className="text-sm text-fg">{personal.location}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <a
            href={`mailto:${personal.email}`}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-accent text-white font-medium hover:bg-accent/90 transition-colors"
          >
            <Mail size={16} aria-hidden="true" />
            Send a message
          </a>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-4 rounded-lg border border-border text-muted hover:text-fg hover:border-fg/20 transition-colors text-sm"
          >
            ← Back to team
          </Link>
        </div>
      </div>
    </section>
  );
}
