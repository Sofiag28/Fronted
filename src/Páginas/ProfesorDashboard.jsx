import React, { useEffect, useState } from "react";
import { fetchEstudiantes, fetchEstudiantesPorCurso } from "../Servicios/api";
import Menu from "../Components/menu";
import "../styles/ProfesorDashboard.css";

export default function EstudiantesPorCurso() {
  const [curso, setCurso] = useState("");
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerEstudiantes = async () => {
      setLoading(true);
      try {
        const res = curso
          ? await fetchEstudiantesPorCurso(curso)
          : await fetchEstudiantes();
        setEstudiantes(res.data);
      } catch (error) {
        console.error("Error al obtener estudiantes:", error);
      } finally {
        setLoading(false);
      }
    };
    obtenerEstudiantes();
  }, [curso]);

  return (
    <div className="profesor-container">
      <Menu />
      <h2 className="titulo-lista">📚 Lista de Estudiantes</h2>

      <div className="acciones-superiores">
        <div className="filtro">
          <label>Filtrar por curso:</label>
          <select value={curso} onChange={(e) => setCurso(e.target.value)}>
            <option value="">Todos</option>
            {[...Array(11).keys()].map((i) => (
              <option key={i + 1} value={i + 1}>
                Curso {i + 1}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="tabla-contenedor">
        <table className="tabla-profesores">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Curso</th>
              <th>Fecha Inscripción</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="loading">
                  Cargando estudiantes...
                </td>
              </tr>
            ) : estudiantes.length > 0 ? (
              estudiantes.map((e) => (
                <tr key={e.id}>
                  <td>{e.id}</td>
                  <td>{e.nombre}</td>
                  <td>{e.apellido}</td>
                  <td>{e.email}</td>
                  <td>{e.id_curso}</td>
                  <td>
                    {e.fecha_inscripcion
                      ? new Date(e.fecha_inscripcion).toLocaleDateString()
                      : "Sin fecha"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="loading">
                  No hay estudiantes registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
