/**
 * Monogram — geometric "B" mark for bathaee.de
 *
 * Construction (24×24 grid):
 *  • Vertical stem  x:5–9  y:3–21  (4 px wide, 18 px tall)
 *  • Top bowl       semi-ellipse rx=9 ry=4  → peak at (18, 7)
 *  • Bottom bowl    semi-ellipse rx=10 ry=5 → peak at (19,16)  (slightly wider)
 *
 * The two arcs share the junction point (9, 11) — no overlap, no gap.
 * Works cleanly at 16 px (favicon) through display sizes.
 */

type Theme   = "dark" | "light" | "accent";
type Display = "contained" | "bare";

interface Props {
  /** Outer edge length in px — component is always square. Default 24. */
  size?: number;
  /** Background + foreground colour scheme. Default "dark". */
  theme?: Theme;
  /**
   * "contained" wraps the mark in a rounded-square container.
   * "bare"      renders just the letterform with `fill="currentColor"`.
   */
  display?: Display;
  className?: string;
}

const FILL: Record<Theme, { bg: string; fg: string }> = {
  dark:   { bg: "#0d0d0d", fg: "#ffffff" },
  light:  { bg: "#ffffff", fg: "#0d0d0d" },
  accent: { bg: "#4f8ef7", fg: "#ffffff" },
};

// Corner radius scales with size so it stays proportional.
const rx = (size: number) => size * (6.5 / 24);

export default function Monogram({
  size    = 24,
  theme   = "dark",
  display = "contained",
  className,
}: Props) {
  const { bg, fg } = FILL[theme];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {display === "contained" && (
        <rect width="24" height="24" rx={rx(24)} fill={bg} />
      )}

      {/*
        B letterform — single closed path.

        M5 3         start: top-left of stem
        H9           → top-right of stem / top of top bowl
        A9 4 0 0 1   arc (rx=9 ry=4, clockwise, small arc)
          9 11        → junction between the two bowls
        A10 5 0 0 1  arc (rx=10 ry=5, clockwise, small arc — slightly wider)
          9 21        → bottom-right of stem / bottom of bottom bowl
        H5           → bottom-left of stem
        Z            close (up the left edge of the stem)
      */}
      <path
        d="M5 3 H9 A9 4 0 0 1 9 11 A10 5 0 0 1 9 21 H5 Z"
        fill={display === "contained" ? fg : "currentColor"}
      />
    </svg>
  );
}
