"use client";

import { useContactModal } from "@/components/ContactModal";

interface Props {
  children: React.ReactNode;
  className?: string;
}

/** Thin client wrapper that opens the contact modal. */
export default function ContactButton({ children, className }: Props) {
  const { openModal } = useContactModal();
  return (
    <button type="button" onClick={openModal} className={className}>
      {children}
    </button>
  );
}
