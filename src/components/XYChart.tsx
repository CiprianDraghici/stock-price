import React, {useEffect, useState} from "react";
import {
    VerticalGridLines,
    HorizontalGridLines,
    XAxis,
    YAxis,
    LineMarkSeries,
    FlexibleXYPlot,
    LineSeries,
    LabelSeries, DiscreteColorLegend, Crosshair, LineMarkSeriesPoint
} from "react-vis";
import {SeriesPoint} from "../models/series-point.model";
import {Series} from "../models/series.model";
import EmptyChart from "./EmptyChart";

interface XYChartProps {
    data: Series;
    showAverage?: boolean;

    handleValueMouseOver?: (dataPoint: SeriesPoint, e: React.MouseEvent<HTMLElement>) => void;
    handleValueMouseOut?: (e: any) => void;
    handleValueClick?: (dataPoint: SeriesPoint | null) => void;
}

const XYChart: React.FC<XYChartProps> = (props) => {
    const [averageSeries, setAverageSeries] = useState<Series | null>();
    const [crossHairValues, setCrossHairValues] = useState<LineMarkSeriesPoint[]>([]);

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

    const getLegend = () => {
        const items = [];

        if(props.data.name) {
            items.push({
                title: props.data.name,
                color: "#007bff"
            })
        }

        return items;
    }


    useEffect(() => {
        computeAverageSeries();
    }, []);

    useEffect(() => {
        computeAverageSeries();
    }, [props.data]);

    const onValueClick = (datapoint: SeriesPoint, e: any) => {
        e.event.stopPropagation();

        if(!props.handleValueClick) { return; }
        props.handleValueClick(datapoint);
    }

    const onValueMouseOut = (datapoint: SeriesPoint, e: any) => {
        e.event.stopPropagation();

        if(!props.handleValueMouseOut) { return; }
        props.handleValueMouseOut(e);
    }

    const onMouseLeave = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCrossHairValues([]);

        if(!props.handleValueMouseOut) { return; }
        props.handleValueMouseOut(e);
    }

    const onClick = () => {
        if(!props.handleValueClick) { return; }
        props.handleValueClick(null);
    }

    const onNearestXY = (value: LineMarkSeriesPoint, e: any) => {
        e.event.stopPropagation();

        setCrossHairValues([value]);

        if(!props.handleValueMouseOver) { return; }
        props.handleValueMouseOver(value, e.event);
    }

    return (
        <div data-testid={"XY-Chart"}>
            {
                props.data.values.length === 0 &&
                <EmptyChart />
            }
            {
                props.data.values.length > 0 &&
                <>
                    <FlexibleXYPlot
                        xType="time"
                        // width={1000}
                        height={600}
                        // style={{position: "absolute"}}
                        onClick={onClick}
                        onMouseLeave={onMouseLeave}
                        style={{marginTop: "5em"}}
                    >
                        <VerticalGridLines />
                        <HorizontalGridLines />
                        <XAxis />
                        <YAxis />

                        <LineMarkSeries
                            className="mark-series-overrides"
                            data={props.data.values}
                            onValueClick={onValueClick}
                            onValueMouseOut={onValueMouseOut}
                            onNearestX={onNearestXY}
                            // style={{
                            //     strokeWidth: '3px'
                            // }}
                            lineStyle={{stroke: '#007bff'}}
                            markStyle={{fill: '#007bff'}}
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

                        <Crosshair values={crossHairValues}>
                            <div/>
                        </Crosshair>
                    </FlexibleXYPlot>
                    <DiscreteColorLegend items={getLegend()} orientation={"horizontal"} />
                    {props.children}
                </>
            }
        </div>
    )
}

export default XYChart;