// @ts-nocheck
'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';

const volumeData = [
  { name: 'Jan', Volume: 4000 },
  { name: 'Feb', Volume: 7500 },
  { name: 'Mar', Volume: 12000 },
  { name: 'Apr', Volume: 9000 },
  { name: 'May', Volume: 15400 },
  { name: 'Jun', Volume: 22000 },
  { name: 'Jul', Volume: 31000 },
];

const userData = [
  { name: 'Jan', Users: 120 },
  { name: 'Feb', Users: 240 },
  { name: 'Mar', Users: 450 },
  { name: 'Apr', Users: 680 },
  { name: 'May', Users: 950 },
  { name: 'Jun', Users: 1400 },
  { name: 'Jul', Users: 1980 },
];

export function OverviewCharts() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Volume Chart */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <h3 className="text-md font-semibold text-gray-900 dark:text-gray-50 mb-4">
          Transaction Volume (USDT)
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={volumeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100 dark:stroke-gray-800" />
              <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                labelClassName="text-slate-400 font-bold"
              />
              <Area type="monotone" dataKey="Volume" stroke="#6366f1" fillOpacity={1} fill="url(#colorVolume)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* User Growth Chart */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
        <h3 className="text-md font-semibold text-gray-900 dark:text-gray-50 mb-4">
          User Signups (Cumulative)
        </h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={userData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100 dark:stroke-gray-800" />
              <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                labelClassName="text-slate-400 font-bold"
              />
              <Bar dataKey="Users" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
