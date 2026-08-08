import React, { useState } from "react";
import { FaHome, FaUserCircle } from "react-icons/fa"; // Importar íconos
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/actions";
import styles from "./Header.module.css"; // Importar estilos CSS

const Header = () => {
  const navigate = useNavigate(); // Hook para navegación
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // Estado para el menú del usuario

  const dispatch = useDispatch();

  // const usuarioSession = JSON.parse(sessionStorage.getItem("usuario_rol"));
  // const usuario_redux = useSelector((state) => state.user.usuario);
  // const rol = usuarioSession.usuario || usuario_redux;

  // const user_object = JSON.parse(sessionStorage.getItem("token")) || {};
  // const user = user_object.user;

  const userRedux = useSelector((state) => state.user.user);
  const rolRedux = useSelector((state) => state.user.usuario);

  const tokenLS = JSON.parse(localStorage.getItem("token")) || {};
  const userLS = tokenLS.user;

  const rolLS =
    JSON.parse(localStorage.getItem("usuario_rol"))?.usuario || null;

  // console.log("datos_usuario", user);

  const user = userRedux || userLS || "";
  const rol = rolRedux || rolLS || "";

  const handleHomeClick = () => {
    navigate("/dashbo"); // Redirigir al Home
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen); // Mostrar/ocultar menú de usuario
  };

  const handleLogout = () => {
    // sessionStorage.clear();
    localStorage.clear();
    dispatch(logout());
    navigate("/"); // Redirigir al login
  };

  return (
    <header className="w-full">
      <div className="bg-gradient-to-r from-navy-dark to-navy py-3 px-7 flex justify-between items-center">
        <h1 className="text-white font-semibold text-xl">Sistema Gestión PIC</h1>
        <div className="flex items-center space-x-6 relative">

          <FaHome
            onClick={handleHomeClick}
            title="Ir al Inicio"
            className="text-white text-2xl cursor-pointer transition-transform duration-200 ease-in-out hover:scale-125 hover:text-teal-light" />
          <FaUserCircle
            onClick={toggleUserMenu}
            title="Ver Usuario"
            className="text-white text-2xl cursor-pointer transition-transform duration-200 ease-in-out hover:scale-125 hover:text-teal-light" />

          {isUserMenuOpen && (
            <div className={styles.menu}>
              <p className={styles.userInfo}>Usuario:{user}</p>
              <p className={styles.userInfo}>Rol:{rol}</p>
              <button
                className={styles.logout}
                onClick={() => { setIsUserMenuOpen(false); navigate("/perfil"); }}
              >
                Perfil
              </button>
              <button className={styles.logout} onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          )}

        </div>
      </div>
      <div className="h-[6px] bg-gradient-to-r from-green-brand to-yellow-brand" >
      </div>
    </header>
  );
};

export default Header;
