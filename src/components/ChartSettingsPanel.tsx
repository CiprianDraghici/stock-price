import React, {useEffect, useState} from "react";
import {Resolution} from "../enums/resolution.enum";
import {DateRange} from "../models/date-range.model";
import Resolutions from "./Resolutions";
import {Box, Button, createStyles} from "@material-ui/core";
import Panel from "./panel/Panel";
import StockSymbol from "./StockSymbol";
import TimeRange from "./TimeRange";
import {StockSettings} from "../models/stock.settings";
import {makeStyles, Theme} from "@material-ui/core/styles";
import SendIcon from "@material-ui/icons/Send";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
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
            borderRadius: "1px",
            margin: "5px",
            position: "absolute",
            bottom: "2em",
            right: "8em"
        },
        applyButton: {
            marginTop: "5em",
            color: "#fff",
            backgroundColor: "#28a745",
            borderRadius: "1px",
            margin: "5px",
            position: "absolute",
            bottom: "2em",
            right: "0"
        },
    }),
);

const ChartSettingsPanel: React.FC<ChartSettingsPanelProps> = (props) => {
    const chartSettings: ChartSettingsService = ChartSettingsService.getInstance();
    const classes = useStyles();

    const [selectedSymbol, setSelectedSymbol] = useState<string>("IBM");
    const [selectedResolution, setSelectedResolution] = useState<Resolution>(Resolution.D);
    const [selectedDateRange, setSelectedDateRange] = useState<DateRange>({
        startDate: new Date(1572651390 * 1000),
        endDate: new Date(1575243390 * 1000)
    });

    useEffect(() => {
        onApplySettings();
    }, []);

    const onSymbolChange = (value: string) => {
        setSelectedSymbol(value);
    }

    const onResolutionChange = (value: Resolution) => {
        setSelectedResolution(value);
    }

    const onDateRangeChange = (value: DateRange) => {
        setSelectedDateRange(value);
    }

    const onApplySettings = () => {
        const settings: StockSettings = {
            symbol: selectedSymbol || "",
            resolution: selectedResolution,
            dateRange: selectedDateRange
        };

        chartSettings.setSettings(settings);
        props.handleApplySettings({...settings});
    }

    const onResetSettings = () => {
        const settings: StockSettings = chartSettings.getSettings();

        setSelectedSymbol(settings.symbol || selectedSymbol);
        setSelectedResolution(settings.resolution || selectedResolution);
        setSelectedDateRange(settings.dateRange || selectedDateRange);
    }

    return (
        <Panel>
            <div style={{marginBottom: 10}}>
                <StockSymbol symbol={selectedSymbol} handleSymbolChange={onSymbolChange} />
            </div>
            <Box display="flex" flexDirection="row" flexWrap="nowrap" justifyContent="flex-start" alignItems="flex-start" alignContent="flex-start">
                <Resolutions resolution={selectedResolution} handleResolutionChange={onResolutionChange} />
            </Box>
            <Box display="flex" flexDirection="row" flexWrap="nowrap" justifyContent="flex-start" alignItems="flex-start" alignContent="flex-start">
                <TimeRange dateRange={selectedDateRange} handlePeriodChange={onDateRangeChange} />
            </Box>
            <Button variant="contained" className={classes.resetButton} endIcon={<RotateLeftIcon/>} onClick={onResetSettings}>
                Reset
            </Button>
            <Button variant="contained" className={classes.applyButton} endIcon={<SendIcon/>} onClick={onApplySettings}>
                Apply
            </Button>
        </Panel>
    )
}

export default ChartSettingsPanel;