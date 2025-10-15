import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, rolPermitido }) {
  const token = localStorage.getItem("token");
  const rol = localStorage.getItem("rol");

  console.log("🧠 ProtectedRoute -> token:", token, "rol:", rol);

  if (!token) {
    console.log("🚫 No hay token, redirigiendo a inicio de sesión");
    return <Navigate to="/inicio-sesion" replace />;
  }

  if (rolPermitido && rol !== rolPermitido) {
    console.log(`⚠️ Rol ${rol} no autorizado para ${rolPermitido}`);
    if (rol === "estudiante") return <Navigate to="/estudiantes" replace />;
    if (rol === "admin") return <Navigate to="/dashboard" replace />;
  }

  console.log("✅ Autorizado, mostrando contenido");
  return children;
}
