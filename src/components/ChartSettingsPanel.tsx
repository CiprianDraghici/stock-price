import React, {useEffect, useState} from "react";
import {Resolution} from "../enums/resolution.enum";
import {DateRange} from "../models/date-range.model";
import Resolutions from "./Resolutions";
import {Box, Button, createStyles} from "@material-ui/core";
import Panel from "./panel/Panel";
import ToggleButton from "./ToggleButton";
import StockSymbol from "./StockSymbol";
import TimeRange from "./TimeRange";
import {StockSettings} from "../models/stock.settings";
import {makeStyles, Theme} from "@material-ui/core/styles";
import SendIcon from '@material-ui/icons/Send';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import {useForceUpdate} from "../custom-hooks/force-update.hook";
import {ChartSettingsService} from "../services/chart-settings.service";

interface ChartSettingsPanelProps {
    handleApplySettings: (settings: StockSettings) => void;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        resetButton: {
            marginTop: "5em",
            color: "#fff",
            backgroundColor: "#e68342",
            float: "right"
        },
        applyButton: {
            marginTop: "5em",
            color: "#fff",
            backgroundColor: "#28a745",
            float: "right"
        },
    }),
);

const ChartSettingsPanel: React.FC<ChartSettingsPanelProps> = (props) => {
    const chartSettings: ChartSettingsService = ChartSettingsService.getInstance();
    const classes = useStyles();

    const [selectedSymbol, setSelectedSymbol] = useState<string>();
    const [selectedResolution, setSelectedResolution] = useState<Resolution>(Resolution.D);
    const [selectedDateRange, setSelectedDateRange] = useState<DateRange>({
        startDate: new Date(),
        endDate: new Date()
    });
    const [showAverage, setShowAverage] = useState<boolean>(false);

    useEffect(() => {
        onApplySettings();
    }, []);

    useEffect(() => {
        const settings: StockSettings = chartSettings.getSettings();
        props.handleApplySettings({...settings});
    }, [selectedSymbol]);

    const onSymbolChange = (value: string) => {
        setSelectedSymbol(value);
    }

    const onResolutionChange = (value: Resolution) => {
        setSelectedResolution(value);
    }

    const onDateRangeChange = (value: DateRange) => {
        setSelectedDateRange(value);
    }

    const onShowAverageChange = (value: boolean) => {
        setShowAverage(value);
    }

    const onApplySettings = () => {
        const settings: StockSettings = {
            symbol: selectedSymbol || "",
            resolution: selectedResolution,
            dateRange: selectedDateRange,
            showAverage
        };

        chartSettings.setSettings(settings);
        props.handleApplySettings({...settings});
    }

    const onResetSettings = () => {
        const settings: StockSettings = chartSettings.getSettings();

        setSelectedSymbol(settings.symbol || selectedSymbol);
        setSelectedResolution(settings.resolution || selectedResolution);
        setSelectedDateRange(settings.dateRange || selectedDateRange);
        setShowAverage(settings.showAverage !== null && settings.showAverage !== undefined ? settings.showAverage : showAverage);

        props.handleApplySettings({...settings});
    }

    return (
        <Panel>
            <StockSymbol symbol={selectedSymbol} handleSymbolChange={onSymbolChange} />
            <Box display="flex" flexDirection="row" flexWrap="nowrap" justifyContent="flex-start" alignItems="flex-start" alignContent="flex-start">
                <ToggleButton label={"Show average"} value={showAverage} handleShowStateChange={onShowAverageChange} />
            </Box>
            <Box display="flex" flexDirection="row" flexWrap="nowrap" justifyContent="flex-start" alignItems="flex-start" alignContent="flex-start">
                <Resolutions resolution={selectedResolution} handleResolutionChange={onResolutionChange} />
            </Box>
            <Box display="flex" flexDirection="row" flexWrap="nowrap" justifyContent="flex-start" alignItems="flex-start" alignContent="flex-start">
                <TimeRange dateRange={selectedDateRange} handlePeriodChange={onDateRangeChange} />
            </Box>
            <Button
                variant="contained"
                className={classes.resetButton}
                endIcon={<RotateLeftIcon/>}
                onClick={onResetSettings}
            >
                Reset
            </Button>
            <Button
                variant="contained"
                className={classes.applyButton}
                endIcon={<SendIcon/>}
                onClick={onApplySettings}
            >
                Apply
            </Button>
        </Panel>
    )
}

export default ChartSettingsPanel;