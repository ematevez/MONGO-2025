// EJERCICIOS PRÁCTICOS INTEGRADOS - NODE.JS + MONGOOSE y atlas
// -----------------------------------------------
// Instalar node
//npm init -y
// Requiere: 
//npm install mongodb readline-sync mongoose
//TODO Solo a para ver como se realizan las consultas en mongo desde un lenguaje de programacion no me meto en otra materia

const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/C334', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });
// mongoose.connect('mongodb+srv://user:user@cluster0.lxfra.mongodb.net/ejerciciosClase7?retryWrites=true&w=majority&appName=Cluster0', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });

mongoose.connect('mongodb+srv://user:user@noviembre.ur7s9iw.mongodb.net/?appName=Noviembre', 
{
  useNewUrlParser: true,
  useUnifiedTopology: true
});



// ------------------- EJERCICIO 1 -------------------
const CredencialSchema = new mongoose.Schema({ usuario: String, password: String });
const RolSchema = new mongoose.Schema({ nombre: String });
const EmpleadoSchema = new mongoose.Schema({ nombre: String, credencial: { type: mongoose.Schema.Types.ObjectId, ref: 'Credencial' }, rol: { type: mongoose.Schema.Types.ObjectId, ref: 'Rol' } });
const AccesoSchema = new mongoose.Schema({ empleado: { type: mongoose.Schema.Types.ObjectId, ref: 'Empleado' }, fecha: Date, dispositivo: String });

const Credencial = mongoose.model('Credencial', CredencialSchema);
const Rol = mongoose.model('Rol', RolSchema);
const Empleado = mongoose.model('Empleado', EmpleadoSchema);
const Acceso = mongoose.model('Acceso', AccesoSchema);

// ------------------- EJERCICIO 2 -------------------
const PacienteSchema = new mongoose.Schema({ nombre: String, historial: mongoose.ObjectId });
const HistorialSchema = new mongoose.Schema({ paciente: mongoose.ObjectId, notas: String });
const ConsultaSchema = new mongoose.Schema({ paciente: mongoose.ObjectId, fecha: Date, motivo: String, medicamentos: [String] });

const Paciente = mongoose.model('Paciente', PacienteSchema);
const Historial = mongoose.model('Historial', HistorialSchema);
const Consulta = mongoose.model('Consulta', ConsultaSchema);

// ------------------- EJERCICIO 3 -------------------
const CategoriaSchema = new mongoose.Schema({ nombre: String });
const LibroSchema = new mongoose.Schema({ titulo: String, autor: String, categoria: mongoose.ObjectId, estado : String });
const MiembroSchema = new mongoose.Schema({ nombre: String, fecha_inscripcion: Date });
const PrestamoSchema = new mongoose.Schema({ libro: mongoose.ObjectId, miembro: mongoose.ObjectId, fecha_prestamo: Date });

const Libro = mongoose.model('Libro', LibroSchema);
const Categoria = mongoose.model('Categoria', CategoriaSchema);
const Miembro = mongoose.model('Miembro', MiembroSchema);
const Prestamo = mongoose.model('Prestamo', PrestamoSchema);

// ------------------- EJERCICIO 4 -------------------
const DepartamentoSchema = new mongoose.Schema({ nombre: String, presupuesto: Number });
const ProyectoSchema = new mongoose.Schema({ nombre: String, fecha_inicio: Date, departamento: mongoose.ObjectId });
const AsignacionSchema = new mongoose.Schema({ empleado: mongoose.ObjectId, proyecto: mongoose.ObjectId, fecha_asignacion: Date });


const Proyecto = mongoose.model('Proyecto', ProyectoSchema);
const Departamento = mongoose.model('Departamento', DepartamentoSchema);
const Asignacion = mongoose.model('Asignacion', AsignacionSchema);

// ------------------- EJERCICIO 5 -------------------


const CursoSchema = new mongoose.Schema({ nombre: String, duracion: Number, profesor: mongoose.ObjectId });
const EstudianteSchema = new mongoose.Schema({ nombre: String, correo: String });
const ProfesorSchema = new mongoose.Schema({ nombre: String, especialidad: String });
const InscripcionSchema = new mongoose.Schema({ estudiante: mongoose.ObjectId, curso: mongoose.ObjectId });

const Curso = mongoose.model('Curso', CursoSchema);
const Estudiante = mongoose.model('Estudiante', EstudianteSchema);
const Profesor = mongoose.model('Profesor', ProfesorSchema);
const Inscripcion = mongoose.model('Inscripcion', InscripcionSchema);

// ------------------- EJERCICIO 6 -------------------
const AsignaturaSchema = new mongoose.Schema({ nombre: String, creditos: Number });
const InscripcionAsignaturaSchema = new mongoose.Schema({ estudiante: mongoose.ObjectId, asignatura: mongoose.ObjectId });
const ProfesorAsignaturaSchema = new mongoose.Schema({ profesor: mongoose.ObjectId, asignatura: mongoose.ObjectId });

