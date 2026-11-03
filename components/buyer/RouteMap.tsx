import { BUYER_POINT, COLLECT_POINT, type Allocation, type Excluded } from "@/data/agri";

export const SHARE_COLORS = ["#155539", "#2A8059", "#78B895", "#F5B921", "#A3B1A9", "#D99A00", "#489B72"];

// Peta skematik (tidak berskala): cincin menunjukkan kira-kira 10 km dan 25 km dari titik kumpul.
export function RouteMap({ allocs, reserve, excluded }: { allocs: Allocation[]; reserve: Allocation[]; excluded: Excluded[] }) {
  const c = COLLECT_POINT, b = BUYER_POINT;
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label="Peta skematik lokasi petani, titik kumpul, dan pembeli" className="h-auto w-full rounded-xl bg-[#EAF2EE]">
      <circle cx={c.x} cy={c.y} r="108" fill="none" stroke="#A9D2B9" strokeDasharray="4 5" />
      <circle cx={c.x} cy={c.y} r="44" fill="#D3E8DB" fillOpacity="0.55" stroke="#78B895" strokeDasharray="4 5" />
      <text x={c.x + 46} y={c.y - 30} fontSize="9" fill="#155539">±10 km</text>
      <text x={c.x + 84} y={c.y - 82} fontSize="9" fill="#155539">±25 km</text>

      <path d={`M${c.x} ${c.y} L${b.x} ${b.y}`} stroke="#D99A00" strokeWidth="2.5" strokeDasharray="7 6" strokeLinecap="round" />
      <text x={(c.x + b.x) / 2 - 8} y={(c.y + b.y) / 2 - 8} fontSize="9" fill="#855C00" textAnchor="middle">±70 km, ±2,5 jam</text>
      <rect x={b.x - 11} y={b.y - 11} width="22" height="22" rx="5" fill="#12201A" />
      <text x={b.x} y={b.y + 4} fontSize="11" fill="#F5B921" textAnchor="middle" fontWeight="700">B</text>
      <text x={b.x + 16} y={b.y + 4} fontSize="10" fill="#12201A">Pembeli, Bandung</text>

      {allocs.map((a, i) => <line key={a.farmer.id} x1={a.farmer.x} y1={a.farmer.y} x2={c.x} y2={c.y} stroke={SHARE_COLORS[i % SHARE_COLORS.length]} strokeWidth="1.5" strokeOpacity="0.7" />)}
      {reserve.map((a) => <circle key={a.farmer.id} cx={a.farmer.x} cy={a.farmer.y} r="4" fill="#fff" stroke="#75877D" strokeWidth="1.5" />)}
      {excluded.map((e) => <text key={e.farmer.id} x={e.farmer.x} y={e.farmer.y + 3} fontSize="11" fill="#C23B2B" textAnchor="middle" fontWeight="700">×</text>)}
      {allocs.map((a, i) => (
        <g key={a.farmer.id}>
          <circle cx={a.farmer.x} cy={a.farmer.y} r={4 + a.kg / 55} fill={SHARE_COLORS[i % SHARE_COLORS.length]} stroke="#fff" strokeWidth="1.5" />
        </g>
      ))}
      <rect x={c.x - 6} y={c.y - 6} width="12" height="12" rx="2" fill="#F5B921" stroke="#12201A" strokeWidth="1.5" transform={`rotate(45 ${c.x} ${c.y})`} />
      <text x={c.x - 52} y={c.y + 22} fontSize="9.5" fill="#12201A" fontWeight="600">Titik kumpul Samarang</text>
    </svg>
  );
}
