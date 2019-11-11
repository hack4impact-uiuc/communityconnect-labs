import React from "react";
import { VictoryStack, VictoryAxis, VictoryArea, VictoryTheme, VictoryChart, VictoryLine, LineSegment, VictoryLabel} from 'victory';
import { getResponseByTractID } from "../utils/apiWrapper";


class Graph extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            data: [
                { x: "20", y: 3 },
                { x: "30", y: 2 },
                { x: "40", y: 0 },
                { x: "50", y: 8 },
                { x: "60", y: 4 },
                { x: "70", y: 2 },
                { x: "80", y: 4 },
                { x: "90", y: 6 }
              ]
        };
    }

    // componentDidMount() {
    //     getResponseByTractIDAndYear(id, year); // change this when ready
    // }

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
                    data={[
                    { x: 10, y: 60 },
                    { x: 20, y: 30 },
                    { x: 30, y: 50 },
                    { x: 40, y: 40 }
                    ]}
                />
            </VictoryChart>
            </>
        )
    }
}

export default Graph;