"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { sendContactMessage } from "@/lib/api";

/* ─── Context ────────────────────────────────────────────────────────────── */

interface ContactModalCtx {
  openModal: () => void;
}

const ContactModalContext = createContext<ContactModalCtx>({ openModal: () => {} });

export const useContactModal = () => useContext(ContactModalContext);

/* ─── Provider (wrap layout so any component can open the modal) ─────────── */

export function ContactModalProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const openModal = useCallback(() => setOpen(true), []);

  return (
    <ContactModalContext.Provider value={{ openModal }}>
      {children}
      {open && <ContactModal onClose={() => setOpen(false)} />}
    </ContactModalContext.Provider>
  );
}

/* ─── Modal component ────────────────────────────────────────────────────── */

type Status = "idle" | "loading" | "success" | "error";

function ContactModal({ onClose }: { onClose: () => void }) {
  const [email,   setEmail]   = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status,  setStatus]  = useState<Status>("idle");
  const [errMsg,  setErrMsg]  = useState("");
  const firstInput = useRef<HTMLInputElement>(null);

  // Focus first field on open; close on Escape
  useEffect(() => {
    firstInput.current?.focus();
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrMsg("");
    try {
      await sendContactMessage({ email, subject, message });
      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      setErrMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-surface-0/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-md bg-surface-1 border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Top accent bar */}
        <div className="h-0.5 w-full bg-accent" aria-hidden="true" />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 id="contact-modal-title" className="text-lg font-semibold text-fg">
                Work with us
              </h2>
              <p className="text-sm text-muted mt-0.5">
                We'll get back to you within 24 hours.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-fg hover:bg-surface-2 transition-colors"
              aria-label="Close modal"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Success state */}
          {status === "success" ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
                  <path d="M4 11l5 5 9-9" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="font-semibold text-fg mb-1">Message sent!</p>
              <p className="text-sm text-muted">We'll be in touch soon.</p>
              <button
                onClick={onClose}
                className="mt-6 px-5 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} noValidate>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5" htmlFor="cm-email">
                    Your email <span className="text-accent" aria-hidden="true">*</span>
                  </label>
                  <input
                    ref={firstInput}
                    id="cm-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface-2 border border-border text-fg text-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/60 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5" htmlFor="cm-subject">
                    Subject <span className="text-accent" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="cm-subject"
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Project inquiry"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface-2 border border-border text-fg text-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/60 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5" htmlFor="cm-message">
                    Message <span className="text-accent" aria-hidden="true">*</span>
                  </label>
                  <textarea
                    id="cm-message"
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your project…"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-surface-2 border border-border text-fg text-sm placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/60 transition-colors resize-none"
                  />
                </div>

                {status === "error" && (
                  <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3.5 py-2.5">
                    {errMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-2.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {status === "loading" ? (
                    <>
                      <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                      </svg>
                      Sending…
                    </>
                  ) : "Send message"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
