import React from "react";

interface TornPaperDividerProps {
  fillColor?: string;
  shadow?: boolean;
  flip?: boolean;
  className?: string;
}

/**
 * milligenclik.org.tr tarzı yırtık kâğıt (torn / ripped paper) kenarlık bileşeni.
 * Koyu manşet alanından beyaz içeriğe doğal ve estetik bir geçiş sağlar.
 */
export default function TornPaperDivider({
  fillColor = "#ffffff",
  shadow = true,
  flip = false,
  className = "",
}: TornPaperDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={`relative w-full overflow-hidden leading-none select-none pointer-events-none ${
        flip ? "rotate-180" : ""
      } ${className}`}
      style={{ height: 28 }}
    >
      <svg
        viewBox="0 0 1440 36"
        preserveAspectRatio="none"
        className="w-full h-full block"
      >
        {shadow && (
          <path
            d="M0,18 L24,24 L48,16 L72,26 L96,19 L120,27 L144,17 L168,25 L192,18 L216,28 L240,16 L264,26 L288,19 L312,27 L336,18 L360,25 L384,17 L408,28 L432,19 L456,26 L480,16 L504,27 L528,18 L552,25 L576,19 L600,28 L624,16 L648,26 L672,18 L696,27 L720,19 L744,28 L768,17 L792,26 L816,18 L840,27 L864,19 L888,28 L912,16 L936,26 L960,18 L984,27 L1008,19 L1032,28 L1056,17 L1080,26 L1104,18 L1128,27 L1152,19 L1176,28 L1200,16 L1224,26 L1248,18 L1272,27 L1296,19 L1320,28 L1344,17 L1368,26 L1392,18 L1416,25 L1440,19 L1440,36 L0,36 Z"
            fill="rgba(0, 0, 0, 0.18)"
            transform="translate(0, 3)"
          />
        )}
        <path
          d="M0,14 L20,20 L42,12 L64,22 L86,15 L108,23 L130,13 L152,21 L174,14 L196,24 L218,12 L240,22 L262,15 L284,23 L306,14 L328,21 L350,13 L372,24 L394,15 L416,22 L438,12 L460,23 L482,14 L504,21 L526,15 L548,24 L570,12 L592,22 L614,14 L636,23 L658,15 L680,24 L702,13 L724,22 L746,14 L768,23 L790,15 L812,24 L834,12 L856,22 L878,14 L900,23 L922,15 L944,24 L966,13 L988,22 L1010,14 L1032,23 L1054,15 L1076,24 L1098,12 L1120,22 L1142,14 L1164,23 L1186,15 L1208,24 L1230,13 L1252,22 L1274,14 L1296,21 L1318,15 L1340,23 L1362,13 L1384,22 L1406,15 L1428,21 L1440,15 L1440,36 L0,36 Z"
          fill={fillColor}
        />
      </svg>
    </div>
  );
}
