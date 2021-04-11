import React, {useEffect, useState} from "react";
import {
    VerticalGridLines,
    HorizontalGridLines,
    XAxis,
    YAxis,
    DiscreteColorLegend,
    LineMarkSeries,
    FlexibleXYPlot,
    LineSeries,
    LabelSeries
} from "react-vis";
import {SeriesPoint} from "../models/series-point.model";
import {Series} from "../models/series.model";

interface XYChartProps {
    data: Series;
    showAverage?: boolean;

    onValueMouseOverCallback?: (dataPoint: SeriesPoint, target: SVGGraphicsElement) => void;
    onValueMouseOutCallback?: (e: any) => void;
    onValueClickCallback?: (dataPoint: SeriesPoint | null) => void;
}

const XYChart: React.FC<XYChartProps> = (props) => {
    const [averageSeries, setAverageSeries] = useState<Series | null>();

    const getAverageValue = () => {
        return props.data.values.reduce((acc, d) => acc + Number(d.y), 0) / props.data.values.length;
    }

    const computeAverageSeries = () => {
        const avgValue = getAverageValue();
        const fillValues = props.data.values.map(x => ({
            ...x,
            y: avgValue
        }));

        setAverageSeries({
            name: "Average",
            values: fillValues
        });
    }

    useEffect(() => {
        computeAverageSeries();
    }, []);

    useEffect(() => {
        computeAverageSeries();
    }, [props.data]);

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

    return (
        <div data-testid={"XY-Chart"}>
            <FlexibleXYPlot
                xType="time"
                // width={1000}
                height={600}
                // style={{position: "absolute"}}
                onClick={onClick}
            >
                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis />
                <YAxis />

                <LineMarkSeries
                    className="mark-series-overrides"
                    data={props.data.values}
                    onValueClick={onValueClick}
                    onValueMouseOver={onValueMouseOver}
                    onValueMouseOut={onValueMouseOut}
                    // style={{
                    //     strokeWidth: '3px'
                    // }}
                    // lineStyle={{stroke: 'red'}}
                    // markStyle={{stroke: 'blue'}}
                />

                {
                    props.showAverage &&
                    <LineSeries
                        data={averageSeries?.values as any[]}
                        style={{
                            strokeWidth: '1px'
                        }}
                        strokeStyle={"dashed"}
                        color={"grey"}
                    />
                }
                {
                    (props.showAverage && props.data.values.length > 1) &&
                    <LabelSeries allowOffsetToBeReversed={true} data={[{
                        ...averageSeries?.values[0],
                        label: `AVG = ${Number(averageSeries?.values[0].y).toFixed(2)}`
                    }] as any[]}/>
                }
            </FlexibleXYPlot>
            {props.children}
        </div>
    )
}

export default XYChart;