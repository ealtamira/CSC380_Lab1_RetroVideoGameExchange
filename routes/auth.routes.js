const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db/database");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password, address } = req.body;
  const hash = await bcrypt.hash(password, 10);

  db.run(
    `INSERT INTO users (name, email, password, address) VALUES (?, ?, ?, ?)`,
    [name, email, hash, address],
    function (err) {
      if (err) {
        return res.status(400).json({ error: "Email already exists" });
      }
      res.status(201).json({ id: this.lastID });
    }
  );
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, "SECRET_KEY");
    res.json({ token });
  });
});

module.exports = router;
