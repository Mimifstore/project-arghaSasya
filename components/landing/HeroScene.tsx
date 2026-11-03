import { Terraces } from "@/components/Terraces";

// Latar hero: gunung, sawah terasering Garut di depan, kota pembeli di kanan, dan jalur pasokan yang menghubungkannya.
export function HeroScene() {
  const buildings = [
    { x: 1400, w: 30, h: 70 }, { x: 1436, w: 24, h: 112 }, { x: 1466, w: 34, h: 86 },
    { x: 1506, w: 26, h: 142 }, { x: 1538, w: 30, h: 98 },
  ];
  return (
    <svg aria-hidden viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 -z-10 h-full w-full">
      <rect width="1600" height="900" fill="#0E2A20" />
      <circle cx="900" cy="330" r="124" fill="none" stroke="#F5B921" strokeOpacity="0.2" />
      <circle cx="900" cy="330" r="72" fill="#F5B921" fillOpacity="0.35" />
      <path d="M0 600 L220 520 L420 560 L700 450 L980 330 L1120 300 L1260 380 L1480 470 L1600 520 V700 H0 Z" fill="#13392B" />
      <path d="M0 640 L260 580 L520 610 L820 520 L1100 470 L1360 540 L1600 580 V720 H0 Z" fill="#184A36" />
      {[540, 566, 588].map((y) => <rect key={y} y={y} width="1600" height="3" fill="#fff" opacity="0.05" />)}
      {buildings.map((b) => (
        <g key={b.x}>
          <rect x={b.x} y={596 - b.h} width={b.w} height={b.h} fill="#0A1F17" />
          {[0, 1, 2, 3].map((r) => (
            <rect key={r} x={b.x + 6} y={596 - b.h + 12 + r * 18} width="5" height="5" fill="#F5B921" opacity={r % 2 ? 0.35 : 0.8} />
          ))}
        </g>
      ))}
      <Terraces top={600} />
      <path d="M320 790 C 600 720 800 730 1000 660 S 1340 610 1445 590" fill="none" stroke="#F5B921" strokeWidth="3.5" strokeDasharray="9 11" strokeLinecap="round" />
      <circle cx="320" cy="790" r="10" fill="#F5B921" stroke="#fff" strokeWidth="3" />
      <circle cx="1445" cy="590" r="10" fill="#F5B921" stroke="#fff" strokeWidth="3" />
    </svg>
  );
}
