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
import {
  ShieldAlert,
  Link as LinkIcon,

} from 'lucide-react';
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
  return (
    <>
    <div className="p-3 hover:shadow-xl shadow-gray-100 border border-green-300/30 rounded-2xl hover:scale-103 transition-all duration-500 rounded-b-2xl text-black flex flex-col bg-gray-50 gap-y-3 items-between min-w-[450px] h-full mt-23 ease-in-out">
      
      <div className='flex justify-around'>
      <ul className="list-disc list-inside flex flex-col gap-y-3 space-y-1 text-md font-light mb-6 w-full">
      <h3 className="text-2xl font-bold mb-4">Additional Insights</h3>
        <li>Phishing attacks account for nearly 40% of reported incidents.</li>
        <li>Ransomware attacks have increased by 25% in the last year.</li>
        <li>Government initiatives are focusing on cybersecurity awareness.</li>
        <li>Remote work has contributed to a rise in cyber vulnerabilities.</li>
        <li>80% of hacking-related breaches are due to weak or reused passwords.</li>
        <li>Outdated software, including mobile apps, can be exploited.</li>
        <li>Early reporting increases the chances of identifying and stopping fraud.</li>
        <li>In India, you can report anonymously at <a href="https://cybercrime.gov.in" target='_blank' className='text-blue-600'>https://cybercrime.gov.in</a> or call 1930.</li>
      </ul>
      </div>
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
    // bg-gradient-to-br from-blue-100 via-voilet-100/30 to-blue-200
    <div className="min-h-screen bg-gray-50  ">
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
        <div className='flex mt-10 mx-5'>
          <div className='flex flex-col items-start gap-y-5 mt-5'>
            <h1 className='mx-10 text-4xl text-blue-600 font-extrabold '>Cyber Law & IT Act Essentials
            </h1>
            <CyberLawCard/>
          </div>
          <div className='flex flex-col items-start justify-start'>
            <AdditionalInsightsPanel/>
          </div>
        </div>

        {/* 5. Cybercrime Statistics */}
        <CyberAnalyticsPage/>


        {/* 6. Tools & Resources */}
        <ToolsAndResources/>
      </div>

      <div className="mt-12 text-center">
        <Link to="/dashboard" className="text-blue-900 text-lg font-mono hover:underline transition-all transform duration-300">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};


