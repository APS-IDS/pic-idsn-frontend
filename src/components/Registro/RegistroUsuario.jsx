import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import Select from "react-select";
import { useSelector } from "react-redux";

// ─── Constants ───────────────────────────────────────────────────────────────

const INITIAL_FORM_STATE = {
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
};

const DOCUMENT_TYPE_OPTIONS = [
  { value: "C.C.", label: "C.C." },
  { value: "C.E.", label: "C.E." },
  { value: "Pasaporte", label: "Pasaporte" },
];

const CUSTOM_SELECT_STYLES = {
  control: (base) => ({
    ...base,
    minHeight: "38px",
    borderColor: "#ccc",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#81e899" : "white",
    color: "#333",
  }),
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const handleSelectChange = (name, selectedOption, changeHandler) => {
  changeHandler({
    target: { name, value: selectedOption?.value || "" },
  });
};

const fetchWithAuth = async (url, token) => {
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
  return response.json();
};

// ─── Component ───────────────────────────────────────────────────────────────

function Register() {
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [roles, setRoles] = useState([]);
  const [operadores, setOperadores] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [selectedRoleName, setSelectedRoleName] = useState("");

  const navigate = useNavigate();
  const back = import.meta.env.VITE_APP_BACK;
  // const token_object = JSON.parse(sessionStorage.getItem("token")) || {};
  // const token = token_object.token;

  const token =
    useSelector((state) => state.token.token) ||
    JSON.parse(localStorage.getItem("token"))?.token;

  // ─── API URLs ──────────────────────────────────────────────────────────────

  const url_operadores = `${back}/api/operador-pics?pagination[pageSize]=100`;
  const url_custom_roles = `${back}/api/custom-roles`;
  const url_roles = `${back}/api/users-permissions/roles`;

  // ─── Data fetching ─────────────────────────────────────────────────────────

  useEffect(() => {
    const fetchOperadores = async () => {
      try {
        const data = await fetchWithAuth(url_operadores, token);
        setOperadores(data.data);
      } catch (error) {
        console.error("Error fetching operadores:", error);
      }
    };
    fetchOperadores();
  }, [token, url_operadores]);

  useEffect(() => {
    const fetchCustomRoles = async () => {
      try {
        const data = await fetchWithAuth(url_custom_roles, token);
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
    fetchCustomRoles();
  }, [token, url_custom_roles]);

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const data = await fetchWithAuth(url_roles, token);
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
    fetchTipos();
  }, [token, url_roles]);

  // console.log("Operadores:", operadores);

  // console.log("Tipos:", tipos);

  // console.log("Tipo:", tipos.roles[0].id);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const changeHandler = useCallback(
    (event) => {
      const { name, value } = event.target;
      setForm((prevForm) => ({ ...prevForm, [name]: value }));

      if (name === "custom_role_id") {
        const roleSelected = roles.find((r) => r.id === parseInt(value));
        setSelectedRoleName(roleSelected?.name?.toLowerCase() || "");
      }

      if (name === "email") {
        setErrors((prev) => ({
          ...prev,
          email: isEmailValid(value)
            ? ""
            : "Por favor, ingresa un email válido",
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
    },
    [roles, form.password],
  );

  // ─── Form validation ──────────────────────────────────────────────────────

  const formIsDisabled = useMemo(
    () =>
      !form.username ||
      !form.email ||
      !isEmailValid(form.email) ||
      !form.password ||
      form.password !== form.confirmPassword ||
      !form.tipo_documento ||
      !form.profesion ||
      !form.cargo ||
      !form.entidad ||
      !form.numero_documento ||
      !form.custom_role_id ||
      (selectedRoleName === "operador" && !form.operador_id), // <- operador obligatorio si es ese rol
    [form],
  );

  // ─── Submit ────────────────────────────────────────────────────────────────

  const submitHandler = useCallback(
    async (event) => {
      event.preventDefault();

      const selectedRole = roles.find(
        (r) => r.id === parseInt(form.custom_role_id),
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
          custom_roles: [selectedRole.documentId],
        };

        if (selectedRoleName === "operador" && form.operador_id) {
          bodyData.operador_pic = form.operador_id;
        }

        const response = await fetch(`${back}/api/custom-roles/user/register`, {
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
    },
    [form, roles, selectedRoleName, back, token, navigate],
  );

  // ─── Derived values for Select components ─────────────────────────────────

  const roleOptions = useMemo(
    () => [
      { value: "", label: "Selecciona un rol" },
      ...roles.map((role) => ({ value: role.id, label: role.name })),
    ],
    [roles],
  );

  const selectedRoleValue = useMemo(
    () =>
      form.custom_role_id
        ? {
            value: form.custom_role_id,
            label:
              roles.find((role) => role.id === form.custom_role_id)?.name ||
              form.custom_role_id,
          }
        : { value: "", label: "Selecciona un rol" },
    [form.custom_role_id, roles],
  );

  const selectedDocumentTypeValue = useMemo(
    () =>
      form.tipo_documento
        ? DOCUMENT_TYPE_OPTIONS.find(
            (option) => option.value === form.tipo_documento,
          ) || null
        : null,
    [form.tipo_documento],
  );

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <Header />
      <MDBContainer
        fluid
        className="d-flex justify-content-center align-items-center vh-100"
        style={{ paddingTop: "730px" }}
      >
        <MDBRow className="d-flex justify-content-center align-items-center w-100">
          <MDBCol lg="6" md="8" sm="10">
            <MDBCard className="my-5 rounded-3" style={{ maxWidth: "700px" }}>
              <MDBCardImage
                src={imagen}
                className="w-100 rounded-top"
                alt="Imagen"
                style={{ height: "400px", objectFit: "contain" }}
              />
              <MDBCardBody className="px-5">
                <h3 className="mb-4 pb-2 text-center">Registro Usuario</h3>

                {/* Credenciales */}
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

                {/* Datos personales */}
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

                {/* Documento */}
                <div className="mb-4">
                  <label className="form-label">Tipo de Documento</label>
                  <Select
                    name="tipo_documento"
                    options={DOCUMENT_TYPE_OPTIONS}
                    value={selectedDocumentTypeValue}
                    onChange={(opt) =>
                      handleSelectChange("tipo_documento", opt, changeHandler)
                    }
                    placeholder="Selecciona un tipo de documento"
                    styles={CUSTOM_SELECT_STYLES}
                  />
                </div>
                <MDBInput
                  label="Número de Documento"
                  name="numero_documento"
                  value={form.numero_documento}
                  onChange={changeHandler}
                  className="mb-3"
                />

                {/* Información laboral */}
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
                  {/* <select
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
                  </select> */}
                  <Select
                    name="custom_role_id"
                    options={roleOptions}
                    value={selectedRoleValue}
                    onChange={(opt) =>
                      handleSelectChange("custom_role_id", opt, changeHandler)
                    }
                    placeholder="Selecciona un rol"
                    styles={CUSTOM_SELECT_STYLES} // si ya tienes tu objeto customStyles
                  />
                </div>

                {/* Select de Operadores SOLO si el rol seleccionado es operador */}
                {selectedRoleName === "operador" && (
                  <div className="mb-4">
                    <label className="form-label">Operador</label>

                    <Select
                      name="operador_id"
                      options={[
                        { value: "", label: "Selecciona un operador" },
                        ...operadores.map((op) => ({
                          value: op.documentId,
                          label: op.operador_pic,
                        })),
                      ]}
                      value={
                        form.operador_id
                          ? {
                              value: form.operador_id,
                              label:
                                operadores.find(
                                  (op) => op.documentId === form.operador_id
                                )?.operador_pic || form.operador_id,
                            }
                          : { value: "", label: "Selecciona un operador" }
                      }
                      onChange={(selectedOption) =>
                        changeHandler({
                          target: {
                            name: "operador_id",
                            value: selectedOption?.value || "",
                          },
                        })
                      }
                      placeholder="Selecciona un operador"
                      //className="form-select" // si quieres seguir usando tu clase de estilos
                      styles={CUSTOM_SELECT_STYLES} // opcional, si usas react-select custom styles
                    />
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
