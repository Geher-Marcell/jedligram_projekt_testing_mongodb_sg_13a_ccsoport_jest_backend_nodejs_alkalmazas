const express = require('express');
const app = express();
const port = 3000;

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