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
            data: []
        };
    }

    async componentDidMount() {
        const response = await getResponseByTractIDAndYear(id, year);
        const rates_dict = response.data.result.response_rates["0"].rates[id];
        const rates_list = [];
        for (var key in rates_dict) {
            rates_list.push({"x": rates_dict[key][1], "y": rates_dict[key][0]});
        }
        console.log(rates_list);
        this.setState({
            data: rates_list
        });
    }

    render() {
        return (
            <>
            <VictoryChart domainPadding={20}>
                <VictoryLabel text="(YEAR) Actual Response Rates Data" x={225} y={50} textAnchor="middle"/>
                <VictoryAxis
                    tickValues={[10, 20, 30, 40]}
                    label="Days After Initial Census Mailing"
                />
                <VictoryAxis
                    dependentAxis
                    tickValues={[0.30, 0.40, 0.50, 0.60, 0.70, 0.80]}
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
