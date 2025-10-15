import React from "react";

const Unauthorized = () => {
  return (
    <div style={{
      textAlign: "center",
      padding: "80px",
      color: "#444",
      fontFamily: "Poppins, sans-serif"
    }}>
      <h1>🚫 Acceso no autorizado</h1>
      <p>No tienes permisos para acceder a esta página.</p>
      <a href="/" style={{ color: "#3a3a8b", textDecoration: "underline" }}>
        Volver al inicio
      </a>
    </div>
  );
};

export default Unauthorized;
