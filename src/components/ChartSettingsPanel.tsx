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
    const classes = useStyles();

    const [selectedSymbol, setSelectedSymbol] = useState<string>("GAZ");
    const [selectedResolution, setSelectedResolution] = useState<Resolution>(Resolution.D);
    const [selectedDateRange, setSelectedDateRange] = useState<DateRange>({
        startDate: new Date(),
        endDate: new Date()
    });
    const [showAverage, setShowAverage] = useState<boolean>(false);

    const [settings, setSettings] = useState<StockSettings>();

    useEffect(() => {
        onApplySettings();
    }, []);

    // useEffect(() => {
    //     onApplySettings();
    // }, [selectedSymbol, selectedResolution, selectedDateRange, showAverage]);

    const onSymbolChange = (value: string) => {
        // const newSettings: StockSettings = {
        //     ...settings,
        //     symbol: value,
        // };
        //
        // setSettings(newSettings);
        setSelectedSymbol(value);
    }

    const onResolutionChange = (value: Resolution) => {
        // const newSettings: StockSettings = {
        //     ...settings,
        //     resolution: value,
        // };
        //
        // setSettings(newSettings);
        setSelectedResolution(value);
    }

    const onDateRangeChange = (value: DateRange) => {
        // const newSettings: StockSettings = {
        //     ...settings,
        //     dateRange: value,
        // };
        //
        // setSettings(newSettings);
        setSelectedDateRange(value);
    }

    const onShowAverageChange = (value: boolean) => {
        // const newSettings: StockSettings = {
        //     ...settings,
        //     showAverage: value,
        // };
        //
        // setSettings(newSettings);
        setShowAverage(value);
    }

    const onApplySettings = () => {
        const settings: StockSettings = {
            symbol: selectedSymbol || "",
            resolution: selectedResolution,
            dateRange: selectedDateRange,
            showAverage
        };

        sessionStorage.setItem("StockPriceApp-ChartSettingsPanel", JSON.stringify(settings));
        props.handleApplySettings({...settings});
    }

    const onResetSettings = () => {
        const settings: StockSettings = JSON.parse(sessionStorage.getItem("StockPriceApp-ChartSettingsPanel") || "{}");
        if(!settings) { return; }

        setSelectedSymbol(settings.symbol || selectedSymbol);
        setSelectedResolution(settings.resolution || selectedResolution);
        setSelectedDateRange(settings.dateRange || selectedDateRange);
        setShowAverage(settings.showAverage ? settings.showAverage : showAverage);

        props.handleApplySettings({...settings});
    }

    return (
        <Panel>
            <StockSymbol handleSymbolChange={onSymbolChange} />
            <Box display="flex" flexDirection="row" flexWrap="nowrap" justifyContent="flex-start" alignItems="flex-start" alignContent="flex-start">
                <ToggleButton label={"Show average"} handleShowStateChange={onShowAverageChange} />
            </Box>
            <Box display="flex" flexDirection="row" flexWrap="nowrap" justifyContent="flex-start" alignItems="flex-start" alignContent="flex-start">
                <Resolutions selectedResolution={selectedResolution} handleResolutionChange={onResolutionChange} />
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