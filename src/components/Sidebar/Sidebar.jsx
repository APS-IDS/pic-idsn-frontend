import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { useSelector } from "react-redux";
const Sidebar = () => {
  // const usuarioRedux = useSelector((state) => state.user.usuario);
  // const usuarioSession = JSON.parse(sessionStorage.getItem("usuario_rol"));

  // const usuario = usuarioSession.usuario || usuarioRedux;

  // const super_user = useSelector((state) => state.user.user_name);

  // Redux (principal)
  const rolRedux = useSelector((state) => state.user.usuario);
  const userRedux = useSelector((state) => state.user.user_name);

  // localStorage (respaldo)
  const usuarioRolLS = JSON.parse(localStorage.getItem("usuario_rol")) || {};
  const rolLS = usuarioRolLS.usuario;
  const userLS = usuarioRolLS.user_name;

  // Resolver valores finales
  const usuario = rolRedux || rolLS;
  const super_user = userRedux || userLS;

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
            {(usuario === "referente_instituto" ||
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
