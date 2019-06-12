import React, { Fragment } from "react";

const styles = {
  logOut: {
    textDecoration: "none"
  }
};

const SignedInLinks = ({ user, signOut }) => {
  // console.log(user.displayName);
  const hrs = new Date().getHours();
  let greet = "";
  if (hrs < 12) greet = "Good Morning";
  else if (hrs >= 12 && hrs <= 17) greet = "Good Afternoon";
  else if (hrs >= 17 && hrs <= 24) greet = "Good Evening";

  const desc = user ? greet + " " + user.first_name : "";

  return (
    <Fragment>
      <p class="navbar-text navbar-right" style={{ color: "white" }}>
        <span style={{padding:"0 30px 0 0 "}} >{desc}</span>
        <a href="#" role="button" className="nav-sub" style={styles.logOut} onClick={signOut}>
          Log Out
        </a>
      </p>
    </Fragment>
  );
};

export default SignedInLinks;
