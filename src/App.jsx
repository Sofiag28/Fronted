import ProtectedRoute from "./Components/protectroute";
import Estudiantes from "./Páginas/Estudiantes";
import StudentMetrics from "./Metricas/MetricasEst";
import InicioSesion from "./Páginas/InicioSesion";
import Registro from "./Páginas/Registro";
import Index from "./Páginas/Index";
import Usuarios from "./Páginas/Usuarios";
import ProfesorDashboard from "./Páginas/ProfesorDashboard";
import MarketingMetrics from "./Metricas/MetricasMark";
import CommercialMetrics from "./Metricas/MetricasCo";
import Integracion from "./Páginas/Integracion";
import MarketingProducts from "./Páginas/Marketing";
import TareasPorCurso from "./Components/ListaTareas";
import CommercialDashboard from "./Páginas/ComercialDash";
import Tareas from "./Components/tareas";
import Layaut from "./Components/Layaut";
import Menu from "./Components/menu";
import Administrador from "./Páginas/Administrador";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

function App() {
  const idEstudiante = localStorage.getItem("id_estudiante");
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/inicio-sesion" element={<InicioSesion />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/layaut" element={<Layaut />} />
         
        <Route
          path="/estudiantes"
          element={
            <ProtectedRoute rolPermitido="estudiante">
              <Estudiantes />
            </ProtectedRoute>
          }
        />  
        <Route 
        path="/metricas-estudiantes/:id" 
        element={<StudentMetrics studentId={parseInt(localStorage.getItem("id_estudiante"))} />} 
        />


        <Route path="/tareas" element={<Tareas studentId={parseInt(localStorage.getItem("id_estudiante"), 10)} />}/>

        <Route
          path="/usuarios"
          element={
            <ProtectedRoute rolPermitido="admin">
              <Usuarios />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profesores"
          element={
            <ProtectedRoute rolPermitido="profesor">
              <ProfesorDashboard />
            </ProtectedRoute>
          }
        />
         <Route
          path="/profesores-crud"
          element={
            <ProtectedRoute rolPermitido="profesor">
              <TareasPorCurso />
            </ProtectedRoute>
          }
        />

        <Route
          path="/integracion"
          element={
            <ProtectedRoute allowedRoles={["Comercial", "Marketing"]}>
              <Integracion />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketin-me"
          element={
            <ProtectedRoute rolPermitido="marketing">
              <MarketingMetrics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketing-ve"
          element={
            <ProtectedRoute rolPermitido="marketing">
              <MarketingProducts />
            </ProtectedRoute>
          }
        />
         <Route
          path="/Comercial-me"
          element={
            <ProtectedRoute rolPermitido="comercial">
              <CommercialMetrics />
            </ProtectedRoute>
          }
        />
         <Route
          path="/Comercial-ve"
          element={
            <ProtectedRoute rolPermitido="comercial">
              <CommercialDashboard />
            </ProtectedRoute>
          }
        />

        <Route
        path="/admin"
        element={
        <ProtectedRoute rolPermitido="admin">
        <Administrador />
        </ProtectedRoute>
  }
/>


        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
