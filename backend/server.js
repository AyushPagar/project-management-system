const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// SQLite Database
const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.error("Database error:", err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});

// Create table if not exists
db.run(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT
)
`);

// Register API
app.post("/api/auth/register", (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const query = `INSERT INTO users (name,email,password) VALUES (?,?,?)`;

  db.run(query, [name, email, password], function (err) {
    if (err) {
      return res.status(400).json({ message: "User already exists" });
    }

    res.json({
      message: "User registered successfully",
      userId: this.lastID,
      user: { id: this.lastID, name, email },
    });
  });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  db.get(
    `SELECT id, name, email, password FROM users WHERE email = ?`,
    [email],
    (err, user) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      return res.json({
        message: "Login successful",
        user: { id: user.id, name: user.name, email: user.email },
      });
    }
  );
});

// Test API
app.get("/", (req, res) => {
  res.send("Backend running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
