const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const db = new sqlite3.Database('./gptboard.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the gptboard database.');
});

app.post('/post', (req, res) => {
  const { title, content } = req.body;
  console.log(`Title: ${title}\nContent: ${content}`);

  const sql = `INSERT INTO board (postdtime, number, title, content) 
                VALUES (datetime('now'), 
                        (SELECT COALESCE(MAX(number), 0) + 1 FROM board), 
                        ?, ?)`;

  db.run(sql, [title, content], (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Internal server error');
    }
    console.log(`A new post has been added.`);
    return res.sendStatus(200);
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
