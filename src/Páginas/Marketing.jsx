import React, { useEffect, useState } from "react";
import { fetchProducts, fetchUsers } from "../Servicios/api";
import Menu from "../Components/menu";
import "../styles/Marketing.css";

export default function MarketingProducts () {
  const [ventas, setVentas] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const resProducts = await fetchProducts();
      const resUsers = await fetchUsers();

      const productsData = resProducts.data;
      const usersData = resUsers.data;

      let ventasSim = [];
      usersData.forEach(user => {
        const compras = Math.floor(Math.random() * 5);
        for (let i = 0; i < compras; i++) {
          const producto = productsData[Math.floor(Math.random() * productsData.length)];
          const cantidad = Math.floor(Math.random() * 3) + 1;
          ventasSim.push({
            user: `${user.name.firstname} ${user.name.lastname}`,
            producto: producto.title,
            precio: producto.price,
            cantidad,
            imagen: producto.image,
          });
        }
      });

      setVentas(ventasSim);
    };

    fetchData();
  }, []);

  return (
    <div className="products-container">
      <Menu />
      <h2>Productos Vendidos</h2>
      <div className="cards-container">
        {ventas.map((v, i) => (
          <div className="card" key={i}>
            <img src={v.imagen} alt={v.producto} className="card-image" />
            <div className="card-body">
              <h4>{v.producto}</h4>
              <p>Cliente: {v.user}</p>
              <p>Cantidad: {v.cantidad}</p>
              <p>Precio: ${v.precio}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

