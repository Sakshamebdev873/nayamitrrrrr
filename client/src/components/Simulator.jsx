import { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, Lock, CheckCircle2, XCircle, ChevronRight, Trophy, Star, FileWarning, Download, Clock, HardDrive, Server, Shield, FileSearch } from "lucide-react";
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

// ========== THREAT SIMULATOR COMPONENT ==========
export const ThreatSimulator = () => {
  const [activeScenario, setActiveScenario] = useState(null);
  const [userProgress, setUserProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [userActions, setUserActions] = useState([]);
  const [currentStepFeedback, setCurrentStepFeedback] = useState('');

  // Simulation scenarios
  const scenarios = [
    {
      id: 1,
      title: "Phishing Email",
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
      difficulty: "Beginner",
      description: "Identify malicious emails trying to steal credentials",
      steps: [
        {
          type: "email",
          content: {
            subject: "Urgent: Your account will be suspended!",
            sender: "support@yourbank.com",
            body: "Click below to verify your account immediately or it will be closed.",
            link: "https://fake-bank-login.com"
          },
          correctAction: "report",
          hints: [
            "Check sender email for inconsistencies",
            "Hover over links before clicking",
            "Look for urgency/scare tactics"
          ]
        }
      ]
    },
    {
      id: 2,
      title: "Ransomware Attack",
      icon: <Lock className="w-5 h-5 text-red-400" />,
      difficulty: "Advanced",
      description: "Detect and respond to a multi-stage ransomware attack",
      steps: [
        {
          type: "download",
          content: {
            filename: "Invoice_Q3.exe",
            source: "accounting@supplier.net",
            size: "3.8MB",
            note: "You weren't expecting this file"
          },
          correctAction: "verify",
          hints: [
            "Unexpected .exe files are high risk",
            "Verify with sender through another channel",
            "Check file properties and digital signatures"
          ],
          feedback: {
            correct: "Good job verifying the suspicious file! This prevented the initial infection.",
            incorrect: "Executing unknown files can lead to ransomware installation."
          }
        },
        {
          type: "network",
          content: {
            alert: "Suspicious network activity detected",
            details: "Multiple encrypted connections to unknown IPs",
            destination: "185.143.223.47 (Russia)"
          },
          correctAction: "isolate",
          hints: [
            "Ransomware often communicates with C2 servers",
            "Unusual outbound traffic is a red flag",
            "Isolate affected systems immediately"
          ],
          feedback: {
            correct: "Correct! Isolating the system prevents lateral movement.",
            incorrect: "Allowing suspicious network traffic enables data exfiltration."
          }
        },
        {
          type: "encryption",
          content: {
            message: "Your files have been encrypted!",
            demand: "Pay 2 BTC within 48 hours to recover your data",
            extension: ".cryptolocker"
          },
          correctAction: "report",
          hints: [
            "Never pay ransoms - it funds criminal activity",
            "Report to IT security immediately",
            "Restore from backups if available"
          ],
          feedback: {
            correct: "Reporting to professionals is the right response.",
            incorrect: "Paying ransoms doesn't guarantee recovery and funds criminals."
          }
        }
      ]
    },
    {
      id: 3,
      title: "Supply Chain Attack",
      icon: <Server className="w-5 h-5 text-purple-400" />,
      difficulty: "Expert",
      description: "Identify compromised software updates",
      steps: [
        {
          type: "update",
          content: {
            software: "FinanceApp Pro",
            version: "2.3.8",
            publisher: "FinTech Solutions Inc",
            hash: "SHA256 mismatch detected"
          },
          correctAction: "quarantine",
          hints: [
            "Verify checksums before installing updates",
            "Only download from official sources",
            "Monitor for unusual post-installation behavior"
          ]
        }
      ]
    }
  ];

  // Start simulation
  const startScenario = (scenario) => {
    setActiveScenario(scenario);
    setIsRunning(true);
    setTimer(scenario.id === 2 ? 90 : 60); // More time for ransomware scenario
    setUserProgress(0);
    setShowResults(false);
    setScore(0);
    setUserActions([]);
    setCurrentStepFeedback('');
  };

  // Handle user action
  const handleUserAction = (action) => {
    if (!activeScenario) return;
    
    const currentStep = activeScenario.steps[userProgress];
    const isCorrect = action === currentStep.correctAction;
    const feedback = currentStep.feedback ? 
      (isCorrect ? currentStep.feedback.correct : currentStep.feedback.incorrect) : 
      (isCorrect ? 'Correct action!' : 'Incorrect choice');
    
    setCurrentStepFeedback(feedback);
    setUserActions(prev => [...prev, { step: userProgress, action, correct: isCorrect }]);
    
    if (isCorrect) {
      setScore(prev => prev + (10 * (activeScenario.difficulty === 'Beginner' ? 1 : 
                                activeScenario.difficulty === 'Intermediate' ? 1.5 : 
                                activeScenario.difficulty === 'Advanced' ? 2 : 2.5)));
    }
    
    setTimeout(() => {
      if (userProgress < activeScenario.steps.length - 1) {
        setUserProgress(prev => prev + 1);
        setCurrentStepFeedback('');
      } else {
        setIsRunning(false);
        setShowResults(true);
      }
    }, 1500);
  };

  // Timer logic
  useEffect(() => {
    let interval;
    if (isRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0 && isRunning) {
      setIsRunning(false);
      setShowResults(true);
    }
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  // Reset simulator
  const resetSimulator = () => {
    setActiveScenario(null);
    setShowResults(false);
    setScore(0);
    setUserActions([]);
  };

  // Calculate performance rating
  const getPerformanceRating = () => {
    const maxScore = activeScenario.steps.length * 10 * 
      (activeScenario.difficulty === 'Beginner' ? 1 : 
       activeScenario.difficulty === 'Intermediate' ? 1.5 : 
       activeScenario.difficulty === 'Advanced' ? 2 : 2.5);
    const percentage = (score / maxScore) * 100;
    
    if (percentage >= 90) return { text: "Expert Defender", color: "text-emerald-600", icon: <Trophy className="w-5 h-5" /> };
    if (percentage >= 70) return { text: "Skilled Protector", color: "text-blue-600", icon: <Shield className="w-5 h-5" /> };
    if (percentage >= 50) return { text: "Aware User", color: "text-amber-600", icon: <FileSearch className="w-5 h-5" /> };
    return { text: "Needs Improvement", color: "text-red-600", icon: <AlertTriangle className="w-5 h-5" /> };
  };

  return (
    <section className="w-full py-12 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg my-10">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10">
          <Badge variant="cyber" className="mb-4">
            <ShieldAlert className="w-4 h-4 mr-1" /> Interactive Training
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Cyber Threat Simulator
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Learn to defend against real-world attacks in this safe environment
          </p>
        </div>

        {/* Scenario Selection */}
        {!activeScenario && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {scenarios.map((scenario) => (
              <motion.div
                key={scenario.id}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white p-6 rounded-xl shadow-md border border-gray-200 cursor-pointer transition-all"
                onClick={() => startScenario(scenario)}
              >
                <div className="flex items-center gap-3 mb-3">
                  {scenario.icon}
                  <span className="font-semibold text-gray-900">{scenario.title}</span>
                  <span className={`ml-auto text-xs px-2 py-1 rounded-full ${
                    scenario.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                    scenario.difficulty === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
                    scenario.difficulty === 'Advanced' ? 'bg-amber-100 text-amber-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {scenario.difficulty}
                  </span>
                </div>
                <p className="text-gray-600 text-sm">{scenario.description}</p>
                <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                  Start challenge <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Active Simulation */}
        {activeScenario && !showResults && (
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  {activeScenario.icon}
                  {activeScenario.title}
                </h3>
                <div className="flex items-center gap-4">
                  <div className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <Clock className="w-4 h-4" /> <span className="text-gray-900">{timer}s</span>
                  </div>
                  <div className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <FileSearch className="w-4 h-4" /> <span className="text-gray-900">Step {userProgress + 1}/{activeScenario.steps.length}</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${((userProgress) / activeScenario.steps.length) * 100}%` }}
                ></div>
              </div>

              {/* Simulation Content */}
              <div className="border border-gray-200 rounded-lg p-4 mb-6">
                {activeScenario.steps[userProgress].type === "email" && (
                  <div className="email-simulation">
                    <div className="border-b pb-2 mb-3">
                      <p className="font-semibold">{activeScenario.steps[userProgress].content.subject}</p>
                      <p className="text-sm text-gray-500">From: {activeScenario.steps[userProgress].content.sender}</p>
                    </div>
                    <p className="mb-4">{activeScenario.steps[userProgress].content.body}</p>
                    <a 
                      href="#" 
                      className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      onClick={(e) => {
                        e.preventDefault();
                        handleUserAction("click");
                      }}
                    >
                      Verify Account
                    </a>
                  </div>
                )}

                {activeScenario.steps[userProgress].type === "download" && (
                  <div className="download-simulation space-y-4">
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <FileWarning className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-gray-900">Unexpected File Received</h4>
                          <p className="text-sm text-gray-600">{activeScenario.steps[userProgress].content.note}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <FileWarning className="w-6 h-6 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activeScenario.steps[userProgress].content.filename}</p>
                        <p className="text-sm text-gray-500">
                          {activeScenario.steps[userProgress].content.source} • {activeScenario.steps[userProgress].content.size}
                        </p>
                      </div>
                      <div className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                        High Risk
                      </div>
                    </div>
                  </div>
                )}

                {activeScenario.steps[userProgress].type === "network" && (
                  <div className="network-simulation space-y-4">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-gray-900">{activeScenario.steps[userProgress].content.alert}</h4>
                          <p className="text-sm text-gray-600 mt-1">{activeScenario.steps[userProgress].content.details}</p>
                          <p className="text-xs text-gray-500 mt-2">Destination: {activeScenario.steps[userProgress].content.destination}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <HardDrive className="w-5 h-5 text-gray-500" />
                        <span className="text-sm font-medium">Workstation-12 (Finance Dept)</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeScenario.steps[userProgress].type === "encryption" && (
                  <div className="encryption-simulation">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Lock className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-gray-900">{activeScenario.steps[userProgress].content.message}</h4>
                          <p className="text-sm text-gray-600 mt-2">{activeScenario.steps[userProgress].content.demand}</p>
                          <div className="mt-3 p-2 bg-white rounded border border-gray-200">
                            <p className="text-xs font-mono text-gray-600">
                              All your files have been encrypted with extension: <span className="font-bold">{activeScenario.steps[userProgress].content.extension}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeScenario.steps[userProgress].type === "update" && (
                  <div className="update-simulation space-y-4">
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Server className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-gray-900">Software Update Available</h4>
                          <p className="text-sm text-gray-600 mt-1">{activeScenario.steps[userProgress].content.software} v{activeScenario.steps[userProgress].content.version}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Publisher:</span>
                          <span className="text-sm font-medium">{activeScenario.steps[userProgress].content.publisher}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Integrity Check:</span>
                          <span className="text-sm font-medium text-red-600">{activeScenario.steps[userProgress].content.hash}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Feedback message */}
              {currentStepFeedback && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 mb-4 rounded-lg text-sm ${
                    currentStepFeedback.includes('Correct') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}
                >
                  {currentStepFeedback}
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-3">
                {activeScenario.steps[userProgress].correctAction === "delete" && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium flex items-center justify-center gap-2"
                      onClick={() => handleUserAction("ignore")}
                    >
                      <XCircle className="w-5 h-5" /> Ignore
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                      onClick={() => handleUserAction("report")}
                    >
                      <CheckCircle2 className="w-5 h-5" /> Report
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-amber-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                      onClick={() => handleUserAction("delete")}
                    >
                      <XCircle className="w-5 h-5" /> Delete
                    </motion.button>
                  </>
                )}
                
                {activeScenario.steps[userProgress].correctAction === "verify" && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium flex items-center justify-center gap-2"
                      onClick={() => handleUserAction("open")}
                    >
                      <Download className="w-5 h-5" /> Open
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                      onClick={() => handleUserAction("verify")}
                    >
                      <FileSearch className="w-5 h-5" /> Verify
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                      onClick={() => handleUserAction("delete")}
                    >
                      <XCircle className="w-5 h-5" /> Delete
                    </motion.button>
                  </>
                )}
                
                {activeScenario.steps[userProgress].correctAction === "isolate" && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium flex items-center justify-center gap-2"
                      onClick={() => handleUserAction("ignore")}
                    >
                      <XCircle className="w-5 h-5" /> Ignore
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                      onClick={() => handleUserAction("monitor")}
                    >
                      <Clock className="w-5 h-5" /> Monitor
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                      onClick={() => handleUserAction("isolate")}
                    >
                      <Shield className="w-5 h-5" /> Isolate
                    </motion.button>
                  </>
                )}
                
                {activeScenario.steps[userProgress].correctAction === "report" && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium flex items-center justify-center gap-2"
                      onClick={() => handleUserAction("ignore")}
                    >
                      <XCircle className="w-5 h-5" /> Ignore
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                      onClick={() => handleUserAction("report")}
                    >
                      <CheckCircle2 className="w-5 h-5" /> Report
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-amber-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                      onClick={() => handleUserAction("pay")}
                    >
                      <Lock className="w-5 h-5" /> Pay
                    </motion.button>
                  </>
                )}
                
                {activeScenario.steps[userProgress].correctAction === "quarantine" && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium flex items-center justify-center gap-2"
                      onClick={() => handleUserAction("install")}
                    >
                      <Download className="w-5 h-5" /> Install
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                      onClick={() => handleUserAction("verify")}
                    >
                      <FileSearch className="w-5 h-5" /> Verify
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                      onClick={() => handleUserAction("quarantine")}
                    >
                      <Shield className="w-5 h-5" /> Quarantine
                    </motion.button>
                  </>
                )}
              </div>

              {/* Hints (collapsible) */}
              <div className="mt-6">
                <details className="group">
                  <summary className="flex items-center gap-2 text-sm font-medium text-gray-600 cursor-pointer list-none">
                    <span>Need help? View hints</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-open:rotate-90" />
                  </summary>
                  <ul className="mt-2 pl-5 space-y-2 text-sm text-gray-600">
                    {activeScenario.steps[userProgress].hints.map((hint, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-blue-500">•</span> {hint}
                      </li>
                    ))}
                  </ul>
                </details>
              </div>
            </div>
          </div>
        )}

        {/* Results Screen */}
        {showResults && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-100 to-green-100 mb-4">
                    <Trophy className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Simulation Complete!
                  </h3>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className={`text-lg font-medium ${getPerformanceRating().color} flex items-center gap-1`}>
                      {getPerformanceRating().icon}
                      {getPerformanceRating().text}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="text-lg font-medium text-gray-900">
                      Score: {score}/{activeScenario.steps.length * 10 * 
                        (activeScenario.difficulty === 'Beginner' ? 1 : 
                        activeScenario.difficulty === 'Intermediate' ? 1.5 : 
                        activeScenario.difficulty === 'Advanced' ? 2 : 2.5)}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Performance Breakdown */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <FileSearch className="w-5 h-5 text-blue-500" />
                      Performance Breakdown
                    </h4>
                    <div className="space-y-4">
                      {activeScenario.steps.map((step, index) => {
                        const userAction = userActions.find(a => a.step === index);
                        return (
                          <div key={index} className="flex items-start gap-3">
                            <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                              userAction?.correct ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                            }`}>
                              {userAction?.correct ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                <XCircle className="w-4 h-4" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">Step {index + 1}: {step.type.replace(/([A-Z])/g, ' $1').trim()}</p>
                              <p className="text-sm text-gray-600">
                                {userAction?.correct ? 
                                  step.feedback?.correct || 'Correct action taken' : 
                                  step.feedback?.incorrect || 'Incorrect action taken'}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Key Takeaways */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                      <Star className="w-5 h-5 text-amber-500" />
                      Key Takeaways
                    </h4>
                    <ul className="space-y-3">
                      {activeScenario.steps.flatMap((step, index) => 
                        step.hints.map((hint, hintIndex) => (
                          <li key={`${index}-${hintIndex}`} className="flex items-start gap-2">
                            <Star className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{hint}</span>
                          </li>
                        ))
                      )}
                      <li className="flex items-start gap-2">
                        <Star className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">Always report suspicious activity to your security team</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Star className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">Maintain regular backups and test restoration procedures</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    {/* <ChevronRight className="w-5 h-5 text-blue-500" />
                    Recommended Next Steps */}
                  </h4>
                  <div className="flex justify-center items-center">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2  bg-blue-600 text-white rounded-lg font-medium"
                      onClick={resetSimulator}
                    >
                      Try Another Scenario
                    </motion.button>
                    {/* <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg font-medium"
                    >
                      View Detailed Report
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg font-medium"
                    >
                      Learn More About Ransomware
                    </motion.button> */}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </section>
  );
};