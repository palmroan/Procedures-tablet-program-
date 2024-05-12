import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Navbar, Nav, ListGroup, CloseButton } from 'react-bootstrap';
import { FaCog, FaClipboardList } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import backgroundImage from './images/WhatsApp Image 2024-04-16 at 18.08.08_fa1f0f48.png';
import './css/james.css';

function James() {
  const { state } = useLocation();
  const { ownerName, patientName, breed, weight, age } = state;
  const [items, setItems] = useState([]);

  const handleAddItem = (label) => {
    const now = new Date();
    const dateTime = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    setItems([...items, { label, dateTime }]);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleEndProcedure = async () => {
    try {
      const procedureData = {
        ownerName,
        patientName,
        breed,
        weight,
        age,
        actions: items.map(item => item.label),
        timestamps: items.map(item => item.dateTime)
      };
      await axios.post('/api/procedures', procedureData);
      alert('Procedure saved successfully!');
    } catch (error) {
      console.error('Error saving procedure', error);
      alert('Failed to save procedure. Please try again.');
    }
  };

  const renderRulerButtons = (start, end, increment, label) => {
    let buttons = [];
    for (let i = start; i <= end; i += increment) {
      buttons.push(
        <Button 
          key={`${label}-${i}`} 
          variant="outline-primary" 
          className="me-2 mb-2 small-button"
          onClick={() => handleAddItem(`${label}: ${i.toFixed(1)}`)}
        >
          {i.toFixed(1)}
        </Button>
      );
    }
    return buttons;
  };

  return (
    <div className="app" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh' }}>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="#home">MyApp</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#settings">
                <FaCog className="me-2" />
                Settings
              </Nav.Link>
              <Nav.Link href="#procedure">
                <FaClipboardList className="me-2" />
                Procedure
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(80vh - 56px)' }}> {/* Adjusted height */}
        <Row className="w-100">
          <Col md={9} className="form-container shadow p-4 rounded bg-light">
            <h2 className="text-center mb-4">Procedure Form</h2>
            <Form>
              <Form.Group controlId="preMed" className="mb-3">
                <Form.Label>Pre Med</Form.Label>
                <Form.Select aria-label="Pre Med selection" className="small-dropdown">
                  <option>Select pre med</option>
                  <option value="Option 1">Option 1</option>
                  <option value="Option 2">Option 2</option>
                  <option value="Option 3">Option 3</option>
                </Form.Select>
              </Form.Group>
              <Form.Group controlId="anaestheticInjectable" className="mb-3">
                <Form.Label>Anaesthetic Injectable</Form.Label>
                <div>
                  {renderRulerButtons(0.1, 3, 0.1, 'Injectable')}
                </div>
              </Form.Group>
              <Form.Group controlId="gasAnaesthetic" className="mb-3">
                <Form.Label>Gas Anaesthetic</Form.Label>
                <div>
                  {renderRulerButtons(0.5, 5, 0.5, 'Gas')}
                </div>
              </Form.Group>
              <Button variant="danger" className="small-button w-auto" onClick={handleEndProcedure}>End of Procedure</Button>
            </Form>
          </Col>
          <Col md={3} className="list-container shadow p-4 rounded bg-light">
            <h2 className="text-center mb-4">Procedure List</h2>
            <ListGroup className="overflow-auto" style={{ maxHeight: '400px' }}>
              {items.map((item, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                  <span>{item.label} <br /> <small className="text-muted">{item.dateTime}</small></span>
                  <CloseButton onClick={() => handleRemoveItem(index)} />
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default James;
