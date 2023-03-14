const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/test', (req, res) => {
    console.log('received');
  const input = req.body.text;
  const response = { text: input };
  res.json(response);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});