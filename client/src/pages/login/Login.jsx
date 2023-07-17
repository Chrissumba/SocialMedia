import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/slices/authorizationSlice";
import "./login.scss";


const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.auth.isLoading);
  const navigate = useNavigate(); // Access the navigate function from react-router-dom

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") {
      setUsername(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const credentials = { username, password };
    dispatch(login(credentials))
      .then((result) => {
        if (result.payload) {
          setUsername('');
          setPassword('');
          navigate("/");
        }
      })
      .catch((error) => {
        setErr(error.response.data);
      });
  };
 
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
            {err && <div className="error">{err}</div>}
            <button onClick={handleLogin} disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
