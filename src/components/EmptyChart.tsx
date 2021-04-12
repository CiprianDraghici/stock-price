import React from "react";
import {
    VerticalGridLines,
    HorizontalGridLines,
    XAxis,
    YAxis,
    FlexibleXYPlot,
    LineSeries,
} from "react-vis";

const EmptyChart: React.FC = (props) => {
    return (
        <FlexibleXYPlot
            height={600}
            style={{marginTop: "5em"}}
        >
            <VerticalGridLines />
            <HorizontalGridLines />
            <XAxis />
            <YAxis />

            <LineSeries data={[{x: 1, y: 1}]}/>
        </FlexibleXYPlot>
    )
}

export default EmptyChart;