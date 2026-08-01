"use client";

import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  DollarSign,
  ShoppingBag,
  PieChart as PieChartIcon,
  TrendingUp,
  BarChart3 // 🔥 NEW: Icon for empty states
} from "lucide-react";

import { request } from "@/utils/request/request";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Clean, standard corporate palette (Apple Human Interface Guidelines)
const PIE_COLORS = [
  "#007AFF", // System Blue
  "#34C759", // System Green
  "#5856D6", // System Indigo
  "#FF9500", // System Orange
  "#AF52DE", // System Purple
  "#FF3B30", // System Red
  "#5AC8FA", // System Light Blue
  "#8E8E93", // System Gray
];

export default function Graph({ selectedDate }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    sale_this_month: { total: 0, total_order: 0 },
    summary_sale_by_month: [],
  });

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        setLoading(true);
        const url = selectedDate ? `admin/getSale?date=${selectedDate}` : `admin/getSale`;
        const res = await request(url, "get");

        if (res) {
          setStats({
            sale_this_month: res.sale_this_month || { total: 0, total_order: 0 },
            summary_sale_by_month: res.summary_sale_by_month || [],
          });
        }
      } catch (error) {
        console.error("Failed to fetch graph data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGraphData();
  }, [selectedDate]);

  const activePieData = useMemo(
    () => stats.summary_sale_by_month.filter((item) => item.total > 0),
    [stats],
  );

  const totalPieRevenue = useMemo(
    () => activePieData.reduce((acc, curr) => acc + curr.total, 0),
    [activePieData],
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[500px] w-full bg-slate-50/50 dark:bg-slate-900/30 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="size-8 text-blue-600 dark:text-blue-500 animate-spin" />
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 tracking-wide uppercase">Analyzing Data...</p>
        </div>
      </div>
    );
  }

  // 🔥 UPDATED: Enterprise Tooltip with Dark Mode & Glassmorphism
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 p-4 rounded-2xl shadow-xl transition-colors">
          <div className="flex items-center gap-2.5 mb-1.5">
            <div
              className="w-3 h-3 rounded-full shadow-sm"
              style={{ backgroundColor: payload[0].payload.fill }}
            />
            <p className="font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">
              {payload[0].name}
            </p>
          </div>
          <p className="text-slate-900 dark:text-white font-black text-xl">
            ${Number(payload[0].value).toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  // 🔥 UPDATED: Enterprise Tooltip with Dark Mode & Glassmorphism
  const CustomAreaTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 p-4 rounded-2xl shadow-xl transition-colors">
          <p className="font-bold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider mb-1.5">{label}</p>
          <p className="text-blue-600 dark:text-blue-400 font-black text-xl">
            ${Number(payload[0].value).toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* --- TOP SUMMARY CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="group bg-white dark:bg-slate-900/60 p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between transition-all duration-300 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] dark:hover:shadow-none dark:hover:border-slate-700">
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
              Sales This Month
            </p>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              ${(stats.sale_this_month?.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/10 rounded-2xl text-blue-600 dark:text-blue-400 shadow-sm transition-colors">
            <DollarSign className="size-7" />
          </div>
        </div>

        <div className="group bg-white dark:bg-slate-900/60 p-6 md:p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between transition-all duration-300 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] dark:hover:shadow-none dark:hover:border-slate-700">
          <div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
              Orders This Month
            </p>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {stats.sale_this_month?.total_order || 0}
            </h3>
          </div>
          <div className="p-4 bg-gradient-to-br from-indigo-100 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/10 rounded-2xl text-indigo-600 dark:text-indigo-400 shadow-sm transition-colors">
            <ShoppingBag className="size-7" />
          </div>
        </div>
      </div>

      {/* --- CHARTS GRID SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* AREA CHART */}
        <Card className="lg:col-span-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 rounded-[2rem] bg-white dark:bg-slate-900/60 overflow-hidden transition-colors duration-300">
          <CardHeader className="pb-4 pt-7 px-7 border-b border-slate-50 dark:border-slate-800/50">
            <CardTitle className="text-xl font-bold flex items-center gap-2.5 text-slate-900 dark:text-white tracking-tight">
              <TrendingUp className="size-6 text-blue-600 dark:text-blue-500" />
              Revenue Trajectory
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8 px-4">
            {stats.summary_sale_by_month.length === 0 ? (
              // 🔥 UPDATED: Designed Empty State
              <div className="h-[350px] flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 m-4">
                <BarChart3 className="size-10 text-slate-300 dark:text-slate-600 mb-3" />
                <p className="font-bold tracking-wide">No revenue data available yet.</p>
              </div>
            ) : (
              <div className="h-[350px] w-full dark:opacity-90 transition-opacity">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={stats.summary_sale_by_month}
                    margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#94a3b8" strokeOpacity={0.15} />
                    
                    {/* 🔥 UPDATED: Added tickMargin for breathing room */}
                    <XAxis
                      dataKey="title"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={16}
                      tick={{ fill: "#64748b", fontSize: 12, fontWeight: 700 }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tickMargin={12}
                      tick={{ fill: "#64748b", fontSize: 12, fontWeight: 700 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    
                    <RechartsTooltip cursor={{ stroke: "#64748b", strokeWidth: 2, strokeDasharray: "4 4", opacity: 0.3 }} content={<CustomAreaTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#3b82f6"
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#blueGradient)"
                      animationDuration={1500}
                      activeDot={{ r: 7, strokeWidth: 3, stroke: "#ffffff", fill: "#3b82f6", style: { filter: "drop-shadow(0px 4px 6px rgba(59, 130, 246, 0.4))" } }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* PIE CHART */}
        <Card className="shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 rounded-[2rem] bg-white dark:bg-slate-900/60 overflow-hidden transition-colors duration-300">
          <CardHeader className="pb-4 pt-7 px-7 border-b border-slate-50 dark:border-slate-800/50">
            <CardTitle className="text-xl font-bold flex items-center gap-2.5 text-slate-900 dark:text-white tracking-tight">
              <PieChartIcon className="size-6 text-indigo-600 dark:text-indigo-400" />
              Revenue Sources
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8 flex flex-col items-center justify-center relative">
            {activePieData.length === 0 ? (
              // 🔥 UPDATED: Designed Empty State
              <div className="h-[350px] w-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 m-4">
                <PieChartIcon className="size-10 text-slate-300 dark:text-slate-600 mb-3" />
                <p className="font-bold tracking-wide text-center px-4">No sources to display.</p>
              </div>
            ) : (
              <div className="h-[350px] w-full relative dark:opacity-90 transition-opacity">
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none -mt-8">
                  <span className="text-slate-400 dark:text-slate-500 text-[11px] font-bold uppercase tracking-wider mb-0.5">
                    Total
                  </span>
                  <span className="text-slate-900 dark:text-white font-black text-3xl tracking-tight">
                    ${totalPieRevenue > 1000 ? (totalPieRevenue / 1000).toFixed(1) + "k" : totalPieRevenue.toFixed(2)}
                  </span>
                </div>

                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={activePieData}
                      cx="50%"
                      cy="45%"
                      innerRadius={75}
                      outerRadius={110}
                      cornerRadius={8}
                      paddingAngle={4}
                      dataKey="total"
                      nameKey="title"
                      animationDuration={1500}
                      stroke="none"
                    >
                      {activePieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<CustomPieTooltip />} />
                    <Legend
                      verticalAlign="bottom"
                      height={40}
                      iconType="circle"
                      iconSize={10}
                      formatter={(value) => (
                        <span className="text-slate-600 dark:text-slate-300 font-bold text-xs ml-1.5 mr-2">
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}