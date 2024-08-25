import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const MetadataPage = () => {
    const [metadata, setMetadata] = useState({ 
        preMedOptions: [], 
        anestheticOptions: [], 
        anesthesiaOptions: [],
        reversalAgentOptions: []  // Add this line
    });
    const [newOption, setNewOption] = useState('');
    const [selectedDropdown, setSelectedDropdown] = useState('preMedOptions');

    useEffect(() => {
        fetchMetadata();
    }, []);

    const fetchMetadata = async () => {
        try {
            const response = await fetch('http://your ip:3001/metadata');
            const result = await response.json();
            setMetadata(result);
        } catch (error) {
            toast.error('Error fetching metadata');
        }
    };

    const handleAddOption = () => {
        if (newOption.trim()) {
            const updatedOptions = [...metadata[selectedDropdown], newOption];
            const updatedMetadata = { ...metadata, [selectedDropdown]: updatedOptions };
            saveMetadata(updatedMetadata);
            setNewOption('');
        }
    };

    const handleRemoveOption = (option) => {
        const updatedOptions = metadata[selectedDropdown].filter(item => item !== option);
        const updatedMetadata = { ...metadata, [selectedDropdown]: updatedOptions };
        saveMetadata(updatedMetadata);
    };

    const saveMetadata = async (updatedMetadata) => {
        try {
            await fetch('http://your ip:3001/metadata', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedMetadata),
            });
            setMetadata(updatedMetadata);
            toast.success('Metadata updated successfully');
        } catch (error) {
            toast.error('Error saving metadata');
        }
    };

    return (
        <div style={styles.container}>
            <ToastContainer />
            <h2 style={styles.heading}>Manage Metadata</h2>
            <div style={styles.field}>
                <label style={styles.label}>Select Dropdown</label>
                <select
                    value={selectedDropdown}
                    onChange={(e) => setSelectedDropdown(e.target.value)}
                    style={styles.input}
                >
                    <option value="preMedOptions">Pre Med Options</option>
                    <option value="anestheticOptions">Anesthetic Agent One Options</option>
                    <option value="anesthesiaOptions">Anesthetic Agent Two Options</option>
                    <option value="reversalAgentOptions">Reversal Agent Options</option> {/* Added this line */}
                </select>
            </div>
            <div style={styles.field}>
                <label style={styles.label}>New Option</label>
                <InputText
                    type="text"
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    style={styles.input}
                />
                <Button label="Add" icon="pi pi-plus" onClick={handleAddOption} style={styles.addButton} />
            </div>
            <DataTable value={metadata[selectedDropdown]} style={styles.table}>
                <Column field="name" header="Options" body={(rowData) => (
                    <div style={styles.tableRow}>
                        {rowData}
                        <Button
                            icon="pi pi-trash"
                            className="p-button-rounded p-button-danger"
                            onClick={() => handleRemoveOption(rowData)}
                        />
                    </div>
                )} />
            </DataTable>
        </div>
    );
};

const styles = {
    container: {
        padding: '40px 20px',
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    },
    heading: {
        textAlign: 'center',
        marginBottom: '30px',
        fontSize: '24px',
        color: '#333',
    },
    field: {
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        marginBottom: '8px',
        fontSize: '16px',
        color: '#333',
    },
    input: {
        padding: '10px',
        fontSize: '16px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        transition: 'border-color 0.3s',
    },
    addButton: {
        marginTop: '10px',
        color: 'white',
        backgroundColor: '#333',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    table: {
        marginTop: '20px',
    },
    tableRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
};

export default MetadataPage;
