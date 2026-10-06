import type { SVGProps } from "react";

/** WhatsApp glyph — lucide has no brand marks, so this is inlined. */
export function WhatsAppIcon({
  className,
  ...rest
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.86 9.86 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.19-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.26.86 5.81 2.42a8.17 8.17 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.52-.75-1.76-.84-.24-.09-.41-.13-.58.13-.17.25-.67.84-.82 1.01-.15.17-.3.19-.55.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.39.11-.51.11-.11.25-.3.37-.44.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.55-1.4-.76-1.9-.2-.5-.4-.43-.55-.44h-.47c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.07 0 1.22.89 2.4 1.02 2.57.12.17 1.75 2.79 4.25 3.8.59.24 1.06.39 1.42.5.6.19 1.14.16 1.57.1.48-.07 1.52-.62 1.74-1.22.21-.6.21-1.11.15-1.22-.06-.11-.23-.18-.48-.3Z" />
    </svg>
  );
}

/** Decorative gear used sparingly as an industrial motif. */
export function GearGlyph({ className, ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <g stroke="currentColor" strokeWidth="1.1">
        <circle cx="50" cy="50" r="30" />
        <circle cx="50" cy="50" r="13" />
        <circle cx="50" cy="50" r="40" strokeDasharray="3 6" />
        {Array.from({ length: 12 }).map((_, index) => {
          const angle = (index * Math.PI * 2) / 12;
          const x1 = 50 + Math.cos(angle) * 30;
          const y1 = 50 + Math.sin(angle) * 30;
          const x2 = 50 + Math.cos(angle) * 38;
          const y2 = 50 + Math.sin(angle) * 38;
          return <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
      </g>
    </svg>
  );
}

/** Caliper / measurement motif for engineering-styled separators. */
export function CaliperGlyph({ className, ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 120 40"
      fill="none"
      aria-hidden="true"
      className={className}
      {...rest}
    >
      <g stroke="currentColor" strokeWidth="1.2">
        <line x1="4" y1="20" x2="116" y2="20" />
        <line x1="4" y1="12" x2="4" y2="28" />
        <line x1="116" y1="12" x2="116" y2="28" />
        <line x1="60" y1="14" x2="60" y2="26" />
        <line x1="32" y1="16" x2="32" y2="24" />
        <line x1="88" y1="16" x2="88" y2="24" />
      </g>
    </svg>
  );
}
