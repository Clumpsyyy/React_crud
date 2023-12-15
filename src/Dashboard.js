import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Candidate from './Candidate';
import Position from './Position';
import { Navbar } from 'react-bootstrap';


const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [showCandidate, setShowCandidate] = useState(false);
  const [showPosition, setShowPosition] = useState(false);
  const navigate = useNavigate();

  // Verify if User In-Session in LocalStorage
  // Fetch user on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Retrieve user data from localStorage
        const tokenString = localStorage.getItem('token');

        if (tokenString) {
          const response = JSON.parse(tokenString);
          setUser(response.data);
          navigate("/dashboard");
        } else {
          console.error('Token not found in localStorage');
          navigate('/login');
        }
      } catch (error) {
        console.error('Failed to fetch user', error);
        navigate('/login');
      }
    };

    fetchUser();
  }, []);

  // Performs Logout Method
  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const toggleCandidate = () => {
    setShowCandidate(!showCandidate);
    setShowPosition(false);
  };

  const togglePosition = () => {
    setShowPosition(!showPosition);
    setShowCandidate(false);
  };

  return (
    <div>
      <Navbar expand="lg" fixed="top">
        <div className='container-fluid d-flex justify-content-between align-items-center'>
          <div>
            <h3>
              Welcome, {user ? user.user.name : 'User'}<br/>
              </h3>
              
              <Button variant="outline-dark" onClick={toggleCandidate} className="inline-button" style={{ margin: '10px'}}>
                Candidate
              </Button>
              <Button variant="outline-dark" onClick={togglePosition} className="inline-button" style={{ margin: '10px'}}>
                Position
              </Button>
           
          </div>

          <Button variant="outline-danger" onClick={handleLogout} className='ml-2'>
            Logout
          </Button>
        </div>
      </Navbar>

      <div className='container'>
        {/* Render components based on conditions */}
        {showCandidate && <Candidate userId={user ? user.user.id : null} />}
        {showPosition && <Position userId={user ? user.user.id : null} />}
      </div>
    </div>
  );
};

export default Dashboard;