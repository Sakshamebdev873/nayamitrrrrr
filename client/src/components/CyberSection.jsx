import React from 'react';
import { useState } from 'react';

import { Awareness } from './cyberPageComponent/Awareness';
import { CyberLawCard } from './cyberPageComponent/Legal';
import { CyberAnalyticsPage } from './cyberPageComponent/CyberAnalytics';
import { ToolsAndResources } from './cyberPageComponent/Tools';

import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
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
import {
  ShieldAlert,
  KeyRound,
  Link as LinkIcon,
  Gavel,
  Users,
  BarChart4,
  Wrench,
  AlertTriangle,
  BookOpen,
  AlertCircle,
  PhoneOff,
  WifiOff,
  XCircle
} from 'lucide-react';
const lineData = [
  { year: 2019, incidents: 21000 },
  { year: 2020, incidents: 30000 },
  { year: 2021, incidents: 43000 },
  { year: 2022, incidents: 58000 },
  { year: 2023, incidents: 72000 },
];


const pieData = [
  { name: "Phishing", value: 35 },
  { name: "Identity Theft", value: 25 },
  { name: "Online Scams", value: 20 },
  { name: "Malware Attacks", value: 10 },
  { name: "Cyberbullying", value: 10 },
];
const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#ff6666"];
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/cards'
// import { Badge } from './ui/badge';
import { motion } from 'framer-motion';

// --- Live Poll Component ---
function LivePoll() {
  const [votes, setVotes] = useState({ phishing: 8, idtheft: 4, scams: 3 }); // Example starting votes
  const [voted, setVoted] = useState(false);

  const handleVote = (option) => {
    if (!voted) {
      setVotes((prev) => ({ ...prev, [option]: prev[option] + 1 }));
      setVoted(true);
    }
  };

  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  return (
    <div className="mb-6">
      <h4 className="font-semibold text-lg font-serif mb-2">Live Poll: Which cybercrime worries you most?</h4>
      <div className="flex gap-4">
        {Object.entries({ phishing: "Phishing", idtheft: "Identity Theft", scams: "Online Scams" }).map(([key, label]) => (
          <button
            key={key}
            onClick={() => handleVote(key)}
            disabled={voted}
            className={`px-4 py-2 rounded-full font-medium transition-colors ${
              voted ? "bg-gray-300 text-gray-500" : "bg-white hover:bg-indigo-100 text-indigo-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="mt-4 space-y-1">
        {Object.entries({ phishing: "Phishing", idtheft: "Identity Theft", scams: "Online Scams" }).map(([key, label]) => (
          <div key={key} className="flex items-center gap-x-40">
            <span className="w-28 font-light">{label}</span>
            <div className="flex-1 bg-gray-200 rounded h-3">
              <div
                className="bg-indigo-500 h-3 rounded"
                style={{ width: `${(votes[key] / totalVotes) * 100}%` }}
              />
            </div>
            <span className="w-8 text-end">{votes[key]}</span>
          </div>
        ))}
      </div>
      {voted && <div className="mt-2 text-green-600 font-medium font-mono">Thank you for voting!</div>}
    </div>
  );
}

function YearlyIncidentsChart() {
  return (
    <div className="p-4 bg-[linear-gradient(342deg,_#3b376a_1.28%,_#008fba_68.28%,_#ff95d5_100%)]
rounded-lg shadow-lg animate-fadeIn">
      <h3 className="text-xl font-bold mr-3 mb-10 text-white">Year-wise Cybercrime Incidents</h3>
      <ResponsiveContainer width="100%" height={200}>
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

// --- Interactive Fact Component ---
function InteractiveFact() {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="bg-white/90 rounded-lg p-4 shadow flex items-center gap-4 mt-4">
      <span className="text-2xl">💡</span>
      <div>
        <span className="font-semibold font-serif ">Did you know?</span>
        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className="ml-3 px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition"
          >
            Reveal
          </button>
        ) : (
          <span className="ml-3 text-gray-700">
            Cybercrime costs India over <b>$8 billion</b> annually.
          </span>
        )}
      </div>
    </div>
  );
}

// --- Enhanced Additional Insights Panel ---
function AdditionalInsightsPanel() {
  return (
    <>
    <div className="p-6 rounded-xl shadow-xl text-black flex flex-col gap-3 justify-center">
      
      <div className='flex justify-around'>
      <ul className="list-none pl-2 space-y-3 flex flex-col gap-y-2 text-md font-light mb-6">
      <h3 className="text-2xl font-bold mb-4">Additional Insights</h3>
        <li>Phishing attacks account for nearly 40% of reported incidents.</li>
        <li>Ransomware attacks have increased by 25% in the last year.</li>
        <li>Government initiatives are focusing on cybersecurity awareness.</li>
        <li>Remote work has contributed to a rise in cyber vulnerabilities.</li>
      </ul>
      <YearlyIncidentsChart/>
      </div>
      <LivePoll />
      <InteractiveFact />
    </div>
    </>
  );
}




const cn = (...classes) => classes.filter(Boolean).join(' ');

const Badge = forwardRef(
  ({ className, variant = "default", ...props }, ref) => {
    const baseClasses =
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

    const variantClasses = {
      default: "bg-primary text-primary-foreground hover:bg-primary/80",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
      outline: "text-foreground",
      ghost: "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
      cyber: "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30 hover:text-red-300",
    };

    return (
      <motion.span
        ref={ref}
        className={cn(baseClasses, variantClasses[variant] || variantClasses.default, className)}
        {...props}
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400 }}
      />
    );
  }
);

Badge.displayName = "Badge";




export function CyberSection(){
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 p-6">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-12 flex items-center justify-center gap-3">
        <ShieldAlert className="w-8 h-8 text-red-600" />
        Cyber Section - Judiciary Portal
      </h1>

      <div className="flex flex-col gap-y-10">

        {/* 1st Awareness */}

        {/* <Awareness/> */}
  
        {/* 2. Legal Information */}
        <CyberLawCard/>

        {/* 5. Cybercrime Statistics */}
        <CyberAnalyticsPage/>

        <AdditionalInsightsPanel/>

        {/* 6. Tools & Resources */}
        <ToolsAndResources/>
      </div>

      <div className="mt-12 text-center">
        <Link to="/dashboard" className="text-blue-600 text-lg font-mono underline hover:text-blue-800 transition-colors">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};


