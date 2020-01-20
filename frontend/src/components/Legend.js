import React, { Component } from "react";
import "../styles/index.css";

const colors = ["#fafa6e", "#c6cd68", "#91a163", "#5e745d", "#2a4858"];

class Legend extends Component {
  render() {
    return (
      <div className="map-overlay" id="features">
        <strong>2010 Census Response Rates (%)</strong>
        <div
          className="legend gradient"
          style={{
            background: "linear-gradient(to right," + colors.toString() + ")"
          }}
        />
        <div className="legend labels">
          <div className="label" style={{ "text-align": "left" }}>
            0
          </div>
          <div className="label">50</div>
          <div className="label" style={{ "text-align": "right" }}>
            100
          </div>
        </div>
      </div>
    );
  }
}

export default Legend;
