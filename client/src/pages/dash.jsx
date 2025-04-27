import React, { useEffect, useState } from 'react';
import { 
  Calendar, CheckCircle, Clock, Trash, Play, AlertTriangle, 
  MoreHorizontal, PlusCircle, RefreshCw, Search, ChevronDown,
  Move, Menu, X, Filter, Maximize, LayoutGrid, List
} from 'lucide-react';
import ProjectColumn from './ProjectColumn';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useSocket } from '../context/SocketContext';
import ActivityFeed from '../components/ActivityFeed';
import { Navbar } from '../shares/Navbar';
import { Sidebar } from '../shares/Sidebar';

// Define item types for drag and drop
const ItemTypes = {
  CARD: 'card'
};

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dueDate');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState('kanban');
  const [showFilters, setShowFilters] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [darkMode, setDarkMode] = useState(false);
  const [activityVisible, setActivityVisible] = useState(false);
  const [columnLayout, setColumnLayout] = useState('equal');
  const { socket } = useSocket();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleActivityFeed = () => {
    setActivityVisible(!activityVisible);
  };

  const fetchProjects = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/projects')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        setError(`Failed to load projects: ${err.message}`);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProjects();
    // Set up socket event listeners when socket is available
    if (socket) {
      // Listen for project creation events
      socket.on('project_created', (newProject) => {
        setProjects(prevProjects => [...prevProjects, newProject]);
      });
      
      // Listen for project deletion events
      socket.on('project_deleted', (projectId) => {
        setProjects(prevProjects => 
          prevProjects.filter(project => project._id !== projectId)
        );
      });

      // Listen for activity events (project updates)
      socket.on('activity_added', (activity) => {
        if (activity.action === 'move') {
          // Extract the new status from the details
          const newStatus = activity.details.split('to ')[1];
          
          // Update project in state
          setProjects(prevProjects => 
            prevProjects.map(project => 
              project._id === activity.projectId 
                ? { ...project, status: newStatus, lastEditedBy: activity.userId }
                : project
            )
          );
        }
      });
    }
    // Clean up event listeners
    return () => {
      if (socket) {
        socket.off('project_created');
        socket.off('project_deleted');
        socket.off('activity_added');
      }
    };
  }, [socket]);

  const filterProjects = (projects) => {
    return projects.filter(p => {
      // Search filter
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Priority filter
      let matchesPriority = true;
      if (priorityFilter !== 'all') {
        const dueDate = new Date(p.dueDate);
        const now = new Date();
        const diffDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
        
        if (priorityFilter === 'urgent' && (diffDays > 2 || p.status === 'Completed')) {
          matchesPriority = false;
        } else if (priorityFilter === 'soon' && (diffDays > 7 || diffDays <= 2 || p.status === 'Completed')) {
          matchesPriority = false;
        } else if (priorityFilter === 'overdue' && (diffDays >= 0 || p.status === 'Completed')) {
          matchesPriority = false;
        }
      }
      
      return matchesSearch && matchesPriority;
    });
  };

  const sortProjects = (projects) => {
    return [...projects].sort((a, b) => {
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate) - new Date(b.dueDate);
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'priority') {
        // Custom priority sorting logic
        const getPriorityValue = (project) => {
          const dueDate = new Date(project.dueDate);
          const now = new Date();
          const diffDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
          
          if (diffDays < 0) return 0; // Overdue (highest priority)
          if (diffDays <= 2) return 1; // Urgent
          if (diffDays <= 7) return 2; // Soon
          return 3; // Normal priority
        };
        
        return getPriorityValue(a) - getPriorityValue(b);
      }
      return 0;
    });
  };

  const filterAndSortProjects = (status) => {
    const filtered = filterProjects(projects.filter(p => p.status === status));
    return sortProjects(filtered);
  };

  const todoProjects = filterAndSortProjects('To Do');
  const inProgressProjects = filterAndSortProjects('In Progress');
  const completedProjects = filterAndSortProjects('Completed');

  const updateProjectStatus = (id, newStatus) => {
    fetch(`http://localhost:5000/api/project/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        setProjects(prevProjects => prevProjects.map(p => {
          if (p._id === id) {
            return { ...p, status: newStatus };
          }
          return p;
        }));
      })
      .catch(err => {
        setError(err.message);
      });
  };

  const removeProject = (id) => {
    if (window.confirm('Are you sure you want to remove this project?')) {
      fetch(`http://localhost:5000/api/project/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        }})
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(() => {
          // Project removal handled by socket.io event
        })
        .catch(err => {
          setError(err.message);
        });
    }
  };

  const navigateToNewProject = () => {
    window.location.href = '/project/new';
  };

  // Total counts for the header
  const totalProjects = projects.length;
  const overdueTasks = projects.filter(p => {
    const now = new Date();
    const due = new Date(p.dueDate);
    return now > due && p.status !== 'Completed';
  }).length;

  // Dynamic column class based on layout setting
  const getColumnClass = () => {
    if (columnLayout === 'equal') {
      return 'flex-1';
    } else if (columnLayout === 'prioritize-todo') {
      return 'flex-1 first:flex-2';
    } else if (columnLayout === 'prioritize-inprogress') {
      return 'flex-1 [&:nth-child(2)]:flex-2';
    }
    return 'flex-1';
  };

  // Overlay that appears when sidebar is open on mobile
  const SidebarOverlay = ({ isOpen, toggleSidebar }) => {
    return isOpen ? (
      <div 
        className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 md:hidden"
        onClick={toggleSidebar}
      />
    ) : null;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50'} min-h-screen transition-colors duration-300`}>
        {/* Sidebar for mobile overlay */}
        <SidebarOverlay isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        
        {/* Sidebar Component */}
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        
        {/* Navbar Component */}
        <Navbar toggleSidebar={toggleSidebar} />
        
        {/* Main Content */}
        <div className="md:ml-64 pt-16">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Top Stats Bar */}
            <div className={`mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-4 flex flex-wrap justify-between items-center gap-4 transition-colors duration-300`}>
              <div className="flex items-center space-x-6">
                <div>
                  <div className="text-sm text-gray-500">Total Projects</div>
                  <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{totalProjects}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Overdue</div>
                  <div className={`text-2xl font-bold ${overdueTasks > 0 ? 'text-red-500' : darkMode ? 'text-white' : 'text-gray-900'}`}>{overdueTasks}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">In Progress</div>
                  <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{inProgressProjects.length}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Completed</div>
                  <div className={`text-2xl font-bold text-green-500`}>{completedProjects.length}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-600'} hover:bg-opacity-80 transition-colors`}
                  title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {darkMode ? 
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="5"></circle>
                      <line x1="12" y1="1" x2="12" y2="3"></line>
                      <line x1="12" y1="21" x2="12" y2="23"></line>
                      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                      <line x1="1" y1="12" x2="3" y2="12"></line>
                      <line x1="21" y1="12" x2="23" y2="12"></line>
                      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg> : 
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                  }
                </button>
                <button
                  onClick={toggleActivityFeed}
                  className={`p-2 rounded-full ${activityVisible ? 'bg-indigo-100 text-indigo-600' : darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-600'} hover:bg-opacity-80 transition-colors`}
                  title="Toggle activity feed"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                </button>
                <button
                  onClick={() => setView(view === 'kanban' ? 'list' : 'kanban')}
                  className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-600'} hover:bg-opacity-80 transition-colors`}
                  title={view === 'kanban' ? "Switch to list view" : "Switch to kanban view"}
                >
                  {view === 'kanban' ? <List size={20} /> : <LayoutGrid size={20} />}
                </button>
              </div>
            </div>
            
            {/* Page Header */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Project Kanban Board</h1>
                  <p className="text-sm text-gray-500 mt-1">Drag and drop tasks between columns to update status</p>
                </div>
                
                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                  <button 
                    onClick={fetchProjects}
                    className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
                    title="Refresh projects"
                  >
                    <RefreshCw size={20} />
                  </button>
                  
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={`${showFilters ? 'bg-indigo-100 text-indigo-600' : darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'} p-2 rounded-full transition-colors`}
                    title="Toggle filters"
                  >
                    <Filter size={18} />
                  </button>
                  
                  <div className="relative">
                    <button 
                      onClick={() => setColumnLayout(
                        columnLayout === 'equal' ? 'prioritize-todo' : 
                        columnLayout === 'prioritize-todo' ? 'prioritize-inprogress' : 'equal'
                      )}
                      className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'} p-2 rounded-full transition-colors`}
                      title="Change column layout"
                    >
                      <Maximize size={18} />
                    </button>
                  </div>
                  
                  <button 
                    onClick={navigateToNewProject}
                    className={`${darkMode ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-indigo-600 hover:bg-indigo-700'} text-white font-medium py-2 px-4 rounded-md flex items-center transition-colors duration-200 shadow-sm hover:shadow-md`}
                  >
                    <PlusCircle size={18} className="mr-1" />
                    New Project
                  </button>
                </div>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm flex items-center">
                <div className="flex items-center flex-1">
                  <AlertTriangle size={20} className="mr-2" />
                  <span>{error}</span>
                </div>
                <button 
                  onClick={() => setError('')} 
                  className="ml-4 text-red-500 hover:text-red-700 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            )}
            
            {/* Search and filters */}
            <div className={`mb-6 ${showFilters ? 'block' : 'hidden md:block'}`}>
              <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-4 transition-colors duration-300`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className={`block w-full pl-10 pr-3 py-2 border ${darkMode ? 'border-gray-700 bg-gray-700 text-white placeholder-gray-400' : 'border-gray-200 bg-white placeholder-gray-400'} rounded-lg leading-5 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 sm:text-sm transition-all shadow-sm`}
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center">
                      <label htmlFor="sortBy" className={`mr-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Sort by:</label>
                      <div className="relative">
                        <select
                          id="sortBy"
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className={`appearance-none border ${darkMode ? 'border-gray-700 bg-gray-700 text-white' : 'border-gray-200 bg-white'} rounded-lg text-sm py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all shadow-sm`}
                        >
                          <option value="dueDate">Due Date</option>
                          <option value="name">Name</option>
                          <option value="priority">Priority</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <ChevronDown size={16} className="text-gray-400" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <label htmlFor="priorityFilter" className={`mr-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>Priority:</label>
                      <div className="relative">
                        <select
                          id="priorityFilter"
                          value={priorityFilter}
                          onChange={(e) => setPriorityFilter(e.target.value)}
                          className={`appearance-none border ${darkMode ? 'border-gray-700 bg-gray-700 text-white' : 'border-gray-200 bg-white'} rounded-lg text-sm py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition-all shadow-sm`}
                        >
                          <option value="all">All</option>
                          <option value="urgent">Urgent</option>
                          <option value="soon">Soon</option>
                          <option value="overdue">Overdue</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <ChevronDown size={16} className="text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Kanban Board */}
              <div className={`${activityVisible ? 'lg:col-span-3' : 'lg:col-span-5'}`}>
                {loading ? (
                  <div className={`flex justify-center items-center h-64 ${darkMode ? 'text-white' : ''}`}>
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                  </div>
                ) : view === 'kanban' ? (
                  <div className="flex flex-col md:flex-row gap-6 overflow-x-auto">
                    <div className={`${getColumnClass()} min-w-[280px]`}>
                      <ProjectColumn 
                        title="To Do" 
                        projects={todoProjects} 
                        icon={<Clock size={20} />}
                        status="To Do"
                        color="text-blue-600"
                        onMoveCard={updateProjectStatus}
                        onStatusChange={updateProjectStatus}
                        onRemove={removeProject}
                        darkMode={darkMode}
                      />
                    </div>
                    
                    <div className={`${getColumnClass()} min-w-[280px]`}>
                      <ProjectColumn 
                        title="In Progress" 
                        projects={inProgressProjects} 
                        icon={<Play size={20} />}
                        status="In Progress"
                        color="text-yellow-600"
                        onMoveCard={updateProjectStatus}
                        onStatusChange={updateProjectStatus}
                        onRemove={removeProject}
                        darkMode={darkMode}
                      />
                    </div>
                    
                    <div className={`${getColumnClass()} min-w-[280px]`}>
                      <ProjectColumn 
                        title="Completed" 
                        projects={completedProjects} 
                        icon={<CheckCircle size={20} />}
                        status="Completed"
                        color="text-green-600"
                        onMoveCard={updateProjectStatus}
                        onStatusChange={updateProjectStatus}
                        onRemove={removeProject}
                        darkMode={darkMode}
                      />
                    </div>
                  </div>
                ) : (
                  // List view implementation would go here
                  <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-4 transition-colors duration-300`}>
                    <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>All Projects</h3>
                    <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
                      {/* List view implementation would go here */}
                      <div className="text-center py-6 text-gray-500">
                        List view coming soon...
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Activity Feed */}
              {activityVisible && (
                <div className="lg:col-span-2">
                  <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-4 h-full transition-colors duration-300`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Activity Feed</h3>
                      <button 
                        onClick={toggleActivityFeed}
                        className={`p-1 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'} rounded-full transition-colors`}
                      >
                        <X size={18} />
                      </button>
                    </div>
                    <ActivityFeed darkMode={darkMode} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default Dashboard;