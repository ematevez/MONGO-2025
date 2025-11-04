// routes/ventas.js
const express = require('express');
const router = express.Router();
const Venta = require('../models/Venta');

/**
 * @swagger
 * /api/ventas:
 *   post:
 *     summary: Registrar una venta
 */
router.post('/', async (req, res) => {
  const venta = new Venta(req.body);
  await venta.save();
  res.status(201).json(venta);
});

/**
 * @swagger
 * /api/ventas:
 *   get:
 *     summary: Obtener todas las ventas
 */
router.get('/', async (req, res) => {
  const ventas = await Venta.find().populate('productos.producto');
  res.json(ventas);
});

module.exports = router;
