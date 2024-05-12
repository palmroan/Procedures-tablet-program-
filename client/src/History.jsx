import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

function History() {
  const [searchData, setSearchData] = useState({
    ownerName: '',
    patientName: ''
  });
  const [searchResults, setSearchResults] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchData({
      ...searchData,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const results = await fetchSearchResults(searchData.ownerName, searchData.patientName);
      setSearchResults(results);
    } catch (error) {
      console.error('Error fetching search results', error);
    }
  };

  const fetchSearchResults = async (ownerName, patientName) => {
    try {
      const response = await axios.get(`/api/procedures/search`, {
        params: { ownerName, patientName }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching search results', error);
      return [];
    }
  };

  return (
    <div>
      <h2 className="text-center mb-4">Search History</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="ownerName" className="mb-3">
          <Form.Label>Owner Name</Form.Label>
          <Form.Control 
            type="text" 
            name="ownerName"
            value={searchData.ownerName} 
            onChange={handleChange} 
            placeholder="Enter owner name" 
          />
        </Form.Group>
        <Form.Group controlId="patientName" className="mb-3">
          <Form.Label>Patient Name</Form.Label>
          <Form.Control 
            type="text" 
            name="patientName"
            value={searchData.patientName} 
            onChange={handleChange} 
            placeholder="Enter patient name" 
          />
        </Form.Group>
        <Button variant="primary" type="submit">Search</Button>
      </Form>
      <div>
        <ul>
          {searchResults.map((result, index) => (
            <li key={index}>
              {result.ownerName} - {result.patientName} - {result.breed} - {result.weight} - {result.age} - {result.actions.join(', ')} - {result.timestamps.join(', ')}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default History;
