import { EducationItem, Certification, Award } from "@/types/profile";
import { GraduationCap, Award as AwardIcon, BadgeCheck } from "lucide-react";

interface Props {
  education:      EducationItem[];
  certifications: Certification[];
  awards:         Award[];
}

export default function Education({ education, certifications, awards }: Props) {
  return (
    <section id="education" className="section" aria-labelledby="education-heading">
      <p className="section-label">Education & Credentials</p>
      <h2 id="education-heading" className="section-title">Academic background</h2>

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {education.map((edu) => (
          <div key={edu.institution} className="card flex gap-4">
            <div className="shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center" aria-hidden="true">
              <GraduationCap size={18} className="text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-fg text-sm">{edu.degree}</h3>
              <p className="text-accent text-sm mt-0.5">{edu.field}</p>
              <p className="text-muted text-xs mt-1">{edu.institution}</p>
              <p className="text-muted text-xs font-mono mt-1">{edu.start} — {edu.end}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-fg mb-4 flex items-center gap-2">
            <BadgeCheck size={16} className="text-accent" aria-hidden="true" />
            Certifications
          </h3>
          <ul className="space-y-3" role="list">
            {certifications.map((cert) => (
              <li key={cert.name} className="card py-3 px-4 flex justify-between items-center">
                <span className="text-sm text-fg/80">{cert.name}</span>
                <span className="text-xs text-muted font-mono">{cert.issuer}</span>
              </li>
            ))}
          </ul>
        </div>

        {awards.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-fg mb-4 flex items-center gap-2">
              <AwardIcon size={16} className="text-accent" aria-hidden="true" />
              Honours & Awards
            </h3>
            <ul className="space-y-3" role="list">
              {awards.map((award) => (
                <li key={award.title} className="card">
                  <p className="text-sm font-medium text-fg">{award.title}</p>
                  <p className="text-xs text-accent mt-0.5">{award.issuer}</p>
                  <p className="text-xs text-muted mt-2 leading-relaxed">{award.description}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
