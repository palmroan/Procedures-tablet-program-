import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios'; // Import Axios

function Settings() {
  const [dropdownItems, setDropdownItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('/api/settings');
      setDropdownItems(response.data); // Update state with correct data
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleAddItem = async () => {
    if (newItem.trim() !== '') {
      try {
        await axios.post('/api/settings/add', { item: newItem.trim() });
        setDropdownItems([...dropdownItems, newItem.trim()]);
        setNewItem('');
      } catch (error) {
        console.error('Error adding item:', error);
      }
    }
  };

  const handleRemoveItem = async (itemId, index) => { // Pass item ID to the function
    try {
      await axios.post('/api/settings/remove', { itemIndex: itemId }); // Send item ID to the server
      const updatedItems = [...dropdownItems];
      updatedItems.splice(index, 1);
      setDropdownItems(updatedItems);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  return (
    <div>
      <h2 className="text-center mb-4">Dropdown Settings</h2>
      <Form>
        <Form.Group controlId="newItem" className="mb-3">
          <Form.Label>Add New Item</Form.Label>
          <Form.Control 
            type="text" 
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Enter new item" 
          />
        </Form.Group>
        <Button variant="primary" onClick={handleAddItem}>Add Item</Button>
      </Form>
      <h3 className="mt-4">Saved Items:</h3>
      <ul>
        {dropdownItems.map((item, index) => (
          <li key={index}>
            {item}
            <Button variant="danger" size="sm" className="ms-2" onClick={() => handleRemoveItem(item._id, index)}>Remove</Button> {/* Pass item ID */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Settings;
