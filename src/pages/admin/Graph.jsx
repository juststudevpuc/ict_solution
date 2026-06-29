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
  Legend
} from "recharts";
import { DollarSign, ShoppingBag, PieChart as PieChartIcon, TrendingUp } from "lucide-react";

import { request } from "@/utils/request/request";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Clean, standard corporate palette (Inspired by Apple Human Interface Guidelines)
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

        const url = selectedDate
          ? `admin/getSale?date=${selectedDate}`
          : `admin/getSale`;

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

  const activePieData = useMemo(() => 
    stats.summary_sale_by_month.filter(item => item.total > 0),
  [stats]);

  const totalPieRevenue = useMemo(() => 
    activePieData.reduce((acc, curr) => acc + curr.total, 0),
  [activePieData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[500px] w-full bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="size-8 text-blue-600 animate-spin" />
          <p className="text-sm font-medium text-slate-500">Loading data...</p>
        </div>
      </div>
    );
  }

  // Minimalist standard tooltip for Pie Chart
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-lg">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: payload[0].payload.fill }} />
            <p className="font-medium text-slate-500 text-xs">{payload[0].name}</p>
          </div>
          <p className="text-slate-900 font-semibold text-lg">
            ${Number(payload[0].value).toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Minimalist standard tooltip for Area Chart
  const CustomAreaTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-lg">
          <p className="font-medium text-slate-500 text-xs mb-1">{label}</p>
          <p className="text-blue-600 font-semibold text-lg">
            ${Number(payload[0].value).toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* --- TOP SUMMARY CARDS (Clean & Minimal) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">
              Sales This Month
            </p>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
              ${(stats.sale_this_month?.total || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}
            </h3>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl">
            <DollarSign className="size-6 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between transition-all hover:shadow-md">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">
              Orders This Month
            </p>
            <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
              {stats.sale_this_month?.total_order || 0}
            </h3>
          </div>
          <div className="p-3 bg-indigo-50 rounded-xl">
            <ShoppingBag className="size-6 text-indigo-600" />
          </div>
        </div>
      </div>

      {/* --- CHARTS GRID SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* AREA CHART */}
        <Card className="lg:col-span-2 shadow-sm border-slate-200 rounded-2xl bg-white overflow-hidden">
          <CardHeader className="pb-4 pt-6 px-6">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800">
              <TrendingUp className="size-5 text-blue-600" /> 
              Revenue Trajectory
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2 px-4">
            
            {stats.summary_sale_by_month.length === 0 ? (
               <div className="h-[350px] flex items-center justify-center text-slate-400 font-medium text-sm">
                 No revenue data available.
               </div>
            ) : (
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.summary_sale_by_month} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#007AFF" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#007AFF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="title" 
                      tickLine={false} 
                      axisLine={false} 
                      tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }} 
                      dy={10} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }} 
                      tickFormatter={(value) => `$${value}`} 
                    />
                    <RechartsTooltip 
                      cursor={{ stroke: "#e2e8f0", strokeWidth: 1, strokeDasharray: "3 3" }}
                      content={<CustomAreaTooltip />}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="total" 
                      stroke="#007AFF" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#blueGradient)" 
                      animationDuration={1500}
                      activeDot={{ r: 5, strokeWidth: 2, stroke: '#ffffff', fill: '#007AFF' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* PIE CHART */}
        <Card className="shadow-sm border-slate-200 rounded-2xl bg-white overflow-hidden">
          <CardHeader className="pb-4 pt-6 px-6">
            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-slate-800">
              <PieChartIcon className="size-5 text-indigo-600" />
              Revenue Sources
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2 flex flex-col items-center justify-center relative">
            
            {activePieData.length === 0 ? (
              <div className="h-[350px] flex items-center justify-center text-slate-400 font-medium text-sm">
                No revenue data available.
              </div>
            ) : (
              <div className="h-[350px] w-full relative">
                
                {/* Centered Text inside the Donut hole */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none -mt-8">
                  <span className="text-slate-500 text-[10px] font-semibold uppercase tracking-wide">Total</span>
                  <span className="text-slate-900 font-bold text-xl">
                    ${(totalPieRevenue > 1000 ? (totalPieRevenue/1000).toFixed(1) + 'k' : totalPieRevenue.toFixed(2))}
                  </span>
                </div>

                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={activePieData}
                      cx="50%"
                      cy="45%"
                      innerRadius={65}
                      outerRadius={95}
                      cornerRadius={4}
                      paddingAngle={2}
                      dataKey="total"
                      nameKey="title"
                      animationDuration={1500}
                      stroke="none"
                    >
                      {activePieData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={PIE_COLORS[index % PIE_COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip content={<CustomPieTooltip />} />
                    <Legend 
                      verticalAlign="bottom" 
                      height={40}
                      iconType="circle"
                      formatter={(value) => <span className="text-slate-600 font-medium text-xs ml-1">{value}</span>}
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