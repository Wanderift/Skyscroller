import React, { useState } from "react";
import { Waypoint } from "react-waypoint";
import Logo from "../../Assets/images/white.jpg";

function ScrollList({ origin, items, ...props }) {
  const [entered, setEntered] = useState({});
  return (
    <div className="scrollable-wrapper">
      {items.map((flight, index) => {
        if (origin && origin !== flight.origin) {
          return null;
        }
        return (
          <div className={`post post1`}
          style={{
            height: "auto",
            width: "100%",
            padding:"0"
          }}>
            <div />
            <div className="row" >
              <div className="col-3 col-md-3 hidden_small">
                <div className="main-img" style={{width:"100%"}}>
                  <Waypoint
                    onEnter={() => {
                      setEntered({ ...entered, [index]: true });
                    }}
                  >
                    <img src={entered[index] ? flight["Image URL"] : Logo} alt="airplane view" style={{ width: "100%" }} />
                  </Waypoint>
                </div>
              </div>
              <div className="col-md-9 col-sm-12">
                <div className="details">
                  <div className="head">
                    <div className="row">
                      <div className="col-6 col-md-6">
                        <div className="route">
                          {flight["Origin"]} <img src="Assets/images/airplane.png" style={{ height: "25px", width: "25px", paddingBottom: "3px" }} alt /> {flight["Destination"]}
                        </div>
                      </div>
                      <div className="col-6 col-md-6">
                        <div className="dates">
                          {/* {dateFormat(flight.initialDate)} - {dateFormat(flight.finalDate)} */}
                          {flight.Date}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="body">
                    <div className="row">
                      <div className="col-12 col-md-12">
                        <div className="airline">{flight["Carrier"]}</div>
                        <div className="round-trip">{flight["Price details"]} Round Trip</div>
                      </div>
                    </div>
                    <div className="deal">
                      <div className="row">
                        <div className="col-8 col-md-8">
                          Great Value $66
                          <div className="less-then">$61 less than Usual</div>
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
          // <div className={`post ${styles.post}`}>
          // 	<div className="row">
          // 		<img src="Assets/images/wanderift.png" alt="wanderift logo" />
          // 		<div className="title"></div>
          // 	</div>
          // 	<div className="post-time">Yesterday at 1:08 AM</div>
          // 	<div className="post-img">

          // 	</div>
          // 	<div className="details">
          // 		<p> Round Trip:</p>
          // 		<p>
          // 			{flight.origin}{' '}
          // 			<img src="Assets/images/airplane.png" alt="plane emoji" />{' '}
          // 			{flight.destination}
          // 		</p>
          // 		<p>
          // 			{dateFormat(flight.initialDate)} - {dateFormat(flight.finalDate)}
          // 		</p>
          // 	</div>
          // </div>
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
