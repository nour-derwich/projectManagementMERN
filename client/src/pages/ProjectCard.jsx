import React, { useEffect, useState } from 'react';
import { 
  Calendar, CheckCircle, Clock, Trash, Play, AlertTriangle, 
  MoreHorizontal, Move, Calendar as CalendarIcon, User, MessageSquare,
  Tag, ChevronRight
} from 'lucide-react';
import { useDrag } from 'react-dnd';

// Define item types for drag and drop
const ItemTypes = {
  CARD: 'card'
};

const ProjectCard = ({ project, onStatusChange, onRemove, darkMode = false }) => {
  const isCompleted = project.status === 'Completed';
  const [showDropdown, setShowDropdown] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [expanded, setExpanded] = useState(false);
  
  // Set up drag source
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: { id: project._id, status: project.status },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const isPastDue = (dueDate) => {
    const now = new Date();
    return now > new Date(dueDate);
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getDaysRemaining = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return "Due today";
    } else if (diffDays === 1) {
      return "Due tomorrow";
    } else {
      return `${diffDays} days remaining`;
    }
  };

  const getPriorityBadge = (dueDate, status) => {
    if (status === 'Completed') return null;
    
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return (
        <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded-full flex items-center">
          <AlertTriangle size={12} className="mr-1" />
          Overdue
        </span>
      );
    } else if (diffDays <= 2) {
      return (
        <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-0.5 rounded-full">
          Urgent
        </span>
      );
    } else if (diffDays <= 7) {
      return (
        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full">
          Soon
        </span>
      );
    }
    return null;
  };

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 500);
    return () => clearTimeout(timer);
  }, [project.status]);

  // Get card background based on dark mode
  const getCardBg = () => {
    if (darkMode) {
      return isCompleted ? 'bg-gray-700/80' : 'bg-gray-700';
    }
    return isCompleted ? 'bg-white/80' : 'bg-white';
  };

  // Get text color based on dark mode
  const getTextColor = () => {
    return darkMode ? 'text-white' : 'text-gray-800';
  };

  // Get border color based on dark mode
  const getBorderColor = () => {
    if (darkMode) {
      return project.status === 'To Do' ? 'border-blue-700' : 
             project.status === 'In Progress' ? 'border-yellow-700' : 
             'border-green-700';
    }
    return project.status === 'To Do' ? 'border-blue-500' : 
           project.status === 'In Progress' ? 'border-yellow-500' : 
           'border-green-500';
  };

  return (
    <div 
      ref={drag}
      className={`${getCardBg()} rounded-lg shadow-sm p-4 mb-4 border-l-4 hover:shadow-md transition-all cursor-move duration-200 ${
        isDragging ? 'opacity-40' : ''
      } ${isCompleted ? 'opacity-80' : 'hover:-translate-y-0.5'} ${animate ? 'animate-pulse bg-yellow-50' : ''}`}
      style={{ 
        borderLeftColor: project.status === 'To Do' ? (darkMode ? '#3b82f6' : '#3b82f6') : 
                        project.status === 'In Progress' ? (darkMode ? '#eab308' : '#eab308') : 
                        (darkMode ? '#22c55e' : '#22c55e'),
        opacity: isDragging ? 0.4 : 1,
      }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center">
            <Move size={14} className={`mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
            <h3 className={`font-medium text-lg mb-1 ${isCompleted ? 'line-through text-gray-500' : getTextColor()}`}>
              {project.name}
            </h3>
          </div>
          
          <div className={`flex items-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'} mb-2`}>
            <Calendar size={14} className="mr-1" />
            <span>
              {formatDate(project.dueDate)}
            </span>
            
            <div className={`mx-2 ${darkMode ? 'text-gray-500' : 'text-gray-300'}`}>•</div>
            
            <span className={isPastDue(project.dueDate) && !isCompleted ? "text-red-600" : ""}>
              {getDaysRemaining(project.dueDate)}
            </span>
          </div>
        </div>
        
        <div className="relative">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowDropdown(!showDropdown);
            }}
            className={`p-1 ${darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-500 hover:bg-gray-100'} rounded-full transition-colors`}
          >
            <MoreHorizontal size={18} />
          </button>
          
          {showDropdown && (
            <div className={`absolute right-0 mt-1 ${darkMode ? 'bg-gray-700' : 'bg-white'} shadow-lg rounded-md py-1 z-10 w-36 ${darkMode ? 'border-gray-600' : 'border-gray-100'} border`}>
              {project.status === 'To Do' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(project._id, 'In Progress');
                    setShowDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm ${darkMode ? 'hover:bg-gray-600 text-gray-200' : 'hover:bg-gray-50 text-gray-700'} flex items-center transition-colors`}
                >
                  <Play size={14} className="mr-2 text-blue-500" />
                  Start Project
                </button>
              )}
              
              {project.status === 'In Progress' && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusChange(project._id, 'Completed');
                    setShowDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm ${darkMode ? 'hover:bg-gray-600 text-gray-200' : 'hover:bg-gray-50 text-gray-700'} flex items-center transition-colors`}
                >
                  <CheckCircle size={14} className="mr-2 text-green-500" />
                  Complete
                </button>
              )}
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(project._id);
                  setShowDropdown(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-50'} flex items-center text-red-600 transition-colors`}
              >
                <Trash size={14} className="mr-2" />
                Remove
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-2 flex items-center space-x-2 flex-wrap">
        {getPriorityBadge(project.dueDate, project.status)}
        
        {/* Custom tags - these would typically come from project data */}
        {project.tags && project.tags.map((tag, index) => (
          <span key={index} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-0.5 rounded-full">
            {tag}
          </span>
        ))}
      </div>
      
      {expanded && (
        <div className={`mt-4 pt-3 border-t ${darkMode ? 'border-gray-600' : 'border-gray-100'}`}>
          <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {project.description || "No description available."}
          </div>
          
          <div className="flex flex-wrap items-center mt-3 gap-3">
            <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
              <User size={14} className="mr-1" />
              {project.assignee || "Unassigned"}
            </div>
            <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
              <MessageSquare size={14} className="mr-1" />
              {project.comments ? `${project.comments} comments` : "No comments"}
            </div>
            <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
              <Tag size={14} className="mr-1" />
              {project.category || "No category"}
            </div>
          </div>
          
          <div className="mt-3">
            <button className={`text-sm font-medium flex items-center ${project.status === 'To Do' ? 'text-blue-500' : project.status === 'In Progress' ? 'text-yellow-500' : 'text-green-500'}`}>
              View Details
              <ChevronRight size={14} className="ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;