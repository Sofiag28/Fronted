import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png";
import API from "../Servicios/api";
import "../styles/index.css";

const Registro = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    id_curso: "", // ⚡ Debe coincidir con el backend
    genero: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const cursos = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];
  const generos = ["Masculino", "Femenino", "Otro"];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    try {
      // Validación básica
      if (
        !formData.nombre ||
        !formData.apellido ||
        !formData.email ||
        !formData.password ||
        !formData.id_curso ||
        !formData.genero
      ) {
        throw new Error("Todos los campos son obligatorios");
      }

      // Enviar el payload al backend
      const payload = {
        ...formData,
        id_curso: Number(formData.id_curso), // ⚡ Asegúrate que sea número
      };

      const response = await API.post("/auth/registro", payload);
      setMensaje("✅ Usuario registrado exitosamente.");
      console.log("📦 Usuario creado:", response.data);

      // Redirigir al login después de un pequeño delay
      setTimeout(() => navigate("/inicio-sesion"), 1500);
    } catch (err) {
      console.error("❌ Error al registrar usuario:", err);
      setError(err.response?.data?.error || err.message || "No se pudo registrar");
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-card">
        <img src={logo} alt="Logo" className="registro-logo" />
        <h2 className="registro-titulo">Registro</h2>

        <form onSubmit={handleSubmit}>
          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />

          <label>Apellido</label>
          <input
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
          />

          <label>Correo electrónico</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Contraseña</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label>Género</label>
          <select
            name="genero"
            value={formData.genero}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un género</option>
            {generos.map((g, i) => (
              <option key={i} value={g}>
                {g}
              </option>
            ))}
          </select>

          <label>Curso</label>
          <select
            name="id_curso" // ⚡ Coincide con el backend
            value={formData.id_curso}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un curso</option>
            {cursos.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </select>

          <button type="submit">Registrar</button>
        </form>

        {mensaje && <p className="registro-exito">{mensaje}</p>}
        {error && <p className="registro-error">{error}</p>}

        <p className="registro-footer">
          ¿Ya tienes una cuenta?{" "}
          <span
            onClick={() => navigate("/inicio-sesion")}
            className="registro-link"
          >
            Inicia sesión
          </span>
        </p>
      </div>
    </div>
  );
};

export default Registro;