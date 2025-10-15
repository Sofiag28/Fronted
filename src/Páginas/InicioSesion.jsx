import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../Servicios/api";
import logo from "../assets/Logo.png";
import "../styles/registro.css";

export default function InicioSesion() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  const manejoLogin = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError("");
    setExito("");

    try {
      // 🔹 Llamada a la API
      const respuesta = await API.post("/auth/login", { email, password });

      // 🔹 Extraer los datos
      const { token, rol, id, nombre, id_curso } = respuesta.data;

      // 🔹 Guardar datos en localStorage
      const usuario = { id, nombre, rol, id_curso };
      localStorage.setItem("usuario", JSON.stringify(usuario));
      localStorage.setItem("token", token);
      localStorage.setItem("rol", rol);
      localStorage.setItem("id_estudiante", id);
      localStorage.setItem("id_curso", id_curso || "");

      setExito("Inicio de sesión exitoso. Redirigiendo...");

      // 🔹 Redirección según rol
      setTimeout(() => {
        const rolLower = rol.toLowerCase();

        if (rolLower === "estudiante") {
          // 🔹 Si hay curso definido, redirigir a dashboard específico
          if (id_curso && typeof id_curso === "string") {
            const cursoLower = id_curso.toLowerCase();
            if (cursoLower === "frontend") {
              navigate("/curso-frontend");
            } else if (cursoLower === "backend") {
              navigate("/curso-backend");
            } else {
              navigate("/estudiantes");
            }
          } else {
            navigate("/estudiantes");
          }
        } else if (rolLower === "marketing") {
          navigate("/marketin-me");
        } else if (rolLower === "comercial") {
          navigate("/Comercial-me");
        } else if (rolLower === "profesor") {
          navigate("/profesores");
        } else if (rolLower === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
        err.message ||
        "Correo o contraseña incorrectos."
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-card">
        <img src={logo} alt="Logo" className="registro-logo" />
        <h1 className="registro-titulo">Iniciar Sesión</h1>

        {error && <p className="registro-error">{error}</p>}
        {exito && <p className="registro-exito">{exito}</p>}

        <form onSubmit={manejoLogin}>
          <label>Correo electrónico:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="ejemplo@correo.com"
          />

          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <button type="submit" disabled={cargando}>
            {cargando ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="registro-footer">
          ¿No tienes cuenta?{" "}
          <span onClick={() => navigate("/registro")} className="registro-link">
            Regístrate
          </span>
        </p>
      </div>
    </div>
  );
}