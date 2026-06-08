/**
 * Logo — bathaee brand mark system.
 * Uses CSS variable `--fg` for the wordmark so it adapts to dark/light themes
 * without needing an explicit theme prop.
 *
 * Variants
 *   "full"      mark + wordmark (default)
 *   "wordmark"  text only
 *   "mark"      monogram only
 */

import Link from "next/link";
import Monogram from "@/components/Monogram";

type Variant = "full" | "wordmark" | "mark";

interface Props {
  variant?:  Variant;
  size?:     number;   // height in px; mark width equals height
  linked?:   boolean;  // wrap in <Link href="/">. default true
  className?: string;
}

export default function Logo({
  variant = "full",
  size    = 22,
  linked  = true,
  className,
}: Props) {
  const mark = (
    <Monogram size={size} theme="accent" display="contained" />
  );

  const wordmark = (
    <span
      style={{
        fontFamily:    "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        fontWeight:    600,
        fontSize:      size * 0.82,
        letterSpacing: "-0.04em",
        // Use CSS variable so it switches with the theme automatically
        color:         "rgb(var(--fg))",
        lineHeight:    1,
        userSelect:    "none",
      }}
    >
      bathaee
    </span>
  );

  const content = (
    <span
      className={className}
      style={{ display: "inline-flex", alignItems: "center", gap: size * 0.4 }}
    >
      {(variant === "full" || variant === "mark")     && mark}
      {(variant === "full" || variant === "wordmark") && wordmark}
    </span>
  );

  if (!linked) return content;

  return (
    <Link
      href="/"
      aria-label="bathaee — home"
      style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}
    >
      {content}
    </Link>
  );
}
