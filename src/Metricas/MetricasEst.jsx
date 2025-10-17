import React, { useEffect, useState } from "react";
import axios from "axios";
import Menu from "../Components/menu";
import "../styles/metricases.css";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function StudentMetrics ({ studentId }){
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!studentId) return;
<Menu></Menu>
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/metricas/${studentId}`);
        setMetrics(res.data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar métricas");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [studentId]);

  if (loading) return <p className="loading">Cargando métricas...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!metrics) return null;

  // Datos Doughnut con gradiente
  const doughnutData = {
    labels: ["Completadas", "Pendientes"],
    datasets: [
      {
        label: "Tareas",
        data: [metrics.tareas_completadas, metrics.tareas_pendientes],
        backgroundColor: ["#6366f1", "#facc15"],
        borderColor: ["#4f46e5", "#eab308"],
        borderWidth: 2,
      },
    ],
  };

  // Datos Bar con gradiente
  const barData = {
    labels: ["Total", "Nuevas este mes"],
    datasets: [
      {
        label: "Tareas",
        data: [metrics.total_tareas, metrics.nuevas_este_mes],
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)",
          "rgba(16, 185, 129, 0.7)"
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)"
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="page-container">
      <Menu />
      <div className="container">
        <div className="cards-grid">
          <div className="card chart-card">
            <h3>Progreso de tareas</h3>
            <div className="chart-container">
              <Doughnut data={doughnutData} options={{ animation: { duration: 1000 } }} />
            </div>
          </div>

          <div className="card chart-card">
            <h3>Totales y nuevas</h3>
            <div className="chart-container">
              <Bar data={barData} options={{ responsive: true, plugins: { legend: { display: false } }, animation: { duration: 1000 } }} />
            </div>
          </div>
        </div>

        <div className="card metrics-card">
          <h3>Detalles</h3>
          <ul>
            <li>Total de tareas: <span>{metrics.total_tareas}</span></li>
            <li>Tareas completadas: <span>{metrics.tareas_completadas}</span></li>
            <li>Tareas pendientes: <span>{metrics.tareas_pendientes}</span></li>
            <li>Porcentaje completado: <span>{metrics.porcentaje_completado}%</span></li>
            <li>Última tarea completada: <span>{metrics.ultima_tarea_completada || "N/A"}</span></li>
            <li>Nuevas este mes: <span>{metrics.nuevas_este_mes}</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
};


