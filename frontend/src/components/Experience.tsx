import { ExperienceItem } from "@/types/profile";

interface Props {
  items: ExperienceItem[];
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "Present";
  const [year, month] = dateStr.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return month ? `${months[parseInt(month, 10) - 1]} ${year}` : year;
}

function totalYears(items: ExperienceItem[]): number {
  const ms = items.reduce((acc, item) => {
    const start = new Date(item.start + "-01");
    const end   = item.end ? new Date(item.end + "-01") : new Date();
    return acc + Math.max(0, end.getTime() - start.getTime());
  }, 0);
  return Math.round(ms / (1000 * 60 * 60 * 24 * 365));
}

export default function Experience({ items }: Props) {
  return (
    <section id="experience" className="section" aria-labelledby="experience-heading">
      <p className="section-label">Experience</p>
      <h2 id="experience-heading" className="section-title">
        {totalYears(items)}+ years of professional experience
      </h2>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-px bg-border md:left-[200px]" aria-hidden="true" />

        <ol className="space-y-0" aria-label="Work experience timeline">
          {items.map((item) => (
            <li key={item.id} className="relative pl-6 md:pl-[232px] pb-10">
              <div
                className={`absolute left-[-4px] md:left-[196px] top-1.5 w-2 h-2 rounded-full border-2 ${
                  item.current ? "border-accent bg-accent" : "border-muted bg-surface-0"
                }`}
                aria-hidden="true"
              />

              <div className="hidden md:block absolute left-0 top-0 w-[188px] text-right">
                <span className="text-xs font-mono text-muted">
                  {formatDate(item.start)} — {formatDate(item.end)}
                </span>
              </div>

              <div className="card group">
                <p className="md:hidden text-xs font-mono text-muted mb-2">
                  {formatDate(item.start)} — {formatDate(item.end)}
                </p>

                <div className="flex items-start justify-between gap-4 mb-1">
                  <div>
                    <h3 className="font-semibold text-fg text-base">{item.role}</h3>
                    <p className="text-sm text-accent mt-0.5">
                      {item.company}
                      {item.type === "Freelance" && (
                        <span className="ml-2 text-xs text-muted border border-border rounded px-1.5 py-0.5 font-mono">
                          freelance
                        </span>
                      )}
                    </p>
                  </div>
                  {item.current && (
                    <span className="shrink-0 text-xs font-mono px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Current
                    </span>
                  )}
                </div>

                <p className="text-xs text-muted mb-3">{item.location}</p>
                <p className="text-sm text-fg/60 mb-4 leading-relaxed">{item.description}</p>

                <ul className="space-y-1.5 mb-4" role="list">
                  {item.bullets.map((bullet, i) => (
                    <li key={i} className="flex gap-2 text-sm text-fg/70">
                      <span className="text-accent mt-0.5 shrink-0" aria-hidden="true">›</span>
                      {bullet}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-1.5" role="list" aria-label="Technologies used">
                  {item.skills.map((skill) => (
                    <span key={skill} className="tag" role="listitem">{skill}</span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
