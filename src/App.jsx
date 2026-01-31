import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login.jsx";
import RegistroUsuario from "./components/Registro/RegistroUsuario.jsx";
import Dashbo from "./components/Dashbo/Dashbo.jsx";
import ReportForm from "./components/Report/ReportForm.jsx";
import ReportView from "./components/ReportView/ReportView.jsx";
import Edit from "./components/EditView/Edit.jsx";
import Seguimiento from "./components/Seguimiento/Seguimiento.jsx";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "./redux/actions";

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token.token);

  useEffect(() => {
    const raw = localStorage.getItem("token");
    if (raw) {
      const datos = JSON.parse(raw);
      if (datos?.token) {
        dispatch(loginSuccess(datos));
      }
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      {/* <Route path="/login" element={<Login />} /> */}
      <Route
        path="/register"
        element={token ? <RegistroUsuario /> : <Login />}
      />
      <Route path="/dashbo" element={token ? <Dashbo /> : <Login />} />
      <Route path="/repo" element={token ? <ReportForm /> : <Login />} />
      <Route path="/view" element={token ? <ReportView /> : <Login />} />
      <Route path="/edit" element={token ? <Edit /> : <Login />} />
      <Route path="/seg" element={token ? <Seguimiento /> : <Login />} />
    </Routes>
  );
}

export default App;
