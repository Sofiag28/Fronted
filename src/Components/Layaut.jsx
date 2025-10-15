import React from "react";
import { Outlet } from "react-router-dom";
import Menu from "./menu";

export default function Layaut() {
  return (
    <div className="layout-container">
      <Menu />
      <div className="layout-content">
        <Outlet />
      </div>
    </div>
  );
}
