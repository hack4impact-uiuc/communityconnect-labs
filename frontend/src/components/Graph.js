import React from "react";
import { VictoryAxis, VictoryChart, VictoryLine, VictoryLabel, VictoryTheme } from "victory";
import { getResponseByTractIDAndYear } from "../utils/apiWrapper";

const STEPS = 5;
const LINE_COLOR = "#d18b30";
const BORDER = "1px solid #ccc";

class Graph extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      xLabels: [],
      yLabels: [],
      tractID: this.props.tract_id,
      year: 2010
    };
  }

  async componentDidMount() {
    const response = await getResponseByTractIDAndYear(
      this.state.tractID,
      this.state.year
    );
    if (!response.data.result.response_rates[0]) {
      return;
    }
    let rates_dict = {};
    rates_dict =
      response.data.result.response_rates[0].rates[this.state.tractID];
    const rates_list = [];
    for (var key in rates_dict) {
      rates_list.push({ x: rates_dict[key][1], y: rates_dict[key][0] });
    }

    let iterator = Math.ceil(
      (rates_list[rates_list.length - 1]["x"] - rates_list[0]["x"]) / STEPS
    );
    let xLabelList = [rates_list[0]["x"]];

    for (let i = 1; i <= STEPS; i++) {
      xLabelList.push(iterator + xLabelList[i - 1]);
    }

    iterator =
      (rates_list[rates_list.length - 1]["y"] - rates_list[0]["y"]) / STEPS;
    let yLabelList = [Math.round(rates_list[0]["y"] * 10) / 10];

    for (let i = 1; i < STEPS + 2; i++) {
      yLabelList.push(Math.round((iterator + yLabelList[i - 1]) * 100) / 100);
    }

    for (let i = 0; i < yLabelList.length; i++) {
      yLabelList[i] = Math.round(yLabelList[i] * 10) / 10
    }

    this.setState({
      data: rates_list,
      xLabels: xLabelList,
      yLabels: yLabelList
    });
  }

  render() {
    return (
      <VictoryChart domainPadding={20} height={300} theme={VictoryTheme.material}>
        
        <VictoryLabel
          text="Response Rates Data Over Collection Period"
          x={170}
          y={20}
          textAnchor="middle"
        />
        <VictoryAxis
          tickValues={this.state.xLabels}
          label="Days After Initial Census Mailing"
          style={{ axisLabel: {padding: 37} }}
        />
        <VictoryAxis
          dependentAxis
          tickValues={this.state.yLabels}
          label="Response Rate"
          style={{ axisLabel: {padding: 35} }}
        />
        <VictoryLine
        style={{
          data: { stroke: LINE_COLOR },
          parent: { border: BORDER }
        }}
        data={this.state.data}
        animate={{
          duration: 1000,
          onLoad: { duration: 1000 }
        }}
        style={{
          data: {
              stroke: 'gray',
              strokeWidth: 2
          }
      }}
      />
      </VictoryChart>
    );
  }
}

export default Graph;
