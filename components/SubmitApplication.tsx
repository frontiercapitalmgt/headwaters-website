"use client";

import { useState, type ReactNode } from "react";
import { FilloutPopupEmbed } from "@fillout/react";
import Button from "@/components/Button";

// Fillout form ID (from forms.fillout.com/t/<ID>) — submissions flow into Airtable.
const FILLOUT_ID = "jub8L58S9Wus";

export default function SubmitApplication({
  variant = "primary",
  children = "Submit Your Application →",
}: {
  variant?: "primary" | "secondary" | "accent";
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant={variant} size="lg" onClick={() => setOpen(true)}>
        {children}
      </Button>

      {open && (
        <FilloutPopupEmbed
          filloutId={FILLOUT_ID}
          isOpen={open}
          onClose={() => setOpen(false)}
          width="680px"
          height="720px"
        />
      )}
    </>
  );
}
