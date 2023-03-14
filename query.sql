CREATE DATABASE IF NOT EXISTS gptboard;

USE gptboard;

CREATE TABLE board (
  id INT AUTO_INCREMENT PRIMARY KEY,
  postdtime DATETIME,
  number INT UNIQUE,
  title VARCHAR(255),
  content TEXT
);