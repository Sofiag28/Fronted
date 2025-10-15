// src/servicios/api.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

export const fetchStudentMetrics = (id) => API.get(`/metricas/estudiante/${id}`);
export const fetchTareasEstudiante = (id) => API.get(`/tareas/estudiante/${id}`);
export const updateTareaEstado = (id, estado) => API.put(`/tareas/${id}/estado`, { estado });

export const fetchProducts = () => axios.get("https://fakestoreapi.com/products");
export const fetchUsers = () => axios.get("https://fakestoreapi.com/users");

// Comercial
export const fetchVentas = () => API.get("/ventas");
export const fetchClientes = () => API.get("/clientes");

// Profesores
export const fetchEstudiantes = () => API.get("/estudiantes");
export const fetchEstudiantesPorCurso = (curso) => API.get(`/estudiantes/curso/${curso}`);
export const fetchTareasCurso = (curso) => API.get(`/tareas/curso/${curso}`);
export const fetchTodasTareas = () => API.get("/tareas");
export const createTarea = (tarea) => API.post("/crear", tarea);
export const updateTarea = (id, tarea) => API.put(`/editar/${id}`, tarea);
export const deleteTarea = (id) => API.delete(`/eliminar/${id}`);

export default API;
