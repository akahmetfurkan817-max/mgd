interface LogoProps {
  className?: string;
  light?: boolean;
}

/**
 * Milli Gençlik Derneği Resmî Yatay Logosu
 * Sabit boyutlu (415x157 -> 116x44) render edilerek mobilde sayfa yenileme anında büyüme/küçülme (CLS) tamamen engellenir.
 */
export default function Logo({ className = "", light = false }: LogoProps) {
  const logoSrc = light ? "/images/mgd-logo-light.png" : "/images/mgd-logo.png";

  return (
    <span className={`inline-flex items-center shrink-0 select-none ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoSrc}
        alt="Milli Gençlik Derneği Logosu"
        width={116}
        height={44}
        decoding="sync"
        className="block h-[44px] w-[116px] shrink-0 object-contain object-left"
      />
    </span>
  );
}
