import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import Login from "./components/Login/Login";
import { Routes, Route } from "react-router-dom";
import Prueba from "./components/Prueba/Prueba.jsx";
import RegistroUsuario from "./components/Registro/RegistroUsuario.jsx";
import Dashbo from "./components/Dashbo/Dashbo.jsx";
import ReportForm from "./components/Report/ReportForm.jsx";
import ReportView from "./components/ReportView/ReportView.jsx";
import Edit from "./components/EditView/Edit.jsx";
import Seguimiento from "./components/Seguimiento/Seguimiento.jsx";
import { useSelector } from "react-redux";
function App() {
  const token = useSelector((state) => state.token.token);

  return (
    <Routes>
      <Route path="/" element={<Prueba />} />
      {/* <Route path="/login" element={<Login />} /> */}
      <Route
        path="/register"
        element={token ? <RegistroUsuario /> : <Prueba />}
      />
      <Route path="/dashbo" element={token ? <Dashbo /> : <Prueba />} />
      <Route path="/repo" element={token ? <ReportForm /> : <Prueba />} />
      <Route path="/view" element={token ? <ReportView /> : <Prueba />} />
      <Route path="/edit" element={token ? <Edit /> : <Prueba />} />
      <Route path="/seg" element={token ? <Seguimiento /> : <Prueba />} />
    </Routes>
  );
}

export default App;
