import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Navbar, Nav } from 'react-bootstrap';
import { FaCog, FaClipboardList } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import backgroundImage from './images/WhatsApp Image 2024-04-16 at 18.08.08_fa1f0f48.png';
import './css/app.css';
import James from './James.jsx';
import Settings from './settings.jsx';
import History from './History.jsx';

function App() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ownerName: '',
    patientName: '',
    breed: '',
    weight: '',
    age: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate('/james', { state: formData });
  };

  return (
    <div className="app" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh' }}>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand as={Link} to="/">MyApp</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/settings">
                <FaCog className="me-2" />
                Settings
              </Nav.Link>
              <Nav.Link as={Link} to="/history">
                <FaClipboardList className="me-2" />
                History
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(80vh - 56px)' }}>
        <Row className="form-container shadow p-4 rounded bg-light">
          <Col>
            <h2 className="text-center mb-4">Owner & Patient Info</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="ownerName" className="mb-3">
                <Form.Label>Owner Name</Form.Label>
                <Form.Control 
                  type="text" 
                  name="ownerName"
                  value={formData.ownerName} 
                  onChange={handleChange} 
                  placeholder="Enter owner name" 
                />
              </Form.Group>
              <Form.Group controlId="patientName" className="mb-3">
                <Form.Label>Patient Name</Form.Label>
                <Form.Control 
                  type="text" 
                  name="patientName"
                  value={formData.patientName} 
                  onChange={handleChange} 
                  placeholder="Enter patient name" 
                />
              </Form.Group>
              <Form.Group controlId="breed" className="mb-3">
                <Form.Label>Breed</Form.Label>
                <Form.Control 
                  type="text" 
                  name="breed"
                  value={formData.breed} 
                  onChange={handleChange} 
                  placeholder="Enter breed" 
                />
              </Form.Group>
              <Form.Group controlId="weight" className="mb-3">
                <Form.Label>Weight</Form.Label>
                <Form.Control 
                  type="text" 
                  name="weight"
                  value={formData.weight} 
                  onChange={handleChange} 
                  placeholder="Enter weight" 
                />
              </Form.Group>
              <Form.Group controlId="age" className="mb-3">
                <Form.Label>Age</Form.Label>
                <Form.Control 
                  type="text" 
                  name="age"
                  value={formData.age} 
                  onChange={handleChange} 
                  placeholder="Enter age" 
                />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100">Submit</Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/james" element={<James />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}

export default AppWrapper;

