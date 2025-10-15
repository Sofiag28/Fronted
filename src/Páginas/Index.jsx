import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/index.css";
import landingImage from "../assets/principal.jpg";
import logo from "../assets/Logo.png";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="index-container">
      {/* Imagen de fondo */}
      <img src={landingImage} alt="Landing" className="landing-image" />

      {/* Card central */}
      <div className="card">
        <img src={logo} alt="Logo" className="logo-card" />
        <h1>
          Estás a punto de iniciar un viaje hacia el universo de la{" "}
          <span className="highlight">educación digital</span>
        </h1>

        <div className="buttons">
          <button
            className="btn login-btn"
            onClick={() => navigate("/inicio-sesion")}
          >
            Login
          </button>
          <button
            className="btn registro-btn"
            onClick={() => navigate("/registro")}
          >
            Registro
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;