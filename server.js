const express = require("express");
const db = require("./config/db");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Project Management Tool API running");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});