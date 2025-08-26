import React from 'react';
import { User, LogOut } from 'lucide-react';
import type { User as UserType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentUser: UserType;
  onLogout: () => void;
  title?: string;
}

export default function Layout({ children, currentUser, onLogout, title = "Care Management & Co." }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">{title}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-6 w-6 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{currentUser.name}</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}