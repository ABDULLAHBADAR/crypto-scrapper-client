import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <nav className="navbar bg-light justify-content-center">
        <Link className="navbar-brand text-dark font-weight-bold" to="/">
          <i className="fa fa-btc"></i> Typhoon telegram scrapper
        </Link>
      </nav>
    </>
  );
};

export default Navbar;
