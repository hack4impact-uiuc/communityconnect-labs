import React from "react";
import * as V from 'victory';
import { VictoryStack, VictoryAxis, VictoryArea, VictoryTheme, VictoryChart, VictoryLine, LineSegment} from 'victory';


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


    render() {
        return (
            <>
            <VictoryAxis crossAxis
                width={200}
                height={200}
                domain={[0, 10]}
                theme={VictoryTheme.material}
                offsetY={200}
                standalone={false}
            />
            <VictoryAxis dependentAxis crossAxis
                width={800}
                tickCount={10}
                tickValues={["90", "80", "70", "60", "50", "40", "30"]}
            />

            <VictoryChart>
                <VictoryLine
                    data={this.state.data}
                    style={{
                    data: {
                        stroke: "#02B875"
                    }
                    }}
                />
            </VictoryChart>

            {/* <VictoryStack>
                <VictoryArea
                    data={[{x: "a", y: 2}, {x: "b", y: 3}, {x: "c", y: 5}]}
                />
                <VictoryArea
                    data={[{x: "a", y: 1}, {x: "b", y: 4}, {x: "c", y: 5}]}
                />
                <VictoryArea
                    data={[{x: "a", y: 3}, {x: "b", y: 2}, {x: "c", y: 6}]}
                />
            </VictoryStack> */}
            </>
        )
    }
}

export default Graph;