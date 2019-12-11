import React from "react";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryLabel,
  VictoryTheme,
  VictoryArea
} from "victory";
import {
  getResponseByTractIDAndYear,
  getPredictive
} from "../utils/apiWrapper";

const STEPS = 5;
const LINE_COLOR = "gray";
const PREDICTION_COLOR = "d1d1d1";
const BORDER = "1px solid #ccc";
const GRAPH_TITLE_X_COOR = 170;
const GRAPH_TITLE_Y_COOR = 20;
const STROKE_WIDTH = 2;
const PREDICTED_2020 = "2020";

class Graph extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actualData: [],
      standardDev: [],
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
    for (var key in rates_dict) {
      rates_list.push({ x: key, y: rates_dict[key] });
    }

    const predictions = await getPredictive(
      this.state.tractID,
      this.state.year
    );

    // Check if tract has predicted data
    if (
      !predictions.data.result[PREDICTED_2020] ||
      !predictions.data.result[PREDICTED_2020][0].rates
    ) {
      return;
    }

    let predictions_dict = {};
    predictions_dict = predictions.data.result[PREDICTED_2020][0].rates;
    let standard_dev = [];
    for (var key in predictions_dict) {
      // TODO: take out divide by 100s when Mongo cluster is edited.
      let rate = predictions_dict[key][0] / 100.0;
      let sd = predictions_dict[key][1] / 100.0;
      standard_dev.push({ x: key, y: rate + sd, y0: rate - sd });
    }

    let iterator = Math.ceil(
      (rates_list[rates_list.length - 1]["x"] - rates_list[0]["x"]) / STEPS
    );
    let xLabelList = [rates_list[0]["x"]];

    for (let i = 1; i <= STEPS; i++) {
      xLabelList.push(iterator + parseInt(xLabelList[i - 1]));
    }

    iterator =
      (rates_list[rates_list.length - 1]["y"] - rates_list[0]["y"]) / STEPS;
    let yLabelList = [Math.round(rates_list[0]["y"] * 10) / 10];

    for (let i = 1; i < STEPS + 2; i++) {
      yLabelList.push(Math.round((iterator + yLabelList[i - 1]) * 100) / 100);
    }

    for (let i = 0; i < yLabelList.length; i++) {
      yLabelList[i] = Math.round(yLabelList[i] * 10) / 10;
    }

    this.setState({
      actualData: rates_list,
      standardDev: standard_dev,
      xLabels: xLabelList,
      yLabels: yLabelList
    });
  }

  render() {
    return (
      <VictoryChart
        domainPadding={20}
        height={300}
        theme={VictoryTheme.material}
      >
        <VictoryLabel
          text="Response Rates Data Over Collection Period"
          x={GRAPH_TITLE_X_COOR}
          y={GRAPH_TITLE_Y_COOR}
          textAnchor="middle"
        />
        <VictoryAxis
          tickValues={this.state.xLabels}
          label="Days After Initial Census Mailing"
          style={{ axisLabel: { padding: 37 } }}
        />
        <VictoryAxis
          dependentAxis
          tickValues={this.state.yLabels}
          label="Response Rate"
          style={{ axisLabel: { padding: 35 } }}
        />
        <VictoryArea
          style={{
            data: { fill: PREDICTION_COLOR }
          }}
          data={this.state.standardDev}
          animate={{
            duration: 1000,
            onLoad: { duration: 1000 }
          }}
        />
        <VictoryLine
          style={{
            data: { stroke: LINE_COLOR, strokeWidth: STROKE_WIDTH },
            parent: { border: BORDER }
          }}
          data={this.state.actualData}
          animate={{
            duration: 1000,
            onLoad: { duration: 1000 }
          }}
        />
      </VictoryChart>
    );
  }
}

export default Graph;
