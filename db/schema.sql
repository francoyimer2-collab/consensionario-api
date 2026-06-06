
CREATE DATABASE IF NOT EXISTS concesionario
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE concesionario;

-- ─── TABLA: vehiculo ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS vehiculo (
  id_vehiculo   INT           NOT NULL AUTO_INCREMENT,
  marca         VARCHAR(50)   NOT NULL,
  modelo        VARCHAR(50)   NOT NULL,
  ano           YEAR          NOT NULL,
  precio        DECIMAL(12,2) NOT NULL,
  color         VARCHAR(30)   NOT NULL,
  kilometraje   INT           NOT NULL DEFAULT 0,
  estado        ENUM('Nuevo','Usado') NOT NULL,
  PRIMARY KEY (id_vehiculo)
) ENGINE=InnoDB;

-- ─── TABLA: cliente ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS cliente (
  id_cliente  INT          NOT NULL AUTO_INCREMENT,
  nombre      VARCHAR(100) NOT NULL,
  email       VARCHAR(100) NOT NULL,
  telefono    VARCHAR(20)  NOT NULL,
  ciudad      VARCHAR(60)  NOT NULL,
  PRIMARY KEY (id_cliente)
) ENGINE=InnoDB;

-- ─── TABLA: reserva ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS reserva (
  id_reserva       INT  NOT NULL AUTO_INCREMENT,
  fecha_reserva    DATE NOT NULL,
  tipo_transaccion ENUM('Compra','Arriendo') NOT NULL,
  id_cliente       INT  NOT NULL,
  id_vehiculo      INT  NOT NULL,
  PRIMARY KEY (id_reserva),
  CONSTRAINT fk_reserva_cliente
    FOREIGN KEY (id_cliente)  REFERENCES cliente(id_cliente)  ON DELETE CASCADE,
  CONSTRAINT fk_reserva_vehiculo
    FOREIGN KEY (id_vehiculo) REFERENCES vehiculo(id_vehiculo) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─── DATOS DE PRUEBA  ──────────────────────────
INSERT INTO vehiculo (marca, modelo, ano, precio, color, kilometraje, estado) VALUES
  ('Toyota',    'Corolla',  2022, 18500000, 'Blanco',  0,     'Nuevo'),
  ('Chevrolet', 'Spark',    2019, 28000000, 'Rojo',    45000, 'Usado'),
  ('Mazda',     'CX-5',     2023, 95000000, 'Gris',    0,     'Nuevo');

INSERT INTO cliente (nombre, email, telefono, ciudad) VALUES
  ('Ana García',    'ana@email.com',    '3001234567', 'Bogotá'),
  ('Luis Martínez', 'luis@email.com',   '3009876543', 'Medellín');

INSERT INTO reserva (fecha_reserva, tipo_transaccion, id_cliente, id_vehiculo) VALUES
  ('2025-06-01', 'Compra',   1, 1),
  ('2025-06-03', 'Arriendo', 2, 3);
