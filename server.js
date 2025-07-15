const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use('/Home', express.static(path.join(__dirname, 'Home')));

app.use('/Eye', express.static(path.join(__dirname, 'Eye')));

app.use('/Shree', express.static(path.join(__dirname, 'Shree')));

app.use('/Dhantha', express.static(path.join(__dirname, 'Dhantha')));

app.use('/Kalaagraha', express.static(path.join(__dirname, 'Kalaagraha')));

app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Home", "Home.html"));
});

app.get("/Eye", (req, res) => {
  res.sendFile(path.join(__dirname, "Eye", "Eye.html"));
});

app.get("/Shree", (req, res) => {
  res.sendFile(path.join(__dirname, "Shree", "Shree.html"));
});

app.get("/Dhantha", (req, res) => {
  res.sendFile(path.join(__dirname, "Dhantha", "Dhantha.html"));
});

app.get("/Kalaagraha", (req, res) => {
  res.sendFile(path.join(__dirname, "Kalaagraha", "Kalaagraha.html"));
});

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
