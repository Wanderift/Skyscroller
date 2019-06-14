import React, { Fragment } from "react";

const SignedOutLinks = () => {
  return (
    <Fragment>
      <li>
        <a href="#login-Modal" role="button" data-toggle="modal" data-target="#login-Modal">
          Sign In
        </a>
      </li>
      <li>
        <a href="#signup-Modal" role="button" data-toggle="modal" data-target="#signup-Modal" className="nav-sub">
          Sign Up
        </a>
      </li>
    </Fragment>
  );
};

export default SignedOutLinks;
