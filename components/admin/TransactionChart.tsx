"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { monthlyTransactions } from "@/data/dummy";

const tick = { fill: "#546759", fontSize: 12 };

export function TransactionChart() {
  const last = monthlyTransactions.length - 1;
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={monthlyTransactions} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="#DCE3DE" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tick={tick} />
        <YAxis tickLine={false} axisLine={false} tick={tick} tickFormatter={(v) => `${v} jt`} />
        <Tooltip cursor={{ fill: "#F2F5F3" }} formatter={(v) => [`Rp ${v} juta`, "Nilai transaksi"]} />
        <Bar dataKey="juta" radius={[6, 6, 0, 0]} maxBarSize={44}>
          {monthlyTransactions.map((d, i) => <Cell key={d.month} fill={i === last ? "#F5B921" : "#1B6B4A"} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
