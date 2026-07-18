// components/ui/Button.jsx
import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const Button = forwardRef(({ 
  children, 
  loading, 
  variant = 'primary', 
  size = 'default',
  className = '',
  ...props 
}, ref) => {

  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 active:scale-[0.985]";

  const variants = {
    primary: "bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/30",
    secondary: "bg-zinc-100 hover:bg-zinc-200 text-zinc-900",
    outline: "border border-zinc-300 hover:bg-zinc-50 text-zinc-700",
    ghost: "hover:bg-zinc-100 text-zinc-700",
  };

  const sizes = {
    default: "px-6 py-3 text-sm",
    lg: "px-8 py-3.5 text-base",
  };

  return (
    <button
      ref={ref}
      disabled={loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
      {children}
    </button>
  );
});

export default Button;