// src/components/Dashboard.jsx
import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { ArrowUpIcon, ArrowDownIcon, CalendarIcon, ChartBarIcon } from '@heroicons/react/24/outline';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export const Dashboard = () => {
  const [activePeriod, setActivePeriod] = useState('1year');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data that matches official dashboard
  useEffect(() => {
    const fetchData = async () => {
      // Simulate API call
      setTimeout(() => {
        setDashboardData({
          totalCases: 72456,
          disposedCases: 52189,
          pendingCases: 20267,
          caseTypes: {
            civil: { pending: 12500, disposed: 32000 },
            criminal: { pending: 4560, disposed: 8900 },
            constitutional: { pending: 1230, disposed: 2450 },
            service: { pending: 980, disposed: 2100 },
            tax: { pending: 760, disposed: 1800 },
            arbitration: { pending: 450, disposed: 1200 },
            labor: { pending: 680, disposed: 1500 },
            company: { pending: 320, disposed: 950 },
            election: { pending: 150, disposed: 400 },
            contempt: { pending: 237, disposed: 889 }
          },
          // Update your mock data in the useEffect hook

  // ... existing data ...
  lastMonth: {
    instituted: 2456,
    institutedChange: +5.2,
    disposed: 2189,
    disposedChange: -3.8,
    weeklyInstituted: [580, 620, 650, 606],
    weeklyDisposed: [550, 540, 560, 539]
  },
  lastYear: {
    instituted: 28945,
    institutedChange: +7.5,
    disposed: 26543,
    disposedChange: +9.2,
    quarterlyInstituted: [6850, 7200, 7450, 7445],
    quarterlyDisposed: [6250, 6500, 6850, 6943]
  },

          timePeriods: {
            '1year': {
              totalCases: 24567,
              disposedCases: 18923,
              pendingCases: 5644,
              monthlyData: [1200, 1900, 1500, 2100, 1800, 2000, 2200, 2100, 1950, 2050, 1900, 2150]
            },
            '2year': {
              totalCases: 45678,
              disposedCases: 34567,
              pendingCases: 11111,
              monthlyData: [1100, 1800, 1450, 2000, 1750, 1950, 2150, 2050, 1900, 2000, 1850, 2100]
            },
            '5year': {
              totalCases: 112345,
              disposedCases: 92100,
              pendingCases: 20245,
              monthlyData: [1000, 1700, 1400, 1900, 1700, 1850, 2050, 2000, 1800, 1950, 1800, 2000]
            }
          },
          disposalRates: {
            civil: 72,
            criminal: 66,
            constitutional: 67,
            service: 68,
            tax: 70,
            arbitration: 73,
            labor: 69,
            company: 75,
            election: 73,
            contempt: 79
          },
          
        });
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Supreme Court of India Dashboard</h1>
        <p className="text-gray-600">Comprehensive case statistics and analytics</p>
      </header>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Total Cases" 
          value={dashboardData.totalCases} 
          change={+12.5} 
          icon={<CalendarIcon className="h-6 w-6 text-blue-500" />}
        />
        <StatCard 
          title="Disposed Cases" 
          value={dashboardData.disposedCases} 
          change={+15.2} 
          icon={<ChartBarIcon className="h-6 w-6 text-green-500" />}
        />
        <StatCard 
          title="Pending Cases" 
          value={dashboardData.pendingCases} 
          change={-8.3} 
          icon={<ChartBarIcon className="h-6 w-6 text-orange-500" />}
        />
      </div>

      {/* Time Period Selector */}
      <div className="flex space-x-2 mb-6">
        {['1year', '2year', '5year'].map((period) => (
          <button
            key={period}
            onClick={() => setActivePeriod(period)}
            className={`px-4 py-2 rounded-md ${activePeriod === period 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            {period.replace('year', ' Year')}
          </button>
        ))}
      </div>

      {/* Time Period Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Disposal Chart */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Case Disposal Trend ({activePeriod.replace('year', ' Year')})
          </h2>
          <BarChart data={dashboardData.timePeriods[activePeriod]} />
        </div>

        {/* Case Type Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Case Type Distribution</h2>
          <PieChart data={dashboardData.caseTypes} />
        </div>
      </div>

      {/* Case Type Statistics */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Detailed Case Type Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.entries(dashboardData.caseTypes).map(([type, data]) => (
            <CaseTypeCard 
              key={type} 
              type={type} 
              data={data} 
              disposalRate={dashboardData.disposalRates[type]} 
            />
          ))}
        </div>
      </div>

      // Add this section just before the Disposal Analysis Panel in your Dashboard component
<div className="bg-white p-6 rounded-lg shadow-md mb-8">
  <h2 className="text-xl font-semibold mb-6 text-gray-800">Recent Case Statistics</h2>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Last Month Statistics */}
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="font-medium text-gray-800 mb-4 flex items-center">
        <CalendarIcon className="h-5 w-5 mr-2 text-blue-500" />
        Last Month Case Flow
      </h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <StatBox 
          title="Instituted" 
          value={dashboardData.lastMonth.instituted} 
          change={dashboardData.lastMonth.institutedChange}
          icon={<ArrowUpIcon className="h-4 w-4" />}
          bgColor="bg-blue-50"
          textColor="text-blue-600"
        />
        <StatBox 
          title="Disposed" 
          value={dashboardData.lastMonth.disposed} 
          change={dashboardData.lastMonth.disposedChange}
          icon={<ArrowDownIcon className="h-4 w-4" />}
          bgColor="bg-green-50"
          textColor="text-green-600"
        />
      </div>
      
      <div className="h-64">
        <MonthlyTrendChart 
          labels={['Week 1', 'Week 2', 'Week 3', 'Week 4']}
          institutedData={dashboardData.lastMonth.weeklyInstituted}
          disposedData={dashboardData.lastMonth.weeklyDisposed}
        />
      </div>
    </div>
    
    {/* Last Year Statistics */}
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="font-medium text-gray-800 mb-4 flex items-center">
        <CalendarIcon className="h-5 w-5 mr-2 text-purple-500" />
        Last Year Case Flow
      </h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <StatBox 
          title="Instituted" 
          value={dashboardData.lastYear.instituted} 
          change={dashboardData.lastYear.institutedChange}
          icon={<ArrowUpIcon className="h-4 w-4" />}
          bgColor="bg-purple-50"
          textColor="text-purple-600"
        />
        <StatBox 
          title="Disposed" 
          value={dashboardData.lastYear.disposed} 
          change={dashboardData.lastYear.disposedChange}
          icon={<ArrowDownIcon className="h-4 w-4" />}
          bgColor="bg-indigo-50"
          textColor="text-indigo-600"
        />
      </div>
      
      <div className="h-64">
        <YearlyTrendChart 
          labels={['Q1', 'Q2', 'Q3', 'Q4']}
          institutedData={dashboardData.lastYear.quarterlyInstituted}
          disposedData={dashboardData.lastYear.quarterlyDisposed}
        />
      </div>
    </div>
  </div>
</div>

      {/* Disposal Analysis Panel */}
      <DisposalAnalysisPanel data={dashboardData} />
    </div>
  );
};

// StatBox Component for compact statistics
const StatBox = ({ title, value, change, icon, bgColor, textColor }) => {
  return (
    <div className={`${bgColor} p-3 rounded-lg`}>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <div className="flex items-end justify-between mt-1">
        <p className={`text-2xl font-bold ${textColor}`}>{value.toLocaleString()}</p>
        <div className={`flex items-center text-xs ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {icon}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
    </div>
  );
};

// Monthly Trend Chart Component
const MonthlyTrendChart = ({ labels, institutedData, disposedData }) => {
  const data = {
    labels,
    datasets: [
      {
        label: 'Instituted',
        data: institutedData,
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
      {
        label: 'Disposed',
        data: disposedData,
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

// Yearly Trend Chart Component
const YearlyTrendChart = ({ labels, institutedData, disposedData }) => {
  const data = {
    labels,
    datasets: [
      {
        label: 'Instituted',
        data: institutedData,
        backgroundColor: 'rgba(124, 58, 237, 0.7)',
        borderColor: 'rgba(124, 58, 237, 1)',
        borderWidth: 1,
      },
      {
        label: 'Disposed',
        data: disposedData,
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

// Component for Stat Cards
const StatCard = ({ title, value, change, icon }) => {
  return (
    <div className="stat-card bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold mt-2 text-gray-800">
            {value.toLocaleString()}
          </p>
        </div>
        <div className="p-2 bg-blue-50 rounded-md">{icon}</div>
      </div>
      <div className={`flex items-center mt-4 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {change >= 0 ? (
          <ArrowUpIcon className="h-4 w-4 mr-1" />
        ) : (
          <ArrowDownIcon className="h-4 w-4 mr-1" />
        )}
        <span>{Math.abs(change)}% from last period</span>
      </div>
    </div>
  );
};

// Component for Bar Chart
const BarChart = ({ data }) => {
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Cases Disposed',
        data: data.monthlyData,
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

// Component for Pie Chart
const PieChart = ({ data }) => {
  const chartData = {
    labels: Object.keys(data).map(type => type.charAt(0).toUpperCase() + type.slice(1)),
    datasets: [
      {
        data: Object.values(data).map(d => d.pending + d.disposed),
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)',
          'rgba(16, 185, 129, 0.7)',
          'rgba(245, 158, 11, 0.7)',
          'rgba(139, 92, 246, 0.7)',
          'rgba(20, 184, 166, 0.7)',
          'rgba(244, 63, 94, 0.7)',
          'rgba(234, 88, 12, 0.7)',
          'rgba(220, 38, 38, 0.7)',
          'rgba(101, 163, 13, 0.7)',
          'rgba(124, 58, 237, 0.7)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(20, 184, 166, 1)',
          'rgba(244, 63, 94, 1)',
          'rgba(234, 88, 12, 1)',
          'rgba(220, 38, 38, 1)',
          'rgba(101, 163, 13, 1)',
          'rgba(124, 58, 237, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return <Pie data={chartData} />;
};

// Component for Case Type Cards
const CaseTypeCard = ({ type, data, disposalRate }) => {
  return (
    <div className="case-type-card bg-white p-4 rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-md">
      <h3 className="font-medium text-gray-800 capitalize">{type}</h3>
      <div className="mt-3 space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Pending:</span>
          <span className="font-medium">{data.pending.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Disposed:</span>
          <span className="font-medium text-green-600">{data.disposed.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Disposal Rate:</span>
          <span className="font-medium">{disposalRate}%</span>
        </div>
      </div>
    </div>
  );
};



// Enhanced Disposal Analysis Panel
const DisposalAnalysisPanel = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Disposal Analysis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Disposal Efficiency */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-800 mb-3">Disposal Efficiency</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Overall Disposal Rate</span>
                <span className="text-sm font-medium text-blue-600">
                  {Math.round((data.disposedCases / data.totalCases) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${(data.disposedCases / data.totalCases) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Civil Cases</span>
                <span className="text-sm font-medium text-green-600">
                  {data.disposalRates.civil}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-green-600 h-2.5 rounded-full" 
                  style={{ width: `${data.disposalRates.civil}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Criminal Cases</span>
                <span className="text-sm font-medium text-purple-600">
                  {data.disposalRates.criminal}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-purple-600 h-2.5 rounded-full" 
                  style={{ width: `${data.disposalRates.criminal}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Case Clearance Rate */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-medium text-gray-800 mb-3">Case Clearance Rate</h3>
          <div className="flex items-center justify-center h-full">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-gray-200"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-blue-600"
                  strokeWidth="10"
                  strokeDasharray={`${(data.disposedCases / data.totalCases) * 251}, 251`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-2xl font-bold text-gray-800">
                  {Math.round((data.disposedCases / data.totalCases) * 100)}%
                </span>
                <p className="text-xs text-gray-500">Clearance Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Yearly Comparison */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h3 className="font-medium text-gray-800 mb-3">Yearly Disposal Comparison</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Period</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cases</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disposed Cases</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending Cases</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disposal Rate</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(data.timePeriods).map(([period, periodData]) => (
                <tr key={period}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                    {period.replace('year', ' Year')}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {periodData.totalCases.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-green-600">
                    {periodData.disposedCases.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {periodData.pendingCases.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-blue-600">
                    {Math.round((periodData.disposedCases / periodData.totalCases) * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};