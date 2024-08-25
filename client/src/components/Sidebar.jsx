// src/Sidebar.js
import React, { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { PanelMenu } from 'primereact/panelmenu';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Link } from 'react-router-dom';

const MySidebar = () => {
    const [visible, setVisible] = useState(false);

    const items = [
        {
            label: 'VetPro',
            icon: 'pi pi-fw pi-home',
            command: () => { setVisible(false); },
            template: (item, options) => {
                return (
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <span className={options.className}>{item.label}</span>
                    </Link>
                );
            }
        },
        {
            label: 'Add Patient',
            icon: 'pi pi-fw pi-home',
            command: () => { setVisible(false); },
            template: (item, options) => {
                return (
                    <Link to="/form" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <span className={options.className}>{item.label}</span>
                    </Link>
                );
            }
        },
        {
            label: 'History',
            icon: 'pi pi-fw pi-calendar',
            command: () => { setVisible(false); },
            template: (item, options) => {
                return (
                    <Link to="/history" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <span className={options.className}>{item.label}</span>
                    </Link>
                );
            }
        },
        {
            label: 'Metadata',
            icon: 'pi pi-fw pi-tags',
            command: () => { setVisible(false); },
            template: (item, options) => {
                return (
                    <Link to="/metadata" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <span className={options.className}>{item.label}</span>
                    </Link>
                );
            }
        },

    ];

    return (
        <div>
            <Button icon="pi pi-bars" onClick={() => setVisible(true)} style={styles.button} />
            <Sidebar visible={visible} onHide={() => setVisible(false)} style={styles.sidebar}>
                <PanelMenu model={items} style={styles.menu} />
            </Sidebar>
        </div>
    );
};

const styles = {
    button: {
        backgroundColor: '#333',
        color: 'white',
        border: 'none',
        position: 'fixed',
        top: '10px',
        left: '10px',
        cursor: 'pointer'
    },
    sidebar: {
        backgroundColor: 'white',
        width: '250px',
    },
    menu: {
        width: '100%',
    },
};

export default MySidebar;
