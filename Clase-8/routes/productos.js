
// routes/productos.js
const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');

/**
 * @swagger
 * /api/productos:
 *   get:
 *     summary: Obtener todos los productos activos
 *     responses:
 *       200:
 *         description: Lista de productos
 */
router.get('/', async (req, res) => {
  const productos = await Producto.find({ activo: true });
  res.json(productos);
});

/**
 * @swagger
 * /api/productos:
 *   post:
 *     summary: Crear un nuevo producto
 */
router.post('/', async (req, res) => {
  const nuevo = new Producto(req.body);
  await nuevo.save();
  res.status(201).json(nuevo);
});

module.exports = router;