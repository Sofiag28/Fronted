// src/Páginas/Usuarios.jsx
import { useEffect, useState } from "react";
import API from "../Servicios/api"; // axios configurado con la base URL de tu backend

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Traer usuarios desde la API
  const obtenerUsuarios = async () => {
    try {
      const respuesta = await API.get("/listarus", {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setUsuarios(respuesta.data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar los usuarios");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-indigo-600">Usuarios Registrados</h1>

      {cargando && <p>Cargando usuarios...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!cargando && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="py-2 px-4 text-left">ID</th>
                <th className="py-2 px-4 text-left">Nombre</th>
                <th className="py-2 px-4 text-left">Rol</th>
                <th className="py-2 px-4 text-left">Correo</th>
                <th className="py-2 px-4 text-left">Fecha Registro</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{u.id}</td>
                  <td className="py-2 px-4">{u.nombre}</td>
                  <td className="py-2 px-4">{u.rol}</td>
                  <td className="py-2 px-4">{u.correo}</td>
                  <td className="py-2 px-4">{u.fecha_registro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
