import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/cards";
import { BarChart4 } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

const pieData = [
  { name: "Phishing", value: 35 },
  { name: "Identity Theft", value: 25 },
  { name: "Online Scams", value: 20 },
  { name: "Malware Attacks", value: 10 },
  { name: "Cyberbullying", value: 10 },
];
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#ff6666"];

const lineData = [
  { year: 2019, incidents: 21000 },
  { year: 2020, incidents: 30000 },
  { year: 2021, incidents: 43000 },
  { year: 2022, incidents: 58000 },
  { year: 2023, incidents: 72000 },
];

function YearlyIncidentsChart() {
  return (
    <div className="p-4 bg-[linear-gradient(342deg,_#3b376a_1.28%,_#008fba_68.28%,_#ff95d5_100%)]
rounded-lg shadow-lg animate-fadeIn">
      <h3 className="text-xl font-bold ml-3 mb-5 text-white">Year-wise Cybercrime Incidents</h3>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={lineData}>
          <XAxis dataKey="year" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip contentStyle={{ backgroundColor: '#333', borderRadius: '8px' }} />
          <Legend wrapperStyle={{ color: '#fff' }} />
          <Line type="monotone" dataKey="incidents" stroke="#fff" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
      <p className="mt-3 text-white text-sm">
        Incidents expected to surpass <strong>100,000 by 2025</strong> due to digital growth.
      </p>
    </div>
  );
}

function CategoryDistributionChart() {
  return (
    <>
    <h3 className="text-xl font-semibold mb-4">Category-wise Distribution</h3>
    <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex">

      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={130}>
            {pieData.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <ul className="text-md font-light text-gray-700 mt-4 space-y-2">
        <li><strong>Phishing:</strong> Leading threat, growing 20% annually.</li>
        <li><strong>Identity Theft:</strong> Rising with data leaks, 15% annual increase.</li>
        <li><strong>Online Scams:</strong> Social media frauds drive 18% yearly rise.</li>
        <li><strong>Malware Attacks:</strong> Surging with IoT device usage.</li>
        <li><strong>Cyberbullying:</strong> Growing among teens, 10% annual increase.</li>
      </ul>
    </div>
    </>
  );
}

export function CyberAnalyticsPage() {
  return (
    <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 p-6 bg-gray-50 min-h-screen">
      <Card className="col-span-2 p-6 bg-white rounded-xl shadow-2xl hover:shadow-3xl transition-shadow duration-500">
        <CardHeader>
          <CardTitle className="text-3xl font-extrabold text-gradient ">
            <BarChart4 className="w-8 h-8 text-transparent bg-clip-text " />
            Cybercrime Analytics
          </CardTitle>
          <CardDescription className="text-lg text-gray-500 mt-1">
            Year-wise crime trends and category breakdowns in India.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-10">
          {/* <YearlyIncidentsChart /> */}
          <CategoryDistributionChart />
        </CardContent>
      </Card>
    </div>
  );
}
