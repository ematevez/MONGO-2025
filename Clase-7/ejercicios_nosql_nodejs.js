const mongoose = require('mongoose');

// ----- Ejercicio 1 -----
const CredencialSchema = new mongoose.Schema({ usuario: String, password: String });
const RolSchema = new mongoose.Schema({ nombre: String });
const EmpleadoSchema = new mongoose.Schema({
  nombre: String,
  credencial: { type: mongoose.Schema.Types.ObjectId, ref: 'Credencial' },
  rol: { type: mongoose.Schema.Types.ObjectId, ref: 'Rol' }
});
const AccesoSchema = new mongoose.Schema({
  empleado: { type: mongoose.Schema.Types.ObjectId, ref: 'Empleado' },
  fecha: Date,
  dispositivo: String
});

// ----- Ejercicio 2 -----
const PacienteSchema = new mongoose.Schema({ nombre: String, historial: mongoose.ObjectId });
const HistorialSchema = new mongoose.Schema({ paciente: mongoose.ObjectId, notas: String });
const ConsultaSchema = new mongoose.Schema({ paciente: mongoose.ObjectId, fecha: Date, motivo: String, medicamentos: [String] });

// ----- Ejercicio 3 -----
const ProfesorSchema = new mongoose.Schema({ nombre: String, especialidad: String });
const CursoSchema = new mongoose.Schema({ nombre: String, duracion: Number, profesor: mongoose.ObjectId });
const EstudianteSchema = new mongoose.Schema({ nombre: String, correo: String });
const InscripcionSchema = new mongoose.Schema({ estudiante: mongoose.ObjectId, curso: mongoose.ObjectId });

// ----- Ejercicio 4 -----
const CategoriaSchema = new mongoose.Schema({ nombre: String });
const LibroSchema = new mongoose.Schema({ titulo: String, autor: String, categoria: mongoose.ObjectId });
const MiembroSchema = new mongoose.Schema({ nombre: String, fecha_inscripcion: Date });
const PrestamoSchema = new mongoose.Schema({ libro: mongoose.ObjectId, miembro: mongoose.ObjectId, fecha_prestamo: Date });

// ----- Ejercicio 5 -----
const DepartamentoSchema = new mongoose.Schema({ nombre: String, presupuesto: Number });
const ProyectoSchema = new mongoose.Schema({ nombre: String, fecha_inicio: Date, departamento: mongoose.ObjectId });
const AsignacionSchema = new mongoose.Schema({ empleado: mongoose.ObjectId, proyecto: mongoose.ObjectId, fecha_asignacion: Date });

// ----- Ejercicio 6 -----
const AsignaturaSchema = new mongoose.Schema({ nombre: String, creditos: Number });
const InscripcionAsignaturaSchema = new mongoose.Schema({ estudiante: mongoose.ObjectId, asignatura: mongoose.ObjectId });
const ProfesorAsignaturaSchema = new mongoose.Schema({ profesor: mongoose.ObjectId, asignatura: mongoose.ObjectId });

// ----- Ejercicio 7 -----
const ClienteSchema = new mongoose.Schema({ nombre: String, correo: String });
const ProductoSchema = new mongoose.Schema({ nombre: String, precio: Number });
const DescuentoSchema = new mongoose.Schema({ porcentaje: Number, descripcion: String });
const VentaSchema = new mongoose.Schema({ cliente: mongoose.ObjectId, producto: mongoose.ObjectId, fecha_venta: Date, descuento: mongoose.ObjectId });

// ----- Ejercicio 8 -----
const DirectorSchema = new mongoose.Schema({ nombre: String, nacionalidad: String });
const ActorSchema = new mongoose.Schema({ nombre: String, fecha_nacimiento: Date });
const PeliculaSchema = new mongoose.Schema({ titulo: String, anio: Number, director: mongoose.ObjectId });
const RepartoSchema = new mongoose.Schema({ actor: mongoose.ObjectId, pelicula: mongoose.ObjectId });

// Exportar modelos
module.exports = {
  Credencial: mongoose.model('Credencial', CredencialSchema),
  Rol: mongoose.model('Rol', RolSchema),
  Empleado: mongoose.model('Empleado', EmpleadoSchema),
  Acceso: mongoose.model('Acceso', AccesoSchema),

  Paciente: mongoose.model('Paciente', PacienteSchema),
  Historial: mongoose.model('Historial', HistorialSchema),
  Consulta: mongoose.model('Consulta', ConsultaSchema),

  Profesor: mongoose.model('Profesor', ProfesorSchema),
  Curso: mongoose.model('Curso', CursoSchema),
  Estudiante: mongoose.model('Estudiante', EstudianteSchema),
  Inscripcion: mongoose.model('Inscripcion', InscripcionSchema),

  Categoria: mongoose.model('Categoria', CategoriaSchema),
  Libro: mongoose.model('Libro', LibroSchema),
  Miembro: mongoose.model('Miembro', MiembroSchema),
  Prestamo: mongoose.model('Prestamo', PrestamoSchema),

  Departamento: mongoose.model('Departamento', DepartamentoSchema),
  Proyecto: mongoose.model('Proyecto', ProyectoSchema),
  Asignacion: mongoose.model('Asignacion', AsignacionSchema),

  Asignatura: mongoose.model('Asignatura', AsignaturaSchema),
  InscripcionAsignatura: mongoose.model('InscripcionAsignatura', InscripcionAsignaturaSchema),
  ProfesorAsignatura: mongoose.model('ProfesorAsignatura', ProfesorAsignaturaSchema),

  Cliente: mongoose.model('Cliente', ClienteSchema),
  Producto: mongoose.model('Producto', ProductoSchema),
  Descuento: mongoose.model('Descuento', DescuentoSchema),
  Venta: mongoose.model('Venta', VentaSchema),

  Director: mongoose.model('Director', DirectorSchema),
  Actor: mongoose.model('Actor', ActorSchema),
  Pelicula: mongoose.model('Pelicula', PeliculaSchema),
  Reparto: mongoose.model('Reparto', RepartoSchema),
};
