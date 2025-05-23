import React from "react";
import { motion } from "framer-motion";

// Motion-enhanced Card base style
const Card = React.forwardRef(({ className = "", children, ...props }, ref) => (
  <motion.div
    ref={ref}
    
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className={`rounded-3xl border border-gray-200 min-w-[100%] mx-10 bg-gradient-to-br from-white to-gray-50 text-zinc-900 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in ${className}`}
    {...props}
  >
    {children}
  </motion.div>
));
Card.displayName = "Card";

const Card1 = React.forwardRef(({ className = "", children, ...props }, ref) => (
  <motion.div
    ref={ref}
    
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className={`rounded-3xl border border-gray-200 max-w-[90%] mx-5 my-4 bg-gradient-to-br  transition-all duration-300 ease-in ${className}`}
    {...props}
  >
    {children}
  </motion.div>
));
Card1.displayName = "Card1";

// Enhanced CardHeader
const CardHeader = React.forwardRef(({ className = "", children, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex flex-col gap-2 p-6 border-b min-w-[100%] border-gray-200 bg-gray-50 ${className}`}
    {...props}
  >
    {children}
  </div>
));
CardHeader.displayName = "CardHeader";

// Enhanced CardTitle
const CardTitle = React.forwardRef(({ className = "", children, ...props }, ref) => (
  <h3
    ref={ref}
    className={`text-2xl font-extrabold leading-tight text-blue-600 tracking-wide ${className}`}
    {...props}
  >
    {children}
  </h3>
));
CardTitle.displayName = "CardTitle";

// Enhanced CardDescription
const CardDescription = React.forwardRef(({ className = "", children, ...props }, ref) => (
  <p
    ref={ref}
    className={`text-sm text-gray-500 ${className}`}
    {...props}
  >
    {children}
  </p>
));
CardDescription.displayName = "CardDescription";

// Enhanced CardContent
const CardContent = React.forwardRef(({ className = "", children, ...props }, ref) => (
  <div
    ref={ref}
    className={`p-6 text-zinc-700 leading-relaxed space-y-3 ${className}`}
    {...props}
  >
    {children}
  </div>
));
CardContent.displayName = "CardContent";

// Optional CardFooter for actions
const CardFooter = React.forwardRef(({ className = "", children, ...props }, ref) => (
  <div
    ref={ref}
    className={`px-6 py-4 bg-gray-100 border-t border-gray-200 flex items-center justify-end gap-2 ${className}`}
    {...props}
  >
    {children}
  </div>
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  Card1,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
