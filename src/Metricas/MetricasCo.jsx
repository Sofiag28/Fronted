import React, { useEffect, useState } from "react";
import { fetchProducts, fetchUsers } from "../Servicios/api";
import Menu from "../Components/menu";
import "../styles/CommercialMetrics.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CommercialMetrics = () => {
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [metrics, setMetrics] = useState({
    totalVentas: 0,
    totalClientes: 0,
    ingresos: 0,
  });

  const COLORS = ["#6366F1", "#22C55E", "#FACC15", "#F97316", "#EC4899"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resProducts = await fetchProducts();
        const resUsers = await fetchUsers();

        const products = resProducts.data;
        const users = resUsers.data;

        const clientesInfo = users.map((u) => ({
          id: u.id,
          nombre: `${u.name.firstname} ${u.name.lastname}`,
          email: u.email,
          ciudad: u.address.city,
          compras: Math.floor(Math.random() * 10) + 1,
        }));
        setClientes(clientesInfo);

        let ventasSimuladas = [];
        clientesInfo.forEach((cliente) => {
          for (let i = 0; i < cliente.compras; i++) {
            const producto = products[Math.floor(Math.random() * products.length)];
            const cantidad = Math.floor(Math.random() * 3) + 1;
            ventasSimuladas.push({
              cliente: cliente.nombre,
              producto: producto.title,
              precio: producto.price,
              cantidad,
            });
          }
        });

        const totalVentas = ventasSimuladas.length;
        const ingresos = ventasSimuladas.reduce(
          (acc, v) => acc + v.precio * v.cantidad,
          0
        );

        setVentas(ventasSimuladas);
        setMetrics({ totalVentas, totalClientes: clientesInfo.length, ingresos });
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const ventasPorCliente = clientes.map((c) => ({
    name: c.nombre,
    ventas: c.compras,
  }));

  const ingresosPorCliente = clientes.map((c) => ({
    name: c.nombre,
    ingresos: ventas
      .filter((v) => v.cliente === c.nombre)
      .reduce((sum, v) => sum + v.precio * v.cantidad, 0),
  }));

  return (
    <div className="dashboard">
      <Menu comercialOnly={true} />
      <div className="marketing-container">
        <h2 className="dashboard-title">📊 Métricas Comerciales</h2>

        {/* MÉTRICAS PRINCIPALES */}
        <div className="metrics-summary">
          <div>
            <h3>Total Clientes</h3>
            <p>{metrics.totalClientes}</p>
          </div>
          <div>
            <h3>Total Ventas</h3>
            <p>{metrics.totalVentas}</p>
          </div>
          <div>
            <h3>Ingresos Estimados</h3>
            <p>${metrics.ingresos.toFixed(2)}</p>
          </div>
        </div>

        {/* GRÁFICOS */}
        <div className="charts-container">
          <div className="chart">
            <h3>Ventas por Cliente</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={ventasPorCliente}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="ventas" fill="#6366F1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart">
            <h3>Ingresos por Cliente</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ingresosPorCliente}
                  dataKey="ingresos"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {ingresosPorCliente.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommercialMetrics;
