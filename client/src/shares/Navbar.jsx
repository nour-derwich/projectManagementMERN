import React from 'react';
import { 
  Menu, Bell, ChevronDown
} from 'lucide-react';

// Navbar Component
export const Navbar = ({ toggleSidebar }) => {
  return null ;
  return (
    <div className="bg-white shadow-sm border-b border-gray-200 fixed top-0 right-0 left-0 z-20">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:justify-end">
          <button 
            onClick={toggleSidebar}
            className="md:hidden text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Menu size={20} />
          </button>
          
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-700 relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>
            
            <div className="relative">
              <button className="flex items-center text-sm text-gray-700 hover:text-gray-900">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium">
                  JS
                </div>
                <ChevronDown size={16} className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sidebar Overlay for mobile
export const SidebarOverlay = ({ isOpen, toggleSidebar }) => {
  return isOpen ? (
    <div 
      className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 md:hidden"
      onClick={toggleSidebar}
    />
  ) : null;
};