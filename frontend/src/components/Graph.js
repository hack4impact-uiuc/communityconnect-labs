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
const LINE_COLOR = "black";
const VERTICAL_COLOR = "#96dbfa";
const PREDICTION_COLOR = "a3b5d1";
const PREDICTIVE_LINE_COLOR = "7f90ad";
const BORDER = "1px solid #ccc";
const GRAPH_TITLE_X_COOR = 170;
const GRAPH_TITLE_Y_COOR = 20;
const STROKE_WIDTH = 2;
const PREDICTED_2020 = "2020";
const ANIMATION_DURATION = 1000; 
const CHART_HEIGHT = 300; 

class Graph extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actualData: [],
      standardDev: [],
      predictiveData: [],
      xLabels: [],
      yLabels: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
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
      rates_list.push({ x: key, y: 100*rates_dict[key] });
    }

    let iterator = Math.ceil(
      (rates_list[rates_list.length - 1]["x"] - rates_list[0]["x"]) / STEPS
    );
    let xLabelList = [rates_list[0]["x"]];

    for (let i = 1; i <= STEPS; i++) {
      xLabelList.push(iterator + parseInt(xLabelList[i - 1]));
    }
    console.log(xLabelList);

    this.setState({
      actualData: rates_list,
      xLabels: xLabelList
    });

    const predictions = await getPredictive(
      this.state.tractID,
      this.state.year
    );

    if (
      predictions &&
      predictions.data.result[PREDICTED_2020] &&
      predictions.data.result[PREDICTED_2020][0] &&
      predictions.data.result[PREDICTED_2020][0].rates
    ) {
      // Check if tract has predicted data

      let predictions_dict = {};
      predictions_dict = predictions.data.result[PREDICTED_2020][0].rates;
      let standard_dev = [];
      let predictive_data = [];
      for (var key in predictions_dict) {
        // TODO: take out divide by 100s when Mongo cluster is edited.
        let rate = predictions_dict[key][0];
        let sd = predictions_dict[key][1];
        predictive_data.push({ x: key, y: rate });
        standard_dev.push({ x: key, y: rate + sd, y0: rate - sd });
      }

      this.setState({
        standardDev: standard_dev,
        predictiveData: predictive_data
      });
    }
  }

  getLowerLineBound = () => {
    const { actualData, standardDev, yLabels } = this.state;
    const standardDevLowerBound =
      standardDev && standardDev[0] ? standardDev[0]["y0"] : null;
    const actualLowerBound = actualData[0]["y"];
    const axisLowerBound = yLabels[0];
    if (!standardDevLowerBound) {
      return Math.min(actualLowerBound, axisLowerBound);
    } else {
      return Math.min(
        Math.min(standardDevLowerBound, actualLowerBound),
        axisLowerBound
      );
    }
  };

  getUpperLineBound = () => {
    const { actualData, standardDev, yLabels } = this.state;
    const standardDevUpperBound =
      standardDev && standardDev[standardDev.length - 1]
        ? standardDev[standardDev.length - 1]["y"]
        : null;
    const actualUpperBound = actualData[actualData.length - 1]["y"];
    const axisUpperBound = yLabels[yLabels.length - 1];
    if (!standardDevUpperBound) {
      return Math.max(actualUpperBound, axisUpperBound);
    } else {
      return Math.max(
        Math.max(standardDevUpperBound, actualUpperBound),
        axisUpperBound
      );
    }
  };

  render() {
    const {
      actualData,
      predictiveData,
      standardDev,
      xLabels,
      yLabels
    } = this.state;
    return (
      <VictoryChart height={CHART_HEIGHT} theme={VictoryTheme.material}>
        <VictoryLabel
          text="Response Rates Data Over Collection Period"
          x={GRAPH_TITLE_X_COOR}
          y={GRAPH_TITLE_Y_COOR}
          textAnchor="middle"
        />
        <VictoryAxis
          tickValues={xLabels}
          label="Days After Initial Census Mailing"
          style={{ axisLabel: { padding: 37 } }}
        />
        <VictoryAxis
          dependentAxis
          tickValues={yLabels}
          label="Response Rate"
          style={{ axisLabel: { padding: 35 } }}
        />
        <VictoryArea
          style={{
            data: { fill: PREDICTION_COLOR }
          }}
          data={standardDev}
          animate={{
            duration: ANIMATION_DURATION,
            onLoad: { duration: ANIMATION_DURATION }
          }}
        />
        <VictoryLine
          style={{
            data: { stroke: LINE_COLOR, strokeWidth: STROKE_WIDTH },
            parent: { border: BORDER }
          }}
          data={actualData}
          animate={{
            duration: ANIMATION_DURATION,
            onLoad: { duration: ANIMATION_DURATION }
          }}
        />
        <VictoryLine
          style={{
            data: { stroke: PREDICTIVE_LINE_COLOR, strokeWidth: STROKE_WIDTH },
            parent: { border: BORDER }
          }}
          data={predictiveData}
          animate={{
            duration: ANIMATION_DURATION,
            onLoad: { duration: ANIMATION_DURATION }
          }}
        />
        {actualData.length > 0 && (
          <VictoryLine
            style={{
              data: { stroke: VERTICAL_COLOR, strokeWidth: STROKE_WIDTH },
              parent: { border: BORDER }
            }}
            labels={[""]}
            animate={{
              duration: ANIMATION_DURATION,
              onLoad: { duration: ANIMATION_DURATION }
            }}
            data={[
              {
                x: this.props.selectedDate,
                y: this.getLowerLineBound()
              },
              {
                x: this.props.selectedDate,
                y: this.getUpperLineBound()
              }
            ]}
          />
        )}
      </VictoryChart>
    );
  }
}

export default Graph;
