// import React, { useState } from "react";
// import {
//   MDBBtn,
//   MDBContainer,
//   MDBCard,
//   MDBCardBody,
//   MDBCardImage,
//   MDBRow,
//   MDBCol,
//   MDBInput,
// } from "mdb-react-ui-kit";
// import imagen from "../../assets/Logo2.jpg";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert";

// function Register() {
//   const [form, setForm] = useState({
//     username: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [errors, setErrors] = useState({
//     email: "",
//     password: "",
//   });

//   const navigate = useNavigate();
//   const back = import.meta.env.VITE_APP_BACK;

//   const isEmailValid = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Validación de formato email
//     return emailRegex.test(email);
//   };

//   const changeHandler = (event) => {
//     const { name, value } = event.target;

//     // Actualizamos el formulario
//     setForm((prevForm) => ({ ...prevForm, [name]: value }));

//     // Validación en tiempo real
//     if (name === "email") {
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         email: isEmailValid(value) ? "" : "Por favor, ingresa un email válido",
//       }));
//     }

//     if (name === "confirmPassword" || name === "password") {
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         password:
//           name === "confirmPassword" && value !== form.password
//             ? "Las contraseñas no coinciden"
//             : "",
//       }));
//     }
//   };

//   const formIsDisabled =
//     !form.username ||
//     !form.email ||
//     !isEmailValid(form.email) ||
//     !form.password ||
//     form.password !== form.confirmPassword;

//   const submitHandler = async (event) => {
//     event.preventDefault();

//     if (!isEmailValid(form.email)) {
//       Swal({
//         title: "Error",
//         text: "Por favor, ingresa un email válido",
//         icon: "error",
//       });
//       return;
//     }

//     if (form.password !== form.confirmPassword) {
//       Swal({
//         title: "Error",
//         text: "Las contraseñas no coinciden",
//         icon: "error",
//       });
//       return;
//     }

//     try {
//       const response = await fetch(
//         // "http://localhost:1337/api/auth/local/register",
//         `${back}/auth/local/register`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             username: form.username,
//             email: form.email,
//             password: form.password,
//           }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log("Fetch POST Response:", data);

//       Swal({
//         title: "Registro exitoso",
//         text: "Usuario registrado correctamente",
//         icon: "success",
//       });

//       navigate("/login"); // Redirigir a la página de login después del registro exitoso
//     } catch (error) {
//       console.error("Fetch POST Error:", error.message);
//       Swal({
//         title: "Error al registrar",
//         text: "Hubo un problema al intentar registrar el usuario",
//         icon: "error",
//       });
//     }
//   };

//   console.log("Form", form);

//   return (
//     <MDBContainer
//       fluid
//       className="d-flex justify-content-center align-items-center vh-100"
//     >
//       <MDBRow className="d-flex justify-content-center align-items-center w-100">
//         <MDBCol lg="6" md="8" sm="10" className="d-flex justify-content-center">
//           <MDBCard className="my-5 rounded-3" style={{ maxWidth: "600px" }}>
//             <MDBCardImage
//               src={imagen}
//               className="w-100 rounded-top"
//               alt="Sample photo"
//               style={{ width: "100%", height: "400px", objectFit: "cover" }}
//             />

//             <MDBCardBody className="px-5">
//               <h3 className="mb-4 pb-2 pb-md-0 mb-md-5 px-md-2 text-center">
//                 Registro Usuario
//               </h3>

//               {/* Campo de Nombre */}
//               <MDBInput
//                 wrapperClass="mb-4"
//                 label="UserName"
//                 id="form1"
//                 type="text"
//                 value={form.username}
//                 onChange={changeHandler}
//                 name="username"
//               />

//               {/* Campo de Email */}
//               <MDBInput
//                 wrapperClass="mb-3"
//                 label="Email"
//                 id="form2"
//                 type="email"
//                 value={form.email}
//                 onChange={changeHandler}
//                 name="email"
//               />
//               {errors.email && <p className="text-danger">{errors.email}</p>}

//               {/* Campo de Contraseña */}
//               <MDBInput
//                 wrapperClass="mb-3"
//                 label="Password"
//                 id="form3"
//                 type="password"
//                 value={form.password}
//                 onChange={changeHandler}
//                 name="password"
//               />

//               {/* Campo de Confirmar Contraseña */}
//               <MDBInput
//                 wrapperClass="mb-3"
//                 label="Confirm Password"
//                 id="form4"
//                 type="password"
//                 value={form.confirmPassword}
//                 onChange={changeHandler}
//                 name="confirmPassword"
//               />
//               {errors.password && (
//                 <p className="text-danger">{errors.password}</p>
//               )}

//               {/* Botón de Enviar */}
//               <MDBBtn
//                 color="success"
//                 className="mb-4 w-100"
//                 size="lg"
//                 disabled={formIsDisabled}
//                 onClick={submitHandler}
//               >
//                 Submit
//               </MDBBtn>
//             </MDBCardBody>
//           </MDBCard>
//         </MDBCol>
//       </MDBRow>
//     </MDBContainer>
//   );
// }

// export default Register;

import React, { useState } from "react";
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
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const back = import.meta.env.VITE_APP_BACK;

  const token_object = JSON.parse(sessionStorage.getItem("token")) || {};
  const token = token_object.token;

  console.log("TOken:", token);

  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const changeHandler = (event) => {
    const { name, value } = event.target;

    setForm((prevForm) => ({ ...prevForm, [name]: value }));

    if (name === "email") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: isEmailValid(value) ? "" : "Por favor, ingresa un email válido",
      }));
    }

    if (name === "confirmPassword" || name === "password") {
      setErrors((prevErrors) => ({
        ...prevErrors,
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
    !form.numero_documento;

  const submitHandler = async (event) => {
    event.preventDefault();

    if (!isEmailValid(form.email)) {
      Swal({
        title: "Error",
        text: "Por favor, ingresa un email válido",
        icon: "error",
      });
      return;
    }

    if (form.password !== form.confirmPassword) {
      Swal({
        title: "Error",
        text: "Las contraseñas no coinciden",
        icon: "error",
      });
      return;
    }

    try {
      const response = await fetch(`${back}/auth/local/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Agrega el token aquí
        },
        body: JSON.stringify({
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
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Registro exitoso:", data);

      Swal({
        title: "Registro exitoso",
        text: "Usuario registrado correctamente",
        icon: "success",
      });

      navigate("/login");
    } catch (error) {
      console.error("Error en el registro:", error.message);
      Swal({
        title: "Error al registrar",
        text: "Hubo un problema al intentar registrar el usuario",
        icon: "error",
      });
    }
  };

  return (
    <>
      <div>
        <Header />
      </div>
      <MDBContainer
        fluid
        className="d-flex justify-content-center align-items-center vh-100"
        style={{ minHeight: "100vh", paddingTop: "600px" }}
      >
        <MDBRow className="d-flex justify-content-center align-items-center w-100">
          <MDBCol
            lg="6"
            md="8"
            sm="10"
            className="d-flex justify-content-center"
          >
            <MDBCard className="my-5 rounded-3" style={{ maxWidth: "600px" }}>
              <MDBCardImage
                src={imagen}
                className="w-100 rounded-top"
                alt="Sample photo"
                style={{ width: "100%", height: "400px", objectFit: "cover" }}
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
                  className="mb-4"
                />

                <MDBBtn
                  color="success"
                  className="w-100"
                  size="lg"
                  disabled={formIsDisabled}
                  onClick={submitHandler}
                >
                  Submit
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
