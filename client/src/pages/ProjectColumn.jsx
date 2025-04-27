import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import ProjectCard from './ProjectCard';
import { AlertTriangle, ChevronDown, MoreHorizontal, PlusCircle } from 'lucide-react';

// Define item types for drag and drop
const ItemTypes = {
  CARD: 'card'
};

const ProjectColumn = ({ 
  title, 
  projects, 
  icon, 
  status, 
  color, 
  onMoveCard, 
  onStatusChange, 
  onRemove,
  darkMode = false
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  
  // Set up drop target
  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop: (item) => {
      if (item.status !== status) {
        onMoveCard(item.id, status);
      }
      return { status };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  // Calculate column statistics
  const totalProjects = projects.length;
  const overdueProjects = projects.filter(p => {
    const now = new Date();
    const due = new Date(p.dueDate);
    return now > due;
  }).length;

  // Get background color based on status and dark mode
  const getBgColor = () => {
    if (darkMode) {
      return isOver ? 'bg-gray-700' : 'bg-gray-800';
    }
    return isOver ? 'bg-gray-50' : 'bg-white';
  };

  // Get card container background
  const getCardsBgColor = () => {
    if (darkMode) {
      return isOver ? 'bg-gray-700' : 'bg-gray-800';
    }
    return isOver ? 'bg-gray-50' : 'bg-white';
  };

  // Get border color
  const getBorderColor = () => {
    if (darkMode) {
      return 'border-gray-700';
    }
    return 'border-gray-100';
  };

  // Calculate a faded version of the status color for the background
  const getStatusBgColor = () => {
    if (status === 'To Do') {
      return darkMode ? 'bg-blue-900/30' : 'bg-blue-50';
    } else if (status === 'In Progress') {
      return darkMode ? 'bg-yellow-900/30' : 'bg-yellow-50';
    } else {
      return darkMode ? 'bg-green-900/30' : 'bg-green-50';
    }
  };

  // Get appropriate text color based on dark mode
  const getTextColor = () => {
    return darkMode ? 'text-white' : 'text-gray-800';
  };

  return (
    <div
      ref={drop}
      className={`rounded-lg shadow-sm border ${getBorderColor()} ${getBgColor()} transition-all duration-200 ${
        isOver ? 'ring-2 ring-indigo-300 transform scale-[1.01]' : ''
      }  single_column`}
    >
      <div className={`p-4 border-b ${getBorderColor()}  `}>
        <div className="k_header">
          <div className="tit ">
       
            <div className={`p-2 rounded-lg ${getStatusBgColor()}`}>
              {React.cloneElement(icon, { className: `${color}` })}
            </div>
            <h2 className={`text-lg font-semibold ${getTextColor()} ml-3`}>{title} </h2>
     
         
          </div>
          
       
          
     

<div>
            
            <span className={`ml-2 ${color} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
            {totalProjects}
          </span>
          
          {overdueProjects > 0 && status !== 'Completed' && (
            <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full flex items-center">
              <AlertTriangle size={12} className="mr-1" />
              {overdueProjects} overdue
            </span>
          )} 
          
          <button 
              onClick={() => setCollapsed(!collapsed)}
              className={`p-1.5 rounded-full ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'} transition-colors`}
            >
              <ChevronDown size={16} className={`transform transition-transform ${collapsed ? 'rotate-180' : ''}`} />
            </button> </div>
        </div>
        
        {/* Column progress indicator */}
        {status !== 'Completed' && totalProjects > 0 && (
          <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className={status === 'To Do' ? 'bg-blue-600' : 'bg-yellow-500'} 
              style={{ width: `${Math.max(0, 100 - (overdueProjects / totalProjects * 100))}%`, height: '6px', borderRadius: '9999px' }}
            ></div>
          </div>
        )}
      </div>
      
      {!collapsed && (
        <div className={`p-3 h-[calc(100vh-250px)] overflow-y-auto ${getCardsBgColor()} transition-colors duration-200`}>
          {projects.length === 0 ? (
            <div className={`flex flex-col items-center justify-center py-8 ${darkMode ? 'text-gray-500 border-gray-700' : 'text-gray-400 border-gray-200'} border-2 border-dashed rounded-lg h-32`}>
              <div className="text-center p-4">
                <p>Drop projects here</p>
                <button 
                  className={`mt-2 inline-flex items-center text-sm font-medium ${status === 'To Do' ? 'text-blue-600' : status === 'In Progress' ? 'text-yellow-600' : 'text-green-600'}`}
                >
                  <PlusCircle size={16} className="mr-1" />
                  Add Project
                </button>
              </div>
            </div>
          ) : (
            projects.map(project => (
              <ProjectCard
                key={project._id}
                project={project}
                onStatusChange={onStatusChange}
                onRemove={onRemove}
                darkMode={darkMode}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectColumn;