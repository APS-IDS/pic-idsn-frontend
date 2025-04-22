import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { useSelector } from "react-redux";
const Sidebar = () => {
  // const usuario_object = JSON.parse(sessionStorage.getItem("usuario")) || {};

  // const usuario_sesion = usuario_object.usuario;
  const usuario_redux = useSelector((state) => state.user.usuario);
  const super_user = useSelector((state) => state.user.user_name);
  console.log("Usuario_sidebar:", usuario_redux);

  // const usuario = usuario_dos;

  // console.log("rol", usuario);
  // console.log("rol_dos", usuario_dos);

  // console.log("super_usuario_side_bar", super_usuario);
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
            {(usuario_redux === "referente_instituto" ||
              super_user === "superuser") && (
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
            {super_user === "superuser" && (
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
