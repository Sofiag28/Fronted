import React, { useEffect, useState } from "react";
import { fetchProducts, fetchUsers } from "../Servicios/api";
import Menu from "../Components/menu";
import "../styles/CommercialDashboard.css";

export default function CommercialDashboard() {
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resProducts = await fetchProducts();
        const resUsers = await fetchUsers();

        const productosData = resProducts.data;
        setProductos(productosData);

        const clientesInfo = resUsers.data.map(u => ({
          id: u.id,
          nombre: `${u.name.firstname} ${u.name.lastname}`,
          email: u.email,
          ciudad: u.address.city,
          compras: Math.floor(Math.random() * 5) + 1,
        }));
        setClientes(clientesInfo);

        // 🔹 Generar ventas aleatorias
        let ventasSimuladas = [];
        clientesInfo.forEach(cliente => {
          for (let i = 0; i < cliente.compras; i++) {
            const producto = productosData[Math.floor(Math.random() * productosData.length)];
            const cantidad = Math.floor(Math.random() * 3) + 1;
            ventasSimuladas.push({
              cliente: cliente.nombre,
              producto: producto.title,
              precio: producto.price,
              cantidad,
              imagen: producto.image,
            });
          }
        });

        setVentas(ventasSimuladas);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard">
      <Menu comercialOnly={true} />

      {/* 🔹 Cabecera */}
      <div className="dashboard-header">
        <img src={dashboardImg} alt="Dashboard Comercial" className="header-img" />
        <h1>Panel Comercial</h1>
        <p>Monitorea tus productos, ventas y clientes fácilmente</p>
      </div>

      <div className="commercial-container">
        {/* 🔹 Productos disponibles */}
        <h2>Productos Disponibles</h2>
        <div className="cards-container">
          {productos.map(p => (
            <div className="card" key={p.id}>
              <img src={p.image} alt={p.title} className="card-img" />
              <div className="card-body">
                <h4>{p.title}</h4>
                <p>💲 {p.price}</p>
                <p className="category">{p.category}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 🔹 Ventas simuladas */}
        <h2>Productos Vendidos</h2>
        <div className="cards-container">
          {ventas.map((v, i) => (
            <div className="card" key={i}>
              <img src={v.imagen} alt={v.producto} className="card-img" />
              <div className="card-body">
                <h4>{v.producto}</h4>
                <p>Cliente: {v.cliente}</p>
                <p>Cantidad: {v.cantidad}</p>
                <p>💲 {v.precio}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 🔹 Clientes */}
        <h2>Clientes</h2>
        <div className="cards-container">
          {clientes.map(c => (
            <div className="card client-card" key={c.id}>
              <div className="card-body">
                <h4>{c.nombre}</h4>
                <p>Email: {c.email}</p>
                <p>Ciudad: {c.ciudad}</p>
                <p>Compras: {c.compras}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
