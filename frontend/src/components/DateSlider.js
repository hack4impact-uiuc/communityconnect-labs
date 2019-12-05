import React, { Component } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

class DateSlider extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const nDates = this.props.dates.length;
    return (
      <div>
        <div>
          <Slider
            min={0}
            max={nDates - 1}
            defaultValue={0}
            onAfterChange={ i => this.props.dateChange(this.props.dates[i]) } />
        </div>
      </div>
    );
  }
}

export default DateSlider;
