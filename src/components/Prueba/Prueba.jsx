import React, { useState } from "react";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBInput,
} from "mdb-react-ui-kit";
import styles from "../Prueba/Prueba.module.css";
import imagen from "../../assets/Logo2.jpg";
import icono from "../../assets/favicon.ico";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/actions";

function Prueba() {
  const [form, setForm] = useState({
    identifier: "", // Cambiado de 'username' a 'identifier'
    password: "",
  });

  const changeHandler = (event) => {
    const property = event.target.name;
    const value = event.target.value;
    setForm({ ...form, [property]: value });
  };

  const formIsDisabled = !form.identifier || !form.password;

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const back = import.meta.env.VITE_APP_BACK;

  const submitHandler = async (event) => {
    event.preventDefault();

    try {
      // const response = await fetch("http://localhost:1337/api/auth/local", {
      const response = await fetch(`${back}/api/auth/local`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form), // Enviar el objeto directamente ya que tiene la estructura correcta
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const datos = {
        token: data.jwt,
        user: form.identifier,
      };

      sessionStorage.setItem("token", JSON.stringify(datos));
      navigate("/dashbo");
      dispatch(loginSuccess(datos));
    } catch (error) {
      console.error("Fetch POST Error:", error.message);
      Swal({
        title: "Usuario o contraseña invalida",
        text: "Por favor revise las credenciales ingresadas",
        icon: "warning",
      });
    }
  };

  return (
    <MDBContainer className="my-5">
      <MDBCard>
        <MDBRow className="g-0">
          <MDBCol md="6">
            <MDBCardImage
              src={imagen}
              alt="login form"
              className="rounded-start w-100"
            />
          </MDBCol>

          <MDBCol md="6">
            <MDBCardBody className="d-flex flex-column">
              <div className="d-flex flex-row mt-2">
                <img
                  src={icono}
                  alt="Mi icono"
                  className="me-3"
                  style={{ width: "48px", height: "48px" }}
                />
                <span className="h1 fw-bold mb-0">IDSN</span>
              </div>

              <h5
                className="fw-normal my-4 pb-3"
                style={{ letterSpacing: "1px" }}
              >
                Ingresa con tu usuario y contraseña
              </h5>

              <MDBInput
                wrapperClass="mb-4"
                label="Usuario"
                id="formIdentifier"
                type="text"
                size="lg"
                value={form.identifier}
                onChange={changeHandler}
                name="identifier" // Cambiado de 'username' a 'identifier'
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Contraseña"
                id="formPassword"
                type="password"
                size="lg"
                value={form.password}
                onChange={changeHandler}
                name="password"
              />

              <MDBBtn
                className="mb-4 px-5"
                color="dark"
                size="lg"
                disabled={formIsDisabled}
                onClick={submitHandler}
              >
                INGRESAR
              </MDBBtn>
              <a className={styles.etiqueta} href="#!">
                Olvidaste tu contraseña?
              </a>
              <p className={styles.etiqueta} style={{ color: "#393f81" }}>
                ¿No tienes cuenta ?
                <a href="/register" style={{ color: "#393f81" }}>
                  Registrate Aqui
                </a>
              </p>

              <div className="d-flex flex-row justify-content-start">
                <a href="#!" className="small text-muted me-1">
                  Terms of use.
                </a>
                <a href="#!" className="small text-muted">
                  Privacy policy
                </a>
              </div>
            </MDBCardBody>
          </MDBCol>
        </MDBRow>
      </MDBCard>
    </MDBContainer>
  );
}

export default Prueba;
