const express = require("express");
const db = require("../db/database");
const auth = require("../middleware/auth");

const router = express.Router();

router.put("/me", auth, (req, res) => {
  const { name, address } = req.body;

  db.run(
    `UPDATE users SET name = ?, address = ? WHERE id = ?`,
    [name, address, req.user.id],
    () => res.status(204).send()
  );
});

module.exports = router;
