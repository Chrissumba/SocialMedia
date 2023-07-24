import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./login.scss";

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [err, setErr] = useState(null);

  const navigate = useNavigate()

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const { login } = useContext(AuthContext);
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(inputs);

      // Check if the login was successful
      if (localStorage.getItem("userdata")) {
        console.log("Login successful!");
        navigate("/");
      } else {
        console.log("Login failed. Invalid credentials.");
        setErr("Invalid credentials.");
      }
    } catch (err) {
      console.log("Login failed. Error:", err.response?.data?.message || "An error occurred");
      setErr(err.response?.data?.message || "Invalid credentials");
    }
  };

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await login(inputs);
  //     navigate("/")
  //   } catch (err) {
  //     setErr(err.response.data);
  //   }
  // };
  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Happy connecting!</h1>
          <p>
          We encourage you to be kind, respectful, and empathetic towards others, creating a warm and inclusive environment for everyone. Let's continue making this social space an enjoyable and enriching experience for all.
          </p>
          <span>Don't you have an account?</span>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            {err && err}
            <button onClick={handleLogin}>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;