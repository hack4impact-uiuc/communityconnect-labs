import React from "react";
import { VictoryAxis, VictoryChart, VictoryLine, VictoryLabel} from 'victory';
import {
    getResponseByTractIDAndYear
} from "../utils/apiWrapper";

const STEPS = 5

class Graph extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            data: [],
            x_labels: [],
            y_labels: [],
            tract_id: this.props.tract_id,
            year: 2010
        };
    }

    async componentDidMount() {
        const response = await getResponseByTractIDAndYear(this.state.tract_id, this.state.year);
        if (!response.data.result.response_rates["0"]) {
          return;
        }
        let rates_dict = {};
        rates_dict = response.data.result.response_rates["0"].rates[this.state.tract_id]
        const rates_list = [];
        for (var key in rates_dict) {
            rates_list.push({"x": rates_dict[key][1], "y": rates_dict[key][0]});
        }

        let iterator = Math.ceil((rates_list[rates_list.length - 1]["x"] - rates_list[0]["x"]) / STEPS);
        let x_label_list = [rates_list[0]["x"]];

        for (let i = 1; i <= STEPS; i++) {
          x_label_list.push(iterator + x_label_list[i - 1]);
        }

        iterator = (rates_list[rates_list.length - 1]["y"] - rates_list[0]["y"]) / STEPS;
        let y_label_list = [Math.round(rates_list[0]["y"] * 10) / 10];

        for (let i = 1; i < STEPS + 2; i++) {
          y_label_list.push(Math.round((iterator + y_label_list[i - 1]) * 100) / 100);
        }

        this.setState({
            data: rates_list,
            x_labels: x_label_list,
            y_labels: y_label_list
        });
    }

    render() {
        return (
            <VictoryChart domainPadding={20} height={500}>
                <VictoryLabel text="Response Rates Data Over Collection Period" x={225} y={50} textAnchor="middle"/>
                <VictoryAxis
                    tickValues={this.state.x_labels}
                    label="Days After Initial Census Mailing"
                />
                <VictoryAxis
                    dependentAxis
                    tickValues={this.state.y_labels}
                    label="Response Rate"
                />

                <VictoryLine
                    style={{
                    data: { stroke: "#d18b30" },
                    parent: { border: "1px solid #ccc"}
                    }}
                    data={this.state.data}
                />
            </VictoryChart>
        )
    }
}

export default Graph;
