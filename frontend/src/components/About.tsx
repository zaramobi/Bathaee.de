import { Language } from "@/types/profile";

interface Props {
  summary: string;
  languages: Language[];
  location: string;
}

export default function About({ summary, languages, location }: Props) {
  return (
    <section id="about" className="section" aria-labelledby="about-heading">
      <p className="section-label">About</p>
      <h2 id="about-heading" className="section-title">Background & expertise</h2>

      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          <p className="text-fg/70 leading-relaxed text-base">{summary}</p>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-fg mb-3">Languages</h3>
            <ul className="space-y-2" role="list">
              {languages.map((lang) => (
                <li key={lang.language} className="flex justify-between text-sm">
                  <span className="text-fg/70">{lang.language}</span>
                  <span className="text-muted font-mono text-xs">{lang.level}</span>
                </li>
              ))}
            </ul>
          </div>

          {location && (
            <div>
              <h3 className="text-sm font-medium text-fg mb-3">Based in</h3>
              <p className="text-fg/70 text-sm">{location}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
