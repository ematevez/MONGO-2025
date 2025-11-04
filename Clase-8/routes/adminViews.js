const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');

// Login - Mostrar formulario
router.get('/admin/login', (req, res) => {
  res.render('login');
});

// Login - Procesar formulario
router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;
  const usuario = await Usuario.findOne({ email });

  if (!usuario) {
    return res.send('❌ Usuario no encontrado');
  }

  const valido = await bcrypt.compare(password, usuario.password);
  if (!valido) {
    return res.send('❌ Contraseña incorrecta');
  }

  // 👇 Esto lo completamos con sesión más adelante
  res.redirect('/admin');
});

// Dashboard
router.get('/admin', async (req, res) => {
  const productos = await Producto.find();
  res.render('dashboard', { productos });
});

// Formulario nuevo
router.get('/admin/agregar', (req, res) => {
  res.render('formulario', { producto: null });
});

// Formulario editar
router.get('/admin/editar/:id', async (req, res) => {
  const producto = await Producto.findById(req.params.id);
  res.render('formulario', { producto });
});

// Mostrar formulario de registro
router.get('/admin/registrar', (req, res) => {
  res.render('registro');
});

// Procesar registro
router.post('/admin/registrar', async (req, res) => {
  const { email, password } = req.body;

  const existe = await Usuario.findOne({ email });
  if (existe) {
    return res.send('⚠️ Ya existe un usuario con ese email');
  }

  const hash = await bcrypt.hash(password, 10);
  const nuevo = new Usuario({ email, password: hash });
  await nuevo.save();

  res.send('✅ Usuario creado correctamente. <a href="/admin/login">Iniciar sesión</a>');
});


module.exports = router;

