const express = require("express");
const router = express.Router();
const pool = require("../db/mysql");

// GET /vehiculos — Retorna todos los vehículos
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM vehiculo ORDER BY id_vehiculo DESC");
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener vehículos:", err.message);
    res.status(500).json({ error: "Error al obtener vehículos" });
  }
});

// GET /vehiculos/:id — Retorna un vehículo por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM vehiculo WHERE id_vehiculo = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Vehículo no encontrado" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Error al obtener vehículo:", err.message);
    res.status(500).json({ error: "Error al obtener vehículo" });
  }
});

// POST /vehiculos — Registra un nuevo vehículo
router.post("/", async (req, res) => {
  const { marca, modelo, ano, precio, color, kilometraje, estado } = req.body;

  // CORRECCIÓN: Validamos que kilometraje no sea undefined ni null, permitiendo el número 0
  if (!marca || !modelo || !ano || !precio || !color || kilometraje === undefined || kilometraje === null || !estado) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO vehiculo (marca, modelo, ano, precio, color, kilometraje, estado) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [marca, modelo, ano, precio, color, kilometraje, estado]
    );
    res.status(201).json({
      message: "Vehículo registrado exitosamente",
      id_vehiculo: result.insertId,
    });
  } catch (err) {
    console.error("Error al registrar vehículo:", err.message);
    res.status(500).json({ error: "Error al registrar vehículo" });
  }
});

// DELETE /vehiculos/:id — Elimina un vehículo
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM vehiculo WHERE id_vehiculo = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Vehículo no encontrado" });
    }
    res.json({ message: "Vehículo eliminado exitosamente" });
  } catch (err) {
    console.error("Error al eliminar vehículo:", err.message);
    res.status(500).json({ error: "Error al eliminar vehículo" });
  }
});

module.exports = router;