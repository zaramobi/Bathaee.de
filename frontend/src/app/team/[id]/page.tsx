export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProfile } from "@/lib/api";
import SiteHeader from "@/components/SiteHeader";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import { MapPin, Mail, Linkedin, FileText } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const profile = await getProfile(id);
    return {
      title:       `${profile.personal.name} – ${profile.personal.title}`,
      description: profile.personal.tagline,
      openGraph: {
        title:       `${profile.personal.name} – ${profile.personal.title}`,
        description: profile.personal.tagline,
        type:        "profile",
      },
    };
  } catch {
    return { title: "Team member" };
  }
}

export default async function TeamMemberPage({ params }: Props) {
  const { id } = await params;

  let profile;
  try {
    profile = await getProfile(id);
  } catch {
    notFound();
  }

  const { personal } = profile;

  return (
    <>
      <SiteHeader variant="detail" />

      <main>
        {/* Hero */}
        <section
          id="hero"
          className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
          aria-label={`${personal.name} introduction`}
        >
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
            aria-hidden="true"
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.07]"
            style={{ background: "radial-gradient(circle, #4f8ef7 0%, transparent 70%)" }}
            aria-hidden="true"
          />

          <div className="relative z-10 text-center px-6 max-w-3xl mx-auto mt-10">


            <div className="mx-auto mb-8 w-28 h-28 rounded-full overflow-hidden ring-2 ring-border animate-fade-in">
              {personal.avatarUrl ? (
                <Image
                  src={personal.avatarUrl}
                  alt={`${personal.name} profile photo`}
                  width={112}
                  height={112}
                  className="w-full h-full object-cover object-top"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-accent/10 flex items-center justify-center text-accent text-3xl font-bold">
                  {personal.name.charAt(0)}
                </div>
              )}
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/5 mb-6 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
              <span className="text-xs font-mono text-accent">Available for projects</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-3 animate-fade-up">
              <span className="gradient-text">{personal.name}</span>
            </h1>
            <p
              className="text-lg md:text-xl text-muted font-light mb-4 animate-fade-up"
              style={{ animationDelay: "0.1s", opacity: 0 }}
            >
              {personal.title}
            </p>
            <p
              className="text-base text-fg/40 max-w-xl mx-auto mb-8 leading-relaxed animate-fade-up"
              style={{ animationDelay: "0.2s", opacity: 0 }}
            >
              {personal.tagline}
            </p>

            <div
              className="flex flex-wrap justify-center gap-4 mb-8 text-sm text-muted animate-fade-up"
              style={{ animationDelay: "0.25s", opacity: 0 }}
            >
              <span className="flex items-center gap-1.5">
                <MapPin size={14} aria-hidden="true" />
                {personal.location}
              </span>
              <a href={`mailto:${personal.email}`} className="flex items-center gap-1.5 hover:text-fg transition-colors">
                <Mail size={14} aria-hidden="true" />
                {personal.email}
              </a>
            </div>

            <div
              className="flex flex-wrap justify-center gap-3 animate-fade-up"
              style={{ animationDelay: "0.3s", opacity: 0 }}
            >
              <a
                href={`mailto:${personal.email}`}
                className="px-6 py-3 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
              >
                Get in touch
              </a>
              {personal.linkedin && (
                <a
                  href={personal.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-lg border border-border text-sm font-medium text-muted hover:text-fg hover:border-fg/20 transition-colors flex items-center gap-2"
                >
                  <Linkedin size={15} aria-hidden="true" />
                  LinkedIn
                </a>
              )}
              <Link
                href={`/team/${id}/cv`}
                className="px-6 py-3 rounded-lg border border-border text-sm font-medium text-muted hover:text-fg hover:border-fg/20 transition-colors flex items-center gap-2"
              >
                <FileText size={15} aria-hidden="true" />
                View CV
              </Link>
            </div>
          </div>
        </section>

        <About summary={profile.summary} languages={profile.languages} location={personal.location} />
        <Experience items={profile.experience} />
        <Skills skills={profile.skills} />
        <Education education={profile.education} certifications={profile.certifications} awards={profile.awards} />
        <Contact personal={personal} />
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted">
        <p>
          © {new Date().getFullYear()} {personal.name} ·{" "}
          <Link href="/" className="hover:text-fg transition-colors">bathaee.de</Link>
        </p>
      </footer>
    </>
  );
}
