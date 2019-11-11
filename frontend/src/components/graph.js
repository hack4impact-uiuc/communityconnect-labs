import React from "react";
import { VictoryStack, VictoryAxis, VictoryArea, VictoryTheme, VictoryChart, VictoryLine, LineSegment, VictoryLabel} from 'victory';
import {
    getResponseByTractIDAndYear
} from "../utils/apiWrapper";

const year = "2010";
const id = "34007603603";

class Graph extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            data: []
        };
    }

    async componentDidMount() {
        const arr = await getResponseByTractIDAndYear(id, year);
        console.log(arr)
        this.setState({
            data: arr.result
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
                    tickValues={[30, 40, 50, 60, 70, 80]}
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