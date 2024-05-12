const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/procedures')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const procedureSchema = new mongoose.Schema({
  ownerName: String,
  patientName: String,
  breed: String,
  weight: String,
  age: String,
  actions: [String],
  timestamps: [String]
});

const Procedure = mongoose.model('Procedure', procedureSchema);

app.post('/api/procedures', async (req, res) => {
  const { ownerName, patientName, breed, weight, age, actions, timestamps } = req.body;
  try {
    const newProcedure = new Procedure({ ownerName, patientName, breed, weight, age, actions, timestamps });
    await newProcedure.save();
    res.status(201).json(newProcedure);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
