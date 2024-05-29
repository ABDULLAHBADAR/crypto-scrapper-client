import React, { useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";

const Register = ({ registerUser, auth, errors, history }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
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
    const { id, value } = e.target;
    if (id === "name") setName(value);
    else if (id === "email") setEmail(value);
    else if (id === "password") setPassword(value);
    else if (id === "password2") setPassword2(value);
  };

  const onSubmit = e => {
    e.preventDefault();

    const newUser = {
      name,
      email,
      password,
      password2
    };

    registerUser(newUser, history);
  };

  return (
    <div className="form-box">
      <form className="signup-form" onSubmit={onSubmit}>
        <div>
          <Link to="/">
            <i className="fa fa-arrow-circle-left"></i> Back to Home
          </Link>
        </div>
        <h2>Register</h2>
        <hr />
        <div className="form-group">
          <input
            type="text"
            id="name"
            placeholder="Name"
            value={name}
            onChange={onChange}
            className={classnames("form-control", {
              invalid: formErrors.name
            })}
          />
          <span className="red-text">{formErrors.name}</span>
        </div>
        <div className="form-group">
          <input
            type="email"
            id="email"
            placeholder="Email Address"
            value={email}
            onChange={onChange}
            className={classnames("form-control", {
              invalid: formErrors.email
            })}
          />
          <span className="red-text">{formErrors.email}</span>
        </div>
        <div className="form-group">
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={onChange}
            className={classnames("form-control", {
              invalid: formErrors.password
            })}
          />
          <span className="red-text">{formErrors.password}</span>
        </div>
        <div className="form-group">
          <input
            type="password"
            id="password2"
            placeholder="Confirm Password"
            value={password2}
            onChange={onChange}
            className={classnames("form-control", {
              invalid: formErrors.password2
            })}
          />
          <span className="red-text">{formErrors.password2}</span>
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-primary btn-block btn-lg">
            Sign Up
          </button>
        </div>
        <div className="text-center">
          Already have an account? <Link to="/login">Login here</Link>
        </div>
      </form>
    </div>
  );
};

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, { registerUser })(withRouter(Register));
