require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB successfully');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/data', (req, res) => {
  res.send('Data received!');
});

app.get('/{id}', (req, res) => {
  const id = req.params.id;
  res.send(`You requested item with id: ${id}`);
});

app.delete('/{id}', (req, res) => {
  const id = req.params.id;
  res.send(`Item with id: ${id} deleted`);
});

app.put('/{id}', (req, res) => {
  const id = req.params.id;
  res.send(`Item with id: ${id} updated`);
});
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
}   );