import React from 'react';
import { 
  BarChart3, 
  Users, 
  FileText, 
  Activity, 
  UtensilsCrossed, 
  MessageSquare,
  Home
} from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'risk-checkup', label: 'Risk Checkup', icon: Activity },
  { id: 'reports', label: 'My Reports', icon: FileText },
  { id: 'diet-plan', label: 'Diet Plan', icon: UtensilsCrossed },
  { id: 'data-analysis', label: 'Data Analysis', icon: BarChart3 },
  { id: 'feedback', label: 'Feedback', icon: MessageSquare },
];

export default function Navigation({ currentPage, onPageChange }: NavigationProps) {
  return (
    <nav className="bg-white rounded-lg shadow-sm mb-6">
      <div className="px-4">
        <div className="flex space-x-1 overflow-x-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  currentPage === item.id
                    ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}