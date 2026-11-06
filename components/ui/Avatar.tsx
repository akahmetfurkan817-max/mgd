import Image from "next/image";
import { User } from "lucide-react";

interface AvatarProps {
  name: string;
  src?: string;
  size?: number;
  className?: string;
  rounded?: "full" | "lg" | "2xl";
}

/** Fotoğraf girilmemişse şık kurumsal silüet çerçevesi gösterir. */
export default function Avatar({
  name,
  src,
  size = 96,
  className = "",
  rounded = "2xl",
}: AvatarProps) {
  const roundClass =
    rounded === "full" ? "rounded-full" : rounded === "lg" ? "rounded-xl" : "rounded-2xl";

  if (src && src.trim() !== "") {
    return (
      <div
        className={`relative overflow-hidden ${roundClass} border-2 border-slate-200/80 shadow-md ${className}`}
        style={{ width: size, height: size }}
      >
        <Image
          src={src}
          alt={name}
          width={size}
          height={size}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={name}
      className={`relative flex items-center justify-center overflow-hidden ${roundClass} border border-slate-200 bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 shadow-inner ${className}`}
      style={{ width: size, height: size }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
      <User
        className="text-slate-400/80 drop-shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:text-primary"
        style={{ width: size * 0.55, height: size * 0.55 }}
        strokeWidth={1.5}
      />
    </div>
  );
}
