'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounce?: number;
  disabled?: boolean;
}

export function SearchBar({
  value: controlledValue,
  onChange,
  placeholder = 'Search...',
  className,
  debounce = 300,
  disabled = false,
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(controlledValue ?? '');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  if (controlledValue !== undefined && controlledValue !== localValue) {
    setLocalValue(controlledValue);
  }

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        onChange(newValue);
      }, debounce);
    },
    [onChange, debounce]
  );

  const handleClear = useCallback(() => {
    setLocalValue('');
    onChange('');

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, [onChange]);

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />

      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
      />

      {localValue && !disabled && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}