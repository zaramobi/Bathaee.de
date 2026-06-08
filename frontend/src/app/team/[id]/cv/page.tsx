export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import { getProfile } from "@/lib/api";
import type { Metadata } from "next";
import type { Profile } from "@/types/profile";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const profile = await getProfile(id);
    return {
      title: `${profile.personal.name} – CV`,
      description: `Curriculum Vitae of ${profile.personal.name}, ${profile.personal.title}`,
      robots: { index: false },
    };
  } catch {
    return { title: "CV" };
  }
}

// ─── Sub-components (all inline so this file is self-contained for printing) ──

function CvHeader({ profile }: { profile: Profile }) {
  const { personal } = profile;
  const linkedin = personal.linkedin
    .replace(/https?:\/\/(www\.)?/, "")
    .replace(/\/$/, "");

  return (
    <header className="mb-8 pb-6 border-b border-gray-200">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">{personal.name}</h1>
      <p className="text-lg text-gray-600 mb-4">{personal.title}</p>

      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
        {personal.email    && <span>{personal.email}</span>}
        {personal.phone    && <span>{personal.phone}</span>}
        {personal.location && <span>{personal.location}</span>}
        {personal.linkedin && <span>{linkedin}</span>}
        {personal.github   && <span>{personal.github}</span>}
        {personal.website  && <span>{personal.website}</span>}
      </div>
    </header>
  );
}

function CvSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-7">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-200 pb-1">
        {title}
      </h2>
      {children}
    </section>
  );
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Present";
  const [year, month] = dateStr.split("-");
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return month ? `${months[parseInt(month, 10) - 1]} ${year}` : year;
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default async function CvPage({ params }: Props) {
  const { id } = await params;

  let profile: Profile;
  try {
    profile = await getProfile(id);
  } catch {
    notFound();
  }

  const allSkills = Object.entries(profile.skills);

  return (
    <>
      {/* Print / back controls — hidden when printing */}
      <div className="print:hidden sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <Link href={`/team/${id}`} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
          ← Back to profile
        </Link>
        <button
          onClick={() => window.print()}
          className="text-sm px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition-colors"
        >
          Print / Save PDF
        </button>
      </div>

      {/* CV document */}
      <div
        className="cv-page max-w-[800px] mx-auto px-10 py-12 bg-white text-gray-900 min-h-screen"
        style={{ fontFamily: "'Inter', 'Arial', sans-serif" }}
      >
        <CvHeader profile={profile} />

        {/* Summary */}
        {profile.summary && (
          <CvSection title="Professional Summary">
            <p className="text-sm text-gray-700 leading-relaxed">{profile.summary}</p>
          </CvSection>
        )}

        {/* Experience */}
        {profile.experience.length > 0 && (
          <CvSection title="Professional Experience">
            <div className="space-y-5">
              {profile.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex items-start justify-between gap-4 mb-0.5">
                    <div>
                      <span className="font-semibold text-gray-900 text-sm">{exp.role}</span>
                      <span className="text-gray-500 text-sm"> · {exp.company}</span>
                      {exp.type === "Freelance" && (
                        <span className="ml-2 text-xs text-gray-400">(Freelance)</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                      {formatDate(exp.start)} – {formatDate(exp.end)}
                    </span>
                  </div>

                  {exp.location && (
                    <p className="text-xs text-gray-400 mb-1.5">{exp.location}</p>
                  )}

                  {exp.description && (
                    <p className="text-sm text-gray-600 mb-2 leading-relaxed">{exp.description}</p>
                  )}

                  {exp.bullets.length > 0 && (
                    <ul className="space-y-1 mb-2">
                      {exp.bullets.map((b, i) => (
                        <li key={i} className="text-sm text-gray-700 flex gap-2">
                          <span className="text-gray-400 mt-0.5 shrink-0">•</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}

                  {exp.skills.length > 0 && (
                    <p className="text-xs text-gray-400">
                      <span className="font-medium">Stack: </span>
                      {exp.skills.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CvSection>
        )}

        {/* Skills */}
        {allSkills.length > 0 && (
          <CvSection title="Technical Skills">
            <dl className="space-y-1.5">
              {allSkills.map(([cat, items]) => (
                <div key={cat} className="flex gap-3 text-sm">
                  <dt className="text-gray-500 capitalize whitespace-nowrap w-36 shrink-0">
                    {cat.replace(/-/g, " ")}
                  </dt>
                  <dd className="text-gray-700">{items.join(", ")}</dd>
                </div>
              ))}
            </dl>
          </CvSection>
        )}

        {/* Education */}
        {profile.education.length > 0 && (
          <CvSection title="Education">
            <div className="space-y-3">
              {profile.education.map((edu) => (
                <div key={edu.institution} className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{edu.degree}</p>
                    <p className="text-sm text-gray-600">{edu.field}</p>
                    <p className="text-xs text-gray-400">{edu.institution}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                    {edu.start}{edu.end ? ` – ${edu.end}` : ""}
                  </span>
                </div>
              ))}
            </div>
          </CvSection>
        )}

        {/* Certifications */}
        {profile.certifications.length > 0 && (
          <CvSection title="Certifications">
            <ul className="space-y-1">
              {profile.certifications.map((cert) => (
                <li key={cert.name} className="text-sm text-gray-700 flex justify-between">
                  <span>{cert.name}</span>
                  <span className="text-gray-400">{cert.issuer}</span>
                </li>
              ))}
            </ul>
          </CvSection>
        )}

        {/* Awards */}
        {profile.awards.length > 0 && (
          <CvSection title="Honours & Awards">
            <div className="space-y-3">
              {profile.awards.map((award) => (
                <div key={award.title}>
                  <p className="font-semibold text-sm text-gray-900">{award.title}</p>
                  <p className="text-xs text-gray-400">{award.issuer} · {award.date}</p>
                  <p className="text-sm text-gray-600 mt-1">{award.description}</p>
                </div>
              ))}
            </div>
          </CvSection>
        )}

        {/* Languages */}
        {profile.languages.length > 0 && (
          <CvSection title="Languages">
            <div className="flex flex-wrap gap-x-8 gap-y-1">
              {profile.languages.map((lang) => (
                <span key={lang.language} className="text-sm text-gray-700">
                  {lang.language} <span className="text-gray-400">· {lang.level}</span>
                </span>
              ))}
            </div>
          </CvSection>
        )}
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body { background: white !important; }
          .cv-page { max-width: 100% !important; padding: 0 !important; margin: 0 !important; }
        }
      `}</style>
    </>
  );
}
