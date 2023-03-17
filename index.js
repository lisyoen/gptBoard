const express = require('express');
const bodyParser = require('body-parser');
const { Router } = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Create a new SQLite database
const db = new sqlite3.Database('./gptboard.db', err => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the gptboard database.');
});

// define route for retrieving list of posts
app.get('/list', (req, res) => {
  // query to retrieve all posts from database
  const sql = 'SELECT * FROM board';

  // execute query
  db.all(sql, [], (err, rows) => {
    if (err) {
      // if error occurs, return error response
      res.status(500).json({ error: err.message });
      return;
    }

    // return list of posts as response
    res.json(rows);
  });
});

// Create a new post
app.post('/item', (req, res) => {
  const { title, password, content } = req.body;
  console.log(`Title: ${title}, Password: ${password}, Content: ${content}`);

  const sql = `INSERT INTO board (postdtime, number, password, title, content) 
               VALUES (datetime('now', 'localtime'), 
                       (SELECT COALESCE(MAX(number), 0) + 1 FROM board), 
                       ?, ?, ?)`;
  db.run(sql, [password, title, content], function(err) {
    if (err) {
      console.error(err.message);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});

app.use(express.static('public'));
