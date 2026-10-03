import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "../Header/Header";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBInput,
} from "mdb-react-ui-kit";
import imagen from "../../assets/Logo2.jpg";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Select from "react-select";
import { useSelector } from "react-redux";
import { CustomRoles } from "../Login/constant";

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
  operador_id: "",
};

const DOCUMENT_TYPE_OPTIONS = [
  { value: "C.C.", label: "C.C." },
  { value: "C.E.", label: "C.E." },
  { value: "Pasaporte", label: "Pasaporte" },
];

// Mismos tokens visuales que Perfil, para que ambas paginas lean igual.
const styleCard = "mb-4 border-solid border-gray-200 border-[1px] p-0";
const styleCardHeader =
  "bg-[#0f7a68] text-[20px] text-white font-bold px-4 py-3";
const styleLabelInput = "text-[16px] font-bold !-translate-y-8";

const CUSTOM_SELECT_STYLES = {
  control: (base) => ({
    ...base,
    minHeight: "38px",
    borderColor: "#dfe3e8",
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#e3f4ef" : "white",
    color: "#1f2937",
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
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
  const [selectedRoleName, setSelectedRoleName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const back = import.meta.env.VITE_APP_BACK;

  const token =
    useSelector((state) => state.token.token) ||
    JSON.parse(localStorage.getItem("token"))?.token;

  // Mismo resolucion de rol que Sidebar: redux primero, localStorage de
  // respaldo. El gate de /register en Sidebar usa `usuarioRol`, no el username.
  const rolRedux = useSelector((state) => state.user.usuario);

  // localStorage (respaldo)
  const usuarioRolLS = JSON.parse(localStorage.getItem("usuario_rol")) || {};
  const rolLS = usuarioRolLS.usuario;

  // Resolver valores finales
  const usuarioRol = rolRedux || rolLS;

  const isSuperUser = usuarioRol === CustomRoles.SUPERUSER;

  // ─── API URLs ──────────────────────────────────────────────────────────────

  const url_operadores = `${back}/api/operador-pics?pagination[pageSize]=100`;
  const url_custom_roles = `${back}/api/custom-roles`;

  // ─── Data fetching ─────────────────────────────────────────────────────────

  useEffect(() => {
    const fetchOperadores = async () => {
      try {
        const data = await fetchWithAuth(url_operadores, token);
        setOperadores(data.data || []);
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
        Swal.fire({
          title: "Error",
          text: "No se pudieron cargar los roles",
          icon: "error",
        });
      }
    };
    fetchCustomRoles();
  }, [token, url_custom_roles]);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const changeHandler = useCallback(
    (event) => {
      const { name, value } = event.target;
      setForm((prevForm) => ({ ...prevForm, [name]: value }));

      if (name === "custom_role_id") {
        const roleSelected = roles.find((r) => r.id === parseInt(value, 10));
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
      (selectedRoleName === CustomRoles.OPERADOR && !form.operador_id),
    [form, selectedRoleName],
  );

  // ─── Submit ────────────────────────────────────────────────────────────────

  const submitHandler = useCallback(
    async (event) => {
      event.preventDefault();

      const selectedRole = roles.find(
        (r) => r.id === parseInt(form.custom_role_id, 10),
      );
      if (!selectedRole) {
        Swal.fire({
          title: "Error",
          text: "Debes seleccionar un rol válido",
          icon: "error",
        });
        return;
      }

      try {
        setSubmitting(true);

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

        if (selectedRoleName === CustomRoles.OPERADOR && form.operador_id) {
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

        await Swal.fire({
          title: "Registro exitoso",
          text: "Usuario registrado correctamente",
          icon: "success",
        });
      } catch (error) {
        console.error("Error en el registro:", error.message);
        Swal.fire({
          title: "Error al registrar",
          text: "Hubo un problema al registrar el usuario",
          icon: "error",
        });
      } finally {
        setSubmitting(false);
      }
    },
    [form, roles, selectedRoleName, back, token, navigate],
  );

  // ─── Derived values for Select components ─────────────────────────────────

  const roleOptions = useMemo(
    () => roles.map((role) => ({ value: role.id, label: role.name })),
    [roles],
  );

  const selectedRoleValue = useMemo(
    () =>
      form.custom_role_id
        ? roleOptions.find((option) => option.value === form.custom_role_id) ||
          null
        : null,
    [form.custom_role_id, roleOptions],
  );

  const operadorOptions = useMemo(
    () =>
      operadores.map((op) => ({
        value: op.documentId,
        label: op.operador_pic,
      })),
    [operadores],
  );

  const selectedOperadorValue = useMemo(
    () =>
      form.operador_id
        ? operadorOptions.find((option) => option.value === form.operador_id) ||
          null
        : null,
    [form.operador_id, operadorOptions],
  );

  const selectedDocumentTypeValue = useMemo(
    () =>
      DOCUMENT_TYPE_OPTIONS.find(
        (option) => option.value === form.tipo_documento,
      ) || null,
    [form.tipo_documento],
  );

  // Las iniciales se arman con el nombre que se esta escribiendo, igual que
  // Perfil las arma con el del usuario cargado.
  const initials =
    form.username
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((name) => name[0].toUpperCase())
      .join("") || "U";

  const selectedRoleLabel = selectedRoleValue?.label || "Sin rol";

  // Campo de texto reutilizable: en modo lectura queda deshabilitado.
  const renderInput = (label, name, type = "text") => (
    <MDBCol md="6">
      <MDBInput
        label={label}
        labelClass={styleLabelInput}
        name={name}
        type={type}
        value={form[name]}
        onChange={changeHandler}
        className="mt-3"
        disabled={!isSuperUser}
      />
    </MDBCol>
  );

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <Header />
      <MDBContainer
        fluid
        className="flex w-[99%] mb-2 items-center justify-center bg-white/95 px-[32px]"
      >
        <MDBRow className="flex justify-center items-center w-[80%]">
          <MDBCard className="mb-4 mt-4 border-solid border-gray-200 border-[1px] border-t-4 border-t-[#0f7a68]">
            <MDBCardBody>
              <MDBRow>
                <MDBCol md="8" className="flex gap-5">
                  <div className="flex rounded-full w-[150px] h-[150px] bg-[#0f7a68] text-white font-bold text-[50px] justify-center items-center shrink-0 shadow-lg">
                    {initials}
                  </div>

                  <div>
                    <h2 className="flex items-center mt-4 mb-1 font-bold text-[#1c3a5e] text-[30px]">
                      {form.username || "Registro de Usuario"}
                    </h2>

                    <span className="bg-[#e3f4ef] inline-flex items-center gap-2 rounded-full px-3 py-1 font-bold text-[#0b5c4d] text-[15px]">
                      ● {selectedRoleLabel}
                    </span>

                    <div className="mt-2 text-[#5b6673] text-[13px] px-2">
                      {form.email || "Completa los datos del nuevo usuario"}
                    </div>
                  </div>
                </MDBCol>
                <MDBCol md="4" className="flex justify-end">
                  <MDBCardImage
                    src={imagen}
                    className="mr-6 w-[150px] h-[150px] rounded-top"
                    alt="Imagen"
                  />
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </MDBCard>

          {!isSuperUser && (
            <div className="mb-4 rounded border-solid border-[1px] border-yellow-brand bg-[#fdf6e3] px-4 py-3 text-[14px] text-[#5b6673]">
              Solo un superusuario puede crear usuarios. Los campos se muestran
              en modo lectura.
            </div>
          )}

          <MDBCard className={styleCard}>
            <MDBCardHeader className={styleCardHeader}>
              Datos de la cuenta
            </MDBCardHeader>
            <MDBCardBody>
              <MDBRow className="g-4">
                {renderInput("Nombre de usuario:", "username")}
                <MDBCol md="6">
                  {renderInput("Email:", "email", "email")}
                  <MDBCol md="6">
                    {errors.email && (
                      <p className="text-[13px] text-red-600">{errors.email}</p>
                    )}
                  </MDBCol>
                </MDBCol>

                {renderInput("Contraseña:", "password", "password")}
                {renderInput(
                  "Confirmar contraseña:",
                  "confirmPassword",
                  "password",
                )}

                <MDBCol md="12">
                  {errors.password && (
                    <p className="text-[13px] text-red-600">
                      {errors.password}
                    </p>
                  )}
                </MDBCol>

                <MDBCol md="6">
                  <label className="text-[16px] font-bold text-[#1f2937]">
                    Rol:
                  </label>
                  <Select
                    name="custom_role_id"
                    options={roleOptions}
                    value={selectedRoleValue}
                    onChange={(opt) =>
                      handleSelectChange("custom_role_id", opt, changeHandler)
                    }
                    placeholder="Selecciona un rol"
                    styles={CUSTOM_SELECT_STYLES}
                    isDisabled={!isSuperUser}
                    isClearable
                    menuPortalTarget={
                      typeof window !== "undefined" ? document.body : null
                    }
                  />
                </MDBCol>

                {selectedRoleName === CustomRoles.OPERADOR && (
                  <MDBCol md="6">
                    <label className="text-[16px] font-bold text-[#1f2937]">
                      Operador:
                    </label>
                    <Select
                      name="operador_id"
                      options={operadorOptions}
                      value={selectedOperadorValue}
                      onChange={(opt) =>
                        handleSelectChange("operador_id", opt, changeHandler)
                      }
                      placeholder="Selecciona un operador"
                      styles={CUSTOM_SELECT_STYLES}
                      isDisabled={!isSuperUser}
                      isClearable
                      menuPortalTarget={
                        typeof window !== "undefined" ? document.body : null
                      }
                    />
                  </MDBCol>
                )}
              </MDBRow>
            </MDBCardBody>
          </MDBCard>

          <MDBCard className={styleCard}>
            <MDBCardHeader className={styleCardHeader}>
              Datos personales
            </MDBCardHeader>
            <MDBCardBody>
              <MDBRow className="g-4">
                {renderInput("Primer nombre:", "primer_nombre")}
                {renderInput("Segundo nombre:", "segundo_nombre")}
                {renderInput("Primer apellido:", "primer_apellido")}
                {renderInput("Segundo apellido:", "segundo_apellido")}

                <MDBCol md="6">
                  <label className="text-[16px] font-bold text-[#1f2937]">
                    Tipo de Documento:
                  </label>
                  <Select
                    name="tipo_documento"
                    options={DOCUMENT_TYPE_OPTIONS}
                    value={selectedDocumentTypeValue}
                    onChange={(opt) =>
                      handleSelectChange("tipo_documento", opt, changeHandler)
                    }
                    placeholder="Selecciona un tipo de documento"
                    styles={CUSTOM_SELECT_STYLES}
                    isDisabled={!isSuperUser}
                    isClearable
                    menuPortalTarget={
                      typeof window !== "undefined" ? document.body : null
                    }
                  />
                </MDBCol>

                {renderInput("Número de Documento:", "numero_documento")}
              </MDBRow>
            </MDBCardBody>
          </MDBCard>

          <MDBCard className={styleCard}>
            <MDBCardHeader className={styleCardHeader}>
              Información profesional
            </MDBCardHeader>
            <MDBCardBody>
              <MDBRow className="g-4">
                {renderInput("Profesión:", "profesion")}
                {renderInput("Cargo:", "cargo")}
                {renderInput("Entidad:", "entidad")}
              </MDBRow>
            </MDBCardBody>
          </MDBCard>

          {isSuperUser && (
            <div className="mb-4 flex justify-end">
              <MDBBtn
                className="bg-[#0f7a68] px-6 py-3 font-bold"
                size="lg"
                disabled={formIsDisabled || submitting}
                onClick={submitHandler}
              >
                {submitting ? "Creando..." : "Crear usuario"}
              </MDBBtn>
            </div>
          )}
        </MDBRow>
      </MDBContainer>
    </>
  );
}

export default Register;
