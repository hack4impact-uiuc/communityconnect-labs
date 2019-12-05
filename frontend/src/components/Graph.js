import React from "react";
import { VictoryAxis, VictoryChart, VictoryLine, VictoryLabel } from "victory";
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
    rates_dict = response.data.result.response_rates[0].rates;
    const rates_list = [];
    console.log(rates_dict);
    for (var key in rates_dict) {
      rates_list.push({ x: key, y: rates_dict[key] });
    }

    let iterator = Math.ceil(
      (rates_list[rates_list.length - 1]["x"] - rates_list[0]["x"]) / STEPS
    );
    let xLabelList = [rates_list[0]["x"]];

    for (let i = 1; i <= STEPS; i++) {
      xLabelList.push(iterator + parseInt(xLabelList[i - 1]));
    }

    console.log(xLabelList);

    iterator =
      (rates_list[rates_list.length - 1]["y"] - rates_list[0]["y"]) / STEPS;
    let yLabelList = [Math.round(rates_list[0]["y"] * 10) / 10];

    for (let i = 1; i < STEPS + 2; i++) {
      yLabelList.push(Math.round((iterator + yLabelList[i - 1]) * 100) / 100);
    }

    this.setState({
      data: rates_list,
      xLabels: xLabelList,
      yLabels: yLabelList
    });
  }

  render() {
    return (
      <VictoryChart domainPadding={20} height={300}>
        <VictoryLabel
          text="Response Rates Data Over Collection Period"
          x={225}
          y={50}
          textAnchor="middle"
        />
        <VictoryAxis
          tickValues={this.state.xLabels}
          label="Days After Initial Census Mailing"
        />
        <VictoryAxis
          dependentAxis
          tickValues={this.state.yLabels}
          label="Response Rate"
        />

        <VictoryLine
          style={{
            data: { stroke: LINE_COLOR },
            parent: { border: BORDER }
          }}
          data={this.state.data}
        />
      </VictoryChart>
    );
  }
}

export default Graph;
