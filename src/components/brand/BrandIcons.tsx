import type { SVGProps } from "react";
import type { Platform } from "@/lib/types";
import { cn } from "@/lib/utils";

export function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

export function TrelloIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M21 0H3C1.343 0 0 1.343 0 3v18c0 1.657 1.343 3 3 3h18c1.657 0 3-1.343 3-3V3c0-1.657-1.343-3-3-3ZM10.44 18.3c0 .414-.336.75-.75.75H4.56a.75.75 0 0 1-.75-.75V5.7c0-.414.336-.75.75-.75h5.13c.414 0 .75.336.75.75v12.6Zm9.75-6.6c0 .414-.336.75-.75.75h-5.13a.75.75 0 0 1-.75-.75V5.7c0-.414.336-.75.75-.75h5.13c.414 0 .75.336.75.75v6Z" />
    </svg>
  );
}

export function HuggingFaceIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <rect width="24" height="24" rx="6" fill="#FFD21E" />
      <circle cx="9.1" cy="10" r="1.05" fill="#1A1A1A" />
      <circle cx="14.9" cy="10" r="1.05" fill="#1A1A1A" />
      <path
        d="M8.2 13.4c.8 1.6 2.1 2.5 3.8 2.5s3-.9 3.8-2.5"
        stroke="#1A1A1A"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M5.1 8.2C4 9 3.6 10.2 3.8 11.4M18.9 8.2c1.1.8 1.5 2 1.3 3.2"
        stroke="#1A1A1A"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path d="M4.4 16.3c1.6 1.8 4.2 2.9 7.6 2.9s6-1.1 7.6-2.9" stroke="#1A1A1A" strokeWidth="1.1" strokeLinecap="round" opacity=".28" />
    </svg>
  );
}

export function GoogleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.9-.1-1.5-.3-2.3H12v4.4h6.5c-.1 1.1-.8 2.7-2.3 3.8l3.5 2.7c2.1-1.9 3.8-4.8 3.8-8.6Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.3 0 6-1.1 8-3l-3.8-3c-1 .7-2.4 1.2-4.2 1.2-3.2 0-5.9-2.1-6.9-5l-4 3.1C3.1 21.3 7.2 24 12 24Z"
      />
      <path fill="#FBBC05" d="M5.1 14.2c-.3-.7-.4-1.4-.4-2.2s.2-1.5.4-2.2L1.1 6.7C.4 8.3 0 10.1 0 12s.4 3.7 1.1 5.3l4-3.1Z" />
      <path
        fill="#EA4335"
        d="M12 4.8c2.3 0 3.8 1 4.7 1.8l3.4-3.3C18 1.2 15.3 0 12 0 7.2 0 3.1 2.7 1.1 6.7l4 3.1c1-2.9 3.7-5 6.9-5Z"
      />
    </svg>
  );
}

export function PlatformIcon({
  platform,
  className,
}: {
  platform: Platform;
  className?: string;
}) {
  const base = cn("h-4 w-4", className);
  if (platform === "github") return <GithubIcon className={cn(base, "text-ink")} />;
  if (platform === "trello") return <TrelloIcon className={cn(base, "text-[#2E9BE6]")} />;
  if (platform === "huggingface") return <HuggingFaceIcon className={base} />;
  return (
    <span
      className={cn(
        "grid h-4 w-4 place-items-center rounded-[4px] bg-muted/20 font-mono text-[9px] font-bold text-muted",
        className,
      )}
    >
      M
    </span>
  );
}

export const platformName: Record<Platform, string> = {
  trello: "Trello",
  github: "GitHub",
  huggingface: "Hugging Face",
  manual: "Manual",
};
