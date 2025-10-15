import React, { useEffect, useState, useMemo } from "react";
import { fetchProducts, fetchUsers } from "../Servicios/api";
import Menu from "../Components/menu";
import { Bar, Pie } from "react-chartjs-2";
import "../styles/MarketingMetrics.css"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const MarketingMetrics = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [metrics, setMetrics] = useState({
    totalClientes: 0,
    totalVentas: 0,
    ingresos: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const resProducts = await fetchProducts();
      const resUsers = await fetchUsers();

      const productsData = resProducts.data;
      const usersData = resUsers.data;

      setProducts(productsData);
      setUsers(usersData);

      // Simular ventas
      let ventasSim = [];
      usersData.forEach(user => {
        const compras = Math.floor(Math.random() * 5);
        for (let i = 0; i < compras; i++) {
          const producto = productsData[Math.floor(Math.random() * productsData.length)];
          const cantidad = Math.floor(Math.random() * 3) + 1;
          ventasSim.push({
            user:` ${user.name.firstname} ${user.name.lastname}`,
            producto: producto.title,
            precio: producto.price,
            cantidad,
            categoria: producto.category
          });
        }
      });

      const totalVentas = ventasSim.length;
      const ingresos = ventasSim.reduce((acc, v) => acc + v.precio * v.cantidad, 0);

      setVentas(ventasSim);
      setMetrics({
        totalClientes: usersData.length,
        totalVentas,
        ingresos,
      });
    };

    fetchData();
  }, []);

  // Datos para gráficos
  const categories = useMemo(() => [...new Set(products.map(p => p.category))], [products]);
  const ventasPorCategoria = useMemo(() => categories.map(cat => ventas.filter(v => v.categoria === cat).length), [ventas, categories]);

  const colors = useMemo(() => categories.map((_, i) => `hsl(${(i * 60) % 360}, 70%, 60%)`), [categories]);

  const barData = { labels: categories, datasets: [{ label: "Ventas por categoría", data: ventasPorCategoria, backgroundColor: colors }] };
  const pieData = { labels: categories, datasets: [{ label: "Distribución de ventas (%)", data: ventasPorCategoria, backgroundColor: colors }] };

  return (
    <div className="marketing-container">
      <Menu />
      <h2>Métricas Marketing</h2>
      <div className="metrics-summary">
        <div>Total clientes: <b>{metrics.totalClientes}</b></div>
        <div>Total ventas: <b>{metrics.totalVentas}</b></div>
        <div>Ingresos estimados: <b>${metrics.ingresos.toFixed(2)}</b></div>
      </div>

      <div className="charts-container">
        <div className="chart">
          <h3>Ventas por categoría</h3>
          <Bar data={barData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
        </div>
        <div className="chart">
          <h3>Distribución de ventas (%)</h3>
          <Pie data={pieData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
        </div>
      </div>
    </div>
  );
};

export default MarketingMetrics;