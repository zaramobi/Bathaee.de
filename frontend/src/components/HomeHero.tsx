import Link from "next/link";
import Monogram from "@/components/Monogram";
import ContactButton from "@/components/ContactButton";

export default function HomeHero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-label="Introduction"
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
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-[0.07]"
        style={{ background: "radial-gradient(circle, #4f8ef7 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="flex justify-center mb-8 animate-fade-in">
          <Monogram size={48} theme="accent" display="contained" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent/5 mb-10 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
          <span className="text-xs font-mono text-accent">Available for freelance projects</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-up">
          <span className="gradient-text">We build modern</span>
          <br />
          <span className="gradient-text">digital products.</span>
        </h1>

        <p
          className="text-xl md:text-2xl text-muted font-light mb-4 max-w-2xl mx-auto animate-fade-up"
          style={{ animationDelay: "0.1s", opacity: 0 }}
        >
          A small multidisciplinary team of developers available for projects.
        </p>

        <p
          className="text-base text-fg/40 mb-12 max-w-xl mx-auto leading-relaxed animate-fade-up"
          style={{ animationDelay: "0.2s", opacity: 0 }}
        >
          We collaborate on web applications, AI tools, and modern digital experiences.
          Open for freelance projects and long-term collaborations.
        </p>

        <div
          className="flex flex-wrap justify-center gap-3 animate-fade-up"
          style={{ animationDelay: "0.3s", opacity: 0 }}
        >
          <Link
            href="#team"
            className="px-7 py-3.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
          >
            Meet the team
          </Link>
          <ContactButton className="px-7 py-3.5 rounded-lg border border-border text-sm font-medium text-muted hover:text-fg hover:border-fg/20 transition-colors">
            Work with us
          </ContactButton>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 4v12M4 10l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  );
}
