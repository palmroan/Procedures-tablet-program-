import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import meta from './metadata.json';

const ProceduresPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { formData, selectedClient } = location.state;
    const [actions, setActions] = useState([]);
    const [metadata, setMetadata] = useState({
        preMedOptions: [],
        anestheticOptions: [],
        anesthesiaOptions: [],
        reversalAgentOptions: []
    });
    const [newPreMed, setNewPreMed] = useState('');
    const [selectedPreMed, setSelectedPreMed] = useState(null);
    const [newReversalAgent, setNewReversalAgent] = useState('');
    const [selectedReversalAgent, setSelectedReversalAgent] = useState(null);

    useEffect(() => {
        setMetadata(meta);
    }, []);

    const handleAnestheticChange = (value) => {
        setActions([...actions, { date_time: new Date().toISOString(), action: `Anesthetic agent one: ${value} |` }]);
    };

    const handleAnesthesiaChange = (value) => {
        setActions([...actions, { date_time: new Date().toISOString(), action: `Anesthetic agent two: ${value} |` }]);
    };

    const handleRemoveAction = (index) => {
        const newActions = actions.filter((_, i) => i !== index);
        setActions(newActions);
    };

    const handleAddPreMed = () => {
        if (newPreMed.trim() && selectedPreMed) {
            setActions([...actions, { date_time: new Date().toISOString(), action: `Pre Med: ${selectedPreMed}   | Amount: ${newPreMed}ml |` }]);
            setNewPreMed('');
            setSelectedPreMed(null);
        } else {
            toast.error('Please select a Pre Med and enter a valid option.');
        }
    };

    const handleAddReversalAgent = () => {
        if (newReversalAgent.trim() && selectedReversalAgent) {
            setActions([...actions, { date_time: new Date().toISOString(), action: `Reversal Agent: ${selectedReversalAgent}   | Amount: ${newReversalAgent}ml |` }]);
            setNewReversalAgent('');
            setSelectedReversalAgent(null);
        } else {
            toast.error('Please select a Reversal Agent and enter a valid option.');
        }
    };

    const renderRuler = (start, end, step, onSelect) => {
        const buttons = [];
        for (let i = start; i <= end; i += step) {
            buttons.push(
                <button key={i} style={styles.rulerButton} onClick={() => onSelect(i.toFixed(1))}>
                    {i.toFixed(1)}
                </button>
            );
        }
        return <div style={styles.rulerContainer}>{buttons}</div>;
    };

    const handleSubmit = async () => {
        if (actions.length === 0) {
            toast.error('Actions list cannot be empty.');
            return;
        }

        try {
            const data = {
                ownername: formData.ownerName,
                patientname: formData.patientName,
                breed: formData.breed,
                weight: formData.weight,
                age: formData.age,
                procedures: [
                    {
                        procedure_name: formData.procedure,
                        doctor_name: formData.doctor,
                        actions: actions
                    }
                ]
            };

            if (selectedClient) {
                // Update existing client
                const response = await fetch(`http://your ip:5000/vet/${selectedClient._id.$oid}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    toast.success('Procedure data updated successfully.');
                    navigate('/');
                } else {
                    toast.error('Failed to update procedure data.');
                }
            } else {
                // Create new client
                const response = await fetch('http://your ip:5000/vet/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    toast.success('Procedure data submitted successfully.');
                    navigate('/');
                } else {
                    toast.error('Failed to submit procedure data.');
                }
            }
        } catch (error) {
            toast.error('An error occurred while submitting data.');
        }
    };

    return (
        <div style={styles.container}>
            <ToastContainer />
            <h2 style={styles.heading}>Procedures for {formData.patientName}</h2>
            <div style={styles.detailsRow}>
                <p style={styles.detail}>Owner: {formData.ownerName}</p>
                <p style={styles.detail}>Age: {formData.age}</p>
                <p style={styles.detail}>Weight: {formData.weight}</p>
                <p style={styles.detail}>Doctor: {formData.doctor}</p>
                <p style={styles.detail}>Procedure: {formData.procedure}</p>
            </div>

            <div style={styles.field}>
                <label style={styles.label}>Pre Med</label>
                <div style={styles.inlineContainer}>
                    <Dropdown value={selectedPreMed} options={metadata.preMedOptions ? metadata.preMedOptions.map(option => ({ label: option, value: option })) : []} onChange={(e) => setSelectedPreMed(e.value)} placeholder="Select Pre Med" style={styles.dropdown} />
                    <InputText value={newPreMed} onChange={(e) => setNewPreMed(e.target.value)} placeholder="Amount in ml" style={styles.inlineInput} />
                    <Button label="Add" icon="pi pi-plus" onClick={handleAddPreMed} style={styles.inlineButton} />
                </div>
            </div>

            <div style={styles.field}>
                <label style={styles.label}>Anesthetic agent one</label>
                <Dropdown value={null} options={metadata.anestheticOptions ? metadata.anestheticOptions.map(option => ({ label: option, value: option })) : []} onChange={(e) => handleAnestheticChange(e.value)} placeholder="Select Anesthetic" style={styles.dropdown} />
                {renderRuler(0.1, 3, 0.1, handleAnestheticChange)}
            </div>

            <div style={styles.field}>
                <label style={styles.label}>Anesthetic agent two</label>
                <Dropdown value={null} options={metadata.anesthesiaOptions ? metadata.anesthesiaOptions.map(option => ({ label: option, value: option })) : []} onChange={(e) => handleAnesthesiaChange(e.value)} placeholder="Select Anesthetic" style={styles.dropdown} />
                {renderRuler(0.5, 5, 0.5, handleAnesthesiaChange)}
            </div>

            <div style={styles.field}>
                <label style={styles.label}>Reversal Agent</label>
                <div style={styles.inlineContainer}>
                    <Dropdown value={selectedReversalAgent} options={metadata.reversalAgentOptions ? metadata.reversalAgentOptions.map(option => ({ label: option, value: option })) : []} onChange={(e) => setSelectedReversalAgent(e.value)} placeholder="Select Reversal Agent" style={styles.dropdown} />
                    <InputText value={newReversalAgent} onChange={(e) => setNewReversalAgent(e.target.value)} placeholder="Amount in ml" style={styles.inlineInput} />
                    <Button label="Add" icon="pi pi-plus" onClick={handleAddReversalAgent} style={styles.inlineButton} />
                </div>
            </div>

            <h3 style={styles.subheading}>Actions</h3>
            <ul style={styles.actionList}>
                {actions.map((action, index) => (
                    <li key={index} style={styles.actionItem}>
                        {action.action} at {new Date(action.date_time).toLocaleString()}
                        <button style={styles.removeButton} onClick={() => handleRemoveAction(index)}>Remove</button>
                    </li>
                ))}
            </ul>

            <button style={styles.doneButton} onClick={handleSubmit} disabled={actions.length === 0}>Done</button>
        </div>
    );
};

const styles = {
    container: {
        padding: '40px 20px',
        maxWidth: '800px',
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
    detailsRow: {
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        marginBottom: '20px',
    },
    detail: {
        fontSize: '18px',
        color: '#666',
    },
    field: {
        marginBottom: '20px',
    },
    label: {
        marginBottom: '8px',
        fontSize: '16px',
        color: '#333',
    },
    dropdown: {
        width: '100%',
    },
    rulerContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        marginTop: '10px',
    },
    rulerButton: {
        padding: '10px',
        fontSize: '14px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        backgroundColor: '#f0f0f0',
    },
    subheading: {
        fontSize: '20px',
        marginTop: '30px',
        marginBottom: '10px',
        color: '#333',
    },
    actionList: {
        listStyleType: 'none',
        padding: 0,
        maxHeight: '200px',
        overflowY: 'auto',
        border: '1px solid #ccc',
        borderRadius: '4px',
    },
    actionItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px',
        borderBottom: '1px solid #ccc',
        marginBottom: '10px',
    },
    removeButton: {
        padding: '5px 10px',
        fontSize: '12px',
        color: 'white',
        backgroundColor: '#e74c3c',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    doneButton: {
        padding: '12px',
        fontSize: '16px',
        color: 'white',
        backgroundColor: '#333',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        display: 'block',
        margin: '0 auto',
        marginTop: '20px',
    },
    inlineContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    inlineInput: {
        marginLeft: '10px',
        marginRight: '10px',
        flexGrow: 1,
    },
    inlineButton: {
        flexShrink: 0,
        color: 'white',
        backgroundColor: '#333',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
};

export default ProceduresPage;
