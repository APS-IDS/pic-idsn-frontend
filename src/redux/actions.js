import axios from "axios";

export const GET_DATA = "GET_DATA";

export const GET_USER = "GET_USER";

export const GET_TOKEN = "GET_TOKEN";
export const LOGIN_DATA = "LOGIN_DATA";
export const TOKEN_DATA = "TOKEN_DATA";
export const LOGOUT = "LOGOUT";
// Variable de entorno

const back = import.meta.env.VITE_APP_BACK;
const url_data_total = `${back}/api/dashboard-all`;
const url_usuarios = `${back}/api/users/me?pLevel=2`;

const getAuthToken = () => {
  return JSON.parse(localStorage.getItem("token"))?.token || null;
};

// export const get_data = (token) => {
//   return async function (dispatch) {
//     try {
//       const response = await fetch(`${url_data_total}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (!response.ok) throw new Error("Error al obtener subregiones.");
//       const data = await response.json();

//       // console.log("data redux:", data);
//       dispatch({ type: GET_DATA, payload: data });
//     } catch (error) {
//       // alert("algo salio mal");
//       console.error("Error fetching subregions:", error);
//     }
//   };
// };

export const get_data = () => {
  return async function (dispatch) {
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await fetch(url_data_total, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Error al obtener subregiones.");
      const data = await response.json();
      dispatch({ type: GET_DATA, payload: data });
    } catch (error) {
      console.error("Error fetching subregions:", error);
    }
  };
};

// export const get_user = (token) => {
//   return async function (dispatch) {
//     try {
//       const response = await fetch(`${url_usuarios}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (!response.ok) throw new Error("Error al obtener usuario");
//       const data = await response.json();
//       const datos = {
//         usuario: data.custom_roles[0].name,
//         user_name: data.username,
//       };

//       // sessionStorage.setItem("usuario_rol", JSON.stringify(datos));

//       localStorage.setItem("usuario_rol", JSON.stringify(datos));

//       // console.log("data user:", datos);
//       dispatch({ type: GET_USER, payload: datos });
//     } catch (error) {
//       // alert("algo salio mal");
//       console.error("Error fetching subregions:", error);
//     }
//   };
// };

export const get_user = () => {
  return async function (dispatch) {
    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await fetch(url_usuarios, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Error al obtener usuario");

      const data = await response.json();
      const datos = {
        usuario: data.custom_roles[0].name,
        user_name: data.username,
      };

      localStorage.setItem("usuario_rol", JSON.stringify(datos));
      dispatch({ type: GET_USER, payload: datos });
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
};

export const tokenData = (tokenData) => ({
  type: TOKEN_DATA,
  payload: tokenData,
});

export const loginSuccess = (userData) => ({
  type: LOGIN_DATA,
  payload: userData,
});

export const logout = () => ({
  type: LOGOUT,
});

export const getUser = (id) => {
  return async function (dispatch) {
    const apiData = await axios.get(
      `https://jsonplaceholder.typicode.com/users/${id}`,
    );
    const user = apiData.data;
    dispatch({ type: GET_TOKEN, payload: user });
  };
};
