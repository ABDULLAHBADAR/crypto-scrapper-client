import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";

const Login = ({ loginUser, auth, errors, history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (auth.isAuthenticated) {
      history.push("/dashboard");
    }
  }, [auth.isAuthenticated, history]);

  useEffect(() => {
    setFormErrors(errors);
  }, [errors]);

  const onChange = e => {
    if (e.target.id === "email") {
      setEmail(e.target.value);
    } else if (e.target.id === "password") {
      setPassword(e.target.value);
    }
  };

  const onSubmit = e => {
    e.preventDefault();

    const userData = {
      email,
      password
    };
    loginUser(userData);
  };

  return (
    <div className="form-box">
      <form className="login-form" onSubmit={onSubmit}>
        <h2>Login</h2>
        <hr />
        <div className="form-group">
          <input
            type="email"
            id="email"
            placeholder="Email Address"
            value={email}
            onChange={onChange}
            className={classnames("form-control", {
              invalid: formErrors.email || formErrors.emailnotfound
            })}
          />
          <span className="red-text">
            {formErrors.email}
            {formErrors.emailnotfound}
          </span>
        </div>
        <div className="form-group">
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={onChange}
            className={classnames("form-control", {
              invalid: formErrors.password || formErrors.passwordincorrect
            })}
          />
          <span className="red-text">
            {formErrors.password}
            {formErrors.passwordincorrect}
          </span>
        </div>
        <div className="form-group">
          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
          >
            Login
          </button>
        </div>
        <div className="text-center">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
};

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { loginUser })(Login);
