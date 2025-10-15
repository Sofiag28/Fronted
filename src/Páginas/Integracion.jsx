import React, { useEffect, useState } from "react";
import "../styles/hubspot.css"; 
import Menu from "../Components/menu"; // ✅ Import correcto

const Integracion = () => {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/integracion/hubspot");
        if (!response.ok) throw new Error("Error al obtener los datos");
        const data = await response.json();
        setDatos(data);
      } catch (err) {
        setError(err.message);
      }
    };

    obtenerDatos();
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!datos) return <p className="cargando">Cargando datos...</p>;

  return (
    <div className="hubspot-container">
      {/* ✅ Menú arriba */}
      <Menu />

      <h1 className="titulo">📊 Integración HubSpot</h1>
      <p className="subtitulo">{datos.integracion}</p>

      {/* 👥 Contactos */}
      <section className="seccion">
        <h2>👥 Contactos</h2>
        <div className="tarjetas">
          {datos.contactos.map((c, i) => (
            <div className="tarjeta" key={i}>
              <h3>{c.nombre}</h3>
              <p><strong>Correo:</strong> {c.correo}</p>
              <p><strong>Ciudad:</strong> {c.ciudad}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 📢 Campañas */}
      <section className="seccion">
        <h2>📢 Campañas</h2>
        <div className="tarjetas">
          {datos.campañas.map((c, i) => (
            <div className="tarjeta" key={i}>
              {/* Imagen del producto */}
              <img
                src={c.imagen}
                alt={c.nombre_campaña}
                className="imagen-campaña"
              />
              <div className="info-campaña">
                <h3>{c.nombre_campaña}</h3>
                <p><strong>Categoría:</strong> {c.categoria}</p>
                <p><strong>Precio Promocional:</strong> {c.precio_promocional}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Integracion;
