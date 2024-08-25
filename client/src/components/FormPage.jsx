// src/FormPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const FormPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        ownerName: '',
        patientName: '',
        breed: '',
        weight: '',
        age: '',
        doctor: '',
        procedure: '',
    });
    const [existingClients, setExistingClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        if (selectedClient) {
            console.log("Selected Client: ", selectedClient);
            setFormData({
                ownerName: selectedClient.ownername,
                patientName: selectedClient.patientname,
                breed: selectedClient.breed || '',
                weight: selectedClient.weight || '',
                age: selectedClient.age || '',
                doctor: '',
                procedure: '',
            });
        }
    }, [selectedClient]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/procedures', { state: { formData, selectedClient } });
    };

    const fetchExistingClients = async () => {
        try {
            const response = await fetch('http://localhost:5000/vet/');
            const result = await response.json();
            console.log("Fetched Clients: ", result);
            setExistingClients(result);
            setShowDialog(true);
        } catch (error) {
            toast.error('Error fetching existing clients');
        }
    };

    const handleClientSelect = (client) => {
        setSelectedClient(client);
        setShowDialog(false);
    };

    return (
        <div style={styles.container}>
            <ToastContainer />
            <h2 style={styles.heading}>Patient Information</h2>
            {/* <Button
                label="Existing Client"
                icon="pi pi-search"
                style={styles.existingClientButton}
                onClick={fetchExistingClients}
            /> */}
            <form style={styles.form} onSubmit={handleSubmit}>
                <div style={styles.field}>
                    <label style={styles.label}>Owner Name</label>
                    <InputText
                        type="text"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        style={styles.input}
                    />
                </div>
                <div style={styles.field}>
                    <label style={styles.label}>Patient Name</label>
                    <InputText
                        type="text"
                        name="patientName"
                        value={formData.patientName}
                        onChange={handleChange}
                        style={styles.input}
                    />
                </div>
                <div style={styles.field}>
                    <label style={styles.label}>Breed</label>
                    <InputText
                        type="text"
                        name="breed"
                        value={formData.breed}
                        onChange={handleChange}
                        style={styles.input}
                    />
                </div>
                <div style={styles.field}>
                    <label style={styles.label}>Weight</label>
                    <InputText
                        type="text"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        style={styles.input}
                    />
                </div>
                <div style={styles.field}>
                    <label style={styles.label}>Age</label>
                    <InputText
                        type="text"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        style={styles.input}
                    />
                </div>
                <div style={styles.field}>
                    <label style={styles.label}>Doctor</label>
                    <InputText
                        type="text"
                        name="doctor"
                        value={formData.doctor}
                        onChange={handleChange}
                        style={styles.input}
                    />
                </div>
                <div style={styles.field}>
                    <label style={styles.label}>Procedure</label>
                    <InputText
                        type="text"
                        name="procedure"
                        value={formData.procedure}
                        onChange={handleChange}
                        style={styles.input}
                    />
                </div>
                <Button label="Submit" type="submit" className="p-button-primary" style={styles.button} />
            </form>

            <Dialog
                header="Select Existing Client"
                visible={showDialog}
                style={{ width: '50vw' }}
                onHide={() => setShowDialog(false)}
            >
                <DataTable value={existingClients} selectionMode="single" onRowSelect={(e) => handleClientSelect(e.data)}>
                    <Column field="ownername" header="Owner Name" />
                    <Column field="patientname" header="Patient Name" />
                    <Column field="breed" header="Breed" />
                    <Column field="weight" header="Weight" />
                    <Column field="age" header="Age" />
                </DataTable>
            </Dialog>
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
    existingClientButton: {
        marginBottom: '20px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
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
    button: {
        padding: '12px',
        fontSize: '16px',
        color: 'white',
        backgroundColor: '#333',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
};

export default FormPage;
