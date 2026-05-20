"use client";

import React from "react";

type InputProps =
  React.InputHTMLAttributes<HTMLInputElement> & {
    error?: string;
  };

export default function Input({
  type = "text",
  error,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="space-y-2">

      <input
        type={type}
        {...props}
        className={`
          w-full
          p-3
          rounded-md
          bg-[#0f1115]
          border
          text-white
          placeholder-gray-500
          outline-none
          transition-all

          ${
            error
              ? "border-red-500 focus:ring-red-500/30"
              : "border-white/10 focus:border-[#C7962D] focus:ring-[#C7962D]/40"
          }

          focus:ring-1

          ${className}
        `}
      />

      {error && (
        <p className="text-sm text-red-400">
          {error}
        </p>
      )}

    </div>
  );
}