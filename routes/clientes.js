const express = require("express");
const router = express.Router();
const pool = require("../db/mysql");

// GET /clientes — Retorna todos los clientes
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM cliente ORDER BY id_cliente DESC");
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener clientes:", err.message);
    res.status(500).json({ error: "Error al obtener clientes" });
  }
});

// GET /clientes/:id — Retorna un cliente por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM cliente WHERE id_cliente = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Error al obtener cliente:", err.message);
    res.status(500).json({ error: "Error al obtener cliente" });
  }
});

// POST /clientes — Registra un nuevo cliente
router.post("/", async (req, res) => {
  const { nombre, email, telefono, ciudad } = req.body;

  if (!nombre || !email || !telefono || !ciudad) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO cliente (nombre, email, telefono, ciudad) VALUES (?, ?, ?, ?)",
      [nombre, email, telefono, ciudad]
    );
    res.status(201).json({
      message: "Cliente registrado exitosamente",
      id_cliente: result.insertId,
    });
  } catch (err) {
    console.error("Error al registrar cliente:", err.message);
    res.status(500).json({ error: "Error al registrar cliente" });
  }
});

// DELETE /clientes/:id — Elimina un cliente
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM cliente WHERE id_cliente = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    res.json({ message: "Cliente eliminado exitosamente" });
  } catch (err) {
    console.error("Error al eliminar cliente:", err.message);
    res.status(500).json({ error: "Error al eliminar cliente" });
  }
});

module.exports = router;
