"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { useContactModal } from "@/components/ContactModal";

interface Props {
  variant?: "home" | "detail";
}

const NAV: { label: string; href: string }[] = [
  { label: "Team",    href: "/#team"    },
  { label: "Contact", href: "/#contact" },
];

export default function SiteHeader({ variant = "home" }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);
  const { openModal }           = useContactModal();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-surface-0/90 backdrop-blur-md border-b border-border"
          : "bg-transparent",
      )}
    >
      <nav
        className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between"
        aria-label="Main navigation"
      >
        <Logo size={20} variant="full" />

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-6" role="list">
          {NAV.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-sm text-muted hover:text-fg transition-colors">
                {l.label}
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={openModal}
              className="text-sm px-4 py-2 rounded-lg border border-border text-muted hover:text-fg hover:border-fg/20 transition-colors"
            >
              Work with us
            </button>
          </li>
          <li>
            <ThemeToggle />
          </li>
        </ul>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            className="text-muted hover:text-fg transition-colors"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              {open ? (
                <path d="M5 5l12 12M17 5L5 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              ) : (
                <path d="M3 7h16M3 11h16M3 15h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden bg-surface-1 border-b border-border px-6 py-4">
          <ul className="flex flex-col gap-4" role="list">
            {NAV.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-muted hover:text-fg transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={() => { setOpen(false); openModal(); }}
                className="text-sm text-muted hover:text-fg transition-colors"
              >
                Work with us
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
