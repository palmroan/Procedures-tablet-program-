// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MySidebar from './components/Sidebar';
import FormPage from './components/FormPage';
import ProceduresPage from './components/Procedurepage';
import MetadataPage from './components/MetadataPage';
import HistoryPage from './components/HistoryPage'
import { Typewriter } from 'react-simple-typewriter';

const HomePage = () => (
    <div style={styles.content}>
        <h1 style={styles.heading}>Welcome to VetPro Procedures</h1>
        <p style={styles.paragraph}>Pick from the sidebar to start</p>
        <div style={styles.typewriter}>
            <Typewriter
                words={['Healing hands today', 'Your work matters', 'All the best today!']}
                loop={10000}
                cursor
                cursorStyle='_'
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={1000}
            />
        </div>
    </div>
);

function App() {
    return (
        <Router>
            <div className="App" style={styles.app}>
                <MySidebar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/form" element={<FormPage />} />
                    <Route path="/procedures" element={<ProceduresPage />} />
                    <Route path="/metadata" element={<MetadataPage />} />
                    <Route path="/History" element={<HistoryPage />} />
                </Routes>
            </div>
        </Router>
    );
}

const styles = {
    app: {
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f0f0f0',
        margin: 0,
        padding: 0,
        height: 'auto',
        minHeight: '100vh'
    },
    content: {
        marginLeft: '60px',
        padding: '20px',
    },
    heading: {
        color: '#333'
    },
    paragraph: {
        color: '#666'
    },
    typewriter: {
        marginTop: '20px',
        fontSize: '1.2em',
        color: '#333',
        fontWeight: 'bold'
    }
};

export default App;
