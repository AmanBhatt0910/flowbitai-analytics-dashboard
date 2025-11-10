'use client';

import React from 'react';
import { Bell, Settings, User, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function Header({ title, description, className }: HeaderProps) {
  return (
    <header className={cn('bg-white border-b border-gray-200 px-8 py-6', className)}>
      <div className="flex items-center justify-between">
        {/* Title Section */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>

        {/* Actions Section */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Search className="h-5 w-5 text-gray-600" />
          </button>

          {/* Notifications */}
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Settings */}
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Settings className="h-5 w-5 text-gray-600" />
          </button>

          {/* Divider */}
          <div className="h-8 w-px bg-gray-200"></div>

          {/* User Profile */}
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-medium text-gray-900">Aman Bhatt</p>
              <p className="text-xs text-gray-600">Intern</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}