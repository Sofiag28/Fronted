import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png";
import "../styles/menu.css";

export default function Menu() {
  const navigate = useNavigate();

  // Traer los datos del usuario logueado
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const rol = usuario?.rol?.toLowerCase() || "invitado";

  // 🔥 Opciones del menú según el rol
  const obtenerOpciones = () => {
    switch (rol) {
      case "estudiante":
        return [
          { label: "Métricas", path: "/metricas-estudiantes/:id" },
          { label: "Tareas", path: "/tareas" },
          { label: "Principal", path: "/estudiantes" },
         { label: "Cerrar sesión", path: "/login" },
        ];
      case "marketing":
        return [
          { label: "Campañas", path: "/marketing-ve" },
          { label: "Estadísticas", path: "/marketin-me" },
            { label: "Cerrar sesión", path: "/login" },
        ];
      case "comercial":
        return [
          { label: "Estadisticas", path: "/Comercial-me" },
        { label: "Productos", path: "/Comercial-ve" },
          { label: "Cerrar sesión", path: "/login" },
        ];
      case "profesor":
        return [
          { label: "Estudiantes", path: "/profesores" },
          { label: "Tareas", path: "/profesores-crud" },
            { label: "Cerrar sesión", path: "/login" },
        ];
      case "admin":
        return [
         { label: "Cerrar sesión", path: "/login" },
        ];
      default:
        return [{ label: "Iniciar Sesión", path: "/login" }];
    }
  };

  const opciones = obtenerOpciones();


  return (
    <div className="menu-container">
      <img src={logo} alt="Logo" className="menu-logo" />

      <nav className="menu-nav">
        {opciones.map((op, index) => (
          <button
            key={index}
            className="menu-btn"
            onClick={() => navigate(op.path)}
          >
            {op.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
