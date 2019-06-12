import React, { useState, useEffect } from "react";
import logo from "./Assets/images/sky_scroller_logo.png";
import ScrollList from "./components/scroll-list";
import AuthLayout from "./components/auth/AuthLayout";
import Sticky from "react-sticky-el";
import $ from "jquery";

import { types } from "./Assets/js/typeMap";

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDPWhrqS-EdY94QvwjFjkeE9fMoX96OfEU",
  authDomain: "dealscroller-7bd62.firebaseapp.com",
  databaseURL: "https://dealscroller-7bd62.firebaseio.com",
  projectId: "dealscroller-7bd62",
  storageBucket: "dealscroller-7bd62.appspot.com",
  messagingSenderId: "1047635684795",
  appId: "1:1047635684795:web:33e2c812f7be6c4d"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
window.firebase = firebase;

function App() {
  // Authentication
  const [user, setUser] = useState({});
  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, SetSigninPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [originCity, setOrigincity] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const [flights, setFlights] = useState([]);
  const [typeFilter, setTypeFilter] = useState("All");
  const [origin, setOrigin] = useState("");

  const dealsFromCities = [
    "Atlanta",
    "Los Angeles",
    "Chicago",
    "Dallas",
    "New York",
    "San Francisco",
    "Las Vegas",
    "Seattle",
    "Charlotte",
    "Newark",
    "Orlando",
    "Phoenix",
    "Miami",
    "Houston",
    "Boston",
    "Minneapolis",
    "Detroit",
    "Baltimore",
    "Salt Lake City",
    "Washington",
    "San Diego",
    "Tampa",
    "Portland"
  ];
  const priceRange = [
    { from: 0, to: 50 },
    { from: 51, to: 100 },
    { from: 101, to: 150 },
    { from: 151, to: 200 }
  ];
  const [selectedCity, setSelectedCity] = useState("Select an Origin City");
  const [openCity, setOpenCity] = useState(false);
  const [openPrice, setOpenPrice] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState("Select a Price Range");

  const [selectPriceRange, setSelectPriceRange] = useState("all");

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      // console.log(user);
      if (user) {
        // Get user data from database
        // console.log(user.uid);
        firebase
          .firestore()
          .collection("users")
          .doc(user.uid)
          .get()
          .then(res => {
            // console.log(res.data());
            const userData = res.data();

            // Save user to state
            setUser(userData);
          })
          .catch(error => {
            console.log("Get User Error: ", error);
          });

        // firebase.firestore()
      } else {
        setUser(null);
      }
    });
  });

  useEffect(() => {
    handleSearch();
  }, []);

  useEffect(() => {
    setTypeFilter("All");
  }, [origin]);

  const handleSearch = () => {
    // console.log("selectPriceRange", selectPriceRange);
    // console.log("selectedCity", selectedCity);

    // let datasnapshot = firebase.firestore().collection("/FlightDeals");

    const db = firebase.database();

    const flightRef = db.ref("cheapest_flights");

    const priceCityStatus =
      selectPriceRange === "all" && selectedCity === "Select an Origin City";

    if (
      flights.length === 0 ||
      selectedCity === "Select an Origin City" ||
      selectPriceRange === "all" ||
      priceCityStatus
    ) {
      flightRef.once("value").then(snapshot => {
        setFlights(snapshot.val());
      });
    }

    if (selectedCity != "Select an Origin City") {
      const filteredFlights = flights.filter(item => {
        if (item.Origin == selectedCity) {
          return item;
        }
      });
      setFlights(filteredFlights);
    } else if (selectPriceRange != "all") {
      const filteredFlights = flights.filter(item => {
        if (
          parseFloat(item["Price"]) >= parseFloat(selectPriceRange.from) &&
          parseFloat(item["Price"]) <= parseFloat(selectPriceRange.to)
        ) {
          return item;
        }
      });
      setFlights(filteredFlights);
    } else if (
      selectedCity !== "Select an Origin City" &&
      selectPriceRange !== "all"
    ) {
      const filteredFlights = flights.filter(item => {
        console.log();

        if (
          parseFloat(item["Price"]) >= parseFloat(selectPriceRange.from) &&
          parseFloat(item["Price"]) <= parseFloat(selectPriceRange.to)
        ) {
          if (item["Origin"] === selectedCity) {
            return item;
          }
        }
      });
      setFlights(filteredFlights);
    }

    // flightRef.on('value', (snapshot)=>{
    //   newFlights = snapshot.val();

    //   if (selectedCity) {
    //     const latestFlights = newFlights.filter((item, index)=>{
    //         if (item.Origin === selectedCity) {
    //           return item.Origin;
    //           }
    //       }
    //     })
    //   }

    //   console.log(latestFlights);

    // })

    // if (selectedCity == "Select an Origin City") {
    //   setOrigin("");
    // } else {
    //   setOrigin(selectedCity);
    //   datasnapshot = datasnapshot.where("origin", "==", selectedCity);
    // }

    // if (selectPriceRange == "all") {
    // } else {
    //   datasnapshot = datasnapshot.where("price", ">=", selectPriceRange.from).where("price", "<=", selectPriceRange.to);
    // }

    // datasnapshot
    //   .orderBy("price", "asc")
    //   .get()
    //   .then(querySnapshot => {
    //     const docs = [];
    //     querySnapshot.docs.forEach(doc => {
    //       docs.push(doc.data());
    //     });

    //     // console.log(docs);
    //     //setOrigin(selectedCity);
    //     setFlights(docs);
    //   });
  };

  const handleSelect = e => {
    // console.log(e);
    setSelectedCity(e.target.innerHTML);
    //setOrigin(e.target.innerHTML);
  };
  const handleOpen = () => {
    setOpenCity(!openCity);
  };

  const handleSelectPriceRange = el => {
    if (el == "all") {
      setSelectedPrice("Select a Price Range");
    } else {
      setSelectedPrice(`$${el.from} - $${el.to}`);
    }

    setSelectPriceRange(el);
  };

  const handleOpenPrice = () => {
    setOpenPrice(!openPrice);
  };

  function tabNavigate(type) {
    setTypeFilter(type);
  }

  const filters = {
    Domestic: item => types.destinations.us.includes(item["Destination"]),
    International: item =>
      types.destinations.international.includes(item["Destination"])
  };

  // Authentication
  // ======================================
  const clearAuthStates = () => {
    setSigninEmail("");
    SetSigninPassword("");
    setFirstName("");
    setOrigincity("");
    setSignupEmail("");
    setSignupPassword("");
  };

  const signIn = e => {
    // e.preventDefault();
    // console.log("aaa");
    auth
      .signInWithEmailAndPassword(signinEmail, signinPassword)
      .then(user => {
        clearAuthStates();
        // hide modal window
        // console.log(user);
      })
      .catch(error => {
        console.log("Signin Error: ", error);
      });
  };

  const signInWithGoogle = e => {
    // e.preventDefault();
    auth
      .signInWithPopup(googleAuthProvider)
      .then(user => {
        // console.log("Google Signin Success: " + user);
      })
      .catch(error => {
        // console.log("Google Signin Error: " + error);
      });
  };

  const signOut = e => {
    // e.preventDefault();
    auth.signOut();
    clearAuthStates();
  };

  const signUp = e => {
    // e.preventDefault();
    // console.log(signupEmail);
    auth
      .createUserWithEmailAndPassword(signupEmail, signupPassword)
      .then(res => {
        // console.log(res.user.uid);
        // save user to database with first name and origin city
        firebase
          .firestore()
          .collection("users")
          .doc(res.user.uid)
          .set({
            first_name: firstName,
            origin_city: originCity
          });
        clearAuthStates();
        // TODO: hide modal window
      })
      .then(() => {
        // console.log("Signup success");
      })
      .catch(error => {
        console.log("SignUp Error: ", error);
      });
  };

  const handleChange = e => {
    // console.log(e.target.id);
    switch (e.target.id) {
      case "signin_email":
        // console.log("Set signin email: ", e.target.value);
        setSigninEmail(e.target.value);
        break;
      case "signin_password":
        // console.log("Set signin password: ", e.target.value);
        SetSigninPassword(e.target.value);
        break;
      case "first_name":
        // console.log(e.target.value);
        setFirstName(e.target.value);
        break;
      case "origin_city":
        setOrigincity(e.target.value);
        break;
      case "signup_email":
        // console.log("Set signup email: ", e.target.value);
        setSignupEmail(e.target.value);
        break;
      case "signup_password":
        // console.log("Set signup password: ", e.target.value);
        setSignupPassword(e.target.value);
        break;
      default:
        break;
    }
  };
  // ======================================

  return (
    <div className="App">
      <div>
        <header className="new-index">
          <nav
            className="navbar navbar-default new-index hidden_small"
            style={{ paddingTop: "14px" }}
          >
            <div className="container">
              {/* Brand and toggle get grouped for better mobile display */}
              <div className="navbar-header">
                <button
                  type="button"
                  className="navbar-toggle collapsed hidden_ever"
                  data-toggle="collapse"
                  data-target="#bs-example-navbar-collapse-1"
                  aria-expanded="false"
                >
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar" />
                  <span className="icon-bar" />
                  <span className="icon-bar" />
                </button>
                <a className="navbar-brand" href="#">
                  <img src={logo} style={{ width: "180px" }} />
                </a>
              </div>
              {/* Collect the nav links, forms, and other content for toggling */}
              <AuthLayout user={user} signOut={signOut} />
              {/* /.navbar-collapse */}
            </div>
          </nav>

          <div className="fillter" style={{ background: "#141F3F" }} />
          <div className="container">
            <div
              className="box"
              style={{
                display: "flex",
                width: "100%",
                flexDirection: "column"
              }}
            >
              <div className="row mini_no_padding">
                <div className="col-12 text-center">
                  <h1
                    className="banner_text1 hidden_small"
                    style={{
                      paddingTop: "20px",
                      lineHeight: "70px",
                      fontWeight: "bold",
                      fontSize: "55px",
                      marginTop: "70px",
                      letterSpacing: "2px"
                    }}
                  >
                    Browse The Cheapest Flights Around
                  </h1>
                  <h1
                    className="banner_text1 hidden_large"
                    style={{
                      paddingTop: "20px",
                      lineHeight: "70px",
                      fontWeight: "bold",
                      fontSize: "40px",
                      marginTop: "70px",
                      letterSpacing: "2px"
                    }}
                  >
                    Browse The Cheapest Flights Around
                  </h1>
                  <h2
                    className="banner_text2 hidden_small"
                    style={{
                      fontSize: "20px",
                      marginTop: "30px",
                      paddingLeft: "40px",
                      paddingBottom: "10px",
                      fontWeight: "normal"
                    }}
                  >
                    Hundreds of destinations
                    <img src="Assets/images/miami.png" alt /> Thousands of
                    savings
                    <img src="Assets/images/money-with-wings_1f4b8.png" alt />
                  </h2>
                </div>
              </div>
              <div
                className="row"
                style={{ paddingBottom: "50px", marginTop: "-40px" }}
              >
                <div className="offset-2 col-8 offset-md-2 col-md-8 offset-sm-1 col-sm-10">
                  <div
                    className="form-container"
                    style={{ marginRight: "auto", marginLeft: "auto" }}
                  >
                    <div id="round-trip-form">
                      <div className="row">
                        <input
                          className="trip_selector"
                          type="radio"
                          id="Round-Trip"
                          name="tripType"
                          defaultChecked="true"
                          defaultValue={2}
                          hidden={true}
                        />
                        <div className="col-sm-5 border-right">
                          <p>Deals From</p>
                          <div
                            className={`nice-select form-control basic ${
                              openCity ? "open" : ""
                            }`}
                            tabIndex={0}
                            onClick={() => handleOpen()}
                          >
                            <span className="current">{selectedCity}</span>
                            <ul className="list">
                              <li
                                key="all"
                                value="all"
                                className="option selected focus"
                                onClick={handleSelect}
                              >
                                Select an Origin City
                              </li>
                              {dealsFromCities.map((el, i) => (
                                <li
                                  key={i}
                                  value={el}
                                  className="option selected focus"
                                  onClick={handleSelect}
                                >
                                  {el}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div
                          className="col-sm-5"
                          style={{ paddingRight: "70px" }}
                        >
                          <p>Price Range</p>
                          <div
                            className={`nice-select form-control basic ${
                              openPrice ? "open" : ""
                            }`}
                            tabIndex={0}
                            onClick={() => handleOpenPrice()}
                          >
                            <span className="current">{selectedPrice}</span>
                            <ul className="list">
                              <li
                                key="all"
                                value="all"
                                className="option selected focus"
                                onClick={() => handleSelectPriceRange("all")}
                              >
                                Select a Price Range
                              </li>
                              {priceRange.map((el, i) => (
                                <li
                                  key={i}
                                  value={el}
                                  className="option"
                                  onClick={() => handleSelectPriceRange(el)}
                                >
                                  ${el.from} - ${el.to}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div
                          className="col-sm-2 add_white_mob"
                          style={{ marginTop: "6px" }}
                        >
                          <button
                            onClick={() => handleSearch()}
                            className="btn btn-primary btn-search"
                            type="button"
                            id="round-trip-button"
                          >
                            Search
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="modal fade"
            id="login-Modal"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden={true}
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-body">
                  <div className="login-head">
                    <h3>Welcome Back!</h3>
                    <p>The find deals closest to you!</p>
                  </div>
                  <div className="login-body">
                    <form>
                      <div className="form-group">
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Email"
                          id="signin_email"
                          onChange={handleChange}
                          value={signinEmail}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Password"
                          id="signin_password"
                          onChange={handleChange}
                          value={signinPassword}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <a id="forgot-password" href="#">
                          Forgot Password?
                        </a>
                      </div>
                      <div className="form-group">
                        <button
                          className="btn btn-primary btn-login"
                          data-dismiss="modal"
                          onClick={signIn}
                        >
                          Sign In
                        </button>
                      </div>
                      {/* <div className="form-group">
                        <button className="btn btn-danger btn-login" onClick={signInWithGoogle}>
                          SignIn With Google
                        </button>
                      </div> */}
                      <div className="form-group">
                        <a href="#" id="started">
                          Don't have an account? Get Started
                        </a>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="modal fade"
            id="signup-Modal"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden={true}
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-body">
                  <div className="login-head">
                    <h3>Never Miss a Deal</h3>
                    <p>
                      Sign up and and stay up to date on the hottest deals near
                      you
                    </p>
                  </div>
                  <div className="login-body">
                    <form>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="First Name"
                          id="first_name"
                          onChange={handleChange}
                          value={firstName}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Origin City"
                          id="origin_city"
                          onChange={handleChange}
                          value={originCity}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Email"
                          id="signup_email"
                          onChange={handleChange}
                          value={signupEmail}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Password"
                          id="signup_password"
                          onChange={handleChange}
                          value={signupPassword}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <button
                          className="btn btn-primary btn-login"
                          data-dismiss="modal"
                          onClick={signUp}
                        >
                          Sign Up
                        </button>
                      </div>
                      <div className="form-group">
                        <a href="#" id="started">
                          Already have an account, Sign In!
                        </a>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="main-content">
          <div className="container-fluid">
            <div
              className="col-md-3 hidden_small"
              style={{ paddingLeft: "90px" }}
            >
              <Sticky>
                <div className="left-side-bar" id="sticky">
                  <h3 className="head">Things to Remember</h3>
                  <p>
                    These Deals could last anywhere from days to minutes before
                    a flights departure
                  </p>
                  <ul>
                    <li>
                      <span>.</span>Prices (typically) don't include checked
                      bags, and are usually basic economy
                    </li>
                    <li>
                      <span>.</span>Looking for deals out of a specific city?
                      Fly up to the search bar and search for the best deals out
                      of your city.
                    </li>
                    <li>
                      <span>.</span>If you travel frequently, check out
                      Wanderift. Pay a monthly fee and recieve a certain amount
                      of flights. Subscribers always pay the same price per
                      flight no matter distance or destination.
                    </li>
                  </ul>
                  <div className="more-trips">
                    <a href="#">More Travel Tips and Tricks</a>
                  </div>
                  <div className="view-destination">
                    <p
                      style={{
                        fontSize: "20px",
                        fontWeight: 500,
                        color: "#333",
                        paddingBottom: "5px"
                      }}
                    >
                      View Based on Destination
                    </p>
                    <a href="#">
                      <img
                        src="Assets/images/new_york.png"
                        style={{ height: "20px", width: "20px" }}
                        alt
                      />{" "}
                      New York
                    </a>
                    <a href="#">
                      <img
                        src="Assets/images/miami.png"
                        style={{ height: "20px", width: "20px" }}
                        alt
                      />{" "}
                      Miami
                    </a>
                    <a href="#">
                      <img
                        src="Assets/images/san_fran.png"
                        style={{ height: "20px", width: "20px" }}
                        alt
                      />{" "}
                      San Francisco
                    </a>
                    <a>
                      <img
                        src="Assets/images/las_vegas.png"
                        style={{ height: "20px", width: "20px" }}
                        alt
                      />{" "}
                      Las Vegas
                    </a>
                  </div>
                  <div className="more-trips">
                    <a href="#">View All</a>
                  </div>
                  <div className="view-destination">
                    <p
                      style={{
                        fontSize: "20px",
                        fontWeight: 500,
                        color: "#333",
                        paddingBottom: "5px"
                      }}
                    >
                      View Based on Price
                    </p>
                    <a href="#">
                      <img
                        src="Assets/images/new_york.png"
                        style={{ height: "20px", width: "20px" }}
                        alt
                      />{" "}
                      Flights lower than $75
                    </a>
                    <a href="#">
                      <img
                        src="Assets/images/miami.png"
                        style={{ height: "20px", width: "20px" }}
                        alt
                      />{" "}
                      Flights from $76 - $125
                    </a>
                    <a href="#">
                      <img
                        src="Assets/images/san_francisco.png"
                        style={{ height: "20px", width: "20px" }}
                        alt
                      />{" "}
                      Flights from $126 - $175
                    </a>
                  </div>
                </div>
              </Sticky>
            </div>
            <div className="col-md-6">
              <div className="timeline">
                <div className="timeline-head">
                  <ul
                    className="nav nav-tabs hidden_small"
                    id="myTab"
                    role="tablist"
                  >
                    <li className="nav-item">
                      <a
                        className={`nav-link ${
                          typeFilter === "All" ? "active" : ""
                        }`}
                        id="home-tab"
                        data-toggle="tab"
                        href="#home"
                        role="tab"
                        aria-controls="home"
                        onClick={e => {
                          e.preventDefault();
                          tabNavigate("All");
                        }}
                        aria-selected="true"
                      >
                        All Flights
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        id="profile-tab"
                        data-toggle="tab"
                        href="#profile"
                        role="tab"
                        aria-controls="profile"
                        onClick={e => {
                          e.preventDefault();
                          tabNavigate("Domestic");
                        }}
                        aria-selected="false"
                      >
                        Domestic Flights
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        id="contact-tab"
                        data-toggle="tab"
                        href="#contact"
                        role="tab"
                        aria-controls="contact"
                        onClick={e => {
                          e.preventDefault();
                          tabNavigate("International");
                        }}
                        aria-selected="false"
                      >
                        International Flights
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="timeline-body">
                  <div className="tab-content" id="myTabContent">
                    <div
                      className="tab-pane fade in active"
                      id="home"
                      role="tabpanel"
                      aria-labelledby="home-tab"
                    >
                      <div className="post hidden_small">
                        <div className="row">
                          <div className="col-md-2">
                            <img
                              src="Assets/images/wanderift_icon.png"
                              style={{ width: "60px", height: "60px" }}
                              alt
                            />
                          </div>
                          <div className="col-md-10 col-sm-12">
                            <p style={{ fontSize: "14px" }}>
                              Welcome to sky<span>scroller</span> powered by
                              Wanderift. Scroll through the cheapest flights
                              around. Want to search for deals out of your city?
                              Not a problem, just select your origin city and
                              price range than start scrolling!
                            </p>
                          </div>
                        </div>
                        <hr />
                        <div className="bottom">
                          <div className="row">
                            <div className="col-md-3">
                              <a href="#">
                                <img
                                  src="Assets/images/share.png"
                                  style={{ height: "25px", width: "25px" }}
                                  alt
                                />
                              </a>{" "}
                              Give us a share
                            </div>
                            <div className="col-md-6 col-sm-12">
                              Check us Out on Social &nbsp;
                              <a href="#">
                                <img
                                  src="Assets/images/instagram.png"
                                  style={{ height: "25px", width: "25px" }}
                                  alt
                                />
                              </a>
                              <a href="#">
                                <img
                                  src="Assets/images/twitter.png"
                                  style={{ height: "25px", width: "25px" }}
                                  alt
                                />
                              </a>
                              <a href="#">
                                <img
                                  src="Assets/images/facebook.png"
                                  style={{ height: "25px", width: "25px" }}
                                  alt
                                />
                              </a>
                            </div>
                            <div className="col-md-3">
                              <div className="built">Built by Wanderift</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div id="cheapest-flights" />
                    </div>
                    <div
                      className="tab-pane fade"
                      id="profile"
                      role="tabpanel"
                      aria-labelledby="profile-tab"
                    >
                      <div className="post">
                        <div className="row">
                          <div className="col-md-2">
                            <img
                              src="Assets/images/wanderift_icon.png"
                              style={{ width: "60px", height: "60px" }}
                              alt
                            />
                          </div>
                          <div className="col-md-10 col-sm-12">
                            <p style={{ fontSize: "14px" }}>
                              Welcome to sky<span>scroller</span> powered by
                              Wanderift. Scroll through the cheapest flights
                              around. Want to search for deals out of your city?
                              Not a problem, just select your origin city and
                              price range than start scrolling!
                            </p>
                          </div>
                        </div>
                        <hr />
                        <div className="bottom">
                          <div className="row">
                            <div className="col-md-3">
                              <a href="#">
                                <img
                                  src="Assets/images/share.png"
                                  style={{ height: "25px", width: "25px" }}
                                  alt
                                />
                              </a>{" "}
                              Give us a share
                            </div>
                            <div className="col-md-6 col-sm-12">
                              Check us Out on Social &nbsp;
                              <a href="#">
                                <img
                                  src="Assets/images/instagram.png"
                                  style={{ height: "25px", width: "25px" }}
                                  alt
                                />
                              </a>
                              <a href="#">
                                <img
                                  src="Assets/images/twitter.png"
                                  style={{ height: "25px", width: "25px" }}
                                  alt
                                />
                              </a>
                              <a href="#">
                                <img
                                  src="Assets/images/facebook.png"
                                  style={{ height: "25px", width: "25px" }}
                                  alt
                                />
                              </a>
                            </div>
                            <div className="col-md-3">
                              <div className="built">Built by Wanderift</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="contact"
                      role="tabpanel"
                      aria-labelledby="contact-tab"
                    >
                      <div className="post">
                        <div className="row">
                          <div className="col-md-2">
                            <img
                              src="Assets/images/wanderift_icon.png"
                              style={{ width: "60px", height: "60px" }}
                              alt
                            />
                          </div>
                          <div className="col-md-10 col-sm-12">
                            <p style={{ fontSize: "14px" }}>
                              Welcome to sky<span>scroller</span> powered by
                              Wanderift. Scroll through the cheapest flights
                              around. Want to search for deals out of your city?
                              Not a problem, just select your origin city and
                              price range than start scrolling!
                            </p>
                          </div>
                        </div>
                        <hr />
                        <div className="bottom">
                          <div className="row">
                            <div className="col-md-3">
                              <a href="#">
                                <img
                                  src="Assets/images/share.png"
                                  style={{ height: "25px", width: "25px" }}
                                  alt
                                />
                              </a>{" "}
                              Give us a share
                            </div>
                            <div className="col-md-6 col-sm-12">
                              Check us Out on Social &nbsp;
                              <a href="#">
                                <img
                                  src="Assets/images/instagram.png"
                                  style={{ height: "25px", width: "25px" }}
                                  alt
                                />
                              </a>
                              <a href="#">
                                <img
                                  src="Assets/images/twitter.png"
                                  style={{ height: "25px", width: "25px" }}
                                  alt
                                />
                              </a>
                              <a href="#">
                                <img
                                  src="Assets/images/facebook.png"
                                  style={{ height: "25px", width: "25px" }}
                                  alt
                                />
                              </a>
                            </div>
                            <div className="col-md-3">
                              <div className="built">Built by Wanderift</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {origin && <h2>{origin}</h2>}
                  <ScrollList
                    origin={origin}
                    items={
                      typeFilter === "All"
                        ? flights
                        : flights.filter(filters[typeFilter])
                    }
                  />
                </div>
              </div>
            </div>
            <div className="col-md-3 hidden_small">
              <Sticky>
                <div className="right-side-bar" id="sticky1">
                  <div className="best-deals">
                    <div className="head">
                      <div className="row">
                        <div className="col-md-10">
                          <p className="head">Trending Flights</p>
                        </div>
                        <div className="col-md-2">
                          <div className="more">
                            <a href="#">
                              <i className="fa fa-ellipsis-h" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="deal">
                      <div className="row">
                        <div className="col-md-12">
                          <img
                            src="Assets/images/southwest.png"
                            style={{ height: "45px", width: "45px" }}
                            alt
                          />
                          <div className="title">Dallas - Las Vegas</div>
                          <div className="post-time">
                            $178, 06/26/2019 - 08/28/2019
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="deal">
                      <div className="row">
                        <div className="col-md-12">
                          <img
                            src="Assets/images/Alaska_Airlines.png"
                            style={{ height: "45px", width: "45px" }}
                            alt
                          />
                          <div className="title">
                            San Fransico, CA - New York, NY
                          </div>
                          <div className="post-time">
                            $178, 06/26/2019 - 08/28/2019
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="deal">
                      <div className="row">
                        <div className="col-md-12">
                          <img
                            src="Assets/images/Alaska_Airlines.png"
                            style={{ height: "45px", width: "45px" }}
                            alt
                          />
                          <div className="title">
                            Los Angeles - San Fransico, CA
                          </div>
                          <div className="post-time">
                            $178, 06/26/2019 - 08/28/2019
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="deal">
                      <div className="row">
                        <div className="col-md-12">
                          <img
                            src="Assets/images/American_Airlines.png"
                            style={{ height: "45px", width: "45px" }}
                            alt
                          />
                          <div className="title">New York - Chicago</div>
                          <div className="post-time">
                            $178, 06/26/2019 - 08/28/2019
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="more-trips">
                      <a href="#">
                        <i className="fa fa-chevron-down" /> Show More
                      </a>
                    </div>
                  </div>
                  <div className="best-deals">
                    <div className="head">
                      <div className="row">
                        <div className="col-md-10">
                          <p className="head">Top Deals</p>
                        </div>
                        <div className="col-md-2">
                          <div className="more">
                            <a href="#">
                              <i className="fa fa-ellipsis-h" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="deal">
                      <div className="row">
                        <div className="col-md-12">
                          <img
                            src="Assets/images/Alaska_Airlines.png"
                            style={{ height: "45px", width: "45px" }}
                            alt
                          />
                          <div className="title">Dallas - Las Vegas</div>
                          <div className="post-time">
                            $178, 06/26/2019 - 08/28/2019
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="deal">
                      <div className="row">
                        <div className="col-md-12">
                          <img
                            src="Assets/images/Delta.png"
                            style={{ height: "45px", width: "45px" }}
                            alt
                          />
                          <div className="title">
                            San Fransico, CA - New York, NY
                          </div>
                          <div className="post-time">
                            $178, 06/26/2019 - 08/28/2019
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="deal">
                      <div className="row">
                        <div className="col-md-12">
                          <img
                            src="Assets/images/American_Airlines.png"
                            style={{ height: "45px", width: "45px" }}
                            alt
                          />
                          <div className="title">
                            Los Angeles - San Fransico, CA
                          </div>
                          <div className="post-time">
                            $178, 06/26/2019 - 08/28/2019
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="deal">
                      <div className="row">
                        <div className="col-md-12">
                          <img
                            src="Assets/images/American_Airlines.png"
                            style={{ height: "45px", width: "45px" }}
                            alt
                          />
                          <div className="title">New York - Chicago</div>
                          <div className="post-time">
                            $178, 06/26/2019 - 08/28/2019
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="more-trips">
                      <a href="#">
                        <i className="fa fa-chevron-down" /> Show More
                      </a>
                    </div>
                  </div>
                </div>
              </Sticky>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
