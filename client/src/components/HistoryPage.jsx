// src/HistoryPage.js
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Button } from 'primereact/button';

const HistoryPage = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [ownerName, setOwnerName] = useState('');
    const [patientName, setPatientName] = useState('');
    const [date, setDate] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://your ip:5000/vet/');
                const result = await response.json();
                setData(result);
                setFilteredData(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const filtered = data.filter(item => {
            const ownerMatch = item.ownername.toLowerCase().includes(ownerName.toLowerCase());
            const patientMatch = item.patientname.toLowerCase().includes(patientName.toLowerCase());
            const dateMatch = date ? new Date(item.procedures[0].actions[0].date_time).toLocaleDateString() === date.toLocaleDateString() : true;
            return ownerMatch && patientMatch && dateMatch;
        });
        setFilteredData(filtered);
    }, [ownerName, patientName, date, data]);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Procedure History</h2>
            <div style={styles.filters}>
                <InputText
                    type="text"
                    placeholder="Owner Name"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    style={styles.input}
                />
                <InputText
                    type="text"
                    placeholder="Patient Name"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    style={styles.input}
                />
                {/* <Calendar
                    value={date}
                    onChange={(e) => setDate(e.value)}
                    placeholder="Select Date"
                    dateFormat="mm/dd/yy"
                    showIcon
                    style={styles.input}
                /> */}
                <Button label="Print" icon="pi pi-print" onClick={handlePrint} style={styles.printButton} />
            </div>
            <ul style={styles.list}>
                {filteredData.map(item => (
                    <li key={item._id.$oid} style={styles.listItem}>
                        <p>Owner: {item.ownername}</p>
                        <p>Patient: {item.patientname}</p>
                        {item.procedures.map((procedure, index) => (
                            <div key={index}>
                                <p>Procedure: {procedure.procedure_name}</p>
                                <p>Doctor: {procedure.doctor_name}</p>
                                {procedure.actions.map((action, actionIndex) => (
                                    <div key={actionIndex} style={styles.actionItem}>
                                        <p>Action: {action.action}</p>
                                        <p>Date: {new Date(action.date_time).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </li>
                ))}
            </ul>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
    },
    heading: {
        textAlign: 'center',
        marginBottom: '20px',
    },
    filters: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px',
    },
    input: {
        padding: '10px',
        fontSize: '16px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        flex: '1',
        marginRight: '10px',
    },
    printButton: {
        marginLeft: '10px',
    },
    list: {
        listStyleType: 'none',
        padding: 0,
    },
    listItem: {
        padding: '10px',
        borderBottom: '1px solid #ccc',
        marginBottom: '10px',
    },
    actionItem: {
        marginLeft: '20px',
    },
};

export default HistoryPage;
