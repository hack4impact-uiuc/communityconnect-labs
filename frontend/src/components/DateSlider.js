import React, { Component } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import "../styles/index.css";

class DateSlider extends Component {
  render() {
    const nDates = this.props.dates.length;
    return (
      <div>
        <div className="slider">
          <Slider
            min={0}
            max={nDates - 1}
            defaultValue={this.props.defaultValue}
            onAfterChange={i => this.props.dateChange(this.props.dates[i])}
          />
        </div>
      </div>
    );
  }
}

export default DateSlider;
