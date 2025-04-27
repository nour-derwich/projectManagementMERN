// ActivityFeed.js component
import React, { useEffect, useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { Clock } from 'lucide-react';

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const { socket } = useSocket();
  
  useEffect(() => {
    // Fetch initial activities
    fetch('http://localhost:5000/api/activities')
      .then(res => res.json())
      .then(data => setActivities(data))
      .catch(err => console.error(err));
    
    // Listen for new activities
    if (socket) {
      socket.on('activity_added', (newActivity) => {
        setActivities(prev => [newActivity, ...prev].slice(0, 10)); // Keep most recent 10
      });
    }
    
    return () => {
      if (socket) {
        socket.off('activity_added');
      }
    };
  }, [socket]);
  
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      
      {activities.length === 0 ? (
        <p className="text-gray-500">No recent activity</p>
      ) : (
        <ul className="space-y-3">
          {activities.map(activity => (
            <li key={activity._id} className="flex items-start gap-3 pb-3 border-b border-gray-100">
              <div className="p-2 bg-blue-50 rounded-full">
                <Clock size={16} className="text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-700">{activity.details}</p>
                <p className="text-xs text-gray-500 mt-1">{formatTime(activity.timestamp)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivityFeed;