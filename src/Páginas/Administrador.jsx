import React, { useEffect, useState } from "react";
import API from "../Servicios/api";
import "../styles/admin.css";
import Menu from "../Components/menu";

export default function Administrador() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ estudiantes: 0, personal: 0 });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [form, setForm] = useState({
    id: "",
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    rol: "",
    id_curso: "",
  });

  // ===========================
  // 🔹 Obtener datos iniciales
  // ===========================
  useEffect(() => {
    obtenerDatos();
  }, []);

  const obtenerDatos = async () => {
    try {
      const [usuariosRes, statsRes] = await Promise.all([
        API.get("/usuarios"),
        API.get("/estadisticas"),
      ]);
      setUsuarios(usuariosRes.data);
      setStats(statsRes.data);
    } catch (err) {
      setError("No se pudieron cargar los datos del administrador.");
    } finally {
      setCargando(false);
    }
  };

  // ===========================
  // 🔹 Manejo de formulario
  // ===========================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      id: "",
      nombre: "",
      apellido: "",
      email: "",
      password: "",
      rol: "",
      id_curso: "",
    });
    setModoEdicion(false);
  };
<Menu></Menu>
  // ===========================
  // 🔹 Crear o Editar usuario
  // ===========================
  const guardarUsuario = async (e) => {
    e.preventDefault();
    try {
      if (modoEdicion) {
        await API.put(`/editar/${form.id}`, form);
        setUsuarios((prev) =>
          prev.map((u) => (u.id === form.id ? { ...u, ...form } : u))
        );
      } else {
        const res = await API.post("/crear", form);
        setUsuarios((prev) => [...prev, res.data]);
      }
      resetForm();
      alert("Usuario guardado correctamente.");
    } catch (err) {
      alert("Error al guardar usuario.");
    }
  };

  // ===========================
  // 🔹 Cargar datos para editar
  // ===========================
  const editarUsuario = (usuario) => {
    setModoEdicion(true);
    setForm(usuario);
  };

  // ===========================
  // 🔹 Eliminar usuario
  // ===========================
  const eliminarUsuario = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      await API.delete(`/eliminar/${id}`);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch {
      alert("Error al eliminar usuario.");
    }
  };

  // ===========================
  // 🔹 Renderizado
  // ===========================
  if (cargando) return <p className="admin-loading">Cargando...</p>;
  if (error) return <p className="admin-error">{error}</p>;

  return (
    <div className="admin-layout">
      {/* ===========================
          🔹 Menú lateral
      =========================== */}
      <aside className="admin-menu">
        <h2>GenuineSchool</h2>
        <nav>
          <ul>
            <li><a href="/admin">🏠 Inicio</a></li>
            <li><a href="/admin/usuarios" className="active">👥 Usuarios</a></li>
            <li><a href="/admin/tareas">📝 Tareas</a></li>
            <li><a href="/admin/cursos">📚 Cursos</a></li>
            <li><a href="/admin/metricas">📊 Métricas</a></li>
          </ul>
        </nav>
      </aside>

      {/* ===========================
          🔹 Contenido principal
      =========================== */}
      <main className="admin-main">
        <h1>Panel de Administración</h1>

        <div className="admin-stats">
          <div className="stat-card">
            <h3>Estudiantes</h3>
            <p>{stats.estudiantes}</p>
          </div>
          <div className="stat-card">
            <h3>Personal</h3>
            <p>{stats.personal}</p>
          </div>
        </div>

        {/* ===========================
            🔹 Formulario Crear/Editar
        =========================== */}
        <div className="form-container">
          <h2>{modoEdicion ? "Editar Usuario" : "Crear Usuario"}</h2>
          <form onSubmit={guardarUsuario} className="admin-form">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="apellido"
              placeholder="Apellido"
              value={form.apellido}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            {!modoEdicion && (
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={form.password}
                onChange={handleChange}
                required
              />
            )}
            <select name="rol" value={form.rol} onChange={handleChange} required>
              <option value="">Seleccionar rol</option>
              <option value="estudiante">Estudiante</option>
              <option value="personal">Personal</option>
            </select>
            <input
              type="text"
              name="id_curso"
              placeholder="ID del curso (opcional)"
              value={form.id_curso}
              onChange={handleChange}
            />
            <button type="submit" className="btn-guardar">
              {modoEdicion ? "Actualizar" : "Crear"}
            </button>
            {modoEdicion && (
              <button
                type="button"
                onClick={resetForm}
                className="btn-cancelar"
              >
                Cancelar
              </button>
            )}
          </form>
        </div>

        {/* ===========================
            🔹 Tabla de usuarios
        =========================== */}
        <h2>Usuarios registrados</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Curso</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.nombre} {u.apellido}</td>
                <td>{u.email}</td>
                <td>{u.rol}</td>
                <td>{u.id_curso || "—"}</td>
                <td>
                  <button
                    onClick={() => editarUsuario(u)}
                    className="btn-editar"
                  >
                    ✏
                  </button>
                  <button
                    onClick={() => eliminarUsuario(u.id)}
                    className="btn-eliminar"
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}