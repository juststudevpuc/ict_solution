"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { DollarSign, ShoppingBag } from "lucide-react";

import { request } from "@/utils/request/request";
import { Spinner } from "@/components/ui/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Map our backend "total" to Shadcn's chart theming
const chartConfig = {
  total: {
    label: "Revenue",
    color: "hsl(var(--chart-1, 221.2 83.2% 53.3%))", // Falls back to a nice blue if CSS var is missing
  },
};

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

        // 2. Attach the date to the API request if it exists
        const url = selectedDate
          ? `admin/getSale?date=${selectedDate}`
          : `admin/getSale`;

        const res = await request(url, "get");

        if (res) {
          setStats({
            sale_this_month: res.sale_this_month,
            summary_sale_by_month: res.summary_sale_by_month,
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner className="size-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* --- TOP SUMMARY CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-emerald-100 text-emerald-600 rounded-xl">
            <DollarSign className="size-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
              Sales This Month
            </p>
            <h3 className="text-xl font-black text-slate-900">
              ${stats.sale_this_month.total.toFixed(2)}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-xl">
            <ShoppingBag className="size-8" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
              Orders This Month
            </p>
            <h3 className="text-xl font-black text-slate-900">
              {stats.sale_this_month.total_order}
            </h3>
          </div>
        </div>
      </div>

      {/* --- THE SHADCN AREA CHART --- */}
      <Card className="pt-0 shadow-sm border-slate-200 rounded-2xl overflow-hidden">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row bg-slate-50/50">
          <div className="grid flex-1 gap-1">
            <CardTitle className="text-lg font-bold">
              Revenue Overview
            </CardTitle>
            <CardDescription>
              Showing total revenue grouped by month for the current year
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-2 pt-6 sm:px-6 sm:pt-8 bg-white">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[350px] w-full"
          >
            <AreaChart
              data={stats.summary_sale_by_month}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-total)"
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-total)"
                    stopOpacity={0.01}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="#e2e8f0"
              />

              <XAxis
                dataKey="title" // Maps to "Jan", "Feb", etc. from Laravel
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                tick={{ fill: "#64748b", fontSize: 13, fontWeight: 500 }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 13 }}
                tickFormatter={(value) => `$${value}`}
                width={60}
              />

              <ChartTooltip
                cursor={{
                  stroke: "#cbd5e1",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    formatter={(value) => `$${Number(value).toFixed(2)}`}
                  />
                }
              />

              <Area
                dataKey="total"
                type="monotone" // Creates the smooth curves
                fill="url(#fillRevenue)"
                stroke="var(--color-total)"
                strokeWidth={3}
                animationDuration={1500}
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
