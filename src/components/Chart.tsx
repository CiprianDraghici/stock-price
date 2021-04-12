import React, {useState} from "react";
import Tooltip from "./Tooltip";
import XYChart from "./XYChart";
import {SeriesPoint} from "../models/series-point.model";
import {Series} from "../models/series.model";
import moment from "moment";
import {Card, CardContent, CardHeader, createStyles, makeStyles, Theme} from "@material-ui/core";
import {ChartSettingsService} from "../services/chart-settings.service";

interface ChartProps {
    data: Series;
    showAverage?: boolean;
}

interface TooltipPosition {
    x: string | number;
    y: string | number;
    datapoint: SeriesPoint;
}

const Chart: React.FC<ChartProps> = (props) => {
    const chartSettings: ChartSettingsService = ChartSettingsService.getInstance();

    const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition | null>( null);

    const onValueMouseOver = (datapoint: any, targetElement: SVGGraphicsElement) => {
        setTooltipPosition({
            x: targetElement.getBoundingClientRect().x + 20,
            y: targetElement.getBoundingClientRect().y + 20,
            datapoint
        });
    }

    const onValueMouseOut = (e: any) => {
        setTooltipPosition(null);
    }

    const TooltipContent = () => {
        if (!tooltipPosition) {
            return <></>;
        }

        return (
            <div data-testid={"tooltip-content"}>
                <div className={"chart-tooltip-header"}>{`${moment(tooltipPosition!.datapoint.x).format("MM/DD/YYYY")}`}</div>
                <div className={"chart-tooltip-content"}>
                    <div className={"symbol"}>{chartSettings.getSettings().symbol}</div>
                    <div className={"symbolValue"}>{tooltipPosition!.datapoint.y}</div>
                </div>
            </div>
        );
    }

    return (
        <div data-testid={"Chart"}>
            <XYChart data={props.data} showAverage={props.showAverage} onValueMouseOverCallback={onValueMouseOver} onValueMouseOutCallback={onValueMouseOut}>
                <Tooltip show={!!tooltipPosition} position={{...tooltipPosition!}} content={TooltipContent} />
            </XYChart>
        </div>
    )
}

export default Chart;