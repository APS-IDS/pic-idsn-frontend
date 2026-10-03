import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import Swal from "sweetalert2";
import {
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
import { useSelector } from "react-redux";
import Spinner from "../Spinner/Spinner";

// ─── Component ───────────────────────────────────────────────────────────────

function Perfil() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const back = import.meta.env.VITE_APP_BACK;
  const token =
    useSelector((state) => state.token.token) ||
    JSON.parse(localStorage.getItem("token"))?.token;

  // ─── Data fetching ─────────────────────────────────────────────────────────

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${back}/api/users/me?pLevel=2`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Error al obtener el perfil.");
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [back, token]);

  useEffect(() => {
    if (!loading && !user) {
      Swal.fire({
        title: "Error",
        text: "No se pudo cargar la información del usuario.",
        icon: "error",
      }).then(() => {
        window.history.back();
      });
    }
  }, [loading, user]);
  // ─── Render ────────────────────────────────────────────────────────────────

  if (loading)
    return (
      <>
        <Header />
        <Spinner />
      </>
    );

  if (!user) {
    return null;
  }

  const roleName = user.custom_roles?.[0]?.name || user.role?.name || "Sin rol";

  const operadorName = user.operador_pic?.operador_pic || "N/A";

  //-----Styles-----------------------

  const initials =
    user.username
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((name) => name[0].toUpperCase())
      .join("") || "U";

  const styleCard = "mb-4 border-solid border-gray-200 border-[1px] p-0";
  const styleCardHeader =
    "bg-[#0f7a68] text-[20px] text-white font-bold px-4 py-3";
  const styleLabelInput = "text-[16px] font-bold !-translate-y-8";

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
                      {user.username}
                    </h2>

                    <span className="bg-[#e3f4ef] inline-flex items-center gap-2 rounded-full px-3 py-1 font-bold text-[#0b5c4d] text-[15px]">
                      ● {roleName}
                    </span>

                    <div className="mt-2 text-[#5b6673] text-[13px] px-2">
                      {user.email}
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

          <MDBCard className={styleCard}>
            <MDBCardHeader className={styleCardHeader}>
              Datos de la cuenta
            </MDBCardHeader>
            <MDBCardBody>
              <MDBRow className="g-4">
                <MDBCol md="6">
                  <MDBInput
                    label="Nombre de usuario:"
                    labelClass={styleLabelInput}
                    value={user.username || ""}
                    className="mt-3"
                    disabled
                  />
                </MDBCol>

                <MDBCol md="6">
                  <MDBInput
                    label="Email:"
                    labelClass={styleLabelInput}
                    value={user.email || ""}
                    className="mt-3"
                    disabled
                  />
                </MDBCol>

                <MDBCol md="6">
                  <MDBInput
                    label="Rol:"
                    labelClass={styleLabelInput}
                    value={roleName}
                    className="mt-3"
                    disabled
                  />
                </MDBCol>

                <MDBCol md="6">
                  <MDBInput
                    label="Operador:"
                    labelClass={styleLabelInput}
                    value={operadorName}
                    className="mt-3"
                    disabled
                  />
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </MDBCard>

          <MDBCard className={styleCard}>
            <MDBCardHeader className={styleCardHeader}>
              Datos personales
            </MDBCardHeader>
            <MDBCardBody>
              <MDBRow className="g-4">
                <MDBCol md="6">
                  <MDBInput
                    label="Primer nombre:"
                    labelClass={styleLabelInput}
                    value={user.primer_nombre || "Sin registrar"}
                    className="mt-3"
                    disabled
                  />
                </MDBCol>

                <MDBCol md="6">
                  <MDBInput
                    label="Segundo nombre:"
                    labelClass={styleLabelInput}
                    value={user.segundo_nombre || "Sin registrar"}
                    className="mt-3"
                    disabled
                  />
                </MDBCol>

                <MDBCol md="6">
                  <MDBInput
                    label="Primer apellido:"
                    labelClass={styleLabelInput}
                    value={user.primer_apellido || "Sin registrar"}
                    className="mt-3"
                    disabled
                  />
                </MDBCol>

                <MDBCol md="6">
                  <MDBInput
                    label="Segundo apellido:"
                    labelClass={styleLabelInput}
                    value={user.segundo_apellido || "Sin registrar"}
                    className="mt-3"
                    disabled
                  />
                </MDBCol>

                <MDBCol md="6">
                  <MDBInput
                    label="Tipo de Documento:"
                    labelClass={styleLabelInput}
                    value={user.tipo_documento || "Sin registrar"}
                    className="mt-3"
                    disabled
                  />
                </MDBCol>

                <MDBCol md="6">
                  <MDBInput
                    label="Número de Documento:"
                    labelClass={styleLabelInput}
                    value={user.numero_documento || "Sin registrar"}
                    className="mt-3"
                    disabled
                  />
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </MDBCard>

          <MDBCard className={styleCard}>
            <MDBCardHeader className={styleCardHeader}>
              Información profesional
            </MDBCardHeader>
            <MDBCardBody>
              <MDBRow className="g-4">
                <MDBCol md="6">
                  <MDBInput
                    label="Profesión:"
                    labelClass={styleLabelInput}
                    value={user.profesion || "Sin registrar"}
                    className="mt-3"
                    disabled
                  />
                </MDBCol>

                <MDBCol md="6">
                  <MDBInput
                    label="Cargo:"
                    labelClass={styleLabelInput}
                    value={user.cargo || "Sin registrar"}
                    className="mt-3"
                    disabled
                  />
                </MDBCol>

                <MDBCol md="6">
                  <MDBInput
                    label="Entidad:"
                    labelClass={styleLabelInput}
                    value={user.entidad || "Sin registrar"}
                    className="mt-3"
                    disabled
                  />
                </MDBCol>
              </MDBRow>
            </MDBCardBody>
          </MDBCard>
        </MDBRow>
      </MDBContainer>
    </>
  );
}

export default Perfil;
