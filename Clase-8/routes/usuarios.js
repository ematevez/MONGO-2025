// routes/usuarios.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');

/**
 * @swagger
 * /api/usuarios/register:
 *   post:
 *     summary: Registrar un usuario admin
 */
router.post('/register', async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 10);
  const usuario = new Usuario({ email: req.body.email, password: hash });
  await usuario.save();
  res.status(201).json(usuario);
});

module.exports = router;