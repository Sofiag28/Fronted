import React, { useEffect, useState } from "react";
import {
  fetchTareasCurso,
  fetchTodasTareas, // nuevo servicio
  createTarea,
  updateTarea,
  deleteTarea,
} from "../Servicios/api";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Menu from "../Components/menu";
import "../styles/ProfesorDashboard.css";

export default function TareasPorCurso() {
  const [curso, setCurso] = useState("");
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nuevaTarea, setNuevaTarea] = useState({
    titulo: "",
    descripcion: "",
    estado: "Pendiente",
    fecha_entrega: "",
    id_curso: "",
  });
  const [editando, setEditando] = useState(null);

  // 🔹 Obtener tareas (todas o filtradas)
  const obtenerTareas = async () => {
    setLoading(true);
    try {
      let res;
      if (curso) {
        res = await fetchTareasCurso(curso);
      } else {
        res = await fetchTodasTareas(); // obtiene todas las tareas
      }
      setTareas(res.data);
    } catch (error) {
      console.error("Error al obtener tareas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerTareas();
  }, [curso]);

  // 🔹 Crear nueva tarea
  const handleCrearTarea = async (e) => {
    e.preventDefault();
    if (!nuevaTarea.titulo.trim() || !nuevaTarea.id_curso) {
      return alert("Debe ingresar el título y seleccionar un curso");
    }

    try {
      const res = await createTarea(nuevaTarea);
      setTareas([...tareas, res.data]);
      setNuevaTarea({
        titulo: "",
        descripcion: "",
        estado: "Pendiente",
        fecha_entrega: "",
        id_curso: "",
      });
      alert("Tarea creada correctamente 🎉");
    } catch (error) {
      console.error("Error al crear tarea:", error);
      alert("Hubo un error al crear la tarea 😢");
    }
  };

  // 🔹 Editar tarea
  const handleEditarTarea = (tarea) => {
    setEditando(tarea);
    setNuevaTarea({
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      estado: tarea.estado,
      fecha_entrega: tarea.fecha_entrega
        ? tarea.fecha_entrega.split("T")[0]
        : "",
      id_curso: tarea.id_curso || "",
    });
  };

  // 🔹 Actualizar tarea
  const handleActualizarTarea = async (e) => {
  e.preventDefault();
  console.log("Editando tarea con ID:", editando?.id);

  if (!editando?.id) {
    alert("Error: no hay tarea seleccionada para editar.");
    return;
  }

  try {
    const res = await updateTarea(editando.id, nuevaTarea);
    setTareas((prev) =>
      prev.map((t) => (t.id === editando.id ? res.data : t))
    );
    setEditando(null);
    setNuevaTarea({
      titulo: "",
      descripcion: "",
      estado: "Pendiente",
      fecha_entrega: "",
      id_curso: "",
    });
    alert("Tarea actualizada correctamente ✅");
  } catch (error) {
    console.error("Error al actualizar tarea:", error);
    alert("Hubo un error al actualizar la tarea 😢");
  }
};

  // 🔹 Eliminar tarea
  const handleEliminarTarea = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta tarea?")) return;
    try {
      await deleteTarea(id);
      setTareas(tareas.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error al eliminar tarea:", error);
    }
  };

  return (
    <div className="profesor-container">
      <Menu />
      <h2 className="titulo-lista">📝 Tareas por Curso</h2>

      {/* 🔹 Filtro de curso */}
      <div className="acciones-superiores">
        <div className="filtro">
          <label>Seleccionar curso:</label>
          <select value={curso} onChange={(e) => setCurso(e.target.value)}>
            {[...Array(11).keys()].map((i) => (
              <option key={i + 1} value={i + 1}>
                Curso {i + 1}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 🔹 Formulario de creación / edición */}
      <form
        onSubmit={editando ? handleActualizarTarea : handleCrearTarea}
        className="form-tareas"
      >
        <input
          type="text"
          placeholder="Título de la tarea"
          value={nuevaTarea.titulo}
          onChange={(e) =>
            setNuevaTarea({ ...nuevaTarea, titulo: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Descripción"
          value={nuevaTarea.descripcion}
          onChange={(e) =>
            setNuevaTarea({ ...nuevaTarea, descripcion: e.target.value })
          }
        />

        <select
          value={nuevaTarea.id_curso}
          onChange={(e) =>
            setNuevaTarea({ ...nuevaTarea, id_curso: e.target.value })
          }
        >
          <option value="">Seleccione un curso</option>
          {[...Array(11).keys()].map((i) => (
            <option key={i + 1} value={i + 1}>
              Curso {i + 1}
            </option>
          ))}
        </select>

        <select
          value={nuevaTarea.estado}
          onChange={(e) =>
            setNuevaTarea({ ...nuevaTarea, estado: e.target.value })
          }
        >
          <option value="Pendiente">Pendiente</option>
          <option value="En progreso">En progreso</option>
          <option value="Completada">Completada</option>
        </select>

        <input
          type="date"
          value={nuevaTarea.fecha_entrega}
          onChange={(e) =>
            setNuevaTarea({ ...nuevaTarea, fecha_entrega: e.target.value })
          }
        />

        <button type="submit" className="btn-crear">
          {editando ? "Actualizar" : (
            <>
              <FaPlus /> Crear
            </>
          )}
        </button>
      </form>

      {/* 🔹 Tabla de tareas */}
      <div className="tabla-contenedor">
        <table className="tabla-profesores">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Curso</th>
              <th>Fecha de Entrega</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7">Cargando tareas...</td>
              </tr>
            ) : tareas.length > 0 ? (
              tareas.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.titulo}</td>
                  <td>{t.descripcion}</td>
                  <td>{t.estado}</td>
                  <td>{t.id_curso || "Sin curso"}</td>
                  <td>
                    {t.fecha_entrega
                      ? new Date(t.fecha_entrega).toLocaleDateString()
                      : "Sin fecha"}
                  </td>
                  <td className="acciones">
                    <button
                      onClick={() => handleEditarTarea(t)}
                      className="btn-icono editar"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleEliminarTarea(t.id)}
                      className="btn-icono eliminar"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No hay tareas registradas</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}