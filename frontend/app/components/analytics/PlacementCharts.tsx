"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const departmentData = [
  { name: "CSE", placed: 180 },
  { name: "IT", placed: 95 },
  { name: "ECE", placed: 72 },
  { name: "EEE", placed: 48 },
  { name: "ME", placed: 55 },
  { name: "AI&DS", placed: 36 },
];

const salaryData = [
  { name: "3-5 LPA", value: 120 },
  { name: "5-8 LPA", value: 180 },
  { name: "8-12 LPA", value: 95 },
  { name: "12+ LPA", value: 41 },
];

const COLORS = ["#1683FF", "#7C5CFF", "#22C55E", "#F59E0B"];

export function PlacementCharts() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-[#1E3045] bg-[#101C2C] p-5">
        <h3 className="mb-4 text-base font-semibold text-[#F8FAFC]">
          Department-wise Placement
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E3045" />
              <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
              <YAxis stroke="#94A3B8" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#101C2C",
                  border: "1px solid #1E3045",
                  borderRadius: "8px",
                  color: "#F8FAFC",
                }}
              />
              <Bar dataKey="placed" fill="#1683FF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-[#1E3045] bg-[#101C2C] p-5">
        <h3 className="mb-4 text-base font-semibold text-[#F8FAFC]">
          Salary Distribution
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={salaryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {salaryData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#101C2C",
                  border: "1px solid #1E3045",
                  borderRadius: "8px",
                  color: "#F8FAFC",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}