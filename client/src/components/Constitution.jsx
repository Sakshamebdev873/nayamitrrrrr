import { useState } from 'react';
// import { AmendmentChart } from './constitution-comparison.webp';
// import { ContributorCard } from './ContributorCard.webp';
import ConstitutionImage from '/123.png';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

const OverviewSection = () => (
  <div className="p-8">
    <h2 className="text-3xl font-bold text-gray-800 mb-6">Overview</h2>
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <p className="text-lg text-gray-700 mb-4">
          The Constitution of India is the supreme law of India. It lays down the framework defining 
          fundamental political principles, establishes the structure, procedures, powers and duties 
          of government institutions, and sets out fundamental rights, directive principles and the 
          duties of citizens.
        </p>
        <p className="text-lg text-gray-700 mb-4">
          Adopted on <span className="font-semibold">26 November 1949</span> and came into effect on 
          <span className="font-semibold"> 26 January 1950</span>, it replaced the Government of India 
          Act (1935) as the country's fundamental governing document.
        </p>
      </div>
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">Key Features</h3>
        <ul className="space-y-3">
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">✓</span>
            <span>Longest written constitution of any sovereign country</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">✓</span>
            <span>Federal system with unitary bias</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">✓</span>
            <span>Parliamentary form of government</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">✓</span>
            <span>Fundamental Rights and Duties</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-500 mr-2">✓</span>
            <span>Directive Principles of State Policy</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
);

