import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
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
import imagen from "../../assets/Logo2.jpg";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert";

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    primer_nombre: "",
    segundo_nombre: "",
    primer_apellido: "",
    segundo_apellido: "",
    tipo_documento: "",
    numero_documento: "",
    profesion: "",
    cargo: "",
    entidad: "",
    custom_role_id: "",
    operador_id: "", // <- nuevo campo
  });

  const [errors, setErrors] = useState({ email: "", password: "" });
  const [roles, setRoles] = useState([]);
  const [operadores, setOperadores] = useState([]);

  const [tipos, setTipos] = useState([]);

  const [selectedRoleName, setSelectedRoleName] = useState("");

  const navigate = useNavigate();
  const back = import.meta.env.VITE_APP_BACK;
  const token_object = JSON.parse(sessionStorage.getItem("token")) || {};
  const token = token_object.token;
  const url_operadores = `${back}/api/operador-pics?pagination[pageSize]=100`;

  const url_custom_roles = `${back}/api/custom-roles`;
  const url_roles = `${back}/api/users-permissions/roles`;

  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    const fetch_operador = async () => {
      try {
        const response = await fetch(url_operadores, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Error al obtener operadores.");
        const data = await response.json();
        setOperadores(data.data);
      } catch (error) {
        console.error("Error fetching operadores:", error);
      }
    };

    fetch_operador();
  }, [token]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch(url_custom_roles, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setRoles(data.data || []);
      } catch (err) {
        console.error("Error al obtener custom roles:", err);
        Swal({
          title: "Error",
          text: "No se pudieron cargar los  custom roles",
          icon: "error",
        });
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    const fetch_tipos = async () => {
      try {
        const res = await fetch(url_roles, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTipos(data || []);
      } catch (err) {
        console.error("Error al obtener roles:", err);
        Swal({
          title: "Error",
          text: "No se pudieron cargar los roles",
          icon: "error",
        });
      }
    };
    fetch_tipos();
  }, []);

  // console.log("Operadores:", operadores);

  // console.log("Tipos:", tipos);

  // console.log("Tipo:", tipos.roles[0].id);

  const changeHandler = (event) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));

    if (name === "custom_role_id") {
      const roleSelected = roles.find((r) => r.id === parseInt(value));
      setSelectedRoleName(roleSelected?.name?.toLowerCase() || "");
    }

    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email: isEmailValid(value) ? "" : "Por favor, ingresa un email válido",
      }));
    }

    if (name === "confirmPassword" || name === "password") {
      setErrors((prev) => ({
        ...prev,
        password:
          name === "confirmPassword" && value !== form.password
            ? "Las contraseñas no coinciden"
            : "",
      }));
    }
  };

  const formIsDisabled =
    !form.username ||
    !form.email ||
    !isEmailValid(form.email) ||
    !form.password ||
    form.password !== form.confirmPassword ||
    !form.tipo_documento ||
    !form.numero_documento ||
    !form.custom_role_id ||
    (selectedRoleName === "operador" && !form.operador_id); // <- operador obligatorio si es ese rol

  const submitHandler = async (event) => {
    event.preventDefault();

    const selectedRole = roles.find(
      (r) => r.id === parseInt(form.custom_role_id)
    );
    if (!selectedRole) {
      Swal({
        title: "Error",
        text: "Debes seleccionar un rol válido",
        icon: "error",
      });
      return;
    }

    try {
      const bodyData = {
        username: form.username,
        email: form.email,
        password: form.password,
        primer_nombre: form.primer_nombre,
        segundo_nombre: form.segundo_nombre,
        primer_apellido: form.primer_apellido,
        segundo_apellido: form.segundo_apellido,
        tipo_documento: form.tipo_documento,
        numero_documento: form.numero_documento,
        profesion: form.profesion,
        cargo: form.cargo,
        entidad: form.entidad,
        confirmed: false,
        blocked: false,
        role: {
          connect: [
            { id: tipos.roles[0].id, documentId: tipos.roles[0].documentId },
          ],
        },
        custom_roles: {
          connect: [
            { id: selectedRole.id, documentId: selectedRole.documentId },
          ],
        },
      };

      if (selectedRoleName === "operador") {
        bodyData.operador = { connect: [{ id: parseInt(form.operador_id) }] };
      }

      const response = await fetch(`${back}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      Swal({
        title: "Registro exitoso",
        text: "Usuario registrado correctamente",
        icon: "success",
      });
      navigate("/");
    } catch (error) {
      console.error("Error en el registro:", error.message);
      Swal({
        title: "Error al registrar",
        text: "Hubo un problema al registrar el usuario",
        icon: "error",
      });
    }
  };

  return (
    <>
      <Header />
      <MDBContainer
        fluid
        className="d-flex justify-content-center align-items-center vh-100"
        style={{ paddingTop: "740px" }}
      >
        <MDBRow className="d-flex justify-content-center align-items-center w-100">
          <MDBCol lg="6" md="8" sm="10">
            <MDBCard className="my-5 rounded-3" style={{ maxWidth: "600px" }}>
              <MDBCardImage
                src={imagen}
                className="w-100 rounded-top"
                alt="Imagen"
                style={{ height: "500px", objectFit: "cover" }}
              />
              <MDBCardBody className="px-5">
                <h3 className="mb-4 pb-2 text-center">Registro Usuario</h3>

                <MDBInput
                  label="Username"
                  name="username"
                  value={form.username}
                  onChange={changeHandler}
                  className="mb-3"
                />
                <MDBInput
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={changeHandler}
                  className="mb-3"
                />
                {errors.email && <p className="text-danger">{errors.email}</p>}
                <MDBInput
                  label="Password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={changeHandler}
                  className="mb-3"
                />
                <MDBInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={changeHandler}
                  className="mb-3"
                />
                {errors.password && (
                  <p className="text-danger">{errors.password}</p>
                )}
                <MDBInput
                  label="Primer Nombre"
                  name="primer_nombre"
                  value={form.primer_nombre}
                  onChange={changeHandler}
                  className="mb-3"
                />
                <MDBInput
                  label="Segundo Nombre"
                  name="segundo_nombre"
                  value={form.segundo_nombre}
                  onChange={changeHandler}
                  className="mb-3"
                />
                <MDBInput
                  label="Primer Apellido"
                  name="primer_apellido"
                  value={form.primer_apellido}
                  onChange={changeHandler}
                  className="mb-3"
                />
                <MDBInput
                  label="Segundo Apellido"
                  name="segundo_apellido"
                  value={form.segundo_apellido}
                  onChange={changeHandler}
                  className="mb-3"
                />
                <MDBInput
                  label="Tipo de Documento"
                  name="tipo_documento"
                  value={form.tipo_documento}
                  onChange={changeHandler}
                  className="mb-3"
                />
                <MDBInput
                  label="Número de Documento"
                  name="numero_documento"
                  value={form.numero_documento}
                  onChange={changeHandler}
                  className="mb-3"
                />
                <MDBInput
                  label="Profesión"
                  name="profesion"
                  value={form.profesion}
                  onChange={changeHandler}
                  className="mb-3"
                />
                <MDBInput
                  label="Cargo"
                  name="cargo"
                  value={form.cargo}
                  onChange={changeHandler}
                  className="mb-3"
                />
                <MDBInput
                  label="Entidad"
                  name="entidad"
                  value={form.entidad}
                  onChange={changeHandler}
                  className="mb-3"
                />

                {/* Select de Roles */}
                <div className="mb-4">
                  <label className="form-label">Rol</label>
                  <select
                    name="custom_role_id"
                    className="form-select"
                    value={form.custom_role_id}
                    onChange={changeHandler}
                  >
                    <option value="">Selecciona un rol</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Select de Operadores SOLO si el rol seleccionado es operador */}
                {selectedRoleName === "operador" && (
                  <div className="mb-4">
                    <label className="form-label">Operador</label>
                    <select
                      name="operador_id"
                      className="form-select"
                      value={form.operador_id}
                      onChange={changeHandler}
                    >
                      <option value="">Selecciona un operador</option>
                      {operadores.map((op) => (
                        <option key={op.id} value={op.id}>
                          {op.operador_pic}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <MDBBtn
                  color="success"
                  className="w-100"
                  size="lg"
                  disabled={formIsDisabled}
                  onClick={submitHandler}
                >
                  Registrar
                </MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </>
  );
}

export default Register;
