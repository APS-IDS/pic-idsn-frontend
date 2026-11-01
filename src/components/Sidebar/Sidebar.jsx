import React from "react"; // Importar íconos
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { CustomRoles } from "../Login/constant";
import {
  FileText,
  ChartNoAxesColumnIncreasing,
  UserRoundPlus,
} from "lucide-react";

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
    `flex items-center gap-[10px] text-left text-md font-semibold border-none px-2 py-[11px] rounded-[8px] w-full cursor-pointer transition-colors 
  ${
    isActive
      ? "bg-[#07a686] text-white/90 hover:text-white"
      : "text-[#c9d6e4] hover:bg-white/5 hover:text-white"
  }`;

  const marginBtn = "my-[14px] mx-[11px]";
  const iconStyle = "w-5 h-5";

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
                  <FileText className={iconStyle} />
                  Anexo Técnico
                </NavLink>
              </li>
            )}
            <li className={marginBtn}>
              <NavLink
                to="/view"
                className={stylesBtn}
                title="Biblioteca de anexos."
              >
                <ChartNoAxesColumnIncreasing className={iconStyle} />
                Visualización
              </NavLink>
            </li>
            {usuarioRol === CustomRoles.SUPERUSER && (
              <li className={marginBtn}>
                <NavLink
                  to="/register"
                  className={stylesBtn}
                  title="Registrar nuevo usuario."
                >
                  <UserRoundPlus className={iconStyle} />
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
