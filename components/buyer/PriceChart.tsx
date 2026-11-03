"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PRICE_SERIES } from "@/data/agri";
import { formatRupiah } from "@/lib/utils";

const tick = { fill: "#546759", fontSize: 12 };

export function PriceChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={PRICE_SERIES} margin={{ top: 8, right: 12, left: -4, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#DCE3DE" />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tick={tick} />
        <YAxis domain={[26000, 40000]} tickLine={false} axisLine={false} tick={tick} tickFormatter={(v) => `${v / 1000} rb`} />
        <Tooltip formatter={(v) => formatRupiah(Number(v))} />
        <Legend iconType="plainline" wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" name="Grade A" dataKey="A" stroke="#1B6B4A" strokeWidth={2.5} dot={false} />
        <Line type="monotone" name="Grade C" dataKey="C" stroke="#75877D" strokeWidth={2.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
