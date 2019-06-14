import React, { useState } from "react";
import { Waypoint } from "react-waypoint";

function ScrollList({ Origin, stack, items, ...props }) {
  const [entered, setEntered] = useState({});
  return (
    <div className="scrollable-wrapper">
      {items.slice(0, stack).map((flight, index) => {
        if (Origin && Origin !== flight.Origin) {
          return null;
        }
        return (
          <div className={`post post1`}
          style={{
            height: "auto",
            width: "100%",
            padding:"0"
          }}
          key={index}>
            <div />
            <div className="row" >
              <div className="col-3 col-md-3 hidden_small">
                <div className="main-img" style={{width:"100%"}}>
                  <Waypoint
                    onEnter={() => {
                      setEntered({ ...entered, [index]: true });
                    }}
                  >
                    <img src={entered[index] ? flight["Image URL"] : "../../assets/image/white.jpg"} alt="airplane view" style={{ width: "100%" }} />
                  </Waypoint>
                </div>
              </div>
              <div className="col-md-9 col-sm-12">
                <div className="details">
                  <div className="head">
                    <div className="row">
                      <div className="col-6 col-md-6">
                        <div className="route">
                          {flight.Origin} <img src="Assets/images/airplane.png" style={{ height: "25px", width: "25px", paddingBottom: "3px" }} alt="airplane" /> {flight["Destination"]}
                        </div>
                      </div>
                      <div className="col-6 col-md-6">
                        <div className="dates">
                          {flight.Date}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="body">
                    <div className="row">
                      <div className="col-12 col-md-12">
                        <div className="airline">{flight["Carrier"]}</div>
                        {/* <div className="round-trip">{flight["Price details"]} Round Trip</div> */}
                      </div>
                    </div>
                    <div className="deal">
                      <div className="row">
                        <div className="col-8 col-md-8">
                          <p style={{fontSize: "17px", fontWeight:"500", wordSpacing: "4px", letterSpacing: "1px"}}>Great Value less than usual Awesome Deal ${flight.Price}
                           </p>
                          {/* <div className="less-then">$61 less than Usual</div> */}
                        </div>
                        <div className="col-4 col-md-4">
                          <div className="view">
                            <a href={flight.URL} className="btn btn-view" style={{width:"100%"}}>
                              View Deal
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default ScrollList;

function dateFormat(date) {
  const dateObj = new Date(date);
  return `${dateObj.getMonth() + 1}/${dateObj.getDate()}/${dateObj.getFullYear()}`;
}
