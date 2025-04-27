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
            <div className={` top_stats   `}>
              <div className="list_items">
                <div className='single_item'>
                  <div className="text-sm text-gray-500">Total Projects</div>
                  <div className="numb">{totalProjects}</div>
                </div>
                <div className='single_item'>
                  <div className="text-sm text-gray-500">Overdue</div>
                  <div className="numb">{overdueTasks}</div>
                </div>
                <div className='single_item'>
                  <div className="text-sm text-gray-500">In Progress</div>
                  <div className="numb" >{inProgressProjects.length}</div>
                </div>
                <div className='single_item'>
                  <div className="text-sm text-gray-500">Completed</div>
                  <div className="numb">{completedProjects.length}</div>
                </div>
              </div>
              
            
            </div>
            
            {/* Page Header */}
            <div className="mb-6">
              <div className=" mid_holder">
                <div>
                  <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Project Kanban Board</h3>
                  <p className="text-sm text-gray-500 mt-1">Drag and drop tasks between columns to update status</p>
                </div>
                
                <div className=" ">
                  <button 
                    onClick={fetchProjects}
                    className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
                    title="Refresh projects"
                    style={{ marginRight: '10px', background:"#ffb450" }}
                  >
                    <RefreshCw size={20} />
                  </button>
                  
             
                  
             
                  
                  <button 
                    onClick={navigateToNewProject}
                    className={""}
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
            
       
            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Kanban Board */}
              <div className={`${activityVisible ? 'lg:col-span-3' : 'lg:col-span-5'}`}>
                {loading ? (
                  <div className={`flex justify-center items-center h-64 ${darkMode ? 'text-white' : ''}`}>
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                  </div>
                ) : view === 'kanban' ? (
                  <div className="kanban">
                    <div className={`${getColumnClass()} min-w-[280px] k_item`}>
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
                    
                    <div className={`${getColumnClass()} min-w-[280px] k_item`}>
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
                    
                    <div className={`${getColumnClass()} min-w-[280px] k_item`}>
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