const MakingSection = () => (
  <div className="p-8">
    <h2 className="text-3xl font-bold text-gray-800 mb-6">The Making of the Constitution</h2>
    
    <div className="mb-12">
      <h3 className="text-2xl font-semibold text-gray-700 mb-4">Constitutional Assembly</h3>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <p className="text-gray-700 mb-4">
            The Constituent Assembly of India was elected to write the Constitution of India. It was 
            formed in <span className="font-semibold">1946</span> following negotiations between Indian 
            leaders and members of the British Cabinet Mission.
          </p>
          <p className="text-gray-700 mb-4">
            The Assembly met for the first time on <span className="font-semibold">9 December 1946</span>, 
            with 207 members attending. Dr. Sachchidananda Sinha was the first president of the Constituent 
            Assembly. Later, Dr. Rajendra Prasad was elected its president.
          </p>
        </div>
        <div className="bg-amber-50 p-6 rounded-lg border border-amber-100">
          <h4 className="text-lg font-semibold text-amber-800 mb-3">Key Dates</h4>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span>First Meeting:</span>
              <span className="font-medium">9 Dec 1946</span>
            </li>
            <li className="flex justify-between">
              <span>Adoption:</span>
              <span className="font-medium">26 Nov 1949</span>
            </li>
            <li className="flex justify-between">
              <span>Enforcement:</span>
              <span className="font-medium">26 Jan 1950</span>
            </li>
            <li className="flex justify-between">
              <span>Time Taken:</span>
              <span className="font-medium">2 years, 11 months, 18 days</span>
            </li>
            <li className="flex justify-between">
              <span>Total Sessions:</span>
              <span className="font-medium">11 sessions</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div className="mb-12">
      <h3 className="text-2xl font-semibold text-gray-700 mb-4">Drafting Committee</h3>
      <p className="text-gray-700 mb-6">
        The Drafting Committee was set up on <span className="font-semibold">29 August 1947</span> under 
        the chairmanship of Dr. B.R. Ambedkar. It had seven members who were responsible for preparing 
        the draft of the Constitution.
      </p>
      <div className="bg-green-50 p-6 rounded-lg border border-green-100">
        <h4 className="text-lg font-semibold text-green-800 mb-3">Drafting Process</h4>
        <p className="text-gray-700 mb-3">
          The committee studied the constitutions of about <span className="font-semibold">60 countries</span> 
          and prepared a draft constitution which was published in <span className="font-semibold">February 1948</span>. 
          The people of India were given <span className="font-semibold">eight months</span> to discuss the draft.
        </p>
        <p className="text-gray-700">
          After more than <span className="font-semibold">2000 amendments</span> were considered, the Constitution 
          was adopted on <span className="font-semibold">26 November 1949</span> and signed by 284 members.
        </p>
      </div>
    </div>

    <div>
      <h3 className="text-2xl font-semibold text-gray-700 mb-4">Influences</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { country: 'UK', features: 'Parliamentary system, Rule of Law' },
          { country: 'USA', features: 'Fundamental Rights, Judicial Review' },
          { country: 'Ireland', features: 'Directive Principles of State Policy' },
          { country: 'Germany', features: 'Emergency Provisions' },
          { country: 'Canada', features: 'Federal System' },
          { country: 'Australia', features: 'Concurrent List' },
          { country: 'South Africa', features: 'Amendment Procedure' },
          { country: 'Japan', features: 'Procedure Established by Law' },
        ].map((source, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <h4 className="font-medium text-gray-800">{source.country}</h4>
            <p className="text-sm text-gray-600 mt-1">{source.features}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ContributorsSection = () => (
  <div className="p-8">
    <h2 className="text-3xl font-bold text-gray-800 mb-6">Key Contributors</h2>
    <p className="text-gray-700 mb-8 max-w-3xl">
      The Indian Constitution was shaped by the collective wisdom of numerous leaders and legal experts. 
      Here are some of the most prominent contributors:
    </p>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ContributorCard
        name="Dr. B.R. Ambedkar"
        role="Chairman of Drafting Committee"
        contribution="Principal architect of the Constitution"
        image='https://imgs.search.brave.com/AaTvaCIj5vMEQ6P2ZPORApuKKd7xCkKA9lJKcsrZLdw/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy9j/L2MzL0RyLl9CaGlt/cmFvX0FtYmVka2Fy/LmpwZw'
      />
      <ContributorCard
        name="Jawaharlal Nehru"
        role="Prime Minister"
        contribution="Moved Objectives Resolution"
        image="https://imgs.search.brave.com/4igWpMcGzVl2FDp3yWLCwjis5K-OlJDnZiqihbgTics/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvOTYx/ODAzODM0L3Bob3Rv/L2phd2FoYXJsYWwt/bmVocnUtcHJpbWUt/bWluaXN0ZXItb2Yt/aW5kaWEtMTk0Ny5q/cGc_cz02MTJ4NjEy/Jnc9MCZrPTIwJmM9/MGJqLVowS194X1Rw/NmI5aEdrRl80Qmt6/MEZfNzBORzg4ekFE/UHJpSlpRUT0"
      />
      <ContributorCard
        name="Rajendra Prasad"
        role="President of Constituent Assembly"
        contribution="Presided over constitution-making"
        image="https://imgs.search.brave.com/t8gHesCaQmyCXYlLp8pLD5zfqfT1-0bEfx6NcIuPCu4/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNzkw/NDE1ODAvcGhvdG8v/MTk1MC1kci1yYWpl/bmRyYS1wcmFzYWQt/dGhlLXByZXNpZGVu/dC1vZi1pbmRpYS1w/b3J0cmFpdC5qcGc_/cz02MTJ4NjEyJnc9/MCZrPTIwJmM9MDlf/S2plLTBiVmZyekRI/WnFuYjJ3dDlDV0k2/VlpsNnAxYlkxanZ0/WGxBWT0"
      />
      <ContributorCard
        name="Sardar Vallabhbhai Patel"
        role="Chairman of Provincial Constitution Committee"
        contribution="Integrated princely states"
        image="https://imgs.search.brave.com/9quxDxpUKIIxBXYEgz6swjT3sINZeIWo7-MOqerOJ0g/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzEzLzA2LzAwLzAy/LzM2MF9GXzEzMDYw/MDAyMjNfendWd0lB/YWtNdHdGT3kwTHZQ/bGhHd2RhMlE5eGVk/VHIuanBn"
      />
      <ContributorCard
        name="B.N. Rau"
        role="Constitutional Advisor"
        contribution="Prepared initial draft"
        image="https://imgs.search.brave.com/LJ1KUoFGO3zeQjwJUHsFG4v-o97VCu9ust13WEj3CtY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuaGluZHVzdGFu/dGltZXMuY29tL3Jm/L2ltYWdlX3NpemVf/NjMweDM1NC9IVC9w/Mi8yMDIwLzAxLzIx/L1BpY3R1cmVzL184/NDBkNTg5OC0zYmUy/LTExZWEtYmZiZC1m/ODEyZjMzYWM0NmYu/anBn"
      />
      <ContributorCard
        name="K.M. Munshi"
        role="Member of Drafting Committee"
        contribution="Key role in fundamental rights"
        image="https://imgs.search.brave.com/t4Mez9qpPMR-wZTB54EpU05NQ0DjU6tvwyNcTr68QC0/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9jb3Zl/cnMub3BlbmxpYnJh/cnkub3JnL2EvaWQv/NjU5NDAyOS1NLmpw/Zw"
      />
    </div>
  </div>
);

const AmendmentsSection = () => {
  const amendmentData = [
    { year: '1951', count: 1, important: 'First Amendment' },
    { year: '1971', count: 24, important: 'Golaknath case response' },
    { year: '1976', count: 42, important: 'Emergency amendments' },
    { year: '1985', count: 52, important: 'Anti-defection law' },
    { year: '1992', count: 73, important: 'Panchayati Raj' },
    { year: '2002', count: 86, important: 'Education as right' },
    { year: '2016', count: 101, important: 'GST' },
    { year: '2019', count: 103, important: 'Jammu & Kashmir' },
    { year: '2021', count: 105, important: 'Latest amendment' },
  ];

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Constitutional Amendments</h2>
      
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <p className="text-gray-700 mb-4">
            The Constitution of India has been amended <span className="font-semibold">105 times</span> 
            as of 2021. The amendment process is laid out in <span className="font-semibold">Article 368</span>.
          </p>
          <p className="text-gray-700 mb-4">
            Amendments require different levels of approval depending on the nature of the amendment:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Simple majority of Parliament</li>
            <li>Special majority (2/3 of members present and voting + majority of total membership)</li>
            <li>Special majority plus ratification by half of state legislatures</li>
          </ul>
        </div>
        <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
          <h3 className="text-xl font-semibold text-purple-800 mb-4">Amendment Types</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium">By Simple Majority</span>
                <span className="font-medium">~30%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-purple-400 h-2.5 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium">By Special Majority</span>
                <span className="font-medium">~65%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-medium">With State Ratification</span>
                <span className="font-medium">~5%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-purple-800 h-2.5 rounded-full" style={{ width: '5%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Amendment Timeline</h3>
        <div className="h-96">
          <AmendmentChart data={amendmentData} />
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Important Amendments</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amendment</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Significance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {amendmentData.filter(a => a.important).map((amend, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 whitespace-nowrap font-medium">{amend.year}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{amend.count}th Amendment</td>
                  <td className="px-4 py-3">{amend.important}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const FactsSection = () => (
  <div className="p-8">
    <h2 className="text-3xl font-bold text-gray-800 mb-6">Interesting Facts</h2>
    
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Document Details</h3>
        <div className="space-y-4">
          <FactCard 
            title="Length" 
            value="Longest in the world" 
            description="Originally had 395 articles in 22 parts and 8 schedules"
            
          />
          <FactCard 
            title="Handwritten" 
            value="Calligraphy by Prem Behari Narain Raizada" 
            description="Each page beautified by artists from Shantiniketan"
          />
          <FactCard 
            title="Languages" 
            value="Hindi and English" 
            description="Original copies handwritten in both languages"
          />
          <FactCard 
            title="Signatures" 
            value="284 members signed" 
            description="Signed on 24 January 1950, came into force two days later"
          />
        </div>
      </div>
      
      <div>
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Unique Aspects</h3>
        <div className="space-y-4">
          <FactCard 
            title="Preamble" 
            value="Inspired by US Constitution" 
            description="'We the People' emphasizes popular sovereignty"
          />
          <FactCard 
            title="Fundamental Duties" 
            value="Added in 1976" 
            description="42nd Amendment introduced 10 fundamental duties"
          />
          <FactCard 
            title="Single Citizenship" 
            value="Unlike USA" 
            description="All Indians are citizens of India only, not states"
          />
          <FactCard 
            title="Living Document" 
            value="105 amendments" 
            description="Flexible enough to adapt to changing needs"
          />
        </div>
      </div>
    </div>
    
    <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
      <h3 className="text-xl font-semibold text-yellow-800 mb-3">Preservation</h3>
      <p className="text-gray-700">
        The original copies of the Indian Constitution are kept in special helium-filled cases in the 
        Library of the Parliament of India. The calligraphy was done by Prem Behari Narain Raizada, 
        and the artwork was done by artists from Shantiniketan including Nandalal Bose.
      </p>
    </div>
  </div>
);

const ContributorCard = ({ name, role, contribution, image }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <div className="h-48 bg-gray-200 overflow-hidden">
      <img 
        src={`${image}`} 
        alt={name} 
        className="w-full h-full object-contain bg-black/60"
      />
    </div>
    <div className="p-4">
      <h3 className="text-xl font-bold text-gray-800">{name}</h3>
      <p className="text-sm text-blue-600 mb-2">{role}</p>
      <p className="text-gray-700">{contribution}</p>
    </div>
  </div>
);

const FactCard = ({ title, value, description }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
    <h4 className="font-medium text-gray-800">{title}</h4>
    <p className="text-blue-600 font-semibold mt-1">{value}</p>
    <p className="text-sm text-gray-600 mt-2">{description}</p>
  </div>
);

export const Timeline = ({ children }) => (
  <div className="relative pl-8 sm:pl-32 py-6 group">
    <div className="absolute left-0 sm:left-20 h-full w-0.5 bg-blue-200"></div>
    {children}
  </div>
);

export const TimelineItem = ({ date, title, description }) => (
  <div className="relative pb-8 group-last:pb-0">
    <div className="absolute -left-2 sm:left-18 h-4 w-4 rounded-full bg-blue-600 border-4 border-blue-100"></div>
    <div className="sm:absolute left-0 sm:w-24 text-sm sm:text-right pr-4 text-gray-500">{date}</div>
    <div className="sm:ml-32">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AmendmentChart = ({ data }) => {
  const chartData = {
    labels: data.map(d => d.year),
    datasets: [
      {
        label: 'Amendment Count',
        data: data.map(d => d.count),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        tension: 0.3,
        pointRadius: 5,
        pointHoverRadius: 7
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          afterLabel: function(context) {
            const index = context.dataIndex;
            return `Notable: ${data[index].important}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Amendment Number'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Year'
        }
      }
    }
  };

  return <Line data={chartData} options={options} />;
};

export const Constitution = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img 
          src={ConstitutionImage} 
          alt="Indian Constitution" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">The Constitution of India</h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Journey of the world's longest written constitution
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-around overflow-x-auto pb-2 mb-8">
          {['overview', 'making', 'contributors', 'amendments', 'facts'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-linear-to-t from-sky-500 to-indigo-500 text-white'
                  : ' bg-blue-200 text-gray-700 hover:bg-blue-500 transition-all duration-500 hover:text-white'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
          {activeTab === 'overview' && <OverviewSection />}
          {activeTab === 'making' && <MakingSection />}
          {activeTab === 'contributors' && <ContributorsSection />}
          {activeTab === 'amendments' && <AmendmentsSection />}
          {activeTab === 'facts' && <FactsSection />}
        </div>
      </div>
    </div>
  );
};
