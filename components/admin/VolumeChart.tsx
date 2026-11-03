"use client";

import { Bar, BarChart, CartesianGrid, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Proyeksi dari roadmap dokumen: pilot bulan 5-6, evaluasi bulan 7 (min. 3.000 kg), target 9.000 kg di bulan 12, total sekitar 38 ton.
const DATA = [0, 0, 0, 0, 800, 1600, 3000, 4000, 5200, 6400, 7600, 9000].map((kg, i) => ({ bulan: `B${i + 1}`, kg }));
const tick = { fill: "#546759", fontSize: 12 };

export function VolumeChart() {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={DATA} margin={{ top: 16, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#DCE3DE" />
        <XAxis dataKey="bulan" tickLine={false} axisLine={false} tick={tick} />
        <YAxis tickLine={false} axisLine={false} tick={tick} tickFormatter={(v) => `${v / 1000} t`} />
        <Tooltip cursor={{ fill: "#F2F5F3" }} formatter={(v) => [`${Number(v).toLocaleString("id-ID")} kg`, "Volume"]} />
        <ReferenceLine y={3000} stroke="#D99A00" strokeDasharray="5 5" label={{ value: "Syarat lanjut (bulan 7): 3 ton", position: "insideTopLeft", fontSize: 11, fill: "#855C00" }} />
        <Bar dataKey="kg" radius={[6, 6, 0, 0]} maxBarSize={36}>
          {DATA.map((d) => <Cell key={d.bulan} fill={d.bulan === "B12" ? "#F5B921" : "#1B6B4A"} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
