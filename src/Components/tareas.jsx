    import { useEffect, useState } from "react";
    import API from "../Servicios/api";
    import Menu from "./menu";
    import "../styles/tareas.css";

    export default function Tareas() {
    const [tareas, setTareas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    const idEstudiante = localStorage.getItem("id_estudiante");

    useEffect(() => {
        const fetchTareas = async () => {
        try {
            const res = await API.get(`/curso-estudiante/${idEstudiante}`);
            setTareas(res.data);
        } catch (err) {
            setError("Error al cargar tareas.");
            console.error(err);
        } finally {
            setCargando(false);
        }
        };
        fetchTareas();
    }, [idEstudiante]);

    const toggleEstado = async (id, estadoActual) => {
        const nuevoEstado =
        estadoActual === "completada" ? "pendiente" : "completada";
        try {
        await API.put(`${id}/estado`, { estado: nuevoEstado });
        setTareas((prev) =>
            prev.map((t) => (t.id === id ? { ...t, estado: nuevoEstado } : t))
        );
        } catch (err) {
        console.error("Error al actualizar tarea:", err);
        }
    };

    const completadas = tareas.filter((t) => t.estado === "completada").length;
    const total = tareas.length;
    const porcentaje =
        total > 0 ? Math.round((completadas / total) * 100) : 0;

    return (
        <>
        <Menu />
        <div className="tareas-container">
            <h1 className="tareas-titulo">Mis Tareas</h1>

            {cargando && <p>Cargando tareas...</p>}
            {error && <p className="tareas-error">{error}</p>}

            {!cargando && !error && tareas.length > 0 ? (
            <>
                <div className="tareas-metricas">
                <p>
                    ✅ Completadas: {completadas} / {total}
                </p>
                <div className="barra-progreso">
                    <div
                    className="progreso"
                    style={{ width: `${porcentaje}%` }}
                    ></div>
                </div>
                <p className="porcentaje">{porcentaje}% completado</p>
                </div>

                <ul className="tareas-lista">
                {tareas.map((tarea) => (
                    <li key={tarea.id} className={`tarea-item ${tarea.estado}`}>
                    <label className="tarea-label">
                        <input
                        type="checkbox"
                        checked={tarea.estado === "completada"}
                        onChange={() =>
                            toggleEstado(tarea.id, tarea.estado)
                        }
                        />
                        <span className="checkmark"></span>
                        <div className="tarea-info">
                        <h3>{tarea.titulo}</h3>
                        <p>{tarea.descripcion}</p>
                        <small>📅 {tarea.fecha_entrega}</small>
                        </div>
                    </label>
                    </li>
                ))}
                </ul>
            </>
            ) : (
            !cargando && <p>No tienes tareas asignadas.</p>
            )}
        </div>
        </>
    );
    }
