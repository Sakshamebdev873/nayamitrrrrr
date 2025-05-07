import React from "react";

const Badge = React.forwardRef(({ className = "", variant = "default", ...props }, ref) => {
  const baseClasses = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

  const variantClasses = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-300 text-black",
    ghost: "bg-transparent text-black hover:bg-gray-100",
    cyber: "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30 hover:text-red-300",
  };

  const finalClassName = `${baseClasses} ${variantClasses[variant] || variantClasses.default} ${className}`;

  return (
    <span ref={ref} className={finalClassName} {...props} />
  );
});
Badge.displayName = "Badge";

export { Badge };