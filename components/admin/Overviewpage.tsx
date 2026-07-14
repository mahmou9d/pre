"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  DollarSign,
  Package,
  ShoppingCart,
  Star,
  Users,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  useGetStatusCount,
  useGetTopSelling,
  useGetSalesOrders,
} from "@/hooks/useDashboard";

export default function OverviewPage() {
  const { data: stats, isLoading: l1 } = useGetStatusCount();
  const { data: topSellingData, isLoading: l3 } = useGetTopSelling();
  const { data: salesData } = useGetSalesOrders();

  const loading = l1 || l3;

  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [chartView, setChartView] = useState<"sales" | "orders">("sales");

  const orders = stats?.orders;
  const totalOrders = orders?.total ?? null;
  const totalStock = stats?.products?.total_stock ?? null;
  const totalUsers = stats?.users ?? null;
  const totalSales = stats?.sales ?? null;

  const statCards = [
    {
      id: 6,
      title: "المبيعات",
      value:
        totalSales != null ? `LE ${Number(totalSales).toLocaleString()}` : "…",
      gradient: "from-[#fda481] to-[#b4182d]",
      icon: DollarSign,
      trend: "up" as const,
      change: "",
    },
    {
      id: 1,
      title: "إجمالي الطلبات",
      value: totalOrders ?? "…",
      gradient: "from-[#b4182d] to-[#54162b]",
      icon: ShoppingCart,
      trend: "up" as const,
      change: "",
    },
    {
      id: 3,
      title: "إجمالي المخزون",
      value: totalStock ?? "…",
      gradient: "from-[#fda481] to-[#b4182d]",
      icon: BarChart3,
      trend: "up" as const,
      change: "",
    },
    {
      id: 5,
      title: "المستخدمين",
      value: totalUsers ?? "…",
      gradient: "from-[#37415c] to-[#242e49]",
      icon: Users,
      trend: "up" as const,
      change: "",
    },
  ];

  const getChartData = () => {
    if (!salesData || salesData.length === 0)
      return { maxValue: 0, steps: [] as number[] };
    const maxValue = Math.max(
      ...salesData.map((d: any) => (chartView === "sales" ? d.sales : d.orders)),
      1,
    );
    const roundedMax = Math.ceil(maxValue / 10) * 10;
    const step = roundedMax / 4;
    const steps = [
      roundedMax,
      roundedMax - step,
      roundedMax - step * 2,
      roundedMax - step * 3,
      0,
    ];
    return { maxValue: roundedMax, steps };
  };

  const { maxValue, steps } = getChartData();

  return (
    <>
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">لوحة التحكم</h1>
        <p className="text-gray-400 text-base">مرحباً بعودتك</p>
      </div>

      {loading && (
        <p className="text-xs text-gray-400 mb-4">جاري تحميل الإحصائيات...</p>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.id}
            className="bg-[#1a1d29] rounded-2xl p-7 border border-white/10 hover:border-[#fff]/50 cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-5">
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-2xl`}
              >
                <stat.icon className="w-7 h-7 text-white" />
              </div>
              {stat.change && (
                <div
                  className={`flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-full ${stat.trend === "up" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}
                >
                  {stat.trend === "up" ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              )}
            </div>
            <p className="text-gray-400 text-sm mb-2 font-medium">
              {stat.title}
            </p>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Analytics */}
        <div className="lg:col-span-2 bg-[#1a1d29] rounded-2xl p-8 border border-white/10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">
                تحليل الإيرادات
              </h2>
              <p className="text-sm text-gray-400 font-medium">الأداء الشهري</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-[#0f1117] rounded-xl p-1 border border-white/10">
                <button
                  onClick={() => setChartView("sales")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold ${chartView === "sales"
                      ? "bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white shadow-lg"
                      : "text-gray-400 hover:text-white"
                    }`}
                >
                  المبيعات
                </button>
                <button
                  onClick={() => setChartView("orders")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold ${chartView === "orders"
                      ? "bg-gradient-to-r from-[#fda481] to-[#b4182d] text-white shadow-lg"
                      : "text-gray-400 hover:text-white"
                    }`}
                >
                  الطلبات
                </button>
              </div>
            </div>
          </div>

          {salesData && salesData.length > 0 ? (
            <div className="relative">
              <div className="flex gap-4">
                {/* Y-axis */}
                <div className="flex flex-col justify-between h-[400px] text-sm text-gray-400 font-semibold pt-2 pb-12">
                  {steps.map((value, i) => (
                    <div key={i} className="flex items-center h-0">
                      <span className="whitespace-nowrap">
                        {chartView === "sales" ? `${value}` : value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Chart Area */}
                <div className="flex-1 relative">
                  <div className="absolute inset-0 flex flex-col justify-between pb-12 pt-2">
                    {steps.map((_, i) => (
                      <div key={i} className="w-full border-t border-white/5" />
                    ))}
                  </div>

                  <div className="relative h-[400px] flex items-end justify-between gap-2 px-2 pb-12 pt-2">
                    {salesData.map((monthData: any, index: number) => {
                      const value =
                        chartView === "sales"
                          ? monthData.sales
                          : monthData.orders;
                      const heightPercentage =
                        maxValue > 0 ? (value / maxValue) * 100 : 0;
                      const isHovered = hoveredBar === index;
                      const hasData = value > 0;

                      return (
                        <div
                          key={index}
                          className="flex-1 flex flex-col items-center justify-end h-full"
                          onMouseEnter={() => setHoveredBar(index)}
                          onMouseLeave={() => setHoveredBar(null)}
                        >
                          <div
                            className="w-full flex items-end justify-center"
                            style={{ height: "100%" }}
                          >
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${heightPercentage}%` }}
                              transition={{
                                delay: 0.1 + index * 0.05,
                                type: "spring",
                                stiffness: 100,
                                damping: 15,
                              }}
                              className={`w-full max-w-[50px] rounded-t-xl relative ${hasData
                                  ? "bg-gradient-to-t from-[#eb0505] via-[#fff] to-[#ffd4c1] cursor-pointer shadow-lg"
                                  : "bg-gradient-to-t from-white/5 to-white/10"
                                }`}
                              style={{
                                minHeight: hasData ? "8px" : "4px",
                                transform:
                                  isHovered && hasData
                                    ? "scaleX(1.1)"
                                    : "scaleX(1)",
                                boxShadow:
                                  isHovered && hasData
                                    ? "0 0 20px rgba(253, 164, 129, 0.5)"
                                    : "none",
                              }}
                            >
                              {isHovered && hasData && (
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-[#0f1117] px-4 py-3 rounded-xl shadow-2xl border border-[#fff]/30 whitespace-nowrap z-50">
                                  <div className="text-center">
                                    <p className="text-xs text-gray-400 font-medium mb-1">
                                      {monthData.name}
                                    </p>
                                    <p className="text-xl font-bold text-[#fff] mb-0.5">
                                      {chartView === "sales"
                                        ? `${monthData.sales}`
                                        : monthData.orders}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {chartView === "sales"
                                        ? `${monthData.orders} الطلبات`
                                        : `${monthData.sales} الإيراد`}
                                    </p>
                                  </div>
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                                    <div className="w-3 h-3 bg-[#0f1117] border-r border-b border-[#fff]/30 rotate-45" />
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* X-axis labels */}
                  <div className="absolute bottom-0 left-0 right-0 h-12 flex items-center justify-between px-2 gap-2">
                    {salesData.map((monthData: any, index: number) => (
                      <div key={index} className="flex-1 text-center">
                        <span
                          className={`text-xs font-bold ${hoveredBar === index ? "text-[#fff]" : "text-gray-400"}`}
                        >
                          {monthData.name.slice(0, 3)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/30 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-emerald-400" />
                    </div>
                    <p className="text-xs text-gray-400 font-medium">
                      إجمالي المبيعات
                    </p>
                  </div>
                  <p className="text-[16px] md:text-2xl font-bold text-white">
                    {salesData
                      .reduce((sum: number, d: any) => sum + d.sales, 0)
                      .toLocaleString()}
                  </p>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/30 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4 text-blue-400" />
                    </div>
                    <p className="text-xs text-gray-400 font-medium">
                      إجمالي الطلبات
                    </p>
                  </div>
                  <p className="text-[16px] md:text-2xl font-bold text-white">
                    {salesData.reduce((sum: number, d: any) => sum + d.orders, 0)}
                  </p>
                </div>

                <div className="col-span-2 bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/30 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/20 to-black/20 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-xs text-gray-400 font-medium">
                      متوسط قيمة الطلب
                    </p>
                  </div>
                  <p className="text-[16px] md:text-2xl font-bold text-white">
                    {(() => {
                      const ts = salesData.reduce(
                        (sum: number, d: any) => sum + d.sales,
                        0,
                      );
                      const to = salesData.reduce(
                        (sum: number, d: any) => sum + d.orders,
                        0,
                      );
                      return to > 0 ? (ts / to).toFixed(2) : "0.00";
                    })()}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center text-gray-400">
              <BarChart3 className="w-20 h-20 mb-4 opacity-20" />
              <p className="text-xl font-semibold mb-2">
                لا توجد بيانات مبيعات
              </p>
              <p className="text-sm text-gray-500">
                ابدأ البيع لرؤية الإحصائيات هنا
              </p>
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-[#1a1d29] rounded-2xl p-8 border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">أفضل المنتجات</h2>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#fda481]/20 to-[#b4182d]/20 flex items-center justify-center">
              <Package className="w-5 h-5 text-[#fda481]" />
            </div>
          </div>
          <div className="space-y-4">
            {topSellingData?.topSelling &&
              topSellingData.topSelling.length > 0 ? (
              topSellingData.topSelling.map((product: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 cursor-pointer group border border-transparent hover:border-[#fda481]/20"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#fda481]/30 to-[#b4182d]/30 flex items-center justify-center border border-white/10">
                    <Package className="w-6 h-6 text-[#fda481]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-sm truncate mb-1">
                      {product.product__name}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 font-medium">
                        {product.total_sold} مُباع
                      </span>
                      <span className="text-xs text-[#fda481] font-medium">
                        • {product.volume}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-12">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="font-semibold">لا توجد منتجات بعد</p>
                <p className="text-sm text-gray-500 mt-1">
                  ستظهر المنتجات هنا بعد أول عملية بيع
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
