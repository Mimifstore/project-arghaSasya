// Sawah terasering: pita-pita lengkung dari belakang ke depan, dengan garis tanam putus-putus.
const PALETTE = ["#1A5A3F", "#1F6B4A", "#25805A", "#2D9468", "#38A878", "#4DBB8A"];

export function Terraces({ top = 600, step = 46 }: { top?: number; step?: number }) {
  return (
    <g>
      {PALETTE.map((fill, i) => {
        const y = top + i * step;
        const a = 14 + i * 5;
        const dir = i % 2 ? -1 : 1;
        const curve = (dy: number) =>
          `M0 ${y + dy} C 260 ${y + dy - a * dir} 560 ${y + dy + a * dir} 840 ${y + dy} S 1360 ${y + dy - a * dir} 1600 ${y + dy + a * dir * 0.4}`;
        return (
          <g key={fill}>
            <path d={`${curve(0)} V 900 H 0 Z`} fill={fill} />
            {[14, 26, 38].map((dy) => (
              <path key={dy} d={curve(dy)} fill="none" stroke="#fff" strokeOpacity={0.1 + i * 0.015} strokeWidth="2" strokeDasharray="2 10" strokeLinecap="round" />
            ))}
          </g>
        );
      })}
    </g>
  );
}
