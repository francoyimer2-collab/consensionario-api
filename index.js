const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const vehiculosRoutes = require("./routes/vehiculos");
const clientesRoutes = require("./routes/clientes");
const reservasRoutes = require("./routes/reservas");

const app = express();
const PORT = process.env.PORT || 3000;

// ─── MIDDLEWARES ───────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sirve el HTML estático desde /public
app.use(express.static(path.join(__dirname, "public")));

// ─── RUTAS ────────────────────────────────────────────────
app.use("/vehiculos", vehiculosRoutes);
app.use("/clientes", clientesRoutes);
app.use("/reservas", reservasRoutes);

// Ruta raíz — sirve el index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Ruta 404 para endpoints no encontrados
app.use((req, res) => {
  res.status(404).json({ error: `Ruta ${req.method} ${req.path} no encontrada` });
});

// ─── INICIO DEL SERVIDOR ──────────────────────────────────
app.listen(PORT, () => {
  console.log(`- Servidor corriendo en http://localhost:${PORT}`);
});
