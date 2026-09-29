import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
          {label && (
            <label className="text-sm font-medium text-slate-700">
              {label}
            </label>
          )}
          <input
            className={`px-3 py-2 border rounded-md outline-none transition-colors
              ${error ? 'border-red-500 focus:border-red-600' : 'border-slate-300 focus:border-blue-500'}
              ${className}`}
            {...props}
          />
          {error && (
            <span className="text-xs text-red-500">{error}</span>
          )}
        </div>
  )
}
