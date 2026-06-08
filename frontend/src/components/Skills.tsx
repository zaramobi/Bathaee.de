const CATEGORY_ICONS: Record<string, string> = {
  languages:       "{ }",
  rtos:            "⚙",
  microcontrollers:"◈",
  protocols:       "⇄",
  cloud:           "☁",
  hardware:        "⬡",
  telecom:         "◎",
  tools:           "⚒",
  backend:         "{ }",
  frontend:        "◻",
  databases:       "▤",
  architecture:    "◈",
  ecommerce:       "◎",
};

const CATEGORY_LABELS: Record<string, string> = {
  languages:        "Languages",
  rtos:             "RTOS",
  microcontrollers: "Microcontrollers & Boards",
  protocols:        "Protocols",
  cloud:            "Cloud & Platforms",
  hardware:         "Hardware & EDA",
  telecom:          "Telecom & RF",
  tools:            "Tools & Environments",
  backend:          "Backend",
  frontend:         "Frontend",
  databases:        "Databases",
  architecture:     "Architecture",
  ecommerce:        "E-Commerce",
};

interface Props {
  skills: Record<string, string[]>;
}

export default function Skills({ skills }: Props) {
  return (
    <section id="skills" className="section" aria-labelledby="skills-heading">
      <p className="section-label">Skills</p>
      <h2 id="skills-heading" className="section-title">Technical expertise</h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(skills).map(([key, items]) => {
          const label = CATEGORY_LABELS[key] ?? key.charAt(0).toUpperCase() + key.slice(1);
          const icon  = CATEGORY_ICONS[key]  ?? "◆";
          return (
            <div key={key} className="card" role="region" aria-labelledby={`skill-${key}`}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-accent text-sm font-mono" aria-hidden="true">{icon}</span>
                <h3 id={`skill-${key}`} className="text-sm font-medium text-fg">{label}</h3>
              </div>
              <div className="flex flex-wrap gap-1.5" role="list">
                {items.map((item) => (
                  <span key={item} className="tag" role="listitem">{item}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
