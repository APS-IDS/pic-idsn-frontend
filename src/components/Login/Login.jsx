import { useState } from "react";
import { useSelector } from "react-redux";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const datos = useSelector((state) => state.token);

  const changeHandler = (event) => {
    const property = event.target.name;
    const value = event.target.value;
    setForm({ ...form, [property]: value });
  };

  const formIsDisabled = !form.password || !form.email;

  return (
    <div>
      <h1>Login</h1>

      <div>
        <form>
          <div>
            <input
              type="text"
              placeholder="Email"
              value={form.email}
              onChange={changeHandler}
              name="email"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Contraseña"
              value={form.password}
              onChange={changeHandler}
              name="password"
            />
          </div>

          <div>
            <button type="submit" disabled={formIsDisabled}>
              Ingresar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
