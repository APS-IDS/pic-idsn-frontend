import React, { useState } from "react";
import { FaHome, FaUserCircle } from "react-icons/fa"; // Importar íconos
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/actions";

const Header = () => {
  const navigate = useNavigate(); // Hook para navegación
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // Estado para el menú del usuario

  const dispatch = useDispatch();

  const usuarioSession = JSON.parse(sessionStorage.getItem("usuario_rol"));
  const usuario_redux = useSelector((state) => state.user.usuario);
  const rol = usuarioSession.usuario || usuario_redux;

  const user_object = JSON.parse(sessionStorage.getItem("token")) || {};
  const user = user_object.user;
  // console.log("datos_usuario", user);

  const handleHomeClick = () => {
    navigate("/dashbo"); // Redirigir al Home
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen); // Mostrar/ocultar menú de usuario
  };

  const handleLogout = () => {
    sessionStorage.clear();
    dispatch(logout());
    navigate("/"); // Redirigir al login
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Sistema Gestión PIC</h1>
      {/* <h1 className={styles.title}>BIENVENIDOS</h1> */}

      <div className={styles.actions}>
        <FaHome className={styles.homeIcon} onClick={handleHomeClick} />
        <div className={styles.userMenu}>
          <FaUserCircle className={styles.userIcon} onClick={toggleUserMenu} />
          {isUserMenuOpen && (
            <div className={styles.menu}>
              <p className={styles.userInfo}>Usuario:{user}</p>
              <p className={styles.userInfo}>Rol:{rol}</p>
              <button className={styles.logout} onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
