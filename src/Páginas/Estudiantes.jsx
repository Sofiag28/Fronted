import { useEffect, useState } from "react";
import API from "../Servicios/api";
import Menu from "../Components/menu";
import "../styles/estudiantes.css";
import "../styles/menu.css";

export default function Estudiantes() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEstudiantes = async () => {
      try {
        const cursoUsuario = localStorage.getItem("id_curso");
        if (!cursoUsuario) {
          setError("No tienes un curso asignado.");
          setCargando(false);
          return;
        }

        const respuesta = await API.get(`/estudiantes/listar/${cursoUsuario}`);
        setEstudiantes(respuesta.data);
      } catch (err) {
        console.error("Error cargando estudiantes:", err);
        setError("Error al cargar los estudiantes.");
      } finally {
        setCargando(false);
      }
    };

    fetchEstudiantes();
  }, []);

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <Menu />

      <div className="estudiantes-container">
        <h1 className="estudiantes-titulo">Compañeros de curso</h1>

        {cargando && <p>Cargando estudiantes...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!cargando && !error && (
          estudiantes.length > 0 ? (
            <div className="companeros-grid">
              {estudiantes.map((est) => (
                <div key={est.id} className="companero-card">
                  <img
                    src={`https://ui-avatars.com/api/?name=${est.nombre}+${est.apellido}&background=4b2e83&color=fff`}
                    alt={`${est.nombre} ${est.apellido}`}
                    className="companero-foto"
                  />
                  <h3 className="companero-nombre">{est.nombre} {est.apellido}</h3>
                  <p className="companero-curso">Curso: {est.id_curso}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No hay estudiantes registrados en tu curso.</p>
          )
        )}
      </div>
    </div>
  );
}
