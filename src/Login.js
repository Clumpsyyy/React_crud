import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import './App.css';

const Login = () => {
  // State variables
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  // Navigation instance
  const navigate = useNavigate();

  // Fetch user on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Retrieve user data from localStorage
        const response = JSON.parse(localStorage.getItem('token'));
        setUser(response.data);
        navigate("/dashboard");
      } catch (error) {
        console.error('Failed to fetch user', error);
        navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);

  // Handle login functionality
  const handleLogin = async () => {
    try {
      // Make API call to authenticate user
      const response = await axios.post('https://mywebsite.x10.mx/api/login', {
        email,
        password,
      });

      // Store authentication token in localStorage
      localStorage.setItem('token', JSON.stringify(response));
      navigate('/dashboard');
    } catch (error) {
      console.error('Login Failed Error', error);
    }
  };

  return (
    <div className="Form d-flex align-items-center justify-content-center vh-100">
    <Row>
      <Col md={100} className="text-center">
        <Form style={{ fontWeight: 'heavy'}}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button variant="outline-light" onClick={handleLogin} style={{ margin: '5px'}}>
            Login
          </Button>
        </Form>
      </Col>
    </Row>
  </div>
  );
}

export default Login;
