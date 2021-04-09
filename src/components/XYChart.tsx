import React from "react";
import {
    VerticalGridLines,
    HorizontalGridLines,
    XAxis,
    YAxis,
    DiscreteColorLegend,
    LineMarkSeries, FlexibleXYPlot
} from "react-vis";
import {SeriesPoint} from "../models/series-point.model";
import {Series} from "../models/series.model";

interface XYChartProps {
    data: Series[];

    onValueMouseOverCallback?: (dataPoint: SeriesPoint, target: SVGGraphicsElement) => void;
    onValueMouseOutCallback?: (e: any) => void;
    onValueClickCallback?: (dataPoint: SeriesPoint | null) => void;
}

const XYChart: React.FC<XYChartProps> = (props) => {
    const onValueClick = (datapoint: SeriesPoint, e: any) => {
        e.event.stopPropagation();

        if(!props.onValueClickCallback) { return; }
        props.onValueClickCallback(datapoint);
    }

    const onValueMouseOver = (datapoint: SeriesPoint, e: any) => {
        e.event.stopPropagation();

        if(!props.onValueMouseOverCallback) { return; }
        props.onValueMouseOverCallback(datapoint, e.event.target);
    }

    const onValueMouseOut = (datapoint: SeriesPoint, e: any) => {
        e.event.stopPropagation();

        if(!props.onValueMouseOutCallback) { return; }
        props.onValueMouseOutCallback(e);
    }

    const onClick = () => {
        if(!props.onValueClickCallback) { return; }
        props.onValueClickCallback(null);
    }

    const getLegend = () => {
        return props.data.map(series => ({
            title: series.name,
            color: "red"
        }));
    }

    return (
        <div data-testid={"XY-Chart"}>
            <FlexibleXYPlot
                xType="time"
                width={1000}
                height={600}
                style={{position: "absolute"}}
                onClick={onClick}
            >
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis />
                <YAxis />

                {
                    props.data.map(series => (
                        <LineMarkSeries
                            key={series.name}
                            className="mark-series-overrides"
                            data={series.values}
                            onValueClick={onValueClick}
                            onValueMouseOver={onValueMouseOver}
                            onValueMouseOut={onValueMouseOut}
                            style={{
                                strokeWidth: '3px'
                            }}
                            lineStyle={{stroke: 'red'}}
                            markStyle={{stroke: 'blue'}}
                        />
                    ))
                }
            </FlexibleXYPlot>
            <DiscreteColorLegend items={getLegend()} orientation={"horizontal"} />
            {props.children}
        </div>
    )
}

export default XYChart;