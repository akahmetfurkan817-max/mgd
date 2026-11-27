"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

const TOKEN_REGEX =
  /(\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)|(?:https?:\/\/[^\s<>"']+|www\.[^\s<>"']+|\b[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:com|net|org|gov|edu|tr|com\.tr|org\.tr|net\.tr|gov\.tr|edu\.tr)(?:\/[^\s<>"']*)?))/gi;

function trimTrailingPunctuation(raw: string): { url: string; trailing: string } {
  let url = raw;
  let trailing = "";
  while (url.length > 0 && /[.,;:!?)]$/.test(url)) {
    trailing = url.slice(-1) + trailing;
    url = url.slice(0, -1);
  }
  return { url, trailing };
}

function normalizeHref(raw: string): { href: string; external: boolean } {
  const trimmed = raw.trim();
  if (trimmed.startsWith("/") || trimmed.startsWith("#")) {
    return { href: trimmed, external: false };
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return { href: trimmed, external: true };
  }
  return { href: `https://${trimmed}`, external: true };
}

/**
 * Metin içindeki tüm URL'leri (https://..., www...., milbis.net/burs, [Metin](url))
 * otomatik olarak tıklanabilir mavi bağlantıya dönüştürür.
 */
export default function LinkifiedText({
  text,
  className,
}: {
  text?: string | null;
  className?: string;
}) {
  if (!text) return null;

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let keyIdx = 0;

  TOKEN_REGEX.lastIndex = 0;
  while ((match = TOKEN_REGEX.exec(text)) !== null) {
    const start = match.index;
    if (start > lastIndex) {
      nodes.push(text.slice(lastIndex, start));
    }

    const fullMatch = match[0];
    const mdLabel = match[2];
    const mdUrl = match[3];

    if (mdLabel && mdUrl) {
      const { href, external } = normalizeHref(mdUrl);
      if (external) {
        nodes.push(
          <a
            key={`lnk-${keyIdx++}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800 underline decoration-blue-400/80 underline-offset-2 break-words transition-colors"
          >
            <span>{mdLabel}</span>
            <ExternalLink size={13} className="inline shrink-0" />
          </a>,
        );
      } else {
        nodes.push(
          <Link
            key={`lnk-${keyIdx++}`}
            href={href}
            onClick={(e) => e.stopPropagation()}
            className="font-semibold text-blue-600 hover:text-blue-800 underline decoration-blue-400/80 underline-offset-2 break-words transition-colors"
          >
            {mdLabel}
          </Link>,
        );
      }
    } else {
      const { url, trailing } = trimTrailingPunctuation(fullMatch);
      const { href, external } = normalizeHref(url);
      if (external) {
        nodes.push(
          <a
            key={`lnk-${keyIdx++}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800 underline decoration-blue-400/80 underline-offset-2 break-all transition-colors"
          >
            <span>{url}</span>
            <ExternalLink size={12} className="inline shrink-0" />
          </a>,
        );
      } else {
        nodes.push(
          <Link
            key={`lnk-${keyIdx++}`}
            href={href}
            onClick={(e) => e.stopPropagation()}
            className="font-semibold text-blue-600 hover:text-blue-800 underline decoration-blue-400/80 underline-offset-2 break-all transition-colors"
          >
            {url}
          </Link>,
        );
      }
      if (trailing) nodes.push(trailing);
    }

    lastIndex = start + fullMatch.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return <span className={className}>{nodes}</span>;
}
