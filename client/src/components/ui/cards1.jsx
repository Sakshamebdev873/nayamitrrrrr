import React from 'react';
import { motion } from 'framer-motion';

// Utility for combining class names
function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

// Re-styled Card component
const Card = ({ className, children, ...props }) => (
  <motion.div
    className={cn(
      "bg-white/90 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg transition-all duration-300",
      "hover:shadow-2xl hover:scale-[1.02] hover:border-blue-300",
      "dark:bg-slate-800/90 dark:border-slate-600 dark:hover:border-blue-400",
      className
    )}
    whileHover={{ scale: 1.02 }}
    {...props}
  >
    {children}
  </motion.div>
);

// Re-styled CardHeader component
const CardHeader = ({ className, children, ...props }) => (
  <div className={cn("p-6 space-y-2 border-b border-slate-200 dark:border-slate-700", className)} {...props}>
    {children}
  </div>
);

// Re-styled CardTitle component
const CardTitle = ({ className, children, ...props }) => (
  <h3
    className={cn(
      "text-2xl font-bold text-blue-800 dark:text-blue-200 tracking-tight",
      className
    )}
    {...props}
  >
    {children}
  </h3>
);

// Re-styled CardDescription component
const CardDescription = ({ className, children, ...props }) => (
  <p
    className={cn(
      "text-gray-600 dark:text-gray-300 text-sm leading-relaxed",
      className
    )}
    {...props}
  >
    {children}
  </p>
);

// Re-styled CardContent component
const CardContent = ({ className, children, ...props }) => (
  <div className={cn("p-6", className)} {...props}>
    {children}
  </div>
);

export { Card, CardHeader, CardTitle, CardDescription, CardContent };
