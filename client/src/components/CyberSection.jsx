import { ShieldAlert, AlertTriangle, WifiOff, Lock, Globe, FileWarning, Eye, Phone,Link as LinkIcon } from "lucide-react";
import React from 'react';
import { useState } from 'react';

import { Awareness } from './cyberPageComponent/Awareness';
import { CyberLawCard } from './cyberPageComponent/Legal';
import { CyberAnalyticsPage } from './cyberPageComponent/CyberAnalytics';
import { ToolsAndResources } from './cyberPageComponent/Tools';

import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

const lineData = [
  { year: 2019, incidents: 21000 },
  { year: 2020, incidents: 30000 },
  { year: 2021, incidents: 43000 },
  { year: 2022, incidents: 58000 },
  { year: 2023, incidents: 72000 },
];


const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#ff6666"];

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



function AdditionalInsightsPanel() {
  const insights = [
    {
      icon: <AlertTriangle className="text-red-400" />,
      text: "Phishing attacks account for nearly 40% of reported incidents.",
    },
    {
      icon: <ShieldAlert className="text-yellow-400" />,
      text: "Ransomware attacks have increased by 25% in the last year.",
    },
    {
      icon: <Globe className="text-blue-400" />,
      text: "Government initiatives are focusing on cybersecurity awareness.",
    },
    {
      icon: <WifiOff className="text-pink-500" />,
      text: "Remote work has contributed to a rise in cyber vulnerabilities.",
    },
    {
      icon: <Lock className="text-purple-400" />,
      text: "80% of hacking-related breaches are due to weak or reused passwords.",
    },
    {
      icon: <FileWarning className="text-orange-400" />,
      text: "Outdated software, including mobile apps, can be exploited.",
    },
    {
      icon: <Eye className="text-cyan-400" />,
      text: "Early reporting increases the chances of identifying and stopping fraud.",
    },
    {
      icon: <Phone className="text-green-400" />,
      text: (
        <>
          In India, report anonymously at{" "}
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-400 hover:text-blue-600"
          >
            cybercrime.gov.in
          </a>{" "}
          or call <span className="text-white font-semibold">1930</span>.
        </>
      ),
    },
  ];

  return (
    <div className="p-6 rounded-2xl shadow-xl border border-gray-200 min-w-[90vw] min-h-[80vh] mt-4 transition-all duration-500 text-white">
      <ul className="flex flex-col gap-5 text-lg font-light">
        {insights.map((item, idx) => (
          <li
            key={idx}
            className="flex items-start gap-4 text-black  p-4 rounded-xl transition"
          >
            <div className="mt-1">{item.icon}</div>
            <p className="leading-relaxed">{item.text}</p>
          </li>
        ))}
      </ul>
    </div>
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
    // bg-gradient-to-br from-blue-100 via-voilet-100/30 to-blue-200
    <div className="min-h-screen bg-gray-50 min-w-[90vw]  ">
    <div className='min-w-full flex justify-between p-10 bg-blue-800/70'>
      <div className='flex flex-col gap-y-5 items-start ml-5'>
      <h1 className="text-3xl font-bold text-center text-white mb-12 flex items-center justify-center gap-3">
        <ShieldAlert className="w-8 h-8 text-red-600" />
        Cyber Section - Judiciary Portal
      </h1>
      <p className='text-white text-md ml-10 font-light max-w-[35%]'>Comprehensive cybersecurity resources and tools designed specifically for judicial officers and court personnel.</p>
      </div>
      <img src="https://plus.unsplash.com/premium_vector-1726498072933-f6112c1b1396?q=80&w=2154&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="image for cyber seq" className='max-h-[25%] w-[30%] rounded-3xl' />
      </div>
        
      <div className="flex flex-col gap-y-10">
  
        {/* 2. Legal Information */}
        <div className='flex flex-col mt-10 mx-5'>
          <div className='flex flex-col items-start gap-y-5 mt-5'>
            <h1 className='mx-10 text-4xl text-blue-600 font-extrabold '>Cyber Law & IT Act Essentials
            </h1>
            <CyberLawCard/>
          </div>
            <h3 className="text-[42px] font-bold text-blue-700 px-12 pt-4 mt-5  mb-4">Additional Insights</h3>
          <div className='flex flex-col justify-center items-center'>
            <AdditionalInsightsPanel/>
          </div>
        </div>

        {/* 5. Cybercrime Statistics */}
        <CyberAnalyticsPage/>
<div className=' my-10 '>
        <Awareness/>
        </div>

        {/* 6. Tools & Resources */}
        <ToolsAndResources/>
      </div>

      {/* <div className="mt-12 text-center">
        <Link to="/dashboard" className="text-blue-900 text-lg font-mono hover:underline transition-all transform duration-300">
          ← Back to Dashboard
        </Link>
      </div> */}
    </div>
  );
};


