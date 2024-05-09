import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Routes, Route } from 'react-router-dom';
import Landing from './pages/landing';
import PrivateRoute from './components/pirvatRouter/PrivateRoute';
import Dashboard from './pages/dash';
import AddProject from './components/AddProject';

function App() {
  const [currentUser, setCurrentUser] = useState({});
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const config = {
      headers: {
        authorization: localStorage.getItem('token'),
      },
    };
    // console.log(`Token => ${localStorage.getItem('token')}`);
    axios
      .get('http://localhost:8000/api/user/', config)
      .then((res) => {
        setCurrentUser(res.data);
        // console.log('**** => ', res.data);
        setIsLoading(false);
      })
      .catch((err) => console.log('*** ==> ', err));
  }, [refresh]);

  const refresher = () => {
    setRefresh(!refresh);
  };
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Landing/>}/>
        <Route
            path="/dash"
            element={ <PrivateRoute> <Dashboard currentUser={currentUser}
                  isLoading={isLoading}
                  // refresh={refresh}
                />
              </PrivateRoute>

            }
          />
           <Route
            path="/project/new"
            element={
              <PrivateRoute>
                {' '}
                <AddProject />
              </PrivateRoute>
            }
          />
           

      </Routes>
    </div>
  );
}

export default App;
