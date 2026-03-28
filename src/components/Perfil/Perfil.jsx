import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import {
  MDBContainer,
  MDBCard,
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

  // ─── Render ────────────────────────────────────────────────────────────────

  if (loading) return <><Header /><Spinner /></>;

  if (!user) {
    return (
      <>
        <Header />
        <MDBContainer fluid className="d-flex justify-content-center align-items-center vh-100">
          <p>No se pudo cargar la información del usuario.</p>
        </MDBContainer>
      </>
    );
  }

  const roleName =
    user.custom_roles?.[0]?.name || user.role?.name || "Sin rol";

  const operadorName = user.operador_pic?.operador_pic || "N/A";

  return (
    <>
      <Header />
      <MDBContainer
        fluid
        className="d-flex justify-content-center align-items-center vh-100"
        style={{ paddingTop: "400px" }}
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
                <h3 className="mb-4 pb-2 text-center">Mi Perfil</h3>

                {/* Credenciales */}
                <MDBInput
                  label="Username"
                  value={user.username || ""}
                  className="mb-3"
                  disabled
                />
                <MDBInput
                  label="Email"
                  value={user.email || ""}
                  className="mb-3"
                  disabled
                />

                {/* Datos personales */}
                <MDBInput
                  label="Primer Nombre"
                  value={user.primer_nombre || ""}
                  className="mb-3"
                  disabled
                />
                <MDBInput
                  label="Segundo Nombre"
                  value={user.segundo_nombre || ""}
                  className="mb-3"
                  disabled
                />
                <MDBInput
                  label="Primer Apellido"
                  value={user.primer_apellido || ""}
                  className="mb-3"
                  disabled
                />
                <MDBInput
                  label="Segundo Apellido"
                  value={user.segundo_apellido || ""}
                  className="mb-3"
                  disabled
                />

                {/* Documento */}
                <MDBInput
                  label="Tipo de Documento"
                  value={user.tipo_documento || ""}
                  className="mb-3"
                  disabled
                />
                <MDBInput
                  label="Número de Documento"
                  value={user.numero_documento || ""}
                  className="mb-3"
                  disabled
                />

                {/* Información laboral */}
                <MDBInput
                  label="Profesión"
                  value={user.profesion || ""}
                  className="mb-3"
                  disabled
                />
                <MDBInput
                  label="Cargo"
                  value={user.cargo || ""}
                  className="mb-3"
                  disabled
                />
                <MDBInput
                  label="Entidad"
                  value={user.entidad || ""}
                  className="mb-3"
                  disabled
                />

                {/* Rol y Operador */}
                <MDBInput
                  label="Rol"
                  value={roleName}
                  className="mb-3"
                  disabled
                />
                <MDBInput
                  label="Operador"
                  value={operadorName}
                  className="mb-3"
                  disabled
                />
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </>
  );
}

export default Perfil;
