import axios from "axios";

export const GET_DATA = "GET_DATA";

export const GET_TOKEN = "GET_TOKEN";
export const LOGIN_DATA = "LOGIN_DATA";
export const TOKEN_DATA = "TOKEN_DATA";

// Variable de entorno

const back = import.meta.env.VITE_APP_BACK;
const url_data_total = `${back}/api/dashboard-all`;

export const get_data = (token) => {
  return async function (dispatch) {
    try {
      const response = await fetch(`${url_data_total}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Error al obtener subregiones.");
      const data = await response.json();

      console.log("data redux:", data);
      dispatch({ type: GET_DATA, payload: data });
    } catch (error) {
      // alert("algo salio mal");
      console.error("Error fetching subregions:", error);
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

export const getUser = (id) => {
  return async function (dispatch) {
    const apiData = await axios.get(
      `https://jsonplaceholder.typicode.com/users/${id}`
    );
    const user = apiData.data;
    dispatch({ type: GET_TOKEN, payload: user });
  };
};
