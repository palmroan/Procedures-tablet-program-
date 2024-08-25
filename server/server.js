const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors());

const metadataFilePath = '../client/src/components/metadata.json';

app.get('/metadata', (req, res) => {
    fs.readFile(metadataFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading metadata');
        }
        res.send(JSON.parse(data));
    });
});

app.post('/metadata', (req, res) => {
    const newMetadata = req.body;
    fs.writeFile(metadataFilePath, JSON.stringify(newMetadata, null, 2), 'utf8', (err) => {
        if (err) {
            return res.status(500).send('Error writing metadata');
        }
        res.send('Metadata updated successfully');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
