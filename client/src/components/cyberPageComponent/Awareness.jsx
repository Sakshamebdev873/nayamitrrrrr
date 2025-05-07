import React, { useState } from 'react';
import { forwardRef } from 'react';

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
import { motion } from 'framer-motion';

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


const Button = ({ label = "Check", onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500 text-white font-semibold shadow-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
    >
      <AlertTriangle className="w-5 h-5" />
      {label}
    </motion.button>
  );
};


const sections = [
  {
    title: "🔐 Strong Passwords",
    content: "Use a mix of uppercase, lowercase, numbers, and symbols. Avoid using common words or birthdays.",
    question: "Which of the following is a strong password?",
    options: ["password123", "qwerty", "M$7vR@2025", "john123"],
    answer: "M$7vR@2025",
  },
  {
    title: "🎣 Phishing Attacks",
    content: "Phishing is a method used to trick you into giving up sensitive info. Always verify links and senders.",
    question: "Which email is likely a phishing attempt?",
    options: [
      "support@yourbank.com",
      "security@paypal.com",
      "clickme@freemoney.ru",
      "info@university.edu"
    ],
    answer: "clickme@freemoney.ru",
  },
  {
    title: "🧠 Social Engineering",
    content: "Hackers manipulate human psychology to gain access. Never share OTPs or passwords—even with 'official' callers.",
    question: "What should you do if someone claiming to be IT support asks for your password?",
    options: [
      "Share if they sound convincing",
      "Refuse and report to IT",
      "Say it’s on a sticky note",
      "Ignore the question"
    ],
    answer: "Refuse and report to IT",
  }
];

export function Awareness() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const handleSubmit = () => {
    if (selectedOption === sections[currentStep].answer) {
      setIsCorrect(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      }, 1000);
    } else {
      setIsCorrect(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold">🛡️ Cyber Awareness Quest</h1>
        <p className="text-muted-foreground mt-2">Learn. Answer. Unlock the next challenge!</p>
      </motion.div>

      {sections.map((section, index) =>
        index === currentStep ? (
          <motion.div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
            <p className="mb-4 text-gray-700">{section.content}</p>
            <p className="mb-2 font-medium">{section.question}</p>
            <div className="space-y-2">
              {section.options.map((option, idx) => (
                <div
                  key={idx}
                  className={`p-2 border rounded-lg cursor-pointer transition ${
                    selectedOption === option ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedOption(option)}
                >
                  {option}
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button onClick={handleSubmit} disabled={!selectedOption}>
                Submit
              </Button>
              {isCorrect === true && (
                <Badge variant="cyber" className="ml-3">✅ Correct! Unlocking next level...</Badge>
              )}
              {isCorrect === false && (
                <Badge variant="destructive" className="ml-3">❌ Try again!</Badge>
              )}
            </div>
          </motion.div>
        ) : (
          index < currentStep && (
            <motion.div
              key={index}
              className="p-4 rounded-md border bg-green-50 border-green-300"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
            >
              ✅ Completed: <strong>{section.title}</strong>
            </motion.div>
          )
        )
      )}

      {currentStep === sections.length && (
        <motion.div
          className="text-center p-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
        >
          <h2 className="text-2xl font-bold">🎉 Congratulations!</h2>
          <p className="mt-2">You’ve completed the Cyber Awareness Challenge.</p>
        </motion.div>
      )}
    </div>
  );
}
