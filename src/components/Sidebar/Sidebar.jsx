import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

const Sidebar = ({ usuario_dos, super_usuario }) => {
  // const usuario_object = JSON.parse(sessionStorage.getItem("usuario")) || {};

  // const usuario = usuario_object.usuario;

  const usuario = usuario_dos;

  console.log("rol", usuario);
  console.log("rol_dos", usuario_dos);

  console.log("super_usuario_side_bar", super_usuario);
  return (
    <div className={styles.side}>
      <aside className={styles.sidebar}>
        <nav>
          <ul>
            <li>
              <NavLink to="/dashbo" className={styles.active}>
                Inicio
              </NavLink>
            </li>
            {(usuario === "referente_instituto" || super_usuario === true) && (
              <li>
                <NavLink to="/repo" className={styles.active}>
                  Anexo Técnico
                </NavLink>
              </li>
            )}
            <li>
              <NavLink
                to="/view"
                // className={({ isActive }) => (isActive ? styles.active : "")}
                className={styles.active}
              >
                Visualización
              </NavLink>
            </li>
            {super_usuario === true && (
              <li>
                <NavLink
                  to="/register"
                  // className={({ isActive }) => (isActive ? styles.active : "")}
                  className={styles.active}
                >
                  Registro
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
