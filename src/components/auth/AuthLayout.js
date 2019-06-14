import React from "react";
import SignedInLinks from "./SignedInLinks";
import SignedOutLinks from "./SignedOutLinks";

const AuthLayout = props => {
  const { user, signOut } = props;
  const links = user ? <SignedInLinks user={user} signOut={signOut} /> : <SignedOutLinks />;

  return (
    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul className="nav navbar-nav navbar-right">{links}</ul>
    </div>
  );
};

export default AuthLayout;
