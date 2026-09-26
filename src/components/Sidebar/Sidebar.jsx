import React from "react";
import { FaHome, FaFolderPlus, FaLayerGroup, FaUserPlus } from "react-icons/fa"; // Importar íconos
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { useSelector } from "react-redux";
import { CustomRoles } from "../Login/constant";

const Sidebar = () => {
  const rolRedux = useSelector((state) => state.user.usuario);
  const userRedux = useSelector((state) => state.user.user_name);

  // localStorage (respaldo)
  const usuarioRolLS = JSON.parse(localStorage.getItem("usuario_rol")) || {};
  const rolLS = usuarioRolLS.usuario;
  const userLS = usuarioRolLS.user_name;

  // Resolver valores finales
  const usuarioRol = rolRedux || rolLS;

  const usuarioName = userRedux || userLS;

  // Estilo taildwind de botones sidebar
  const stylesBtn = ({ isActive }) =>
    `flex items-center gap-[10px] text-left text-[13.5px] font-semibold border-none px-[14px] py-[11px] rounded-[8px] w-full cursor-pointer transition-colors 
  ${
    isActive
      ? "bg-[#07a686] text-white/90 hover:text-white"
      : "text-[#c9d6e4] hover:bg-white/5 hover:text-white"
  }`;

  const marginBtn = "my-[14px] mx-[11px]";

  return (
    <div className="w-fit">
      <aside className="flex flex-col w-[220px] bg-[var(--navy-dark)] h-full px-[14px] py-[18px] shadow-[2px_0px_5px_rgba(0,0,0,0.1)] shrink-0 gap-[10px] ">
        <nav>
          <ul className="	list-none p-0">
            {(usuarioRol === CustomRoles.REFERENTE_INSTITUTO ||
              usuarioName === CustomRoles.SUPERUSER) && (
              <li className={marginBtn}>
                <NavLink
                  to="/anexo/add"
                  className={stylesBtn}
                  title="Crear nuevo anexo."
                >
                  <FaFolderPlus />
                  Anexo Técnico.
                </NavLink>
              </li>
            )}
            <li className={marginBtn}>
              <NavLink
                to="/view"
                className={stylesBtn}
                title="Biblioteca de anexos."
              >
                <FaLayerGroup />
                Visualización.
              </NavLink>
            </li>
            {usuarioRol === CustomRoles.SUPERUSER && (
              <li className={marginBtn}>
                <NavLink
                  to="/register"
                  className={stylesBtn}
                  title="Registrar nuevo usuario."
                >
                  <FaUserPlus />
                  Registro.
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
