import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/cards';
import {
  Link as LinkIcon,
  Wrench,
  PlayCircle,
  Info,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { motion } from 'framer-motion';

const resources = [
  {
    name: 'Email Header Analyzer',
    description:
      'Detect phishing and spoofing attempts by examining the email routing path and authentication results.',
    link: 'https://tools.email-checker.net/email-header-analyzer',
    tutorial:
      'Copy the email header and paste it into the tool. Analyze the "Received" lines and look for SPF/DKIM alignment to verify sender legitimacy.',
    tip: 'Use this tool before clicking suspicious links in emails.',
  },
  {
    name: 'VirusTotal - Link & File Scanner',
    description:
      'Scan links and files using multiple antivirus engines to detect malware and phishing.',
    link: 'https://www.virustotal.com/',
    tutorial:
      'Paste a URL or upload a file. Check which engines flag it. Green means safe; red or yellow flags need caution.',
    tip: 'Always scan downloads from unknown sources.',
  },
  {
    name: 'Cybersecurity Awareness Quiz',
    description:
      'Assess your knowledge on secure practices using fun, scenario-based questions.',
    link: 'https://www.cybersecurityquiz.org/',
    tutorial:
      'Answer questions based on common cyberattack scenarios. Each correct answer gives tips to enhance your safety.',
    tip: 'Retake monthly to stay updated with evolving threats.',
  },
  {
    name: 'Have I Been Pwned - Data Breach Checker',
    description:
      'Check if your personal data has been exposed in past security breaches.',
    link: 'https://haveibeenpwned.com/',
    tutorial:
      'Enter your email or username. Review breaches and follow guidance to change passwords or enable 2FA.',
    tip: 'Set alerts to get notified of future breaches involving your email.',
  },
];

export function ToolsAndResources() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-xl">
      {resources.map((tool, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.03 }}
          className="transition-shadow hover:shadow-xl rounded-xl"
        >
          <Card className="border border-indigo-200">
            <CardHeader
              onClick={() =>
                setActiveIndex(index === activeIndex ? null : index)
              }
              className="cursor-pointer"
            >
              <CardTitle className="text-xl font-semibold text-indigo-700 flex items-center gap-2">
                <Wrench className="w-5 h-5" />
                {tool.name}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {tool.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <a
                href={tool.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline flex items-center gap-1.5"
              >
                <LinkIcon className="w-4 h-4" />
                Visit Tool
              </a>
              {activeIndex === index && (
                <motion.div
                  className="bg-white border border-indigo-100 p-4 rounded-lg text-sm text-gray-800 shadow-inner"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <PlayCircle className="w-4 h-4 text-indigo-500" />
                    <span className="font-semibold">How to Use</span>
                  </div>
                  <p>{tool.tutorial}</p>

                  <div className="flex items-center gap-2 mt-4 text-indigo-600">
                    <Info className="w-4 h-4" />
                    <em>{tool.tip}</em>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}


