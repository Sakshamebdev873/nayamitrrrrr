import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Button as UIButton } from "@/components/ui/button";
import { Badge as UIBadge } from "@/components/ui/badge";

// Utility function
const cn = (...classes) => classes.filter(Boolean).join(' ');

// ✅ Renamed to avoid conflict
const AnimatedBadge = ({ className, variant = "default", ...props }) => {
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
      className={cn(baseClasses, variantClasses[variant] || variantClasses.default, className)}
      {...props}
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 400 }}
    />
  );
};

// ✅ Renamed to avoid conflict
const MotionButton = ({ label = "Check", onClick, disabled }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500 text-white font-semibold shadow-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:opacity-50"
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
  },
  {
    title: "💻 Two-Factor Authentication",
    content: "Two-factor authentication adds an extra layer of security. Always enable it wherever possible.",
    question: "Why should you enable two-factor authentication?",
    options: [
      "It makes login faster",
      "It adds an extra layer of security",
      "It’s required by some websites",
      "It’s a waste of time"
    ],
    answer: "It adds an extra layer of security",
  },
  {
    title: "🌐 Safe Browsing",
    content: "Use HTTPS websites and be cautious when downloading files. Only download from trusted sources.",
    question: "Which of the following is a sign that a website is secure?",
    options: [
      "The website has a padlock symbol in the address bar",
      "The website has no ads",
      "The website loads quickly",
      "The website is listed on Google"
    ],
    answer: "The website has a padlock symbol in the address bar",
  },
  {
    title: "🔒 Encryption",
    content: "Encryption is a way to secure your data by converting it into unreadable format, which can only be decrypted with a key.",
    question: "Why is encryption important for online communication?",
    options: [
      "It prevents data from being accessed by unauthorized users",
      "It makes the internet faster",
      "It stops hackers from creating new accounts",
      "It ensures emails arrive quickly"
    ],
    answer: "It prevents data from being accessed by unauthorized users",
  },
  {
    title: "💼 Work-from-Home Security",
    content: "When working remotely, ensure your network is secure and avoid using public Wi-Fi for sensitive tasks.",
    question: "What’s the best way to secure your Wi-Fi network at home?",
    options: [
      "Use a strong password and WPA3 encryption",
      "Leave it open for easier access",
      "Use the default password provided by the router",
      "Only allow access from one device"
    ],
    answer: "Use a strong password and WPA3 encryption",
  },
  {
    title: "📱 Mobile Security",
    content: "Mobile devices can be a target for malware and data theft. Always use a PIN and enable app permissions carefully.",
    question: "What is the best way to secure your smartphone?",
    options: [
      "Set a strong PIN or fingerprint lock",
      "Turn off the screen lock to make it easier to access",
      "Download apps from any source",
      "Share your phone password with trusted contacts"
    ],
    answer: "Set a strong PIN or fingerprint lock",
  },
  {
    title: "🛡️ Data Privacy",
    content: "Protect your personal information by controlling which data you share and being mindful of privacy settings.",
    question: "How can you protect your personal data on social media?",
    options: [
      "Share everything with everyone",
      "Use privacy settings to control who can see your posts",
      "Leave your account open for all to see",
      "Never post anything"
    ],
    answer: "Use privacy settings to control who can see your posts",
  },
  {
    title: "⚡ Cyber Threats Awareness",
    content: "Cyber threats are constantly evolving. Stay updated on the latest security news and implement the best practices.",
    question: "Which of the following is considered a cyber threat?",
    options: [
      "Phishing emails",
      "Downloading software from trusted sources",
      "Using a strong password",
      "Keeping software up-to-date"
    ],
    answer: "Phishing emails",
  }
];

export function Awareness() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const totalSteps = sections.length;

  const handleSubmit = () => {
    if (selectedOption === sections[currentStep].answer) {
      setIsCorrect(true);
      setTimeout(() => {
        const isLast = currentStep + 1 === totalSteps;
        if (isLast) setShowConfetti(true);
        setCurrentStep((prev) => prev + 1);
        setSelectedOption(null);
        setIsCorrect(null);
      }, 1000);
    } else {
      setIsCorrect(false);
    }
  };

  return (
    <div className="flex justify-center items-center  min-h-screen bg-gray-50">
  <div className="max-w-3xl  w-full p-6 space-y-8 relative">
    {showConfetti && <Confetti numberOfPieces={200} recycle={false} />}
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <h1 className="text-3xl font-bold text-cyan-600">🛡️ Cyber Awareness Quest</h1>
      <p className="text-muted-foreground mt-2">Learn. Answer. Unlock the next challenge!</p>
      <div className="w-full bg-gray-200 h-3 rounded-lg mt-4">
        <div
          className="h-3 rounded-lg bg-cyan-500 transition-all"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </motion.div>

    {sections.map((section, index) =>
      index === currentStep ? (
        <div className="flex justify-center items-center" >
          <AnimatePresence key={index}>
          <motion.div
            className="bg-white min-w-[90vw]  p-6 rounded-2xl shadow-2xl border border-blue-400 relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-blue-400 font-mono">
              {section.title}
            </h2>

            <p className="mb-4 text-gray-700">{section.content}</p>
            <p className="mb-2 font-semibold text-blue-400">{section.question}</p>

            <div className="space-y-3">
              {section.options.map((option, idx) => (
                <motion.div
                  key={idx}
                  className={`p-4 rounded-md cursor-pointer border transition-all duration-300 font-mono text-gray-800 relative ${
                    selectedOption === option
                      ? "bg-blue-100 border-blue-400"
                      : "hover:bg-blue-50 border-gray-300"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedOption(option)}
                >
                  {option}
                </motion.div>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-3">
              <motion.button
                className={`px-5 py-2 rounded-md font-bold font-mono transition duration-300 bg-blue-400 text-white hover:bg-blue-500 ${
                  !selectedOption ? "opacity-50 cursor-not-allowed" : ""
                }`}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={!selectedOption}
              >
                Submit
              </motion.button>

              {isCorrect === true && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 text-green-600 font-mono"
                >
                  <CheckCircle className="w-5 h-5" /> Correct! Unlocking next level...
                </motion.div>
              )}

              {isCorrect === false && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 text-red-500 font-mono"
                >
                  <XCircle className="w-5 h-5" /> Incorrect. Try again!
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
        </div>
      ) : index < currentStep ? (
      <div className="flex flex-col justify-center items-center" >
  <motion.div
          key={index}
          className="p-4 rounded-md border bg-blue-50 border-blue-300 text-blue-700 font-mono min-w-[90vw] "
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
        >
          ✅ Completed: <strong className="text-blue-500">{section.title}</strong>
        </motion.div>
      </div>
      ) : null
    )}

    {currentStep === sections.length && (
      <motion.div
        className="text-center p-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg mt-6"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
      >
        <h2 className="text-2xl font-bold">🎉 Congratulations!</h2>
        <p className="mt-2">You’ve completed the Cyber Awareness Challenge.</p>
      </motion.div>
    )}
  </div>
</div>

  );
}
