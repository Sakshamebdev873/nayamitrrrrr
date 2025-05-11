import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChild, FaUsers, FaFemale, FaHandHoldingHeart, FaPeopleCarry } from 'react-icons/fa';

import { Phone, ShieldCheck, Mail, Globe, AlertTriangle } from 'lucide-react';

function SafetyPlainPopup({ onClose }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, width: '100%', height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div style={{
        backgroundColor: '#fefefe',
        padding: '2rem',
        borderRadius: '10px',
        width: '90%',
        maxWidth: '600px',
        position: 'relative',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
        fontFamily: 'Arial, sans-serif',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute',
          top: '10px',
          right: '15px',
          background: 'transparent',
          border: 'none',
          fontSize: '1.8rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          color: '#444'
        }}>×</button>

        <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>🚨 Emergency Helplines</h2>
        <ul style={{ lineHeight: '1.8', paddingLeft: '1rem' }}>
          <li><strong>Police:</strong> 100</li>
          <li><strong>Women Helpline:</strong> 1091</li>
          <li><strong>Childline:</strong> 1098</li>
          <li><strong>Senior Citizens:</strong> 14567</li>
          <li><strong>National Emergency:</strong> 112</li>
          <li><strong>Cyber Crime:</strong> 1930</li>
          <li><strong>Mental Health (Kiran):</strong> 1800-599-0019</li>
        </ul>

        <h3 style={{ marginTop: '1.5rem' }} className='font-xl font-bold font-mono'>🌐 Important Web Links</h3>
        <ul style={{ lineHeight: '1.8', paddingLeft: '1rem'  }} >
          <li className='text-blue-700 hover:underline'><a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" >Cyber Crime Reporting</a></li>
          <li className='text-blue-700 hover:underline'><a href="http://ncw.nic.in" target="_blank" rel="noopener noreferrer" >National Commission for Women</a></li>
          <li className='text-blue-700 hover:underline'><a href="https://www.childlineindia.org" target="_blank" rel="noopener noreferrer">Childline India Foundation</a></li>
          <li className='text-blue-700 hover:underline'><a href="https://nhrc.nic.in/complaints" target="_blank" rel="noopener noreferrer">Human Rights Complaint</a></li>
          <li className='text-blue-700 hover:underline'><a href="https://www.mha.gov.in" target="_blank" rel="noopener noreferrer">Ministry of Home Affairs</a></li>
          <li className='text-blue-700 hover:underline'><a href="https://consumerhelpline.gov.in" target="_blank" rel="noopener noreferrer">Consumer Complaints</a></li>
        </ul>
      </div>
    </div>
  );
}



const safetyData = [
  {
    key: "women",
    link: 'http://ncw.nic.in',
    title: "Women's Safety",
    tips: [
      "Avoid isolated areas at night.",
      "Use verified ride-sharing apps with tracking.",
      "Carry a personal safety alarm or pepper spray.",
      "Keep emergency contacts on speed dial.",
      "Be aware of surroundings and trust your instincts."
    ],
    helpline:1091,
    icon: <FaFemale className="text-pink-500 text-3xl" />
  },
  {
    key: "children",
    link: 'http://ncw.nic.in',
    title: "Child Safety",
    tips: [
      "Teach children about 'stranger danger'.",
      "Monitor internet usage and parental controls.",
      "Ensure safe pickup and drop from school.",
      "Educate about emergency contact numbers.",
      "Use child locks and safety gates at home."
    ],
    helpline:1098,
    icon: <FaChild className="text-yellow-500 text-3xl" />
  },
  {
    key: "elderly",
    link: 'http://ncw.nic.in',
    title: "Elderly Safety",
    tips: [
      "Install handrails and non-slip mats at home.",
      "Ensure regular medical check-ups.",
      "Avoid keeping large cash at home.",
      "Have emergency numbers nearby.",
      "Educate on fraud/scam awareness."
    ],
    helpline:14567,
    icon: <FaHandHoldingHeart className="text-green-600 text-3xl" />
  },
  {
    key: "allGenders",
    link: 'http://ncw.nic.in',
    title: "General Safety for All Genders",
    tips: [
      "Stay informed about local safety alerts.",
      "Practice digital safety and privacy online.",
      "Know self-defense basics.",
      "Report harassment and abuse immediately.",
      "Be respectful and promote inclusivity."
    ],
    helpline:112,
    icon: <FaUsers className="text-blue-500 text-3xl" />
  },
  {
    key: "communities",
    link: 'http://ncw.nic.in',
    title: "Ethnic Communities",
    tips: [
      "Report discrimination or hate speech promptly.",
      "Participate in local community support groups.",
      "Educate children about their rights.",
      "Access legal support if treated unfairly.",
      "Preserve cultural identity with confidence."
    ],
    helpline:`011-24364271`,
    icon: <FaPeopleCarry className="text-purple-600 text-3xl" />
  }
];

function SafetyCard({ title, icon, tips, helpline, link, isOpen, onToggle }) {
  return (
    <div
      className="bg-white rounded-xl shadow-lg p-5 hover:shadow-xl cursor-pointer transition"
      onClick={onToggle}
    >
      <div className="flex items-center gap-4 mb-2">
        {icon}
        <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
      </div>

      <div className='flex justify-end mr-5'>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-blue-900 text-sm hover:underline"
        >
          Go visit
        </a>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            className="mt-3 space-y-2 text-sm text-gray-600 list-disc list-inside"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
          >
            {tips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
            <div className='flex justify-end'>
              <h3 className='font-bold font-mono'>Helpline: {helpline}</h3>
            </div>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SafetyHub() {
  const [showPopup, setShowPopup] = useState(false);
  const [openCardIndex, setOpenCardIndex] = useState(null); // <-- New state

  return (
    <>
      <div className='relative h-[800px]'>
        <div className="p-6 max-w-6xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-center text-blue-800 mb-10">Safety Hub</h1>

          <div className='flex justify-between mx-10'>
            <div className='flex flex-col justify-start'>
              <h1 className='text-2xl font-bold font-serif mb-5'>Quick Tips for Everyone</h1>
              <ul className='list-disc list-inside space-y-3'>
                <li>Keep emergency contacts on speed dial.</li>
                <li>Share your live location with trusted contacts while traveling alone.</li>
                <li>Stay updated on new scams via government or verified channels.</li>
              </ul>

              <button
                className='bg-red-700 text-white px-1 py-2 font-bold max-w-[50%] rounded-xl hover:bg-red-500 transition-all duration-300 scale-105 m-5'
                onClick={() => setShowPopup(true)}
              >
                <Phone className='mr-3 inline-block' />Emergency Contacts
              </button>

              {showPopup && <SafetyPlainPopup onClose={() => setShowPopup(false)} />}
            </div>
          </div>

          <div className="flex flex-col justify-end max-w-[40%] gap-6 absolute right-5 top-10">
            {safetyData.map((card, index) => (
              <SafetyCard
                key={card.key}
                {...card}
                isOpen={openCardIndex === index}
                onToggle={() => setOpenCardIndex(openCardIndex === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
