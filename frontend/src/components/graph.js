import React from "react";
import { VictoryStack, VictoryAxis, VictoryArea, VictoryTheme, VictoryChart, VictoryLine, LineSegment, VictoryLabel} from 'victory';
import {
    getResponseByTractIDAndYear
} from "../utils/apiWrapper";

const year = "2010";
const id = "17001000201";

class Graph extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            data: [],
            x_labels: [],
            y_labels: [],
            tract_id: this.props.tract_id,
            year: this.props.year
        };
    }

    async componentDidMount() {
        // const response = await getResponseByTractIDAndYear(this.state.tract_id, this.state.year);
        // const rates_dict = response.data.result.response_rates["0"].rates[this.state.tract_id];
        // const rates_list = [];
        // for (var key in rates_dict) {
        //     rates_list.push({"x": rates_dict[key][1], "y": rates_dict[key][0]});
        // }
        //
        // const STEPS = 5
        // const iterator = Math.ceil(Object.keys(rates_dict).length / STEPS);
        // let x_label_list = [iterator];
        //
        // for (let i = 1; i <= STEPS; i++) {
        //   x_label_list.push(iterator + x_label_list[i - 1]);
        // }
        //
        // console.log(rates_list);
        // this.setState({
        //     data: rates_list,
        //     x_labels: x_label_list
        // });
    }

    render() {
        return (
            <>
            <VictoryChart domainPadding={20}>
                <VictoryLabel text="(YEAR) Actual Response Rates Data" x={225} y={50} textAnchor="middle"/>
                <VictoryAxis
                    tickValues={this.state.x_labels}
                    label="Days After Initial Census Mailing"
                />
                <VictoryAxis
                    dependentAxis
                    tickValues={[0.40, 0.50, 0.60, 0.70, 0.80, 0.90, 1.00]}
                    label="Self Response Rate (YEAR)"
                />

                <VictoryLine
                    style={{
                    data: { stroke: "#d18b30" },
                    parent: { border: "1px solid #ccc"}
                    }}
                    data={this.state.data}
                />
            </VictoryChart>
            </>
        )
    }
}

export default Graph;
