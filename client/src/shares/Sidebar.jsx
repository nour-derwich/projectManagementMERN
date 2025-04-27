import React from 'react';
import { 
  Home, BarChart2, Users, Settings, Bell, LogOut,
  User, Briefcase, Menu, X, ChevronDown
} from 'lucide-react';

// Sidebar Component
export const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navItems = [ ];

  return (
    <div className='headersj' >
      <div className="flex items-center justify-between   border-b border-indigo-800">
        <div className="flex items-center">
        
          <h1 >ProjectHub</h1>
        </div>
 
      </div>
      
{/*       <nav className="flex-1 overflow-y-auto py-4">
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
      </nav> */}
      
      <div className="p-4 border-t border-indigo-800">
     {/*    <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-medium">
            JS
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">John Smith</p>
            <p className="text-xs text-indigo-300">Project Manager</p>
          </div>
        </div> */}
        <a href="#" className='logout' >
          <LogOut size={18} className="mr-2" />
          Sign Out
        </a>
      </div>
    </div>
  );
};
