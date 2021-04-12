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
    showMin?: boolean;
    showAverage?: boolean;
    showMax?: boolean;

    handleValueMouseOver?: (dataPoint: SeriesPoint, e: React.MouseEvent<HTMLElement>) => void;
    handleValueMouseOut?: (e: any) => void;
    handleValueClick?: (dataPoint: SeriesPoint | null) => void;
}

const XYChart: React.FC<XYChartProps> = (props) => {
    const [minSeries, setMinSeries] = useState<Series | null>();
    const [averageSeries, setAverageSeries] = useState<Series | null>();
    const [maxSeries, setMaxSeries] = useState<Series | null>();
    const [crossHairValues, setCrossHairValues] = useState<LineMarkSeriesPoint[]>([]);

    const getMinValue = () => {
        return props.data.values.reduce((acc, d) => {
            const currentValue = Number(d.y);
            return currentValue < acc ? currentValue : acc;
        }, Infinity);
    }

    const getAverageValue = () => {
        return props.data.values.reduce((acc, d) => acc + Number(d.y), 0) / props.data.values.length;
    }

    const getMaxValue = () => {
        return props.data.values.reduce((acc, d) => {
            const currentValue = Number(d.y);
            return currentValue > acc ? currentValue : acc;
        }, -Infinity);
    }

    const fillSeries = (value: number) => {
        return props.data.values.map(x => ({
            ...x,
            y: value
        }));
    }

    const computeMinSeries = () => {
        const minValue = getMinValue();
        const fillValues = fillSeries(minValue);
        setMinSeries({
            name: "Min",
            values: fillValues
        });
    }

    const computeAverageSeries = () => {
        const avgValue = getAverageValue();
        const fillValues = fillSeries(avgValue);
        setAverageSeries({
            name: "Average",
            values: fillValues
        });
    }

    const computeMaxSeries = () => {
        const maxValue = getMaxValue();
        const fillValues = fillSeries(maxValue);
        setMaxSeries({
            name: "Max",
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

    const getLine = (series: Series) => {
        return <LineSeries
            data={series?.values as any[]}
            style={{
                strokeWidth: '1px'
            }}
            strokeStyle={"dashed"}
            color={"grey"}
        />
    }

    const getLabel = (series: Series, text: string) => {
        return <LabelSeries allowOffsetToBeReversed={true} data={[{
            ...series?.values[0],
            label: `${text} = ${Number(series?.values[0].y).toFixed(2)}`
        }] as any[]}/>
    }

    useEffect(() => {
        computeMinSeries();
        computeAverageSeries();
        computeMaxSeries();
    }, []);

    useEffect(() => {
        computeMinSeries();
        computeAverageSeries();
        computeMaxSeries();
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
                        height={600}
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
                            lineStyle={{stroke: '#007bff'}}
                            markStyle={{fill: '#007bff'}}
                        />

                        {
                            props.showMin && minSeries &&
                            getLine(minSeries)
                        }
                        {
                            (props.showMin && minSeries && props.data.values.length > 1) &&
                            getLabel(minSeries, "MIN")
                        }

                        {
                            props.showAverage && averageSeries &&
                            getLine(averageSeries)
                        }
                        {
                            (props.showAverage && averageSeries && props.data.values.length > 1) &&
                            getLabel(averageSeries, "AVG")
                        }

                        {
                            props.showMax && maxSeries &&
                            getLine(maxSeries)
                        }
                        {
                            (props.showMax && maxSeries && props.data.values.length > 1) &&
                            getLabel(maxSeries, "MAX")
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