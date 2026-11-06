import Image from "next/image";

interface LogoProps {
  className?: string;
  light?: boolean;
}

/**
 * Milli Gençlik Derneği Resmî Yatay Logosu
 */
export default function Logo({ className = "", light = false }: LogoProps) {
  const logoSrc = light ? "/images/mgd-logo-light.png" : "/images/mgd-logo.png";

  return (
    <span className={`inline-flex items-center select-none ${className}`}>
      <div className="relative h-11 sm:h-13 w-32 sm:w-40 shrink-0">
        <Image
          src={logoSrc}
          alt="Milli Gençlik Derneği Logosu"
          fill
          sizes="(max-width: 640px) 130px, 160px"
          className="object-contain object-left"
          priority
        />
      </div>
    </span>
  );
}
