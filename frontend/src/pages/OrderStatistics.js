"use client";

import { useEffect, useState } from "react";
import SummaryApi from "../common";
import moment from "moment";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#0891b2", // Cyan-600
  "#10b981", // Emerald-500
  "#3b82f6", // Blue-500
  "#8b5cf6", // Violet-500
  "#f59e0b", // Amber-500
  "#ef4444", // Red-500
  "#06b6d4", // Cyan-500
];

const GroupByOptions = {
  DAY: "day",
  MONTH: "month",
  YEAR: "year",
};

const viewByLabels = {
  day: "Ngày",
  month: "Tháng",
  year: "Năm",
};

const OrderStatistics = () => {
  const [data, setData] = useState([]);
  const [viewBy, setViewBy] = useState(GroupByOptions.DAY);
  const [groupedData, setGroupedData] = useState([]);
  const [orderCountData, setOrderCountData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(SummaryApi.allOrder.url, {
        method: SummaryApi.allOrder.method,
        credentials: "include",
      });
      const resData = await res.json();
      setData(resData.data || []);
    } catch (error) {
      console.error("Lỗi khi fetch đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  const groupDataBy = (orders, viewType) => {
    const groups = {};
    const orderCounts = {};

    orders.forEach((order) => {
      let key;
      const date = moment(order.createdAt);

      if (viewType === GroupByOptions.DAY) {
        key = date.format("YYYY-MM-DD");
      } else if (viewType === GroupByOptions.MONTH) {
        key = date.format("YYYY-MM");
      } else if (viewType === GroupByOptions.YEAR) {
        key = date.format("YYYY");
      }

      if (!groups[key]) groups[key] = 0;
      groups[key] += order.totalAmount || 0;

      if (!orderCounts[key]) orderCounts[key] = 0;
      orderCounts[key] += 1;
    });

    setGroupedData(
      Object.entries(groups).map(([key, value]) => ({
        name: key,
        totalAmount: value,
      }))
    );
    setOrderCountData(
      Object.entries(orderCounts).map(([key, value]) => ({
        name: key,
        orderCount: value,
      }))
    );
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    groupDataBy(data, viewBy);
  }, [data, viewBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-8 mb-8 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Thống kê doanh thu và đơn hàng
                </h1>
                <p className="text-cyan-100 text-lg">
                  Phân tích chi tiết doanh thu và xu hướng đơn hàng
                </p>
              </div>
            </div>
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm border border-white/30 rounded-xl px-6 py-3 text-white font-semibold transition-all duration-200 flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <svg
                className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {loading ? "Đang tải..." : "Làm mới"}
            </button>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <label className="font-semibold text-white whitespace-nowrap flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              Xem theo:
            </label>
            <select
              value={viewBy}
              onChange={(e) => setViewBy(e.target.value)}
              className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-2 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200 hover:bg-white/30"
            >
              <option value={GroupByOptions.DAY} className="text-gray-800">
                Ngày
              </option>
              <option value={GroupByOptions.MONTH} className="text-gray-800">
                Tháng
              </option>
              <option value={GroupByOptions.YEAR} className="text-gray-800">
                Năm
              </option>
            </select>
          </div>
        </div>

        {loading && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 shadow-2xl flex items-center gap-4">
              <svg
                className="w-8 h-8 text-cyan-600 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span className="text-xl font-semibold text-gray-800">
                Đang tải dữ liệu thống kê...
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-8 0v4a1 1 0 01-8 0V4z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Doanh thu theo {viewByLabels[viewBy]}
              </h2>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-xl p-4">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={groupedData}
                  margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
                >
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    interval={0}
                  />
                  <YAxis
                    tickFormatter={(value) =>
                      value.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                        maximumFractionDigits: 0,
                      })
                    }
                    width={120}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                  />
                  <Tooltip
                    formatter={(value) =>
                      value.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })
                    }
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Bar
                    dataKey="totalAmount"
                    fill="url(#revenueGradient)"
                    name="Tổng doanh thu"
                    radius={[8, 8, 0, 0]}
                  />
                  <defs>
                    <linearGradient
                      id="revenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#0891b2" />
                      <stop offset="100%" stopColor="#0e7490" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Số lượng đơn hàng theo {viewByLabels[viewBy]}
              </h2>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-violet-50 rounded-xl p-4">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={orderCountData}
                  margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
                >
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    interval={0}
                  />
                  <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Bar
                    dataKey="orderCount"
                    fill="url(#orderGradient)"
                    name="Số lượng đơn hàng"
                    radius={[8, 8, 0, 0]}
                  />
                  <defs>
                    <linearGradient
                      id="orderGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Tỷ lệ doanh thu theo {viewByLabels[viewBy]}
              </h2>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-4">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={groupedData}
                    dataKey="totalAmount"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={({ name, totalAmount }) => {
                      const totalSum = groupedData.reduce(
                        (sum, cur) => sum + cur.totalAmount,
                        0
                      );
                      const percent = ((totalAmount / totalSum) * 100).toFixed(
                        1
                      );
                      return `${name}: ${percent}%`;
                    }}
                    labelLine={false}
                  >
                    {groupedData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) =>
                      value.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })
                    }
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Tỷ lệ đơn hàng theo {viewByLabels[viewBy]}
              </h2>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-emerald-50 rounded-xl p-4">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={orderCountData}
                    dataKey="orderCount"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={({ name, orderCount }) => {
                      const totalSum = orderCountData.reduce(
                        (sum, cur) => sum + cur.orderCount,
                        0
                      );
                      const percent = ((orderCount / totalSum) * 100).toFixed(
                        1
                      );
                      return `${name}: ${percent}%`;
                    }}
                    labelLine={false}
                  >
                    {orderCountData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "none",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStatistics;
