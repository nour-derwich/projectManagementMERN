import React from 'react';
import { 
  Home, BarChart2, Users, Settings, Bell, LogOut,
  User, Briefcase, Menu, X, ChevronDown
} from 'lucide-react';

// Sidebar Component
export const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navItems = [
    { icon: <Home size={20} />, label: 'Dashboard', active: true },
    { icon: <Briefcase size={20} />, label: 'Projects', active: false },
    { icon: <BarChart2 size={20} />, label: 'Reports', active: false },
    { icon: <Users size={20} />, label: 'Team', active: false },
    { icon: <Settings size={20} />, label: 'Settings', active: false },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 bg-indigo-900 text-white transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-30 w-64 flex flex-col`}>
      <div className="flex items-center justify-between p-4 border-b border-indigo-800">
        <div className="flex items-center">
          <div className="bg-white rounded-lg p-1 mr-3">
            <Briefcase size={24} className="text-indigo-700" />
          </div>
          <h1 className="font-bold text-xl">ProjectHub</h1>
        </div>
        <button onClick={toggleSidebar} className="md:hidden text-indigo-300 hover:text-white">
          <X size={20} />
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul>
          {navItems.map((item, index) => (
            <li key={index}>
              <a 
                href="#" 
                className={`flex items-center px-6 py-3 text-sm ${item.active ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'} transition-colors`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-indigo-800">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-medium">
            JS
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">John Smith</p>
            <p className="text-xs text-indigo-300">Project Manager</p>
          </div>
        </div>
        <a href="#" className="mt-4 flex items-center text-indigo-200 hover:text-white text-sm py-2">
          <LogOut size={18} className="mr-2" />
          Sign Out
        </a>
      </div>
    </div>
  );
};
