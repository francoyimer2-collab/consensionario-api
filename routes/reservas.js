const express = require("express");
const router = express.Router();
const pool = require("../db/mysql");

// GET /reservas — Retorna todas las reservas con JOIN a cliente y vehículo
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        r.id_reserva,
        r.fecha_reserva,
        r.tipo_transaccion,
        r.id_cliente,
        r.id_vehiculo,
        c.nombre AS nombre_cliente,
        c.email AS email_cliente,
        v.marca,
        v.modelo,
        v.ano,
        v.precio,
        v.color,
        v.estado
      FROM reserva r
      INNER JOIN cliente c ON r.id_cliente = c.id_cliente
      INNER JOIN vehiculo v ON r.id_vehiculo = v.id_vehiculo
      ORDER BY r.id_reserva DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener reservas:", err.message);
    res.status(500).json({ error: "Error al obtener reservas" });
  }
});

// POST /reservas — Registra una nueva reserva
router.post("/", async (req, res) => {
  const { fecha_reserva, tipo_transaccion, id_cliente, id_vehiculo } = req.body;

  if (!fecha_reserva || !tipo_transaccion || !id_cliente || !id_vehiculo) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO reserva (fecha_reserva, tipo_transaccion, id_cliente, id_vehiculo) VALUES (?, ?, ?, ?)",
      [fecha_reserva, tipo_transaccion, id_cliente, id_vehiculo]
    );
    res.status(201).json({
      message: "Reserva registrada exitosamente",
      id_reserva: result.insertId,
    });
  } catch (err) {
    console.error("Error al registrar reserva:", err.message);
    res.status(500).json({ error: "Error al registrar reserva" });
  }
});

// DELETE /reservas/:id — Elimina una reserva
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM reserva WHERE id_reserva = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }
    res.json({ message: "Reserva eliminada exitosamente" });
  } catch (err) {
    console.error("Error al eliminar reserva:", err.message);
    res.status(500).json({ error: "Error al eliminar reserva" });
  }
});

module.exports = router;