const Asignatura = mongoose.model('Asignatura', AsignaturaSchema);
const InscripcionAsignatura = mongoose.model('InscripcionAsignatura', InscripcionAsignaturaSchema);
const ProfesorAsignatura = mongoose.model('ProfesorAsignatura', ProfesorAsignaturaSchema);

// ------------------- EJERCICIO 7 -------------------
const ClienteSchema = new mongoose.Schema({ nombre: String, correo: String });
const ProductoSchema = new mongoose.Schema({ nombre: String, precio: Number });
const DescuentoSchema = new mongoose.Schema({ porcentaje: Number, descripcion: String });
const VentaSchema = new mongoose.Schema({ cliente: mongoose.ObjectId, producto: mongoose.ObjectId, fecha_venta: Date, descuento: mongoose.ObjectId });

const Cliente = mongoose.model('Cliente', ClienteSchema);
const Producto = mongoose.model('Producto', ProductoSchema);
const Descuento = mongoose.model('Descuento', DescuentoSchema);
const Venta = mongoose.model('Venta', VentaSchema);

// ------------------- EJERCICIO 8 -------------------
const PeliculaSchema = new mongoose.Schema({ titulo: String, anio: Number, director: mongoose.ObjectId });
const ActorSchema = new mongoose.Schema({ nombre: String, fecha_nacimiento: Date });
const DirectorSchema = new mongoose.Schema({ nombre: String, nacionalidad: String });
const RepartoSchema = new mongoose.Schema({ actor: mongoose.ObjectId, pelicula: mongoose.ObjectId });

const Pelicula = mongoose.model('Pelicula', PeliculaSchema);
const Actor = mongoose.model('Actor', ActorSchema);
const Director = mongoose.model('Director', DirectorSchema);
const Reparto = mongoose.model('Reparto', RepartoSchema);

// --------- INSERCIÓN DE DATOS DE EJEMPLO ---------
async function insertarDatos() {
  const rol = await Rol.create({ nombre: 'Administrador' });
  const cred = await Credencial.create({ usuario: 'admin', password: 'admin123' });
  const emp = await Empleado.create({ nombre: 'Laura', credencial: cred._id, rol: rol._id });
  await Acceso.create({ empleado: emp._id, fecha: new Date(), dispositivo: 'Laptop' });

  const paciente = await Paciente.create({ nombre: 'Juan Pérez' });
  const historial = await Historial.create({ paciente: paciente._id, notas: 'Diabético' });
  paciente.historial = historial._id;
  await paciente.save();
  await Consulta.create({ paciente: paciente._id, fecha: new Date(), motivo: 'Chequeo', medicamentos: ['Metformina'] });

  const profesor = await Profesor.create({ nombre: 'Carlos Ruiz', especialidad: 'Matemática' });
  const curso = await Curso.create({ nombre: 'Álgebra', duracion: 60, profesor: profesor._id });
  const estudiante = await Estudiante.create({ nombre: 'Ana Gómez', correo: 'ana@mail.com' });
  await Inscripcion.create({ estudiante: estudiante._id, curso: curso._id });

  const cat = await Categoria.create({ nombre: 'Ciencia Ficción' });
  const libro = await Libro.create({ titulo: 'Duna', autor: 'Frank Herbert', categoria: cat._id });
  const miembro = await Miembro.create({ nombre: 'Lucía', fecha_inscripcion: new Date() });
  await Prestamo.create({ libro: libro._id, miembro: miembro._id, fecha_prestamo: new Date() });

  const depto = await Departamento.create({ nombre: 'TI', presupuesto: 500000 });
  const proyecto = await Proyecto.create({ nombre: 'Sistema Web', fecha_inicio: new Date(), departamento: depto._id });
  await Asignacion.create({ empleado: emp._id, proyecto: proyecto._id, fecha_asignacion: new Date() });

  const asignatura = await Asignatura.create({ nombre: 'Programación', creditos: 6 });
  await InscripcionAsignatura.create({ estudiante: estudiante._id, asignatura: asignatura._id });
  await ProfesorAsignatura.create({ profesor: profesor._id, asignatura: asignatura._id });

  const cliente = await Cliente.create({ nombre: 'Daniel', correo: 'daniel@mail.com' });
  const prod = await Producto.create({ nombre: 'Notebook', precio: 1200 });
  const desc = await Descuento.create({ porcentaje: 10, descripcion: 'Descuento Estudiante' });
  await Venta.create({ cliente: cliente._id, producto: prod._id, fecha_venta: new Date(), descuento: desc._id });

  const director = await Director.create({ nombre: 'Nolan', nacionalidad: 'Británica' });
  const actor = await Actor.create({ nombre: 'Leonardo DiCaprio', fecha_nacimiento: new Date('1974-11-11') });
  const peli = await Pelicula.create({ titulo: 'Inception', anio: 2010, director: director._id });
  await Reparto.create({ actor: actor._id, pelicula: peli._id });

  console.log('Datos insertados correctamente');
  mongoose.connection.close();
}

insertarDatos();
