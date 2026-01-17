const express = require("express");
const db = require("../db/database");
const auth = require("../middleware/auth");

const router = express.Router();

// CREATE
router.post("/", auth, (req, res) => {
  const g = req.body;
  db.run(
    `INSERT INTO games VALUES (NULL,?,?,?,?,?,?,?)`,
    [
      g.name,
      g.publisher,
      g.yearPublished,
      g.system,
      g.condition,
      g.previousOwners,
      req.user.id
    ],
    function () {
      res.status(201).json({ id: this.lastID });
    }
  );
});

// SEARCH
router.get("/", auth, (req, res) => {
  const { name } = req.query;
  const sql = name
    ? `SELECT * FROM games WHERE name LIKE ?`
    : `SELECT * FROM games`;
  db.all(sql, name ? [`%${name}%`] : [], (_, rows) =>
    res.json(rows)
  );
});

// UPDATE (owner only)
router.put("/:id", auth, (req, res) => {
  db.run(
    `UPDATE games SET name=?, publisher=?, yearPublished=?, system=?, condition=?, previousOwners=?
     WHERE id=? AND ownerId=?`,
    [...Object.values(req.body), req.params.id, req.user.id],
    function () {
      if (this.changes === 0)
        return res.status(403).json({ error: "Forbidden" });
      res.status(204).send();
    }
  );
});

// DELETE
router.delete("/:id", auth, (req, res) => {
  db.run(
    `DELETE FROM games WHERE id=? AND ownerId=?`,
    [req.params.id, req.user.id],
    function () {
      if (this.changes === 0)
        return res.status(403).json({ error: "Forbidden" });
      res.status(204).send();
    }
  );
});

module.exports = router;
