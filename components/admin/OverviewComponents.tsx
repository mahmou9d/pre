/* eslint-disable @typescript-eslint/no-explicit-any */
import { Package, AlertTriangle } from "lucide-react";
import React from "react";

// في OverviewComponents.tsx

const colorMap: Record<string, { gradient: string; icon: string }> = {
  blue: { gradient: "from-blue-500 to-blue-700", icon: "text-blue-400" },
  green: {
    gradient: "from-emerald-500 to-emerald-700",
    icon: "text-emerald-400",
  },
  purple: {
    gradient: "from-purple-500 to-purple-700",
    icon: "text-purple-400",
  },
  amber: { gradient: "from-amber-500 to-amber-700", icon: "text-amber-400" },
  red: { gradient: "from-rose-500 to-rose-700", icon: "text-rose-400" },
  gray: { gradient: "from-gray-500 to-gray-700", icon: "text-gray-400" },
};

interface StatCardProps {
  label: string;
  value: string | number;
  color?: string;
  icon?: React.ElementType;
  change?: string;
  trend?: "up" | "down";
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  color = "blue",
  icon: Icon,
  change,
  trend,
}) => {
  const c = colorMap[color] ?? colorMap.blue;

  return (
    <div className="bg-[#1a1d29] rounded-2xl p-6 border border-white/10 hover:border-[#fff]/50 cursor-pointer group">
      <div className="flex items-start justify-between mb-4">
        {Icon && (
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center shadow-xl`}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
        {change && (
          <div
            className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
              trend === "up"
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-rose-500/10 text-rose-400"
            }`}
          >
            {trend === "up" ? "↑" : "↓"} {change}
          </div>
        )}
      </div>
      <p className="text-gray-400 text-xs mb-1 font-medium">{label}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
};
export const TopSellingCard = ({
  title,
  rows,
}: {
  title: string;
  rows: any[];
}) => (
  <div className="bg-[#1a1d29] rounded-2xl p-8 border border-white/10">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#fff]/20 to-[#000]/20 flex items-center justify-center">
        <Package className="w-5 h-5 text-[#fff]" />
      </div>
    </div>
    <div className="space-y-3">
      {rows.length > 0 ? (
        rows.map((r, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 cursor-pointer border border-transparent hover:border-[#fff]/20"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#fff]/30 to-[#000]/30 flex items-center justify-center border border-white/10">
              <Package className="w-5 h-5 text-[#fff]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-sm truncate">
                {r.name ?? r.product__name}
              </p>
            </div>
            <span className="text-xs font-bold text-[#fff]">
              {r.total_sold} sold
            </span>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500 text-center py-8">لا يوجد بيانات</p>
      )}
    </div>
  </div>
);

export const LowStockCard = ({
  title,
  rows,
}: {
  title: string;
  rows: any[];
}) => (
  <div className="bg-[#1a1d29] rounded-2xl p-8 border border-white/10">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/20 to-rose-700/20 flex items-center justify-center">
        <AlertTriangle className="w-5 h-5 text-rose-400" />
      </div>
    </div>
    <div className="space-y-3">
      {rows.length > 0 ? (
        rows.map((r, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 cursor-pointer border border-transparent hover:border-rose-500/20"
          >
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-sm truncate">
                {r.product_name}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Volume: {r.volume}</p>
            </div>
            <span
              className={`text-sm font-bold ${r.stock <= 5 ? "text-rose-400" : "text-amber-400"}`}
            >
              {r.stock} left
            </span>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500 text-center py-8">لا يوجد بيانات</p>
      )}
    </div>
  </div>
);
