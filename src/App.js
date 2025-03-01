import * as React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.css";
import Nav from "react-bootstrap/Nav";

import Login from "./Login";
import Position from "./Position";
import Dashboard from './Dashboard';
import Candidate from "./Candidate"; // Adjust the import statement
// ayo
// import Position from "./Position";

function App() {
  
  return (
    <div>
      <Router>
        <Navbar>
          <Container>
            <Nav className="ms-auto">
             
            </Nav>
          </Container>
        </Navbar>

        <Container className="mt-5">
          <Row>
            <Col md={12}>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/position" element={<Position />} />
                <Route path="/candidate" element={<Candidate />} />
              </Routes>
            </Col>
          </Row>
          </Container>
      </Router>
    </div>
  );
}

export default App;
