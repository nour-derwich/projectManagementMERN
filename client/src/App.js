import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/landing';
import PrivateRoute from './components/pirvatRouter/PrivateRoute';
import Dashboard from './pages/dash';
import AddProject from './components/AddProject';
import { SocketProvider } from './context/SocketContext';

function App() {
  const [currentUser, setCurrentUser] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const config = {
          headers: {
            authorization: localStorage.getItem('token'),
          },
        };
        const response = await axios.get('http://localhost:5000/api/user/', config);
        setCurrentUser(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user:', error);
        setIsLoading(false); // You may want to handle the error state differently here
      }
    };

    fetchUser();
  }, [refresh]);

  const refresher = () => {
    setRefresh(!refresh);
  };

  return (
    <div className="App">
      <SocketProvider> {/* Move SocketProvider outside of Routes */}
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/dash"
            element={
              <PrivateRoute>
                <Dashboard currentUser={currentUser} isLoading={isLoading} />
              </PrivateRoute>
            }
          />
          <Route
            path="/project/new"
            element={
              <PrivateRoute>
                <AddProject />
              </PrivateRoute>
            }
          />
        </Routes>
      </SocketProvider>
    </div>
  );
}

export default App;
