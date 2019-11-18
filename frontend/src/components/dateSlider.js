import React, { Component } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const wrapperStyle = { width: 200, margin: 0 };

class DateSlider extends Component {
  constructor(props) {
    super(props);
  }

  generateMarks() {
    var nDates = this.props.dates.length;
    if (nDates == 1) {
      return {100: this.props.dates[0]};
    }
    var step = 100 / (nDates - 1);
    var marks = {};
    var i = 0;
    this.props.dates.forEach(date => {
      marks[i] = date;
      i += step;
    });
    return marks;
  }

  render() {
    const marks = this.generateMarks();
    return (
      <div>
        <div style={wrapperStyle}>
          <Slider
            min={0}
            defaultValue={100}
            marks={marks}
            step={null}
            onChange={ d => this.props.dateChange(marks[d]) } />
        </div>
      </div>
    );
  }
}

export default DateSlider;
