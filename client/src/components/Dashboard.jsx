import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, BarChart, Bar
} from 'recharts';

import { motion } from 'framer-motion';

const resolutionData = [
  { court: 'District', avgDays: 220 },
  { court: 'High', avgDays: 340 },
  { court: 'Supreme', avgDays: 410 },
];

const filingTrend = [
  { month: 'Jan', cases: 320 },
  { month: 'Feb', cases: 410 },
  { month: 'Mar', cases: 380 },
  { month: 'Apr', cases: 460 },
  { month: 'May', cases: 510 },
  { month: 'Jun', cases: 488 },
  { month: 'Jul', cases: 550 },
];

// Region-wise data
const regions = [
  { name: 'North', caseCount: 120, pending: 50, resolved: 70 },
  { name: 'South', caseCount: 90, pending: 30, resolved: 60 },
  { name: 'East', caseCount: 100, pending: 40, resolved: 60 },
  { name: 'West', caseCount: 75, pending: 25, resolved: 50 },
  { name: 'Central', caseCount: 60, pending: 10, resolved: 50 },
];

// Year-wise case trends
const caseTrends = [
  { year: 2020, criminal: 120, civil: 90, family: 60, cyber: 20, property: 40, others: 10 },
  { year: 2021, criminal: 150, civil: 100, family: 70, cyber: 30, property: 45, others: 15 },
  { year: 2022, criminal: 170, civil: 110, family: 80, cyber: 40, property: 60, others: 20 },
  { year: 2023, criminal: 200, civil: 130, family: 90, cyber: 50, property: 70, others: 25 },
  { year: 2024, criminal: 220, civil: 140, family: 95, cyber: 65, property: 85, others: 30 },
];

function CaseStats() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white p-8">
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-indigo-700 mb-8 text-center"
      >
        Case statistics dashboard
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Average Resolution Time */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="bg-white rounded-3xl shadow-lg p-6 border border-gray-200"
        >
          <h2 className="text-xl font-semibold text-indigo-600 mb-4">Average case resolution time (in Days)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={resolutionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="court" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgDays" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Case Filing Trend */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-3xl shadow-lg p-6 border border-gray-200"
        >
          <h2 className="text-xl font-semibold text-indigo-600 mb-4">Monthly Case Filing Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filingTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="cases" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}

// Summary categories
const total = (key) => caseTrends.reduce((sum, item) => sum + item[key], 0);

const categories = [
  { key: 'criminal', label: 'Criminal', color: 'bg-red-100 text-red-600', border: 'border-red-400' },
  { key: 'civil', label: 'Civil', color: 'bg-blue-100 text-blue-600', border: 'border-blue-400' },
  { key: 'family', label: 'Family', color: 'bg-yellow-100 text-yellow-600', border: 'border-yellow-400' },
  { key: 'cyber', label: 'Cybercrime', color: 'bg-green-100 text-green-600', border: 'border-green-400' },
  { key: 'property', label: 'Property', color: 'bg-purple-100 text-purple-600', border: 'border-purple-400' },
  { key: 'others', label: 'Others', color: 'bg-gray-100 text-gray-600', border: 'border-gray-400' },
];

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Judiciary Case Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5 mb-10">
        {categories.map(({ key, label, color, border }) => (
          <div
            key={key}
            className={`rounded-xl p-5 shadow-lg border ${border} ${color} transition-transform hover:scale-105`}
          >
            <div className="text-sm font-semibold">{label} Cases</div>
            <div className="text-2xl font-bold">{total(key)}</div>
          </div>
        ))}
      </div>

      {/* Line Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200 mb-10">
        <h2 className="text-xl font-semibold mb-4 text-[#4F39F6]">Year-wise Case Type Trends</h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={caseTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="criminal" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="civil" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="family" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="cyber" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="property" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="others" stroke="#64748b" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* added info- avg time graph and case related */}

        <CaseStats/>

      {/* Region Bar Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
        <h2 className="text-xl text-[#4F39F6] font-semibold mb-4 ">Region-wise Case Distribution</h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={regions}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="caseCount" fill="#3b82f6" name="Total Cases" />
            <Bar dataKey="pending" fill="#facc15" name="Pending" />
            <Bar dataKey="resolved" fill="#10b981" name="Resolved" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
