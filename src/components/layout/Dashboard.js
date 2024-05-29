import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";

const Dashboard = ({ auth, logoutUser }) => {
  const { user } = auth;

  const onLogout = e => {
    e.preventDefault();
    logoutUser();
  };

  return (
    <div className="container text-center mt-15">
      <div className="row">
        <div className="col-sm-12">
          <h4>
            Hey there, <b className="name-lable">{user.name.split(" ")[0]}</b>
            <p className="mt-4">
              You are logged in to{" "} 
              <span style={{ fontFamily: "monospace" }}>Scrapper</span> 👏
            </p>
          </h4>
          <button
            onClick={onLogout}
            className="btn btn-large btn-light hoverable font-weight-bold"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logoutUser })(Dashboard);
